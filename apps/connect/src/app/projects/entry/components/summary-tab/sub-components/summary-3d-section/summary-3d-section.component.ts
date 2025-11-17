import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { EntryStoreState } from '../../../../store/entry-store.model';
import { EntrySelectors } from '../../../../store/entry.selectors';
import { ComponentCommunicationService } from '../../../../services/component-comm.service';
import { componentExistsInMolstar, drawSelectionInMolstar, Molstar370DefaultParams, zoomOutStructureInMolstar } from '../../../../helpers/molstar-helpers';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import type { QueryParam } from 'pdbe-molstar/lib/helpers';
import { assemblyCompositionTooltip, assemblyNameTooltip, baseUrl, complexIdTooltip, preferredAssemblyTooltip } from '../../../../entry-constant';
import { filter, firstValueFrom, map, take, timer } from 'rxjs';
import { Molecule } from '../../../../data-models/molecule.model';
import { ProcessedDomain, ProcessedMacromolecule } from '../../../../store/data-processing/models/processed-entities.model';
import { ProcessedLigandOrMod } from '../../../../store/data-processing/ligand-processing';
import { GoogleAnalyticsService } from '@pdbc/core';
import { getLigandsDropdownOptions, getMacromoleculeChainDropdownOptions } from '../../../../helpers/processed-data-to-controls';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EntryDropdownComponent } from '../../../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { MaterialModule } from '@pdbc/core';

type NestedDomainsData = Array<{
  macromolecule: ProcessedMacromolecule;
  domains: ProcessedDomain[];
}>;

@Component({
  selector: 'pdbc-summary-3d-section',
  standalone: true,
  templateUrl: './summary-3d-section.component.html',
  styleUrls: ['./summary-3d-section.component.scss'],
  imports: [CommonModule, MolstarComponent, NgxSkeletonLoaderModule, EntryDropdownComponent, MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Summary3DSectionComponent {
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';
  public baseUrl = baseUrl;

  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly compCommunication = inject(ComponentCommunicationService);
  public readonly gAS = inject(GoogleAnalyticsService);

  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));

  private procPrefAssembly = toSignal(this.globalStore.select(EntrySelectors.processedPrefAssembly));
  private procMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));
  private procLigands = toSignal(this.globalStore.select(EntrySelectors.processedLigands));
  private procDomains = toSignal(this.globalStore.select(EntrySelectors.processedDomains));
  private processedDomains = toSignal(this.globalStore.select(EntrySelectors.processedDomainsWithMacromols));

  public hasLoadedDomains = computed(() => this.processedDomains() !== undefined);
  public hasLoadedMacromolecules = computed(() => this.procMacromolecules() !== undefined);
  public hasLoadedLigands = computed(() => this.procLigands() !== undefined);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  private readonly destroyRef = inject(DestroyRef);

  private molstarReady = signal(false);
  private _molstarComponent?: MolstarComponent;
  @ViewChild('molstarComponent') set molstarComponent(ref: MolstarComponent | undefined) {
    if (ref) {
      this._molstarComponent = ref;
      this.molstarReady.set(true);
    }
  }

  public readonly slowNetwork = toSignal(
    this.compCommunication.slowNetwork$,
    { initialValue: undefined } // assume "unknown/loading" until we know
  );

  public readonly checkedWebGl = computed(() => this.compCommunication.checkedWebGlSupport);
  public readonly isWebGlEnabled = computed(() => this.compCommunication.isWebGlEnabled);

  public readonly fastNetworkOrForceLoad = computed(() => {
    const isSlow = this.slowNetwork();
    const forceLoad = this.compCommunication.forceLoad();
    if (isSlow === undefined) return false;
    return isSlow === false || forceLoad === true;
  });

  public toggleMolstar() {
    const forceLoad = this.compCommunication.forceLoad();
    this.compCommunication.forceLoad.set(!forceLoad);
  }

  public molstarFirstRenderFinished = computed(() => {
    if (!this.molstarReady()) return false;
    return this._molstarComponent?.firstLoadFinished() || false;
  });
  private molstarFirstRenderFinished$ = toObservable(this.molstarFirstRenderFinished);

  public inPrefAssemblyForSelection = signal(true);
  public hasClosedMessage = signal(false);

  public readonly configForMolstar = computed(() => {
    const summary = this.summary();
    const entryId = this.entryId();
    // const chainSelection = this.chainSelection();
    const inPrefAssemblyForSelection = this.inPrefAssemblyForSelection();

    if (!summary || !entryId) return undefined;
    const preferredAssembly = summary.assemblies.length > 0 ? summary.assemblies.filter((eachAssembly) => eachAssembly.preferred) : [];
    const preferredAssemblyId = preferredAssembly.length > 0 ? preferredAssembly[0].assembly_id : '1';
    const assemblyId = inPrefAssemblyForSelection ? preferredAssemblyId : undefined;

    const configForMolstar = {
      ...Molstar370DefaultParams,
      moleculeId: this.entryId(),
      assemblyId,
      bgColor: { r: 255, g: 255, b: 255 },
      landscape: true,
      subscribeEvents: true,
      granularity: 'residue',
      hideControls: true,
      visualStyle: {
        polymer: {
          type: 'cartoon',
          color: 'entity-id',
        },
      },
      loadMaps: true,
      mapSettings: { defaultView: 'selection-box' },
      // ...(chainSelection && { 'selection': chainSelection }),
    };

    return configForMolstar;
  });
  public readonly configForMolstar$ = toObservable(this.configForMolstar);

  public zoomOutDuration = 600;

  public dropdownSelected!: string;
  public dropdownOptions = signal<DownloadOption[]>([]);
  public dropdownOptionsToMolstar: { [key: string]: QueryParam[] } = {};

  private selectionData?: QueryParam[];
  private nonSelectionColor?: string;

  private zoomSelectionMutex = Promise.resolve();

  private async resetSelection() {
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance || !this.selectionData) return;
    await instance.visual.clearSelection();
    await this.onZoomOut(this.zoomOutDuration);
  }

  async onZoomOut(durationMs: number) {
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    this.zoomSelectionMutex = this.zoomSelectionMutex.then(() => zoomOutStructureInMolstar(instance, durationMs));
    await this.zoomSelectionMutex;
  }

  async onZoomInAndSelect() {
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    this.zoomSelectionMutex = this.zoomSelectionMutex.then(() => drawSelectionInMolstar(instance, this.selectionData, this.nonSelectionColor));
    await this.zoomSelectionMutex;
  }

  //  data used in template for assembly accordion
  public assemblyData = computed(() => this.procPrefAssembly());
  public descriptionsFromAPI = toSignal(this.globalStore.select(EntrySelectors.macromolsDescriptions));
  public entryContentsDescription = computed(() => this.descriptionsFromAPI()?.entryContentsDescription);
  public macromoleculesDescription = computed(() => this.descriptionsFromAPI()?.macromoleculesDescription);

  public preferredAssemblyTooltip = preferredAssemblyTooltip;
  public assemblyNameTooltip = assemblyNameTooltip;
  public complexIdTooltip = complexIdTooltip;
  public assemblyCompositionTooltip = assemblyCompositionTooltip;

  public assemblies = toSignal(this.globalStore.select(EntrySelectors.summaryData).pipe(map((data) => data?.assemblies)));

  public assembly = computed(() => {
    const assemblies = this.assemblies() ?? [];
    if (assemblies.length > 0) {
      const firstAssembly = assemblies[0];
      const result = firstAssembly.form + ' ' + firstAssembly.name;
      return firstAssembly.name === 'monomer' ? 'monomeric' : result;
    }
    return '';
  });

  // data processed for all views
  readonly maxPerPage = 80;
  public processedMacromolecules = computed(() => {
    const rows = this.procMacromolecules();
    if (rows === undefined) return [];
    return rows;
  });

  public currentMacromoleculesPage = signal(0);

  public maxMacromoleculesPages = computed(() => {
    const hasMacromoleculesData = this.procMacromolecules();
    if (hasMacromoleculesData === undefined) return 1;
    const macromolecules = this.processedMacromolecules();
    const total = macromolecules.length;
    return Math.ceil(total / this.maxPerPage);
  });

  public setListViewPage(nextOrPrev: 1 | -1, selectionType: string) {
    const configMap = {
      Macromolecules: {
        currentPage: this.currentMacromoleculesPage,
        maxPages: this.maxMacromoleculesPages,
        panelSelector: '#mm-exp-panel .mat-expansion-panel-body',
      },
      Ligands: {
        currentPage: this.currentLigandsPage,
        maxPages: this.maxLigandsPages,
        panelSelector: '#lig-exp-panel .mat-expansion-panel-body',
      },
      Domains: {
        currentPage: this.currentDomainsPage,
        maxPages: this.maxDomainsPages,
        panelSelector: '#dom-exp-panel .mat-expansion-panel-body',
      },
      Modifications: {
        currentPage: this.currentModificationsPage,
        maxPages: this.maxModificationsPages,
        panelSelector: '#mod-exp-panel .mat-expansion-panel-body',
      },
    } as const;

    const config = configMap[selectionType as keyof typeof configMap];
    if (!config) return;

    const idx = config.currentPage();
    const max = config.maxPages();
    const proposedIdx = idx + nextOrPrev;
    const newIdx = (proposedIdx + max) % max; // wrap logic
    config.currentPage.set(newIdx);

    const element = document.querySelector(config.panelSelector) as HTMLElement;

    setTimeout(() => {
      if (element) {
        element.scrollTop = nextOrPrev === 1 ? 0 : element.scrollHeight;
      }
    }, 50);
  }

  public processedMacromoleculesToView = computed(() => {
    const macromolecules = this.processedMacromolecules();
    const page = this.currentMacromoleculesPage();
    const start = page * this.maxPerPage;
    const end = start + this.maxPerPage;
    return macromolecules.slice(start, end);
  });

  public processedLigands = computed(() => {
    const rows = this.procLigands();
    if (rows === undefined) return [];
    return rows.filter((lig) => lig.type === 'ligand');
  });

  public currentLigandsPage = signal(0);

  public maxLigandsPages = computed(() => {
    const hasLigandsData = this.procLigands();
    if (hasLigandsData === undefined) return 1;
    const ligands = this.processedLigands();
    const total = ligands.length;
    return Math.ceil(total / this.maxPerPage);
  });

  public processedLigandsToView = computed(() => {
    const ligands = this.processedLigands();
    const page = this.currentLigandsPage();
    const start = page * this.maxPerPage;
    const end = start + this.maxPerPage;
    return ligands.slice(start, end);
  });

  public allLigandsQueryParam = computed(() => {
    const ligandsSelectionData: QueryParam[] = [];
    const hasLigandsData = this.procLigands();
    if (hasLigandsData === undefined) return ligandsSelectionData;
    const ligands = this.processedLigands();
    ligandsSelectionData.push(
      ...ligands.map((ligand) => {
        const entityId = (ligand.additionalData.source as Molecule).entity_id;
        const entityColor = ligand.molstarColorHex;
        const queryParam: QueryParam = {
          entity_id: `${entityId}`,
          color: entityColor,
          representation: 'spacefill',
          representationColor: entityColor,
          focus: false,
        };
        this.nonSelectionColor = '#FEFEFE';
        return queryParam;
      })
    );
    return ligandsSelectionData;
  });

  public processedModifications = computed(() => {
    const rows = this.procLigands();
    if (rows === undefined) return [];
    return rows.filter((lig) => lig.type === 'modification');
  });

  public currentModificationsPage = signal(0);

  public maxModificationsPages = computed(() => {
    const hasLigandsData = this.procLigands();
    if (hasLigandsData === undefined) return 1;
    const modifications = this.processedModifications();
    const total = modifications.length;
    return Math.ceil(total / this.maxPerPage);
  });

  public processedModificationsToView = computed(() => {
    const modifications = this.processedModifications();
    const page = this.currentModificationsPage();
    const start = page * this.maxPerPage;
    const end = start + this.maxPerPage;
    return modifications.slice(start, end);
  });

  public allModificationsQueryParam = computed(() => {
    const modsSelectionData: QueryParam[] = [];
    const hasLigandsData = this.procLigands();
    if (hasLigandsData === undefined) return modsSelectionData;
    const modifications = this.processedModifications();
    for (const mod of modifications) {
      for (const sel of mod.additionalData.selections) {
        const modSel = sel[0];
        const entityColor = mod.molstarColorHex;
        modsSelectionData.push({
          ...modSel,
          color: entityColor,
          representation: 'spacefill',
          representationColor: entityColor,
          focus: false,
        });
        this.nonSelectionColor = '#FEFEFE';
      }
    }
    return modsSelectionData;
  });

  public processedDomainsAsList = computed(() => {
    const rows = this.procDomains();
    if (rows === undefined) return [];
    return rows;
  });

  public domainCount = computed(() => {
    return this.processedDomainsAsList().length;
  });

  public domainCountByResource = computed(() => {
    const countByResource: { [key: string]: number } = { CATH: 0, Pfam: 0, SCOP: 0 };
    const domainList = this.processedDomainsAsList();
    for (const domain of domainList) {
      countByResource[domain.resource]++;
    }
    return countByResource;
  });

  public uniqueDomainCountByResource = computed(() => {
    const uniqueByResource: { [key: string]: number } = { CATH: 0, Pfam: 0, SCOP: 0 };
    const uniqueAccessions: { [key: string]: Set<string> } = { CATH: new Set(), Pfam: new Set(), SCOP: new Set() };
    const domainList = this.processedDomainsAsList();
    for (const domain of domainList) {
      uniqueAccessions[domain.resource].add(domain.additionalData.accession);
    }
    for (const key of Object.keys(uniqueByResource)) {
      uniqueByResource[key] = uniqueAccessions[key].size;
    }
    return uniqueByResource;
  });

  public currentDomainResourceFromDropdown = signal<string | undefined>(undefined);

  public currentDomainResource = computed(() => {
    const dropdownSelectedResource = this.currentDomainResourceFromDropdown();
    if (dropdownSelectedResource) return dropdownSelectedResource;
    // const countByResource = this.domainCountByResource();
    // const firstAvailable = ['CATH', 'SCOP', 'Pfam'].find((r) => countByResource[r] > 0);
    // if (firstAvailable) return firstAvailable;
    return 'All';
  });

  public domainResourceCounts = computed(() => {
    const countByResource = this.domainCountByResource();
    const domainResourceCounts = [];

    domainResourceCounts.push({
      name: this.getDomainResourceCountTxt('All', countByResource),
      downloadable: false,
      url: '0',
    });

    domainResourceCounts.push({
      name: this.getDomainResourceCountTxt('CATH', countByResource),
      downloadable: false,
      url: '1',
    });

    domainResourceCounts.push({
      name: this.getDomainResourceCountTxt('Pfam', countByResource),
      downloadable: false,
      url: '2',
    });

    domainResourceCounts.push({
      name: this.getDomainResourceCountTxt('SCOP', countByResource),
      downloadable: false,
      url: '3',
    });

    return domainResourceCounts;
  });

  public processedDomainsForListView = computed(() => {
    const result: NestedDomainsData = [];
    const hasMacromoleculesData = this.procMacromolecules() !== undefined;
    const hasDomainsData = this.processedDomains() !== undefined;
    if (!hasMacromoleculesData || !hasDomainsData) return result;
    const processedDomains = this.processedDomains()!;
    for (const processedDomain of processedDomains) {
      const macromolecule = processedDomain.macromolecule;
      const allDomainsInListView = this.currentDomainResource() === 'All';
      let filteredDomains = processedDomain.domains;
      if (!allDomainsInListView) filteredDomains = processedDomain.domains.filter((domain) => domain.resource === this.currentDomainResource());
      if (filteredDomains.length > 0) {
        result.push({
          macromolecule,
          domains: filteredDomains,
        });
      }
    }
    return result;
  });

  public currentDomainsPage = signal(0);

  private chunkProcessedDomainsByDomainCount(processedDomains: NestedDomainsData): NestedDomainsData[] {
    const chunks: NestedDomainsData[] = [];
    let currentChunk: NestedDomainsData = [];
    let currentTotal = 0;

    for (const pd of processedDomains) {
      const domainCount = pd.domains.length;

      if (domainCount >= this.maxPerPage) {
        // Single large item goes in its own page
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = [];
          currentTotal = 0;
        }
        chunks.push([pd]);
      } else if (currentTotal + domainCount > this.maxPerPage) {
        // Current chunk is full, start a new one
        chunks.push(currentChunk);
        currentChunk = [pd];
        currentTotal = domainCount;
      } else {
        // Add to current chunk
        currentChunk.push(pd);
        currentTotal += domainCount;
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  public maxDomainsPages = computed(() => {
    const hasDomainsData = this.processedDomains() !== undefined;
    if (!hasDomainsData) return 1;

    const processedDomains = this.processedDomainsForListView();
    const chunks = this.chunkProcessedDomainsByDomainCount(processedDomains);
    return chunks.length || 1;
  });

  public processedDomainsToView = computed(() => {
    const page = this.currentDomainsPage();
    const processedDomains = this.processedDomainsForListView();
    const chunks = this.chunkProcessedDomainsByDomainCount(processedDomains);
    return chunks[page] || [];
  });

  public allCurrentResourceDomainsQueryParam = computed(() => {
    const hasDomainsData = this.processedDomains() !== undefined;
    if (!hasDomainsData) return [];

    const allDomainsInListView = this.currentDomainResource() === 'All';
    if (allDomainsInListView) return [];

    const domainSelectionData: QueryParam[] = [];
    const allDomains = this.processedDomainsAsList();
    const domainsForResource = allDomains.filter((dom) => dom.resource === this.currentDomainResource());
    for (const domain of domainsForResource) {
      const eachSelection = domain.additionalData.selections[0];
      for (const residRange of eachSelection) {
        const domainColor = domain.molstarColorHex;
        domainSelectionData.push({
          ...residRange,
          color: domainColor,
          focus: false,
        });
      }
    }
    if (domainSelectionData.length > 100) return [];
    return domainSelectionData;
  });

  public relatedEntries = computed(() => {
    let relatedEntries: string[] = [];
    const primaryPublication = this.primaryPublication();
    if (primaryPublication) {
      if (primaryPublication && primaryPublication.associated_entries) {
        relatedEntries = primaryPublication.associated_entries.split(', ');
      }
    }
    return relatedEntries;
  });

  // Create a computed signal for having related entries
  public hasRelatedEntries = computed(() => {
    const relatedEntries = this.relatedEntries();
    const hasRelatedEntries = relatedEntries.length > 0;
    return hasRelatedEntries;
  });

  // public relatedEntriesText = computed(() => {
  //   let relatedEntriesText = '';
  //   if (this.hasRelatedEntries()) relatedEntriesText = ' or explore related entries';
  //   return relatedEntriesText;
  // });

  public lastOpenedAccordionName = signal<string | undefined>(undefined);
  public openedAccordionName = signal<string | undefined>(undefined);

  public lastSelection: {
    [key: string]: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain | undefined;
  } = {};

  public lastSubSelection: {
    [key: string]: number;
  } = {
    Macromolecules: 0,
    Ligands: 0,
    Modifications: 0,
  };

  public getDomainResourceCountTxt(domainName: string, countByResource: { [key: string]: number }) {
    if (domainName === 'All') {
      const totalCount = Object.entries(countByResource).reduce((sum, [, count]) => sum + count, 0);
      const plural = totalCount > 1 ? 's' : '';
      return `All - ${totalCount} domain${plural}`;
    }
    const plural = countByResource[domainName] > 1 ? 's' : '';
    return `${domainName} - ${countByResource[domainName]} domain${plural}`;
  }

  public onOpenAccordionPanel(tabName: string) {
    this.gAS.logPageEvents('ep_overview_click', {
      tab_name: tabName,
    });
    this.lastOpenedAccordionName.set(tabName);
    if (tabName === this.openedAccordionName()) {
      this.openedAccordionName.set(undefined);
    } else {
      this.openedAccordionName.set(tabName);
    }
    this.updateView(tabName, false);
  }

  public async selectListItem(listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain, selectionType: string) {
    // on click if already selected -> undefined, otherwise select
    if (listItem === this.lastSelection[selectionType]) {
      this.lastSelection[selectionType] = undefined;
      this.dropdownOptionsToMolstar = {};
      this.dropdownOptions.set([]);
    } else {
      this.lastSelection[selectionType] = listItem;
    }
    this.updateView(selectionType, true);
  }

  public isSelected(listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain, selectionType: string) {
    return this.lastSelection[selectionType] === listItem;
  }

  public async mouseinListItem(listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain, selectionType: string) {
    const selectionToHighlight = await this.getSelectionObjForSelectionType(listItem, selectionType, false, false);
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance || !selectionToHighlight) return;
    await instance.visual.highlight({ data: selectionToHighlight });
  }

  public async mouseoutListItem() {
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    await instance.visual.clearHighlight();
  }

  public onDomainResourceSelect(event: string) {
    this.currentDomainResourceFromDropdown.set(event.split(' - ')[0]);
    this.updateView('Domains', true);
  }

  private updateView(tabName: string, resetDropdown: boolean) {
    const listViewItem = this.lastSelection[tabName];
    if (listViewItem) {
      this.updateDropdownOptions(listViewItem, tabName, resetDropdown);
    }
    this.updateMolstarAny(listViewItem, tabName);
  }

  private updateDropdownOptions(listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain, selectionType: string, resetDropdown: boolean) {
    if (selectionType === 'Assembly' || selectionType === 'Domains') {
      this.dropdownOptionsToMolstar = {};
      this.dropdownOptions.set([]);
    }
    if (selectionType === 'Macromolecules') {
      this.dropdownOptionsToMolstar = getMacromoleculeChainDropdownOptions(listItem as ProcessedMacromolecule);
      this.dropdownOptions.set(
        Object.keys(this.dropdownOptionsToMolstar).map((eachString, idx) => {
          return {
            name: eachString,
            url: `macro-${idx + 1}`,
            downloadable: false,
          };
        })
      );
      const subSelectionIdx = resetDropdown ? 0 : this.lastSubSelection[selectionType];
      if (resetDropdown) this.lastSubSelection[selectionType] = subSelectionIdx;
      this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[subSelectionIdx];
    }
    if (selectionType === 'Ligands') {
      this.dropdownOptionsToMolstar = getLigandsDropdownOptions(listItem as ProcessedLigandOrMod);
      this.dropdownOptions.set(
        Object.keys(this.dropdownOptionsToMolstar).map((eachString, idx) => {
          return {
            name: eachString,
            url: `lig-${idx + 1}`,
            downloadable: false,
          };
        })
      );
      const subSelectionIdx = resetDropdown ? 0 : this.lastSubSelection[selectionType];
      if (resetDropdown) this.lastSubSelection[selectionType] = subSelectionIdx;
      this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[subSelectionIdx];
    }
    if (selectionType === 'Modifications') {
      this.dropdownOptionsToMolstar = getLigandsDropdownOptions(listItem as ProcessedLigandOrMod);
      this.dropdownOptions.set(
        Object.keys(this.dropdownOptionsToMolstar).map((eachString, idx) => {
          return {
            name: eachString,
            url: `mod-${idx + 1}`,
            downloadable: false,
          };
        })
      );
      const subSelectionIdx = resetDropdown ? 0 : this.lastSubSelection[selectionType];
      if (resetDropdown) this.lastSubSelection[selectionType] = subSelectionIdx;
      this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[subSelectionIdx];
    }
  }

  public async onDropdownSelect(event: string) {
    const tabName = this.openedAccordionName();
    if (!tabName) return;
    const listViewItem = this.lastSelection[tabName];
    const subSelectionIdx = Object.keys(this.dropdownOptionsToMolstar).indexOf(event);
    if (subSelectionIdx === -1) return;
    this.lastSubSelection[tabName] = subSelectionIdx;
    this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[subSelectionIdx];
    this.updateMolstarAny(listViewItem, tabName);
  }

  private async getSelectionObjForSelectionType(
    listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain,
    selectionType: string,
    focusType: boolean,
    useCurrent: boolean
  ): Promise<QueryParam[] | undefined> {
    let molstarSelections: QueryParam[] | undefined = undefined;
    if (selectionType === 'Macromolecules') {
      const macromolecule = listItem as ProcessedMacromolecule;
      const allSelections: QueryParam[] = [
        {
          entity_id: `${macromolecule.additionalData.molecule.entity_id}`,
        },
      ];
      const currentMolstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
      molstarSelections = useCurrent ? currentMolstarSelection : allSelections;
    }
    if (selectionType === 'Ligands') {
      const ligand = listItem as ProcessedLigandOrMod;
      const src = ligand.additionalData.source as Molecule;
      const allSelections: QueryParam[] = [
        {
          entity_id: `${src.entity_id}`,
        },
      ];
      const currentMolstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
      molstarSelections = useCurrent ? currentMolstarSelection : allSelections;
    }
    if (selectionType === 'Domains') {
      const domain = listItem as ProcessedDomain;
      molstarSelections = domain.additionalData.selections[0];
    }
    if (selectionType === 'Modifications') {
      const mod = listItem as ProcessedLigandOrMod;
      const allSelections = mod.additionalData.selections;
      const currentMolstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
      const flatSelections = allSelections.flat(1);
      molstarSelections = useCurrent ? currentMolstarSelection : flatSelections;
    }
    if (!molstarSelections) return molstarSelections;

    // loop over each molstar selection and add color and focus
    const selectionToHighlight = molstarSelections.map((eachSelection) => {
      return {
        ...eachSelection,
        color: listItem.molstarColorHex,
        focus: focusType,
      };
    });
    return selectionToHighlight;
  }

  public async zoomInCurrentSelection() {
    const tabName = this.openedAccordionName();
    if (!tabName) return;
    const listViewItem = this.lastSelection[tabName];
    if (!listViewItem) return;
    const selectionToZoom = await this.getSelectionObjForSelectionType(listViewItem, tabName, true, true);
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance || !selectionToZoom) return;
    await instance.visual.focus(selectionToZoom);
  }

  private async updateMolstarAny(listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain | undefined, selectionType: string) {
    // Wait until first render is finished
    await firstValueFrom(
      this.molstarFirstRenderFinished$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );

    // check whether selection is in pref assembly, molstar config needs update and wait for it
    await this.updateConfigAssemblyAndSyncMolstar(listItem, selectionType === 'Domains', selectionType === 'Assembly');

    this.nonSelectionColor = undefined;
    if (selectionType === 'Assembly') {
      this.resetSelection();
    }
    if (selectionType === 'Macromolecules') {
      this.updateMolstarMacromolecules(listItem as ProcessedMacromolecule | undefined);
    }
    if (selectionType === 'Ligands') {
      this.updateMolstarLigands(listItem as ProcessedLigandOrMod | undefined);
    }
    if (selectionType === 'Domains') {
      this.updateMolstarDomains(listItem as ProcessedDomain | undefined);
    }
    if (selectionType === 'Modifications') {
      this.updateMolstarModifications(listItem as ProcessedLigandOrMod | undefined);
    }
  }

  public hasNonPrefAssemblySelection(listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain, mode: 'all' | 'any') {
    if (mode === 'all') return listItem.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly === false);
    else return listItem.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly === true) === false;
  }

  private async updateConfigAssemblyAndSyncMolstar(
    listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain | undefined,
    forDomains: boolean,
    forAssembly: boolean
  ) {
    const inPrefAssemblyForSelection = this.inPrefAssemblyForSelection();
    let isSelectionPrefAssembly = true;
    if (forAssembly) {
      isSelectionPrefAssembly = true;
    } else if (listItem) {
      const molstarSelectionIdx = forDomains ? 0 : Object.keys(this.dropdownOptionsToMolstar).indexOf(this.dropdownSelected);
      isSelectionPrefAssembly = listItem.additionalData.selectionsInPrefAssembly[molstarSelectionIdx];
    }

    const changedDisplayedAssembly = inPrefAssemblyForSelection !== isSelectionPrefAssembly;
    if (changedDisplayedAssembly && isSelectionPrefAssembly === false) {
      this.hasClosedMessage.set(false);
    }
    // setting inPrefAssemblyForInstance may trigger update on configForMolstar
    this.inPrefAssemblyForSelection.set(isSelectionPrefAssembly);

    // ... if this update is triggered
    if (changedDisplayedAssembly) {
      // wait until configForMolstar recomputes with new assembly/moleculeId
      const oldCfg = await firstValueFrom(this.configForMolstar$.pipe(take(1)));

      const newCfg = await firstValueFrom(
        this.configForMolstar$.pipe(
          filter((cfg) => cfg !== undefined && cfg !== oldCfg),
          take(1)
        )
      );

      // 2. Wait for MolstarComponent to APPLY the new config
      await firstValueFrom(
        this._molstarComponent!.configUpdated.pipe(
          filter((cfg) => JSON.stringify(cfg) === JSON.stringify(newCfg)),
          take(1)
        )
      );
    }
  }

  private async updateMolstarMacromolecules(macromolecule: ProcessedMacromolecule | undefined) {
    if (!macromolecule) {
      await this.resetSelection();
      return;
    }
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    // loop over each molstar selection and add color and focus
    this.selectionData = molstarSelection.map((eachSelection) => {
      return {
        ...eachSelection,
        color: macromolecule.molstarColorHex,
        focus: true,
      };
    });
    this.nonSelectionColor = '#FEFEFE';

    const durationMs = this._molstarComponent ? this.zoomOutDuration : 0;
    await this.onZoomOut(durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await this.onZoomInAndSelect();
    });
  }

  private async updateMolstarLigands(ligand: ProcessedLigandOrMod | undefined) {
    if (!ligand) {
      this.selectionData = [];
      const ligandsSelectionData = this.allLigandsQueryParam();
      this.selectionData = ligandsSelectionData;
      this.nonSelectionColor = '#FEFEFE';
    } else {
      const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
      const instance = this._molstarComponent?.getInstance() ?? undefined;
      const hasLigands = await componentExistsInMolstar(instance, 'ligand');
      this.selectionData = molstarSelection.map((eachSelection) => {
        return {
          ...eachSelection,
          color: ligand.molstarColorHex,
          focus: true,
          ...(hasLigands === false && {
            representation: 'ball-and-stick',
            representationColor: ligand.molstarColorHex,
          }),
        };
      });
    }

    const durationMs = this._molstarComponent ? this.zoomOutDuration : 0;
    await this.onZoomOut(durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await this.onZoomInAndSelect();
    });
  }

  private async updateMolstarDomains(domain: ProcessedDomain | undefined) {
    this.nonSelectionColor = '#FEFEFE';
    if (!domain) {
      this.selectionData = [];
      const domainsSelectionData = this.allCurrentResourceDomainsQueryParam();
      this.selectionData = domainsSelectionData;
    } else {
      this.selectionData = domain.additionalData.selections[0].map((eachSegment) => {
        return {
          ...eachSegment,
          color: domain.molstarColorHex,
          focus: true,
        };
      });
    }

    const durationMs = this._molstarComponent ? this.zoomOutDuration : 0;
    await this.onZoomOut(durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await this.onZoomInAndSelect();
    });
  }

  private async updateMolstarModifications(mod: ProcessedLigandOrMod | undefined) {
    if (!mod) {
      this.selectionData = [];
      const ligandsSelectionData = this.allModificationsQueryParam();
      this.selectionData = ligandsSelectionData;
      this.nonSelectionColor = '#FEFEFE';
    } else {
      const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
      const instance = this._molstarComponent?.getInstance() ?? undefined;
      const hasModifications = await componentExistsInMolstar(instance, 'non-standard');
      this.selectionData = molstarSelection.map((eachSelection) => {
        return {
          ...eachSelection,
          color: mod.molstarColorHex,
          focus: true,
          ...(hasModifications === false && {
            representation: 'ball-and-stick',
            representationColor: mod.molstarColorHex,
          }),
        };
      });
    }

    const durationMs = this._molstarComponent ? this.zoomOutDuration : 0;
    await this.onZoomOut(durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await this.onZoomInAndSelect();
    });
  }
}
