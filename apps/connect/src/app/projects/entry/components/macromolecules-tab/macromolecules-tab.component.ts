/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, linkedSignal, OnInit, signal, ViewChild } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { dashboardStatLinks } from '../../entry-constant';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService, MaterialModule, ScriptLoaderService, UtilService } from '@pdbc/core';
import { getMacromoleculeChainDropdownOptions, getMacromoleculeSequenceDetails } from '../../helpers/processed-data-to-controls';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryPgProtvistaComponent } from '../shared/entry-pv-nightingale/entry-pv-nightingale.component';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { ComponentType } from '@angular/cdk/overlay';
import { EcNumbersComponent } from '../shared/ec-numbers/ec-numbers.component';
import { GoTermsComponent } from '../shared/go-terms/go-terms.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { ECMapping, GOMapping, UniProtMappingObj } from '../../data-models/uniprot-mapping.model';
import { AlternativeNumbering, SmartSequenceAnnotation, SmartSeqViewerComponent } from '@pdbe-lib/smart-seq-viewer';
import { convertOutliersToSmartSequenceAnnotation, createAuthAlternateNumbering, getNonObserved } from '../../helpers/procesing-for-smart-seq-viewer';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, firstValueFrom, take, timer } from 'rxjs';
import { EntryActions } from '../../store/entry.actions';
import type { QueryParam } from 'pdbe-molstar/lib/helpers';
import { initializeModelIdTracking } from '../../helpers/molstar-nmr-model-tracking';
import { drawSelectionInMolstar, Molstar370DefaultParams, zoomOutStructureInMolstar } from '../../helpers/molstar-helpers';
import { VisualisationInteractivityService } from '../../services/vis-interactivity-service';
import { ProteinSummaryStats } from '../../data-models/protein-summary-stats.model';
import { getUniProtsDataForMacromolecule } from '../../store/data-processing/macromolecule-processing';
import { ProcessedMacromolecule } from '../../store/data-processing/models/processed-entities.model';

// necessary to render the topology viewer
declare let PdbTopologyViewerPlugin: any;
@Component({
  selector: 'pdbc-macromolecules-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EntryDropdownComponent,
    MaterialModule,
    ReactiveFormsModule,
    InteractiveTablesComponent,
    NgxSkeletonLoaderModule,
    EntryPgProtvistaComponent,
    SmartSeqViewerComponent,
    MolstarComponent,
  ],
  templateUrl: './macromolecules-tab.component.html',
  styleUrl: './macromolecules-tab.component.scss',
})
export class MacromoleculesTabComponent implements OnInit {
  public readonly utilService = inject(UtilService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly visInteractivity = inject(VisualisationInteractivityService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scriptLoader = inject(ScriptLoaderService);

  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly processedMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));

  public readonly proteinsStatsObservable = this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds);
  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly goMapping = toSignal(this.globalStore.select(EntrySelectors.goMapping));
  public readonly ecMapping = toSignal(this.globalStore.select(EntrySelectors.ecMapping));
  public readonly residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));
  public readonly residueListingObservable = this.globalStore.select(EntrySelectors.residueListing);
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly uniprotMappings = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));
  public readonly polymerCoverage = toSignal(this.globalStore.select(EntrySelectors.polymerCoverage));

  public readonly gAS = inject(GoogleAnalyticsService);

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.processedMacromolecules() !== undefined);

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: QueryParam[] } = {};
  public dashboardStatLinks = dashboardStatLinks;

  public macromoleculeSequence = computed(() => this.sequenceDetails()?.fullSequence);
  public backgroundAnnotation = signal<SmartSequenceAnnotation | undefined>(undefined);

  private molstarReady = signal(false);
  public _molstarComponent?: MolstarComponent;
  @ViewChild('molstarComponent') set molstarComponent(ref: MolstarComponent | undefined) {
    if (ref) {
      this._molstarComponent = ref;
      this.visInteractivity.currentMolstarComponent = this._molstarComponent;
      this.molstarReady.set(true);
    }
  }

  public get isMobile(): boolean {
    return window.innerWidth <= 768; // typical mobile breakpoint
  }

  public molstarFirstRenderFinished = computed(() => {
    if (!this.molstarReady()) return false;
    return this._molstarComponent?.firstLoadFinished() || false;
  });
  private molstarFirstRenderFinished$ = toObservable(this.molstarFirstRenderFinished);

  public readonly configForMolstar = computed(() => {
    const summary = this.summaryData();
    const entryId = this.entryId();
    // const chainSelection = this.chainSelection();

    if (!summary || !entryId) return undefined;
    const preferredAssembly = summary.assemblies.length > 0 ? summary.assemblies.filter((eachAssembly) => eachAssembly.preferred) : [];
    const preferredAssemblyId = preferredAssembly.length > 0 ? preferredAssembly[0].assembly_id : '1';

    const configForMolstar = {
      ...Molstar370DefaultParams,
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
          // 'color': 'entity-id',
          color: 'uniform',
          colorParams: { value: 0xfefefe },
        },
      },
      loadMaps: true,
      mapSettings: { defaultView: 'selection-box' },
      // ...(chainSelection && { 'selection': chainSelection }),
    };

    return configForMolstar;
  });
  public molstarHeight = '100%';

  public selectionStats = signal<ProteinSummaryStats | undefined>(undefined);
  // public goMappings = computed(() => Object.keys(this.goMapping() ?? {}));

  public goMappingsForMacromolecule = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    const goMapping = this.goMapping();
    if (!macromolecule || !goMapping) return {};
    const entityId = (macromolecule as ProcessedMacromolecule).additionalData.molecule.entity_id;
    const filteredGoMapping = this.filterMappingByEntityId(goMapping, entityId) as GOMapping;
    return filteredGoMapping;
  });

  public ecMappingsForMacromolecule = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    const ecMapping = this.ecMapping();
    if (!macromolecule || !ecMapping) return {};
    const entityId = (macromolecule as ProcessedMacromolecule).additionalData.molecule.entity_id;
    const filteredEcMapping = this.filterMappingByEntityId(ecMapping, entityId) as ECMapping;
    return filteredEcMapping;
  });

  private filterMappingByEntityId(mapping: GOMapping | ECMapping, entityId: number): GOMapping | ECMapping {
    const filtered: GOMapping | ECMapping = {};

    for (const [id, item] of Object.entries(mapping)) {
      const relevantMappings = item.mappings.filter((eachMapping: UniProtMappingObj) => eachMapping.entity_id === entityId);

      if (relevantMappings.length > 0) {
        filtered[id] = {
          ...item,
          mappings: relevantMappings, // optional: keep only matching mappings
        };
      }
    }

    return filtered;
  }

  public isThereGoMappings = computed(() => Object.keys(this.goMappingsForMacromolecule() ?? {}));
  public goMappings = linkedSignal({
    source: this.goMappingsForMacromolecule,
    computation: () => {
      const mappedData = this.getMappedGOMapping.reduce((acc: any[], curr: any) => {
        if (acc[curr.category]) {
          acc[curr.category].push(curr);
        } else {
          acc[curr.category] = [curr];
        }
        return acc;
      }, {});
      return mappedData;
    },
  });

  public readonly isCategoryMoreThanOne = computed(() => {
    return (
      this.goMappings()?.['Biological_process']?.length > 1 ||
      this.goMappings()?.['Molecular_function']?.length > 1 ||
      this.goMappings()?.['Cellular_component']?.length > 1
    );
  });

  public ecMappings = computed(() => Object.keys(this.ecMappingsForMacromolecule() ?? {}));

  public uniprotMappedData = computed(() => {
    const currentMacromoleculeDatum = this.currentMacromoleculeDatum();
    const uniprotMappings = this.uniprotMappings();
    const polymerCoverage = this.polymerCoverage();

    if (!currentMacromoleculeDatum) return undefined;
    if (!uniprotMappings) return undefined;
    if (!polymerCoverage) return undefined;

    const mol = currentMacromoleculeDatum.additionalData.molecule;
    const mappedUnps = getUniProtsDataForMacromolecule(mol, uniprotMappings, polymerCoverage);
    return mappedUnps;
  });

  public uniprotsAllowed = computed(() => this.uniprotMappedData()?.uniprotAccsForMacromolecule);
  public uniprotsAllowedObs$ = toObservable(this.uniprotsAllowed);

  public bestResidues = computed(() => {
    const uniprotsAllowed = this.uniprotsAllowed();
    if (!uniprotsAllowed) return [];

    let isoformsMappingKeys = Object.keys(this.isoformsMapping() ?? {});
    isoformsMappingKeys = isoformsMappingKeys.filter((isoform) => {
      const hasAllowed = uniprotsAllowed.some((uniprot) => isoform.includes(uniprot));
      return hasAllowed;
    });

    const filteredIsoformsMapping: any[] = [];

    isoformsMappingKeys.forEach((uniprot: string) => {
      if (uniprot.indexOf('-') !== -1) {
        filteredIsoformsMapping.push({ ...this.isoformsMapping()?.[uniprot], uniprot });
      }
    });

    return filteredIsoformsMapping;
  });

  private readonly allThereVisuals = ['polypeptide(L)', 'polypeptide(D)'];
  private readonly onlyTwoVisuals = ['polyribonucleotide', 'polydeoxyribonucleotide'];
  private readonly onlyMolstarVisuals = ['carbohydrate polymer'];

  public hasProtvista = false;
  public currentSelectionEntityId = signal<string | undefined>(undefined);
  public currentSelectionChainId = signal<string | undefined>(undefined);

  public hasTopologyViewer = false;
  @ViewChild('topologyViewerContainer') topologyViewerContainer!: ElementRef;
  private topologyViewerInstance: any;

  public sequenceDetails = signal<
    | {
        title: string;
        fullSequence: string;
      }
    | undefined
  >(undefined);

  public selectionUniprotId = 'None';
  public selectionTypeText?: string;

  public readonly selectedMacromoleculeIdx = toSignal(this.compCommunication.macromoleculeSelection$.pipe(debounceTime(50), distinctUntilChanged()));

  public readonly macromoleculeTableRows = computed(() => {
    const rows = this.processedMacromolecules();
    if (rows === undefined) return [];
    return rows;
  });

  public currentMacromoleculeDatum = signal<ProcessedMacromolecule | undefined>(undefined);

  public uniqueOrganisms = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (macromolecule === undefined) return [];
    return [...new Set(macromolecule['organisms'].filter((organism) => organism !== null))];
  });

  public uniqueExpSystems = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (macromolecule === undefined) return [];
    const sources = macromolecule.additionalData.molecule.source;
    if (!sources) return [];
    const expSystems = sources.map((src) => src.expression_host_scientific_name);
    return [...new Set(expSystems.filter((expSystem) => expSystem !== null))];
  });

  public mappedResidues = computed(() => {
    const currentMacromoleculeDatum = this.currentMacromoleculeDatum();
    const currentChain = this.currentSelectionChainId();
    const mappedUnps = this.uniprotMappedData();

    if (!currentMacromoleculeDatum) return undefined;
    if (!mappedUnps) return undefined;
    if (!currentChain) return undefined;

    const mappingsForChains = mappedUnps.uniprotRangesByChainId;
    return mappingsForChains[currentChain];
  });

  public altSequences = signal<AlternativeNumbering[] | undefined>(undefined);
  public nonObserved = signal<number[] | undefined>(undefined);

  public seqViewerReady = computed(() => {
    const hasSequence = this.macromoleculeSequence() !== undefined;
    const hasAltSequences = this.altSequences() !== undefined;
    const hasNonObserved = this.nonObserved() !== undefined;
    const hasBgAnnotations = this.backgroundAnnotation() !== undefined;
    const hasCurrentSelectionEntityId = this.currentSelectionEntityId() !== undefined;
    const hasCurrentSelectionChainId = this.currentSelectionChainId() !== undefined;
    return hasSequence && hasAltSequences && hasNonObserved && hasBgAnnotations && hasCurrentSelectionEntityId && hasCurrentSelectionChainId;
  });

  public currentModelId$ = new BehaviorSubject<string>('1');
  private modelIdObserver?: MutationObserver;

  private topolViewerMutex = Promise.resolve();

  ngOnInit() {
    /* 1. Fetch tab data*/

    /* 2. Fetch topol viewer mutex inside Promise */
    this.topolViewerMutex = this.topolViewerMutex.then(async () => {
      await this.scriptLoader.loadScript('https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdb-topology-viewer-plugin-2.0.0.js');
    });

    this.compCommunication.macromoleculeSelection$.pipe(debounceTime(50), distinctUntilChanged()).subscribe((idx) => {
      if (idx === undefined || idx === null) return;
      const datum = this.macromoleculeTableRows()[idx];
      if (datum) {
        this.sequenceDetails.set(undefined);
        this.currentMacromoleculeDatum.set(datum);
        this.triggerMacromoleculeUpdateSideEffects(datum);
      }
    });
    // once molstar has rendered, initializes mutation observer for NMR model Id
    this.molstarFirstRenderFinished$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (finished) => {
      if (finished) {
        this.modelIdObserver = await initializeModelIdTracking(this.currentModelId$, this._molstarComponent?.getContainer());
      }
    });
    // every time NMR model Id updates, data for smart seq viewer is refreshed
    this.currentModelId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (newModelId) => {
      this.updateBackgroundAnnotation();
    });

    // when uniprot listing has arrived and been processed
    this.uniprotsAllowedObs$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        filter((unps) => unps !== undefined)
      )
      .subscribe((unpsList) => {
        // if protein is not chimeric (single uniprotAccession), set this as selectionUniprotId
        if (unpsList.length === 1) {
          this.selectionUniprotId = unpsList[0];
          // dispatch call to API endpoint and when finished triggers
          // constructor this.proteinsStatsObservable.pipe(...)
          this.globalStore.dispatch(
            EntryActions.getUniprotSummary({
              uniprotId: this.selectionUniprotId ?? '',
            })
          );
        }
      });
    // when uniprot summary API call has finished
    this.proteinsStatsObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((proteinSummary) => {
      if (proteinSummary) {
        const datum = proteinSummary[this.selectionUniprotId];
        if (datum) this.selectionStats.set(datum);
      }
    });

    this.residueListingObservable
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        filter((resList) => resList !== undefined)
      )
      .subscribe((residueListing) => {
        if (residueListing.length > 0) {
          const authNumbering = createAuthAlternateNumbering(residueListing);
          const nonObservedResidues = getNonObserved(residueListing);
          this.altSequences.set([authNumbering]);
          this.nonObserved.set(nonObservedResidues);
        } else {
          this.altSequences.set([]);
          this.nonObserved.set([]);
        }
      });
  }

  getStatValue(id: string): number | undefined {
    const stats = this.selectionStats();
    return stats ? stats[id as keyof ProteinSummaryStats] : undefined;
  }

  triggerMacromoleculeUpdateSideEffects(macromolecule: ProcessedMacromolecule) {
    // refreshes dropdown options on new macromolecule
    this.updateDropdownOptions(macromolecule);

    // updates shown sequence on new macromolecule
    const chainId = this.dropdownSelected?.split('Chain ')[1];
    const sequenceDetails = getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, chainId);
    this.sequenceDetails.set(sequenceDetails);

    this.altSequences.set(undefined);
    this.nonObserved.set(undefined);
    this.globalStore.dispatch(
      EntryActions.getResidueListing({
        chainId: chainId,
      })
    );

    // updates layout display details on new macromolecule
    this.updateVisualsDisplayed(macromolecule);

    // renders necessary visualisations according to display options and data
    this.renderVisualisations(macromolecule);

    // updates smart sequence viewer annotations
    this.updateBackgroundAnnotation();
  }

  updateDropdownOptions(macromolecule: ProcessedMacromolecule) {
    this.dropdownOptionsToMolstar = getMacromoleculeChainDropdownOptions(macromolecule);
    this.dropdownOptions = Object.keys(this.dropdownOptionsToMolstar).map((eachString, idx) => {
      return {
        name: eachString,
        url: `macro-${idx + 1}`,
        downloadable: false,
      };
    });
    this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[0];
    this.sequenceDetails.set(undefined);
    const sequenceDetails = getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, this.dropdownSelected);
    this.sequenceDetails.set(sequenceDetails);
    this.updateBackgroundAnnotation();
  }

  private updateBackgroundAnnotation() {
    this.backgroundAnnotation.set(undefined);

    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return;
    const sequence = macromolecule.additionalData.molecule.sequence;
    if (!sequence) return;

    const entityId = macromolecule.additionalData.molecule.entity_id;
    const chainId = this.dropdownSelected.split('Chain ')[1];
    const modelId = this.currentModelId$.value || '1';
    const annotation = convertOutliersToSmartSequenceAnnotation(sequence, entityId, chainId, modelId, this.residueWiseOutliers());
    this.backgroundAnnotation.set(annotation);
  }

  updateVisualsDisplayed(macromolecule: ProcessedMacromolecule) {
    this.hasTopologyViewer = false;
    this.selectionUniprotId = 'None';
    if (this.allThereVisuals.includes(macromolecule.additionalData.molecule.molecule_type)) {
      this.selectionTypeText = 'protein';
      this.hasTopologyViewer = true;
      this.hasProtvista = true;
    }

    if (this.onlyTwoVisuals.includes(macromolecule.additionalData.molecule.molecule_type)) {
      this.hasProtvista = true;
      this.hasTopologyViewer = false;
    }

    if (this.onlyMolstarVisuals.includes(macromolecule.additionalData.molecule.molecule_type)) {
      this.hasProtvista = false;
      this.hasTopologyViewer = false;
    }
  }

  get getMappedGOMapping() {
    return Object.entries(this.goMappingsForMacromolecule() ?? {}).reduce((acc: any[], [id, item]) => {
      acc.push({ ...item, id });
      return acc;
    }, []);
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.utilService.generateQueryURL(term, 'q_organism_name');
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;

    // all possible rendering functions are called for a dashboard
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return;

    this.sequenceDetails.set(undefined);
    const sequenceDetails = getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, this.dropdownSelected);
    this.sequenceDetails.set(sequenceDetails);

    await this.renderVisualisations(macromolecule);
    this.updateBackgroundAnnotation();
  }

  public openDialog(type: string) {
    const macromolecule = this.currentMacromoleculeDatum() as ProcessedMacromolecule;
    const component: ComponentType<any> = type === 'ec' ? EcNumbersComponent : GoTermsComponent;
    this.dialog.open(component, {
      disableClose: false,
      panelClass: 'entry-Dialog',
      data: { entityId: macromolecule.additionalData.molecule.entity_id },
    });
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  public copySequence(sequenceDetail?: { title: string; fullSequence: string }) {
    if (!sequenceDetail) return;
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
    this.gAS.logEntryPageEvents('ep_copy_seq', {
      tab: 'macromolecules',
    });
  }

  private async renderVisualisations(macromolecule: ProcessedMacromolecule) {
    await this.renderInMolstar(macromolecule);
    await this.initOrRefreshProtvista(macromolecule);
    await this.initOrRefreshTopologyViewer(macromolecule);
  }

  public selectionData?: QueryParam[];

  private async renderInMolstar(macromolecule: ProcessedMacromolecule) {
    // Wait until first render is finished
    await firstValueFrom(
      this.molstarFirstRenderFinished$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );

    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];

    // loop over each molstar selection and add color and focus
    this.selectionData = molstarSelection.map((eachSelection) => {
      return {
        ...eachSelection,
        color: macromolecule.molstarColorHex,
        focus: true,
      };
    });
    this.visInteractivity.currentSelectionData.set(this.selectionData);

    const durationMs = this._molstarComponent ? 1200 : 0;

    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    await zoomOutStructureInMolstar(instance, durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await drawSelectionInMolstar(instance, this.selectionData);
    });
  }

  private async initOrRefreshProtvista(macromolecule: ProcessedMacromolecule) {
    // stop if this dashboard does not have protvista (initially false and then set in onTableRowSelection according to tabName input)
    if (!this.hasProtvista) return;
    // const datum = this.currentMacromoleculeDatum();
    const entityId = macromolecule.additionalData.molecule.entity_id;
    const chainId = this.dropdownSelected.split('Chain ')[1];

    this.currentSelectionEntityId.set(`${entityId}`);
    this.currentSelectionChainId.set(chainId);
    this.visInteractivity.currentSelectionEntityId.set(`${entityId}`);
    this.visInteractivity.currentSelectionChainId.set(chainId);
  }

  private async initOrRefreshTopologyViewer(macromolecule: ProcessedMacromolecule) {
    this.topolViewerMutex = this.topolViewerMutex.then(() => {
      const topologyContainer = this.topologyViewerContainer.nativeElement;

      // stop if this dashboard does not have topology viewer (initially false and then set in onTableRowSelection according to tabName input)
      if (!this.hasTopologyViewer && topologyContainer) {
        topologyContainer.innerHTML = '';
        return;
      }

      // topology viewer is only currently shown for macromolecules
      // const datum = this.currentMacromoleculeDatum();
      const entityId = (macromolecule as ProcessedMacromolecule).additionalData.molecule.entity_id;
      const chainId = this.dropdownSelected?.split('Chain ')[1];

      // topology viewer load or reload in page is simple
      this.topologyViewerInstance = new PdbTopologyViewerPlugin();

      const options = {
        entryId: this.entryId(),
        entityId: `${entityId}`,
        chainId: chainId,
        subscribeEvents: true,
      };

      //Call render method to display the 2D view
      this.topologyViewerInstance.render(topologyContainer, options);
    });
  }

  getLengthType(macromolecule: ProcessedMacromolecule) {
    let lengthType = 'residue';
    if (macromolecule.additionalData.molecule.molecule_type.includes('polypeptide')) {
      lengthType = 'amino acid';
    } else if (macromolecule.additionalData.molecule.molecule_type.includes('nucleotide')) {
      lengthType = 'nucleotide';
    } else if (macromolecule.additionalData.molecule.molecule_type.includes('carbohydrate')) {
      lengthType = 'monosaccharide';
    }
    if (macromolecule.length > 1) {
      return `${lengthType}s`;
    }
    return lengthType;
  }

  public getRoundedWeight(): number | undefined {
    const weight = this.currentMacromoleculeDatum()?.additionalData.molecule.weight;
    return weight !== undefined ? +(weight / 1000).toFixed(3) : undefined;
  }
}
