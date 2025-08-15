import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrucQualityGradientsComponent } from '../shared/struc-quality-gradients/struc-quality-gradients.component';
import { MaterialModule } from '@pdbc/core';
import { UtilService } from '@pdbc/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { assemblyCompositionTooltip, assemblyNameTooltip, complexIdTooltip, preferredAssemblyTooltip } from '../../entry-constant';
import { modelQualitySummaryTooltip } from '../../entry-constant';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { DefaultParams, InitParams } from 'pdbe-molstar/lib/spec';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PresetStructureRepresentations } from 'molstar/lib/mol-plugin-state/builder/structure/representation-preset';
import { DownloadStructure } from 'molstar/lib/mol-plugin-state/actions/structure';
import { Structure } from 'molstar/lib/mol-model/structure';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { filter, firstValueFrom, map, take, timer } from 'rxjs';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../../data-classes/data-models-and-definitions/row-and-table.model';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { getLigandsDropdownOptions, getMacromoleculeChainDropdownOptions } from '../../helpers/processed-data-to-controls';
import { drawSelectionInMolstar, zoomOutStructureInMolstar } from '../../helpers/molstar-helpers';

type NestedDomainsData = Array<{
  macromolecule: MacromoleculesRowData;
  domains: DomainsRowData[];
}>;
@Component({
  selector: 'pdbc-summary-tab',
  imports: [CommonModule, StrucQualityGradientsComponent, MaterialModule, MolstarComponent, NgxSkeletonLoaderModule, EntryDropdownComponent],
  templateUrl: './summary-tab.component.html',
  styleUrl: './summary-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryTabComponent implements AfterViewInit {
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly util = inject(UtilService);
  private readonly compCommunication = inject(ComponentCommunicationService);

  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly organismScientificNames = toSignal(this.globalStore.select(EntrySelectors.organismScientificNames));
  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));
  public readonly qualityScores = toSignal(this.globalStore.select(EntrySelectors.summaryQualityScores));

  /**
   * Left panel: Text information related
   */
  public modelQualitySummaryTooltip = modelQualitySummaryTooltip;

  public mappedInformation: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

  public initialAuthorCount = signal<number>(5);
  public initialEntriesCount = signal<number>(5);

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }

  public generateAuthorSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'all_authors');
  }

  public splitStringByCommas(str: string): string[] {
    return str.split(',').map((e) => e.trim());
  }

  toggleAuthorList() {
    const authorList = this.primaryPublication()?.author_list ?? [];
    this.initialAuthorCount.update((prev) => (prev === 5 ? authorList.length : 5));
  }

  public toggleEntriesList(): void {
    const entries = this.primaryPublication()?.associated_entries ?? '';
    const entriesArray = this.splitStringByCommas(entries);
    this.initialEntriesCount.update((prev) => (prev === 5 ? entriesArray.length : 5));
  }

  /**
   * Right panel: Molstar related
   */

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

  public molstarFirstRenderFinished = computed(() => {
    if (!this.molstarReady()) return false;
    return this._molstarComponent?.firstLoadFinished() || false;
  });
  private molstarFirstRenderFinished$ = toObservable(this.molstarFirstRenderFinished);

  public readonly configForMolstar = computed<InitParams | undefined>(() => {
    const summary = this.summary();
    const entryId = this.entryId();
    // const chainSelection = this.chainSelection();

    if (!summary || !entryId) return undefined;
    const preferredAssembly = summary.assemblies.length > 0 ? summary.assemblies.filter((eachAssembly) => eachAssembly.preferred) : [];
    const preferredAssemblyId = preferredAssembly.length > 0 ? preferredAssembly[0].assembly_id : '1';

    const configForMolstar: InitParams = {
      ...DefaultParams,
      moleculeId: this.entryId(),
      assemblyId: preferredAssemblyId,
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
      // ...(chainSelection && { 'selection': chainSelection }),
    };

    return configForMolstar;
  });

  public zoomOutDuration = 600;

  public dropdownSelected!: string;
  public dropdownOptions = signal<DownloadOption[]>([]);
  public dropdownOptionsToMolstar: { [key: string]: QueryParam[] } = {};

  private selectionData?: QueryParam[];
  private nonSelectionColor?: string;

  private zoomSelectionMutex = Promise.resolve();

  ngAfterViewInit(): void {
    // forces molstar to apply 'polymer-and-ligand' component preset when it loads (so ligands, ions, etc always shown)
    this.molstarFirstRenderFinished$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((finished) => {
      if (finished && this.compCommunication.currentTabName() === 'summary') {
        let attempts = 0;
        const maxAttempts = 180; // polling for 3 minutes, 1 attempt every second

        const pollingInterval = setInterval(() => {
          try {
            if (this.compCommunication.currentTabName() !== 'summary') {
              clearInterval(pollingInterval);
              return;
            }
            const plugin = this._molstarComponent?.getInstance()?.plugin ?? null;
            if (!plugin) throw new Error('Mol* plugin not found');

            const params = DownloadStructure.createDefaultParams(plugin.state.data.root.obj!, plugin);
            const assemblyRef = plugin.managers.structure?.hierarchy?.current?.structures[0]?.cell?.transform?.ref;
            const structure = plugin.state.data?.select(assemblyRef)[0]?.obj?.data;
            const thresholds = plugin.config.get(PluginConfig.Structure.SizeThresholds) || Structure.DefaultSizeThresholds;
            const size = Structure.getSize(structure, thresholds);
            if (size !== Structure.Size.Small) {
              PresetStructureRepresentations['polymer-and-ligand'].apply(assemblyRef, params as any, plugin);
            }
          } catch (error) {
            console.warn(`Error during attempt ${attempts + 1} for Mol* initialization:`, error);
          }

          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(pollingInterval); // Stop polling after 3 minutes
            console.warn('Polling expired: Mol* setup was not successful in time.');
          }
        }, 1000); // polling interval: 1 secon
      }
    });
  }

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
  public assemblyData = computed(() => this.compCommunication.preferredAssemblyData());
  public entryContentsDescription = computed(() => this.compCommunication.descriptions()?.entryContentsDescription);
  public macromoleculesDescription = computed(() => this.compCommunication.descriptions()?.macromoleculesDescription);

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
  public processedMacromolecules = computed(() => {
    const hasMacromoleculesData = this.compCommunication.hasProcessedMacromolecules();
    if (!hasMacromoleculesData) return [];
    return this.compCommunication.processedMacromolecules;
  });

  public processedLigands = computed(() => {
    const hasLigandsData = this.compCommunication.hasProcessedLigands();
    if (!hasLigandsData) return [];
    return this.compCommunication.processedLigands;
  });

  public allLigandsQueryParam = computed(() => {
    const ligandsSelectionData: QueryParam[] = [];
    const hasLigandsData = this.compCommunication.hasProcessedLigands();
    if (!hasLigandsData) return ligandsSelectionData;
    const ligands = this.compCommunication.processedLigands;
    for (const lig of ligands) {
      for (const sel of lig.additionalData.selections) {
        const ligSel = sel[0];
        const entityColor = lig.molstarColorHex;
        ligandsSelectionData.push({
          ...ligSel,
          color: entityColor,
          representation: 'spacefill',
          representationColor: entityColor,
          focus: false,
        });
        this.nonSelectionColor = '#FEFEFE';
      }
    }
    return ligandsSelectionData;
  });

  public processedModifications = computed(() => {
    const hasLigandsData = this.compCommunication.hasProcessedLigands();
    if (!hasLigandsData) return [];
    return this.compCommunication.processedModifications;
  });

  public allModificationsQueryParam = computed(() => {
    const modsSelectionData: QueryParam[] = [];
    const hasLigandsData = this.compCommunication.hasProcessedLigands();
    if (!hasLigandsData) return modsSelectionData;
    const modifications = this.compCommunication.processedModifications;
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
    const hasDomainsData = this.compCommunication.hasProcessedDomains();
    if (!hasDomainsData) return [];
    return this.compCommunication.processedDomainsAsList;
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
    const countByResource = this.domainCountByResource();
    const firstAvailable = ['CATH', 'SCOP', 'Pfam'].find((r) => countByResource[r] > 0);
    if (firstAvailable) return firstAvailable;
    return 'CATH';
  });

  public domainResourceCounts = computed(() => {
    const countByResource = this.domainCountByResource();
    const domainResourceCounts = [];

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
    const hasMacromoleculesData = this.compCommunication.hasProcessedMacromolecules();
    const hasDomainsData = this.compCommunication.hasProcessedDomains();
    if (!hasMacromoleculesData || !hasDomainsData) return result;
    const processedDomains = this.compCommunication.processedDomains;
    for (const processedDomain of processedDomains) {
      const macromolecule = processedDomain.macromolecule;
      const filteredDomains = processedDomain.domains.filter((domain) => domain.resource === this.currentDomainResource());
      if (filteredDomains.length > 0) {
        result.push({
          macromolecule,
          domains: filteredDomains,
        });
      }
    }
    return result;
  });

  public allCurrentResourceDomainsQueryParam = computed(() => {
    const domainSelectionData: QueryParam[] = [];
    const hasDomainsData = this.compCommunication.hasProcessedDomains();
    if (!hasDomainsData) return domainSelectionData;

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

  public openedAccordionName?: string;

  public lastSelection: {
    [key: string]: MacromoleculesRowData | LigandsRowData | DomainsRowData | undefined;
  } = {};

  public lastSubSelection: {
    [key: string]: number;
  } = {
    Macromolecules: 0,
    Ligands: 0,
    Modifications: 0,
  };

  public getDomainResourceCountTxt(domainName: string, countByResource: { [key: string]: number }) {
    const plural = countByResource[domainName] > 1 ? 's' : '';
    return `${domainName} - ${countByResource[domainName]} domain${plural}`;
  }

  public onOpenAccordionPanel(tabName: string) {
    if (tabName === this.openedAccordionName) {
      this.openedAccordionName = undefined;
    } else {
      this.openedAccordionName = tabName;
    }
    this.updateView(tabName, false);
  }

  public async selectListItem(listItem: MacromoleculesRowData | LigandsRowData | DomainsRowData, selectionType: string) {
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

  public isSelected(listItem: MacromoleculesRowData | LigandsRowData | DomainsRowData, selectionType: string) {
    return this.lastSelection[selectionType] === listItem;
  }

  public async mouseinListItem(listItem: MacromoleculesRowData | LigandsRowData | DomainsRowData, selectionType: string) {
    const selectionToHighlight = this.getSelectionObjForSelectionType(listItem, selectionType, false, false);
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

  private updateDropdownOptions(listItem: MacromoleculesRowData | LigandsRowData | DomainsRowData, selectionType: string, resetDropdown: boolean) {
    if (selectionType === 'Assembly' || selectionType === 'Domains') {
      this.dropdownOptionsToMolstar = {};
      this.dropdownOptions.set([]);
    }
    if (selectionType === 'Macromolecules') {
      this.dropdownOptionsToMolstar = getMacromoleculeChainDropdownOptions(listItem as MacromoleculesRowData);
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
      this.dropdownOptionsToMolstar = getLigandsDropdownOptions(listItem as LigandsRowData);
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
      this.dropdownOptionsToMolstar = getLigandsDropdownOptions(listItem as LigandsRowData);
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
    if (!this.openedAccordionName) return;
    const tabName = this.openedAccordionName;
    const listViewItem = this.lastSelection[tabName];
    const subSelectionIdx = Object.keys(this.dropdownOptionsToMolstar).indexOf(event);
    if (subSelectionIdx === -1) return;
    this.lastSubSelection[tabName] = subSelectionIdx;
    this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[subSelectionIdx];
    this.updateMolstarAny(listViewItem, tabName);
  }

  private getSelectionObjForSelectionType(
    listItem: MacromoleculesRowData | LigandsRowData | DomainsRowData,
    selectionType: string,
    focusType: boolean,
    useCurrent: boolean
  ): QueryParam[] | undefined {
    let molstarSelections: QueryParam[] | undefined = undefined;
    if (selectionType === 'Macromolecules') {
      const macromolecule = listItem as MacromoleculesRowData;
      const allSelections = macromolecule.additionalData.selections;
      const currentMolstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
      const flatSelections = allSelections.reduce((acc, curr) => acc.concat(curr), []);
      molstarSelections = useCurrent ? currentMolstarSelection : flatSelections;
    }
    if (selectionType === 'Ligands') {
      const ligand = listItem as LigandsRowData;
      const allSelections = ligand.additionalData.selections;
      const currentMolstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
      const flatSelections = allSelections.reduce((acc, curr) => acc.concat(curr), []);
      molstarSelections = useCurrent ? currentMolstarSelection : flatSelections;
    }
    if (selectionType === 'Domains') {
      const domain = listItem as DomainsRowData;
      molstarSelections = domain.additionalData.selections[0];
    }
    if (selectionType === 'Modifications') {
      const mod = listItem as LigandsRowData;
      const allSelections = mod.additionalData.selections;
      const currentMolstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
      const flatSelections = allSelections.reduce((acc, curr) => acc.concat(curr), []);
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
    if (!this.openedAccordionName) return;
    const tabName = this.openedAccordionName;
    const listViewItem = this.lastSelection[tabName];
    if (!listViewItem) return;
    const selectionToZoom = this.getSelectionObjForSelectionType(listViewItem, tabName, true, true);
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance || !selectionToZoom) return;
    await instance.visual.focus(selectionToZoom);
  }

  private async updateMolstarAny(listItem: MacromoleculesRowData | LigandsRowData | DomainsRowData | undefined, selectionType: string) {
    // Wait until first render is finished
    await firstValueFrom(
      this.molstarFirstRenderFinished$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );
    this.nonSelectionColor = undefined;
    if (selectionType === 'Assembly') {
      this.resetSelection();
    }
    if (selectionType === 'Macromolecules') {
      this.updateMolstarMacromolecules(listItem as MacromoleculesRowData | undefined);
    }
    if (selectionType === 'Ligands') {
      this.updateMolstarLigands(listItem as LigandsRowData | undefined);
    }
    if (selectionType === 'Domains') {
      this.updateMolstarDomains(listItem as DomainsRowData | undefined);
    }
    if (selectionType === 'Modifications') {
      this.updateMolstarModifications(listItem as LigandsRowData | undefined);
    }
  }

  private async updateMolstarMacromolecules(macromolecule: MacromoleculesRowData | undefined) {
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

  private async updateMolstarLigands(ligand: LigandsRowData | undefined) {
    if (!ligand) {
      this.selectionData = [];
      const ligandsSelectionData = this.allLigandsQueryParam();
      this.selectionData = ligandsSelectionData;
      this.nonSelectionColor = '#FEFEFE';
    } else {
      const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
      this.selectionData = molstarSelection.map((eachSelection) => {
        return {
          ...eachSelection,
          color: ligand.molstarColorHex,
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

  private async updateMolstarDomains(domain: DomainsRowData | undefined) {
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

  private async updateMolstarModifications(mod: LigandsRowData | undefined) {
    if (!mod) {
      this.selectionData = [];
      const ligandsSelectionData = this.allModificationsQueryParam();
      this.selectionData = ligandsSelectionData;
      this.nonSelectionColor = '#FEFEFE';
    } else {
      const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
      this.selectionData = molstarSelection.map((eachSelection) => {
        return {
          ...eachSelection,
          color: mod.molstarColorHex,
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
}
