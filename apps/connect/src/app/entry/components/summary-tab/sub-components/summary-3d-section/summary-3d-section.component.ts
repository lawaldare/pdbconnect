import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService, MaterialModule } from '@pdbc/core';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { ComponentExpressionT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { map } from 'rxjs';
import { ModifiedResidue } from '../../../../data-models/modified-residues.model';
import type { Molecule } from '../../../../data-models/molecule.model';
import { assemblyCompositionTooltip, assemblyNameTooltip, baseUrl, complexIdTooltip, preferredAssemblyTooltip } from '../../../../entry-constant';
import { Dropdown, makeEntityColors, toBehaviorSubject, updateSymmetryDropdownOptions, whenSignalFirstTrue } from '../../../../helpers/misc';
import { EntryPageTabsCommonMolstarParams, QueryParamForHelpers } from '../../../../helpers/molstar-helpers';
import { MVSHandler } from '../../../../helpers/mvs-handler';
import type { SnapshotSpec } from '../../../../helpers/mvs-views/mvs-snapshot-types';
import {
  getCleanMoleculeName,
  getDomainChainDropdownOptions,
  getLigandsDropdownOptions,
  getMacromoleculeChainDropdownOptions,
} from '../../../../helpers/processed-data-to-controls';
import { ComponentCommunicationService } from '../../../../services/component-comm.service';
import { ProcessedLigandOrMod } from '../../../../store/data-processing/ligand-processing';
import { ProcessedDomain, ProcessedMacromolecule } from '../../../../store/data-processing/models/processed-entities.model';
import { EntryStoreState } from '../../../../store/entry-store.model';
import { EntrySelectors } from '../../../../store/entry.selectors';
import { EntryDropdownComponent } from '../../../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';

type NestedDomainsData = Array<{
  macromolecule: ProcessedMacromolecule;
  domains: ProcessedDomain[];
}>;

type ViewItem =
  | { kind: 'Assembly'; item: undefined }
  | { kind: 'Macromolecules'; item: ProcessedMacromolecule | undefined }
  | { kind: 'Ligands'; item: ProcessedLigandOrMod | undefined }
  | { kind: 'Domains'; item: ProcessedDomain | undefined }
  | { kind: 'Modifications'; item: ProcessedLigandOrMod | undefined };

type DropdownDetail =
  | { kind: 'Macromolecules'; item: undefined }
  | { kind: 'Ligands'; item: undefined }
  | { kind: 'Domains'; item: undefined }
  | { kind: 'Modifications'; item: ModifiedResidue };

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

  private molstarReady = signal(false);
  private _molstarComponent?: MolstarComponent;
  @ViewChild('molstarComponent') set molstarComponent(ref: MolstarComponent | undefined) {
    if (ref) {
      this._molstarComponent = ref;
      this.molstarReady.set(true);
    }
  }
  private molstarFirstRenderFinished = computed(() => this.molstarReady() && this._molstarComponent!.firstLoadFinished());

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

  constructor() {
    whenSignalFirstTrue(this.molstarFirstRenderFinished).subscribe(() => {
      // run after molstar rendered
      const mvsHandler = MVSHandler(this._molstarComponent);
      this.mvsSnapshotSpec$.subscribe((spec) => mvsHandler.loadMVSSnapshotSpec(spec));
    });
  }

  public toggleMolstar() {
    const forceLoad = this.compCommunication.forceLoad();
    this.compCommunication.forceLoad.set(!forceLoad);
  }

  public inPrefAssemblyForSelection = signal(true);
  public hasClosedMessage = signal(false);

  private preferredAssemblyId = computed<string | undefined>(() => this.summary()?.assemblies.find((ass) => ass.preferred)?.assembly_id);

  public readonly configForMolstar = computed(() => EntryPageTabsCommonMolstarParams);

  private readonly viewItem = signal<ViewItem>({ kind: 'Assembly', item: undefined });

  public dropdown = new Dropdown<{
    authAsymId: string;
    molstarSelection: QueryParamForHelpers[];
    inPrefAssembly: boolean;
    symmOperators: string[];
    detail: DropdownDetail;
  }>();
  public symmetryDropdown = new Dropdown<{ instanceId: string | undefined }>();

  private selectedInstanceId = computed(() => this.symmetryDropdown.selectedOption()?.data.instanceId);

  public getCleanMoleculeName = getCleanMoleculeName;

  /** Indicates if the currently selected substructure should be focused in 3D or not. */
  public readonly zoomed = signal<boolean>(true);

  /** Zoom in or out currently selected substructure */
  async zoomCurrentSelection(zoomed: boolean) {
    if (zoomed !== this.zoomed()) {
      // Update mvsSnapshotSpec indirectly
      this.zoomed.set(zoomed);
    } else {
      // Replay current mvsSnapshotSpec
      this.mvsSnapshotSpec$.next(this.mvsSnapshotSpec$.value);
    }
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
  public processedMacromolecules = computed(() => this.procMacromolecules() ?? []);

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

  public processedLigands = computed(() => this.procLigands()?.filter((lig) => lig.type === 'ligand') ?? []);

  private readonly entityColors = computed(() => makeEntityColors(this.procMacromolecules(), this.procLigands()));

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

    const domainSelectionData: QueryParamForHelpers[] = [];
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

  public lastSubSelection: { [key: string]: number } = { Macromolecules: 0, Ligands: 0, Modifications: 0 };

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
      this.dropdown.updateOptions([]);
      this.symmetryDropdown.updateOptions([]);
    } else {
      this.lastSelection[selectionType] = listItem;
    }
    this.updateView(selectionType, true);
  }

  public isSelected(listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain, selectionType: string) {
    return this.lastSelection[selectionType] === listItem;
  }

  public async mouseinListItem(listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain, selectionType: string) {
    const selectionToHighlight = await this.getSelectionObjForSelectionType(listItem, selectionType);
    const instance = this._molstarComponent?.getInstance();
    if (!instance || !selectionToHighlight) return;
    await instance.visual.highlight({ data: selectionToHighlight });
  }

  public async mouseoutListItem() {
    const instance = this._molstarComponent?.getInstance();
    if (!instance) return;
    await instance.visual.clearHighlight();
  }

  public onDomainResourceSelect(event: string) {
    this.currentDomainResourceFromDropdown.set(event.split(' - ')[0]);
    this.updateView('Domains', true);
  }

  private updateView(tabName: string, resetDropdown: boolean) {
    const listViewItem = this.lastSelection[tabName];
    this.updateDropdownOptions(listViewItem, tabName);
    this.updateSymmetryDropdownOptions(tabName);
    this.viewItem.set({ kind: tabName as any, item: listViewItem });
    this.zoomed.set(true);
  }

  private updateDropdownOptions(listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain | undefined, selectionType: string) {
    type DropdownOption = Summary3DSectionComponent['dropdown']['options'][number];
    this.dropdown.updateOptions([]);
    if (!listItem) return;

    if (selectionType === 'Assembly') {
      this.dropdown.updateOptions([]);
    }

    if (selectionType === 'Macromolecules') {
      const macromolecule = listItem as ProcessedMacromolecule;
      const options = getMacromoleculeChainDropdownOptions(macromolecule);
      this.dropdown.updateOptions(
        Object.keys(options).map((name, idx): DropdownOption => {
          const authAsymId = macromolecule.additionalData.selections[idx][0].auth_asym_id;
          if (authAsymId === undefined) throw new Error('authAsymId is undefined');
          return {
            name: name,
            url: `macro-${idx + 1}`,
            downloadable: false,
            data: {
              authAsymId,
              molstarSelection: options[name],
              inPrefAssembly: macromolecule.additionalData.selectionsInPrefAssembly[idx],
              symmOperators: macromolecule.chainSymmOperators[authAsymId] ?? [],
              detail: { kind: 'Macromolecules', item: undefined },
            },
          };
        })
      );
    }

    if (selectionType === 'Ligands' || selectionType === 'Modifications') {
      const ligand = listItem as ProcessedLigandOrMod;
      const options = getLigandsDropdownOptions(ligand);
      this.dropdown.updateOptions(
        Object.keys(options).map((name, idx): DropdownOption => {
          const molstarSelection = options[name];
          const authAsymId = molstarSelection[0].auth_asym_id;
          if (authAsymId === undefined) throw new Error('authAsymId is undefined');
          return {
            name: name,
            url: `lig-${idx + 1}`,
            downloadable: false,
            data: {
              authAsymId,
              molstarSelection,
              inPrefAssembly: ligand.additionalData.selectionsInPrefAssembly[idx],
              symmOperators: ligand.symmOpListForEachLigOrMod[idx],
              detail: ligand.type === 'modification' ? { kind: 'Modifications', item: ligand.additionalData.source[idx] } : { kind: 'Ligands', item: undefined },
            },
          };
        })
      );
    }

    if (selectionType === 'Domains') {
      const domain = listItem as ProcessedDomain;
      const options = getDomainChainDropdownOptions(domain);
      this.dropdown.updateOptions(
        Object.keys(options).map((name, idx): DropdownOption => {
          const authAsymId = domain.additionalData.selections[idx][0].auth_asym_id;
          if (authAsymId === undefined) throw new Error('authAsymId is undefined');
          return {
            name: name,
            url: `domain-${idx + 1}`,
            downloadable: false,
            data: {
              authAsymId,
              molstarSelection: options[name],
              inPrefAssembly: domain.additionalData.selectionsInPrefAssembly[idx],
              symmOperators: domain.symmOpListForSegments[idx],
              detail: { kind: selectionType, item: undefined },
            },
          };
        })
      );
    }
  }

  private updateSymmetryDropdownOptions(selectionType: string) {
    const prefix =
      selectionType === 'Macromolecules'
        ? `macro-${this.dropdown.selectedOption()?.data.authAsymId}-symop-`
        : selectionType === 'Ligands' || selectionType === 'Modifications'
          ? 'lig-0-symop-'
          : selectionType === 'Domains'
            ? 'domain-0-symop-'
            : 'symop-';
    updateSymmetryDropdownOptions(this.symmetryDropdown, this.dropdown.selectedOption()?.data.symmOperators, prefix);
  }

  public async onDropdownSelect(event: string) {
    const tabName = this.openedAccordionName();
    if (!tabName) return;
    this.dropdown.select(event);
    this.updateSymmetryDropdownOptions(tabName);
    this.zoomed.set(true);
  }

  public async onSymmetryDropdownSelect(event: string) {
    this.symmetryDropdown.select(event);
    this.zoomed.set(true);
  }

  private async getSelectionObjForSelectionType(
    listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain,
    selectionType: string
  ): Promise<ComponentExpressionT[] | undefined> {
    if (selectionType === 'Macromolecules') {
      const macromolecule = listItem as ProcessedMacromolecule;
      return [{ label_entity_id: String(macromolecule.additionalData.molecule.entity_id) }];
    }
    if (selectionType === 'Ligands') {
      const ligand = listItem as ProcessedLigandOrMod;
      const src = ligand.additionalData.source as Molecule;
      return [{ label_entity_id: String(src.entity_id) }];
    }
    if (selectionType === 'Domains') {
      const domain = listItem as ProcessedDomain;
      return domain.additionalData.boundaries.map((segment) => ({
        auth_asym_id: segment.chain,
        beg_label_seq_id: segment.start,
        end_label_seq_id: segment.end,
      }));
    }
    if (selectionType === 'Modifications') {
      const mod = listItem as ProcessedLigandOrMod;
      return [{ label_comp_id: `${mod.id}` }];
    }
    return undefined;
  }

  private readonly mvsSnapshotSpec = computed<SnapshotSpec | undefined>(() => {
    const entryId = this.entryId();
    if (!entryId) return undefined;
    const viewItem = this.viewItem();
    if (!viewItem) return undefined;

    const dropdownSelected = this.dropdown.selectedOption();
    const molstarSelection = dropdownSelected?.data.molstarSelection;
    const inPrefAssembly = dropdownSelected?.data.inPrefAssembly ?? true;
    const detail = dropdownSelected?.data.detail;
    const assemblyId = inPrefAssembly ? this.preferredAssemblyId() : undefined; // undefined = deposited model
    const entityColors = this.entityColors();

    switch (viewItem.kind) {
      case 'Assembly':
        return {
          name: 'Preferred complex',
          kind: 'pdbconnect_complex',
          params: { entry: entryId, assemblyId, volumeStreaming: true, entityColors },
        } satisfies SnapshotSpec;
      case 'Macromolecules':
        if (!viewItem.item) {
          return {
            name: 'All macromolecules',
            kind: 'pdbconnect_complex',
            params: { entry: entryId, assemblyId, volumeStreaming: true, entityColors },
          } satisfies SnapshotSpec;
        } else {
          const entityData = viewItem.item.additionalData;
          const entityId = String(entityData.molecule.entity_id);
          if (!molstarSelection) return undefined;
          const labelAsymId = molstarSelection[0].label_asym_id;
          const authAsymId = molstarSelection[0].auth_asym_id;
          const instanceId = this.selectedInstanceId();
          const focus = this.zoomed();
          return {
            name: 'Macromolecule',
            kind: 'pdbconnect_macromolecule',
            params: { entry: entryId, assemblyId, entityId, labelAsymId, authAsymId, instanceId, focus, volumeStreaming: true, color: entityColors[entityId] },
          } satisfies SnapshotSpec;
        }
      case 'Ligands':
        if (!viewItem.item) {
          const ligandEntityIds = this.processedLigands().map((ligand) => String(ligand.additionalData.source.entity_id));
          return {
            name: 'All ligands',
            kind: 'pdbconnect_all_ligands',
            params: { entry: entryId, assemblyId, volumeStreaming: true, ligandEntityIds, modifications: undefined, entityColors },
          } satisfies SnapshotSpec;
        } else {
          const ligandData = viewItem.item.additionalData;
          const moleculeData = ligandData.source as Molecule;
          const entityId = String(moleculeData.entity_id);
          if (!molstarSelection) return undefined;
          const labelAsymId = molstarSelection[0].label_asym_id;
          if (!labelAsymId) throw new Error('label_asym_id for ligand instance not set');
          const instanceId = this.selectedInstanceId();
          const focus = this.zoomed();
          return {
            name: 'Ligand',
            kind: 'pdbconnect_ligand',
            params: { entry: entryId, assemblyId, entityId, labelAsymId, instanceId, focus, volumeStreaming: true, entityColors },
          } satisfies SnapshotSpec;
        }
      case 'Domains': {
        const selectedResource = this.currentDomainResource();
        const domains: ProcessedDomain[] = viewItem.item ? [viewItem.item] : this.procDomains()?.filter((dom) => dom.resource === selectedResource) ?? []; // empty list when selectedResource==='All'
        const instanceId = this.selectedInstanceId();
        const focus = this.zoomed();
        return {
          name: 'Domains',
          kind: 'pdbconnect_domains',
          params: {
            entry: entryId,
            assemblyId,
            domains: domains.map((dom) => ({
              name: dom.additionalData.accession,
              color: dom.molstarColorHex ?? 'gray',
              selector: dom.additionalData.boundaries.map(
                (segment) =>
                  ({
                    auth_asym_id: segment.chain,
                    beg_label_seq_id: segment.start,
                    end_label_seq_id: segment.end,
                    instance_id: instanceId,
                  }) satisfies ComponentExpressionT
              ),
            })),
            focus,
            volumeStreaming: true,
          },
        } satisfies SnapshotSpec;
        // TODO: fix every domain appearing twice in the list (entry 1bvy)
      }
      case 'Modifications': {
        const allModres = this.processedModifications();
        const spec: SnapshotSpec<'pdbconnect_modifications'> = {
          name: 'Modifications',
          kind: 'pdbconnect_modifications',
          params: {
            entry: entryId,
            assemblyId,
            modifications: allModres.map((mod) => ({
              labelCompId: mod.id,
              name: mod.codeAndName.name,
              color: mod.molstarColorHex ?? 'gray',
            })),
            selected: undefined,
            focus: false,
            volumeStreaming: true,
            entityColors,
          },
        };
        if (viewItem.item) {
          if (detail?.kind !== 'Modifications') return undefined;
          const modres = detail.item;
          const instanceId = this.selectedInstanceId();
          spec.name = `Selected modification ${viewItem.item.id}`;
          spec.params.selected = [
            {
              label_asym_id: modres.struct_asym_id,
              label_seq_id: modres.residue_number,
              instance_id: instanceId,
            },
          ];
          spec.params.focus = this.zoomed();
        }
        return spec;
      }
      default: {
        console.warn('unknown view kind:', (viewItem as any).kind);
        return undefined;
      }
    }
  });
  private readonly mvsSnapshotSpec$ = toBehaviorSubject(this.mvsSnapshotSpec); // Using `BehaviorSubject` instead of `toObservable` so that we can force to re-emit current value (for zoom in/out)

  public hasNonPrefAssemblySelection(listItem: ProcessedMacromolecule | ProcessedLigandOrMod | ProcessedDomain, mode: 'all' | 'any') {
    if (mode === 'all') return listItem.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly === false);
    else return listItem.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly === true) === false;
  }
}
