/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ComponentType } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, DestroyRef, effect, ElementRef, inject, linkedSignal, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService, MaterialModule, Mutex, ScriptLoaderService, UtilService } from '@pdbc/core';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { ProtvistaWrapperComponent } from '@pdbe-lib/pv-nightingale-components';
import { AlternativeNumbering, SmartSequenceAnnotation, SmartSeqViewerComponent } from '@pdbe-lib/smart-seq-viewer';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, firstValueFrom, interval, map, of, take, timeout } from 'rxjs';
import { ProteinSummaryStats } from '../../data-models/protein-summary-stats.model';
import { ECMapping, GOMapping, UniProtMappingObj } from '../../data-models/uniprot-mapping.model';
import { dashboardStatLinks, entryMacromoleculeTooltips, symmOperatorTooltip } from '../../entry-constant';
import { Dropdown, updateSymmetryDropdownOptions, whenSignalFirstTrue } from '../../helpers/misc';
import { EntryPageTabsCommonMolstarParams, QueryParamForHelpers } from '../../helpers/molstar-helpers';
import { MVSHandler } from '../../helpers/mvs-handler';
import { SnapshotSpec } from '../../helpers/mvs-views/mvs-snapshot-types';
import { convertOutliersToSmartSequenceAnnotation, createAuthAlternateNumbering, getNonObserved } from '../../helpers/procesing-for-smart-seq-viewer';
import {
  getCleanMoleculeName,
  getCleanSelectionName,
  getMacromoleculeChainDropdownOptions,
  getMacromoleculeSequenceDetails,
} from '../../helpers/processed-data-to-controls';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { EntryPageTutorialTourService } from '../../services/entry-page-tutorial-tour.service';
import { VisualisationInteractivityService } from '../../services/vis-interactivity-service';
import { getUniProtMappingsForMacromolecule } from '../../store/data-processing/macromolecule-processing';
import { ProcessedMacromolecule } from '../../store/data-processing/models/processed-entities.model';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntryActions } from '../../store/entry.actions';
import { EntrySelectors } from '../../store/entry.selectors';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { EcNumbersComponent } from '../shared/ec-numbers/ec-numbers.component';
import { PvDataProcessingFacade } from '../shared/entry-pv-nightingale/pv-entry-api.facade';
import { GoTermsComponent } from '../shared/go-terms/go-terms.component';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { UnpMappingListComponent } from '../shared/unp-mapping-list/unp-mapping-list.component';
import { MacromoleculesTabFacade } from './macromolecules-tab.facade';

// necessary to render the topology viewer
declare let PdbTopologyViewerPlugin: any;
declare let PdbRnaViewerPlugin: any;
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
    SmartSeqViewerComponent,
    MolstarComponent,
    HelpIconWithTooltipComponent,
    ProtvistaWrapperComponent,
  ],
  templateUrl: './macromolecules-tab.component.html',
  styleUrl: './macromolecules-tab.component.scss',
})
export class MacromoleculesTabComponent implements OnInit, AfterViewInit {
  public readonly utilService = inject(UtilService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly visInteractivity = inject(VisualisationInteractivityService);
  private readonly macromoleculesTabFacade = inject(MacromoleculesTabFacade);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scriptLoader = inject(ScriptLoaderService);

  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly processedMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));

  public readonly proteinsStats = toSignal(this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds));
  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly goMapping = toSignal(this.globalStore.select(EntrySelectors.goMapping));
  public readonly ecMapping = toSignal(this.globalStore.select(EntrySelectors.ecMapping));
  public readonly residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));
  public readonly residueWiseOutliersObservable = this.globalStore.select(EntrySelectors.residueWiseOutliers);
  public readonly residueListingObservable = this.globalStore.select(EntrySelectors.residueListing);
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly uniprotMappings = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));
  public readonly polymerCoverage = toSignal(this.globalStore.select(EntrySelectors.polymerCoverage));

  private protvistaDataFacade = inject(PvDataProcessingFacade);
  public macromolSequence = this.protvistaDataFacade.sequence;
  public loadingStatus = this.protvistaDataFacade.loadingStatus;
  public macromolIsNucleic = signal(false);

  public readonly protvistaTooltips = computed(() => this.protvistaDataFacade.tooltips());
  public readonly protvistaData = computed(() => {
    const domainsByResource = this.protvistaDataFacade.domainsByResource();
    const domainResourcesList = this.protvistaDataFacade.domainResourcesList();
    const mergedDomainsList = domainsByResource.flat();

    const biophysicalResourcesList = this.protvistaDataFacade.biophysicalResourcesList();
    const biophysicalByResource = this.protvistaDataFacade.biophysicalByResource();
    const mergedBiophysicalList = biophysicalByResource.flat();

    const isNucleic = this.macromolIsNucleic();

    return [
      {
        id: 'uniprot',
        type: 'TrackCanvas',
        name: 'UniProt',
        data: this.protvistaDataFacade.uniprotTracks(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['uniprot'],
        // colourIn3DControl: true,
      },
      {
        id: 'validation',
        type: 'TrackCanvas',
        name: 'Validation',
        data: this.protvistaDataFacade.validationTracks(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['validation'],
      },
      {
        id: 'secondary',
        type: 'TrackCanvas',
        name: 'Secondary structure',
        data: this.protvistaDataFacade.secStrTracks(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['secondary'],
      },
      {
        id: 'binding',
        type: 'TrackCanvas',
        name: 'Ligand binding sites',
        data: this.protvistaDataFacade.ligandBindingTracks(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['binding'],
      },
      {
        id: 'interfaces',
        type: 'TrackCanvas',
        name: 'Interaction interfaces',
        data: this.protvistaDataFacade.interfacesTracks(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['interfaces'],
      },
      {
        id: isNucleic ? 'familes' : 'domains',
        type: 'NestedTrackCanvas',
        name: isNucleic ? 'Families' : 'Domains',
        data: mergedDomainsList,
        childData: domainsByResource.map((data, i) => {
          const rawId = domainResourcesList[i];
          const sanitizedId = rawId
            .toLowerCase()
            .replace(/\s+/g, '') // remove all whitespace
            .replace(/[^a-z0-9]/g, ''); // remove anything not a–z or 0–9

          return {
            id: `${sanitizedId}_${i}`,
            name: domainResourcesList[i],
            data,
            status: this.protvistaDataFacade.loadingStatusPerTrack()[isNucleic ? 'rfam' : 'domains'],
            // colourIn3DControl: true,
          };
        }),
        status: this.protvistaDataFacade.loadingStatusPerTrack()[isNucleic ? 'rfam' : 'domains'],
      },
      {
        id: 'biophysical',
        type: 'NestedTrackCanvas',
        name: 'Biophysical parameters',
        data: mergedBiophysicalList,
        childData: biophysicalByResource.map((data, i) => {
          const rawId = biophysicalResourcesList[i];
          const sanitizedId = rawId
            .toLowerCase()
            .replace(/\s+/g, '_') // remove all whitespace
            .replace(/[^a-z0-9]/g, ''); // remove anything not a–z or 0–9

          return {
            id: `${sanitizedId}_${i}`,
            name: biophysicalResourcesList[i],
            data,
            status: this.protvistaDataFacade.loadingStatusPerTrack()['secondary'],
          };
        }),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['secondary'],
      },
      {
        id: 'conservation',
        type: 'TrackConservation',
        name: 'Conservation',
        data: this.protvistaDataFacade.originalConservationData(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['conservation'],
      },
      {
        id: 'variation',
        type: 'TrackVariation',
        name: 'Variation',
        data: this.protvistaDataFacade.originalVariationData(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['variation'],
      },
    ];
  });

  public readonly gAS = inject(GoogleAnalyticsService);

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.processedMacromolecules() !== undefined);

  public readonly entryMacromoleculeTooltips = entryMacromoleculeTooltips;
  public readonly symmOperatorTooltip = symmOperatorTooltip;

  public dropdown = new Dropdown<{ authAsymId: string; molstarSelection: QueryParamForHelpers[]; inPrefAssembly: boolean; symmOperators: string[] }>();
  public symmetryDropdown = new Dropdown<{ instanceId: string | undefined }>();

  private selectedInstanceId = computed(() => this.symmetryDropdown.selectedOption()?.data.instanceId);

  public inPrefAssembly = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return true; // No macromolecule selected -> true (no warning to display)
    return macromolecule.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly);
  });

  public inPrefAssemblyForChain = computed<boolean>(() => this.dropdown.selectedOption()?.data.inPrefAssembly ?? true); // No chain selected -> true (no warning to display)

  public currentSelectionChainId = computed<string | undefined>(() => this.dropdown.selectedOption()?.data.authAsymId);
  public currentSelectionEntityId = computed<string | undefined>(() => String(this.currentMacromoleculeDatum()?.additionalData.molecule.entity_id));

  public dashboardStatLinks = dashboardStatLinks;

  public macromoleculeSequence = computed(() => this.sequenceDetails()?.fullSequence);
  public backgroundAnnotation = signal<SmartSequenceAnnotation | undefined>(undefined);

  public getCleanSelectionName = getCleanSelectionName;

  private molstarReady = signal(false);
  public _molstarComponent?: MolstarComponent;
  @ViewChild('molstarComponent') set molstarComponent(ref: MolstarComponent | undefined) {
    if (ref) {
      this._molstarComponent = ref;
      this.visInteractivity.currentMolstarComponent = this._molstarComponent;
      this.molstarReady.set(true);
    }
  }
  private molstarFirstRenderFinished = computed(() => this.molstarReady() && this._molstarComponent!.firstLoadFinished());

  public get isMobile(): boolean {
    return window.innerWidth <= 768; // typical mobile breakpoint
  }

  public readonly slowNetwork = toSignal(
    this.compCommunication.slowNetwork$,
    { initialValue: undefined } // assume "unknown/loading" until we know
  );

  public readonly checkedWebGl = computed(() => this.compCommunication.checkedWebGlSupport);
  public readonly isWebGlEnabled = computed(() => this.compCommunication.isWebGlEnabled);

  public getCleanMoleculeName = getCleanMoleculeName;

  public readonly fastNetworkOrForceLoad = computed(() => {
    const isSlow = this.slowNetwork();
    const forceLoad = this.compCommunication.forceLoad();
    return isSlow === false || forceLoad === true;
  });

  public toggleMolstar() {
    const forceLoad = this.compCommunication.forceLoad();
    this.compCommunication.forceLoad.set(!forceLoad);
  }

  private readonly preferredAssemblyId = computed(() => this.summaryData()?.assemblies.find((ass) => ass.preferred)?.assembly_id);

  public readonly configForMolstar = computed(() => EntryPageTabsCommonMolstarParams);

  public molstarHeight = '100%';

  public readonly selectionStats = computed(() => {
    const stats = this.proteinsStats();
    const uniprotId = this.selectionUniprotId();

    if (!stats || !uniprotId || uniprotId === 'None') return undefined;

    return stats[uniprotId];
  });

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
    const mappedUnpsRows = getUniProtMappingsForMacromolecule(mol, uniprotMappings, polymerCoverage);

    return mappedUnpsRows;
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
  private readonly onlyMolstarVisuals = ['carbohydrate polymer', 'peptide nucleic acid'];

  public hasProtvista = false;

  public hasTopologyViewer = false;
  @ViewChild('topologyViewerContainer', { static: false }) topologyViewerContainer!: ElementRef;
  private topologyViewerInstance: any;

  public hasRNAViewer = false;
  @ViewChild('rnaViewerContainer', { static: false }) rnaViewerContainer!: ElementRef;
  private rnaViewerInstance: any;

  public sequenceDetails = signal<{ title: string; fullSequence: string } | undefined>(undefined);

  public readonly selectionUniprotId = computed(() => {
    const allowed = this.uniprotsAllowed();
    if (!allowed || allowed.length !== 1) return 'None';
    return allowed[0];
  });

  public selectionTypeText?: string;

  public readonly selectedMacromoleculeIdx = toSignal(this.compCommunication.macromoleculeSelection$.pipe(debounceTime(50), distinctUntilChanged()));

  public readonly macromoleculeTableRows = computed(() => {
    const rows = this.processedMacromolecules();
    if (rows === undefined) return [];
    return rows;
  });

  public currentMacromoleculeDatum = signal<ProcessedMacromolecule | undefined>(undefined);

  public collapsedChains = true;

  public uniqueOrganismsWithStrains = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (macromolecule === undefined) return [];

    const seen = new Set<string>();
    return (macromolecule.additionalData.molecule['source'] ?? [])
      .filter((s) => s.organism_scientific_name)
      .filter((s) => {
        const key = `${s.organism_scientific_name}|${s.strain ?? ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((s) => ({
        name: s.organism_scientific_name,
        strain: s.strain,
      }));
  });

  public uniqueExpSystems = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (macromolecule === undefined) return [];
    const sources = macromolecule.additionalData.molecule.source;
    if (!sources) return [];
    const expSystems = sources.map((src) => src.expression_host_scientific_name);
    return [...new Set(expSystems.filter((expSystem) => expSystem !== null))];
  });

  public isUniprotMappingsClosed = true;
  public isUniprotMappingsBig = computed(() => {
    const currentMacromoleculeDatum = this.currentMacromoleculeDatum();
    const currentChain = this.currentSelectionChainId();
    const mappedUnps = this.uniprotMappedData();

    if (!currentMacromoleculeDatum) return false;
    if (!mappedUnps) return false;
    if (!currentChain) return false;

    const mappingsForChains = mappedUnps.labelUniProtMappings.filter((mapped) => mapped.chainIds.indexOf(currentChain) > -1);

    if (mappingsForChains.length > 1 || mappingsForChains[0].uniprotSegments.length > 2) {
      return true;
    }
    return false;
  });

  public uniprotProcessedMappings = computed(() => {
    const currentMacromoleculeDatum = this.currentMacromoleculeDatum();
    const currentChain = this.currentSelectionChainId();
    const mappedUnps = this.uniprotMappedData();

    if (!currentMacromoleculeDatum) return undefined;
    if (!mappedUnps) return undefined;
    if (!currentChain) return undefined;

    const mappingsForChains = mappedUnps.labelUniProtMappings;
    return mappingsForChains.filter((mapped) => mapped.chainIds.indexOf(currentChain) > -1);
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

  private topolViewerMutex = Mutex('topolViewerMutex');
  private rnaViewerMutex = Mutex('rnaViewerMutex');

  public readonly tutorialTourService = inject(EntryPageTutorialTourService);
  public hasLoadedMacromolecules = computed(() => this.processedMacromolecules() !== undefined);
  public hasMacromolecules = computed(() => {
    const rows = this.processedMacromolecules();
    if (rows === undefined) return false;
    return rows.length > 0;
  });

  private readonly mvsSnapshotSpec$ = new BehaviorSubject<SnapshotSpec | undefined>(undefined);

  constructor() {
    whenSignalFirstTrue(this.molstarFirstRenderFinished).subscribe(() => {
      // run after molstar rendered
      const mvsHandler = MVSHandler(this._molstarComponent);
      this.mvsSnapshotSpec$.subscribe((spec) => mvsHandler.loadMVSSnapshotSpec(spec));
    });

    effect(() => this.visInteractivity.currentSelectionEntityId.set(this.currentSelectionEntityId()));
    effect(() => this.visInteractivity.currentSelectionChainId.set(this.currentSelectionChainId()));
    effect(() => this.visInteractivity.selectedSymOpInstanceId.set(this.selectedInstanceId()));
  }

  ngAfterViewInit(): void {
    this.compCommunication.macromoleculeSelection$.pipe(debounceTime(50), distinctUntilChanged()).subscribe(async (idx) => {
      if (idx === undefined || idx === null) return;
      const datum = this.macromoleculeTableRows()[idx];
      if (datum) {
        this.sequenceDetails.set(undefined);
        this.currentMacromoleculeDatum.set(datum);
        await this.triggerMacromoleculeUpdateSideEffects(datum);
      }
    });
  }

  ngOnInit() {
    /* 1. Fetch tab data*/

    /* 2. Fetch topol viewer mutex inside Promise */
    this.topolViewerMutex.run(async () => {
      // await this.scriptLoader.loadScript('https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdb-topology-viewer-plugin-2.0.0.js');
      await this.scriptLoader.loadScript('./assets/pdb-topology-viewer-component-3.0.1.js');
    });

    this.rnaViewerMutex.run(async () => {
      await this.scriptLoader.loadScript('./assets/pdb-rna-viewer-plugin-0.3.1.js');
    });

    // every time NMR model Id updates, data for smart seq viewer is refreshed
    this.currentModelId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (newModelId) => {
      await this.updateBackgroundAnnotation();
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
          // dispatch call to API endpoint and when finished triggers
          // constructor this.proteinsStatsObservable.pipe(...)
          this.globalStore.dispatch(
            EntryActions.getUniprotSummary({
              uniprotId: unpsList[0] ?? '',
            })
          );
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

  async triggerMacromoleculeUpdateSideEffects(macromolecule: ProcessedMacromolecule) {
    // refreshes chain dropdown options on new macromolecule
    await this.updateDropdownOptions(macromolecule);
    await this.updateSymmetryDropdownOptions();

    // updates shown sequence on new macromolecule
    const chainId = this.currentSelectionChainId();
    if (chainId === undefined) return;
    await this.updateSequenceDetailsFromChainId(macromolecule, chainId);

    this.altSequences.set(undefined);
    this.nonObserved.set(undefined);
    this.globalStore.dispatch(EntryActions.getResidueListing({ chainId: chainId }));

    // updates layout display details on new macromolecule
    this.updateVisualsDisplayed(macromolecule);

    // renders necessary visualisations according to display options and data
    this.renderVisualisations(macromolecule);

    // updates smart sequence viewer annotations
    await this.updateBackgroundAnnotation();
  }

  async updateDropdownOptions(macromolecule: ProcessedMacromolecule) {
    const options = getMacromoleculeChainDropdownOptions(macromolecule);
    type DropdownOption = MacromoleculesTabComponent['dropdown']['options'][number];
    this.dropdown.updateOptions(
      Object.keys(options).map((eachString, idx): DropdownOption => {
        const authAsymId = macromolecule.additionalData.selections[idx][0].auth_asym_id;
        if (authAsymId === undefined) throw new Error('authAsymId is undefined');
        return {
          name: eachString,
          url: `macro-${idx + 1}`,
          downloadable: false,
          data: {
            authAsymId,
            molstarSelection: options[eachString],
            inPrefAssembly: macromolecule.additionalData.selectionsInPrefAssembly[idx],
            symmOperators: macromolecule.chainSymmOperators[authAsymId] ?? [],
          },
        };
      })
    );
  }

  async updateSymmetryDropdownOptions() {
    updateSymmetryDropdownOptions(this.symmetryDropdown, this.dropdown.selectedOption()?.data.symmOperators, 'macro-0-symop-');
  }

  private async updateSequenceDetailsFromChainId(macromolecule: ProcessedMacromolecule, chainId: string) {
    this.sequenceDetails.set(undefined);
    const sequenceDetails = getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, chainId);
    this.sequenceDetails.set(sequenceDetails);
    await this.updateBackgroundAnnotation();
  }

  private async updateBackgroundAnnotation() {
    this.backgroundAnnotation.set(undefined);

    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return;
    const sequence = macromolecule.additionalData.molecule.sequence;
    if (!sequence) return;

    // wait max 10s for residueWiseOutliers to populate
    let outliers = this.residueWiseOutliers();
    if (outliers === undefined) {
      outliers = await firstValueFrom(
        interval(200).pipe(
          map(() => this.residueWiseOutliers()),
          filter((o) => o !== undefined), // stop when defined
          take(1), // only take the first defined
          timeout({ first: 10000, with: () => of([]) }) // fallback if still undefined
        )
      );
    }

    const entityId = macromolecule.additionalData.molecule.entity_id;
    const chainId = this.currentSelectionChainId();
    if (chainId === undefined) return;
    const modelId = this.currentModelId$.value || '1';
    const annotation = convertOutliersToSmartSequenceAnnotation(sequence, entityId, chainId, modelId, outliers);
    this.backgroundAnnotation.set(annotation);
  }

  updateVisualsDisplayed(macromolecule: ProcessedMacromolecule) {
    this.hasTopologyViewer = false;
    if (this.allThereVisuals.includes(macromolecule.additionalData.molecule.molecule_type)) {
      this.selectionTypeText = 'protein';
      this.hasTopologyViewer = true;
      this.hasProtvista = true;
      this.hasRNAViewer = false;
      this.visInteractivity.hasTopoViewer.set(true);
      this.visInteractivity.hasRNATopoViewer.set(false);
    }

    if (this.onlyTwoVisuals.includes(macromolecule.additionalData.molecule.molecule_type)) {
      const isRNA = macromolecule.additionalData.molecule.molecule_type === 'polyribonucleotide';
      this.hasProtvista = true;
      this.hasTopologyViewer = false;
      this.hasRNAViewer = isRNA;
      this.visInteractivity.hasTopoViewer.set(false);
      this.visInteractivity.hasRNATopoViewer.set(isRNA);
    }

    if (this.onlyMolstarVisuals.includes(macromolecule.additionalData.molecule.molecule_type)) {
      this.hasProtvista = false;
      this.hasTopologyViewer = false;
      this.hasRNAViewer = false;
      this.visInteractivity.hasTopoViewer.set(false);
      this.visInteractivity.hasRNATopoViewer.set(false);
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
    this.dropdown.select(event);
    await this.updateSymmetryDropdownOptions();

    // all possible rendering functions are called for a dashboard
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return;

    const chainId = this.currentSelectionChainId();
    if (chainId === undefined) return;
    await this.updateSequenceDetailsFromChainId(macromolecule, chainId);

    await this.renderVisualisations(macromolecule);
    await this.updateBackgroundAnnotation();
  }

  public async onSymmetryDropdownSelect(event: string) {
    this.symmetryDropdown.select(event);

    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return;
    await this.renderVisualisations(macromolecule);
  }

  public openDialog(type: string) {
    const macromolecule = this.currentMacromoleculeDatum() as ProcessedMacromolecule;
    let component: ComponentType<any>;
    let dialogData: any = {};
    switch (type) {
      case 'ec':
        component = EcNumbersComponent;
        dialogData = { entityId: macromolecule.additionalData.molecule.entity_id };
        break;
      case 'go':
        component = GoTermsComponent;
        dialogData = { entityId: macromolecule.additionalData.molecule.entity_id };
        break;
      case 'uniprot':
        component = UnpMappingListComponent;
        dialogData = this.uniprotMappedData()!;
        break;
      default:
        throw new Error(`Unknown dialog type: ${type}`);
    }
    this.dialog.open(component, {
      disableClose: false,
      panelClass: 'entry-Dialog',
      data: dialogData,
    });
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  public copySequence(sequenceDetail?: { title: string; fullSequence: string }) {
    if (!sequenceDetail) return;
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
    this.gAS.logPageEvents('ep_copy_seq', {
      tab: 'macromolecules',
    });
  }

  private async renderVisualisations(macromolecule: ProcessedMacromolecule) {
    this.renderInMolstar(macromolecule);
    await this.initOrRefreshProtvista(macromolecule);
    setTimeout(async () => {
      await this.initOrRefreshTopologyViewer(macromolecule);
      await this.initOrRNATopologyViewer(macromolecule);
    }, 500);
  }

  public selectionData?: QueryParamForHelpers[];

  private renderInMolstar(macromolecule: ProcessedMacromolecule) {
    this.mvsSnapshotSpec$.next(this.getMvsSnapshotSpec(macromolecule));
  }

  private getMvsSnapshotSpec(macromolecule: ProcessedMacromolecule): SnapshotSpec | undefined {
    const entryId = this.entryId();
    if (!entryId) return undefined;

    const entityId = `${macromolecule.additionalData.molecule.entity_id}`;
    const dropdownSelected = this.dropdown.selectedOption();
    if (!dropdownSelected) return undefined;
    const { molstarSelection, inPrefAssembly } = dropdownSelected.data;
    const labelAsymId = molstarSelection[0].label_asym_id;
    const authAsymId = molstarSelection[0].auth_asym_id;

    const assemblyId = inPrefAssembly ? this.preferredAssemblyId() : undefined;
    const instanceId = this.selectedInstanceId();

    return {
      name: `Macromolecule ${entityId}`,
      kind: 'pdbconnect_macromolecule',
      params: {
        entry: entryId,
        assemblyId,
        entityId,
        labelAsymId,
        authAsymId,
        instanceId,
        focus: true,
        volumeStreaming: true,
        color: macromolecule.molstarColorHex,
      },
    };
  }

  private async initOrRefreshProtvista(macromolecule: ProcessedMacromolecule) {
    // stop if this dashboard does not have protvista (initially false and then set in onTableRowSelection according to tabName input)
    if (!this.hasProtvista) return;
    const entityId = macromolecule.additionalData.molecule.entity_id;
    const chainId = this.currentSelectionChainId();

    const isNucleic = macromolecule?.additionalData?.molecule?.molecule_type.includes('nucleotide');
    this.macromolIsNucleic.set(isNucleic);
    this.protvistaDataFacade.processNewData(`${entityId}`, isNucleic);
  }

  private async initOrRefreshTopologyViewer(macromolecule: ProcessedMacromolecule) {
    this.topolViewerMutex.run(async () => {
      const topologyContainer = this.topologyViewerContainer?.nativeElement;

      // stop if this dashboard does not have topology viewer (initially false and then set in onTableRowSelection according to tabName input)
      if (!this.hasTopologyViewer && topologyContainer) {
        topologyContainer.innerHTML = '';
        return;
      }

      // topology viewer is only currently shown for macromolecules
      // const datum = this.currentMacromoleculeDatum();
      const entityId = (macromolecule as ProcessedMacromolecule).additionalData.molecule.entity_id;
      const chainId = this.currentSelectionChainId();

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

  private async initOrRNATopologyViewer(macromolecule: ProcessedMacromolecule) {
    this.rnaViewerMutex.run(async () => {
      const rnaContainer = this.rnaViewerContainer?.nativeElement;

      // stop if this dashboard does not have topology viewer (initially false and then set in onTableRowSelection according to tabName input)
      if (!this.hasRNAViewer && rnaContainer) {
        rnaContainer.innerHTML = '';
        return;
      }

      // topology viewer is only currently shown for macromolecules
      // const datum = this.currentMacromoleculeDatum();
      const entityId = (macromolecule as ProcessedMacromolecule).additionalData.molecule.entity_id;
      const chainId = this.currentSelectionChainId();

      // topology viewer load or reload in page is simple
      this.rnaViewerInstance = new PdbRnaViewerPlugin();

      const options = {
        pdbId: this.entryId(),
        entityId: `${entityId}`,
        chainId: chainId,
        subscribeEvents: true,
      };

      //Call render method to display the 2D view
      this.rnaViewerInstance.render(rnaContainer, options);
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

  openedAddCustomTrack() {
    this.gAS.logPageEvents('ep_map_data', {
      tab: this.compCommunication.currentTabName() ?? '',
    });
  }
}

// TODO: Fix wrong inPrefAssembly for macromolecule 2 in 7p19 (same on other tabs)
