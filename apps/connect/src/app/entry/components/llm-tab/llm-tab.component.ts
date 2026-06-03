/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ComponentType } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, HostListener, inject, signal, ViewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AG_Grid_Theme_Class, MaterialModule, UtilService } from '@pdbc/core';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { AlternativeNumbering, SmartSequenceAnnotation, SmartSeqViewerComponent } from '@pdbe-lib/smart-seq-viewer';
import { AgGridAngular } from 'ag-grid-angular';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { LLMAnnotation } from '../../data-models/llm-model';
import { dashboardStatLinks, entryMacromoleculeTooltips, symmOperatorTooltip, TEXT_ANNOTATION_HIGHLIGHT_COLOR } from '../../entry-constant';
import { Dropdown, groupBy, whenSignalFirstTrue } from '../../helpers/misc';
import { EntryPageTabsCommonMolstarParams } from '../../helpers/molstar-helpers';
import { initializeModelIdTracking } from '../../helpers/molstar-nmr-model-tracking';
import { MVSHandler } from '../../helpers/mvs-handler';
import { SnapshotSpec } from '../../helpers/mvs-views/mvs-snapshot-types';
import {
  convertOutliersToSmartSequenceAnnotation,
  createAuthAlternateNumbering,
  getCircleAnnotationsForSeqViewer,
  getNonObserved,
  removeDuplicatesByKey,
} from '../../helpers/procesing-for-smart-seq-viewer';
import {
  CommonDropdownOptionData,
  getCleanMoleculeName,
  getCleanSelectionName,
  getMacromoleculeSequenceDetails,
  makeMacromoleculeChainDropdownOptions,
  makeSymmetryDropdownOptions,
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
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { UnpMappingListComponent } from '../shared/unp-mapping-list/unp-mapping-list.component';
import { colDefs, gridOptions } from './ag-grid';

@Component({
  selector: 'pdbc-llm-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EntryDropdownComponent,
    MaterialModule,
    ReactiveFormsModule,
    InteractiveTablesComponent,
    NgxSkeletonLoaderModule,
    AgGridAngular,
    SmartSeqViewerComponent,
    MolstarComponent,
    HelpIconWithTooltipComponent,
  ],
  templateUrl: './llm-tab.component.html',
  styleUrl: './llm-tab.component.scss',
})
export class LLMTabComponent {
  public readonly utilService = inject(UtilService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly dialog = inject(MatDialog);

  public readonly isSidebarDisplayed = signal<boolean>(true);

  public dropdown = new Dropdown<CommonDropdownOptionData>({
    autoOptions: () => makeMacromoleculeChainDropdownOptions(this.currentMacromoleculeDatum()),
  });

  public symmetryDropdown = new Dropdown<{ instanceId: string | undefined }>({
    autoOptions: () => makeSymmetryDropdownOptions(this.dropdown.selectedOption()?.data.symmOperators),
  });

  public currentSelectionEntityId = computed<string | undefined>(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return undefined;
    return String(macromolecule.additionalData.molecule.entity_id);
  });

  private readonly selectedChainAuthAsymId = computed<string | undefined>(() => this.dropdown.selectedOption()?.data.authAsymId);

  public readonly selectedChainLabelAsymId = computed<string | undefined>(() => {
    const authAsymId = this.selectedChainAuthAsymId();
    if (authAsymId === undefined) return undefined;
    const macromolecule = this.currentMacromoleculeDatum();
    return macromolecule?.additionalData.molecule.auth_asym_id_to_label_asym_id?.[authAsymId];
  });

  private readonly selectedInstanceId = computed(() => this.symmetryDropdown.selectedOption()?.data.instanceId);

  public inPrefAssembly = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return true;
    return macromolecule.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly);
  });

  public inPrefAssemblyForChain = computed<boolean>(() => this.dropdown.selectedOption()?.data.inPrefAssembly ?? true); // No chain selected -> true (no warning to display)

  public dashboardStatLinks = dashboardStatLinks;

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly processedMacromoleculesForLLM = toSignal(this.globalStore.select(EntrySelectors.processedMacromoleculesForLLM));

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly proteinsStats = toSignal(this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds));
  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));
  private readonly residueListing = toSignal(this.globalStore.select(EntrySelectors.residueListing));
  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly uniprotMappings = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));
  public readonly polymerCoverage = toSignal(this.globalStore.select(EntrySelectors.polymerCoverage));

  public readonly entryMacromoleculeTooltips = entryMacromoleculeTooltips;
  public readonly symmOperatorTooltip = symmOperatorTooltip;

  public selectionStats: { [key: string]: any } | undefined;

  public paginationPageSizeSelector = signal<number[]>([5, 10, 20]);

  public readonly tabDataLoaded = computed(() => this.processedMacromoleculesForLLM() !== undefined);
  public readonly macromoleculeTableRows = computed(() => this.processedMacromoleculesForLLM() ?? []);

  /** Index of the currently selected macromolecule row in the left panel */
  private readonly selectedMacromoleculeIdx = toSignal<number | undefined>(this.compCommunication.llmSelection$.pipe(debounceTime(50), distinctUntilChanged()));

  public readonly currentMacromoleculeDatum = computed<ProcessedMacromolecule | undefined>(() => {
    const idx = this.selectedMacromoleculeIdx();
    if (idx === undefined) return undefined;
    return this.macromoleculeTableRows()[idx];
  });

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

  public bestResidues = computed(() => {
    const uniprotsAllowed = this.uniprotsAllowed();
    if (!uniprotsAllowed) return [];

    const isoformsMapping = this.isoformsMapping();
    if (!isoformsMapping) return [];
    const isoformsMappingKeys = Object.keys(isoformsMapping).filter((isoform) => uniprotsAllowed.some((uniprot) => isoform.includes(uniprot)));
    const filteredIsoformsMapping = [];
    for (const uniprot of isoformsMappingKeys) {
      if (uniprot.includes('-')) {
        filteredIsoformsMapping.push({ ...isoformsMapping[uniprot], uniprot });
      }
    }
    return filteredIsoformsMapping;
  });

  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;

  /** List of all annotations (for all chains and all entities) */
  public readonly allAnnotations = toSignal(this.globalStore.select(EntrySelectors.llmAnnotations));

  /**  List of annotations from primary citation (for all chains and all entities) */
  private readonly primaryAnnotations = computed<LLMAnnotation[] | undefined>(() => this.allAnnotations()?.filter((a) => a.primaryCitation === 'Y'));

  /** Annotations from primary citation, grouped by chain (label_asym_id) */
  private readonly primaryAnnotationsByLabelAsymId = computed<{ [labelAsymId: string]: LLMAnnotation[] }>(() => {
    return groupBy(this.primaryAnnotations() ?? [], (annot) => annot.pdbChain);
  });

  /** Annotations from primary citation in the current selected chain */
  private readonly primaryAnnotationsInCurrentChain = computed<LLMAnnotation[]>(() => {
    const labelAsymId = this.selectedChainLabelAsymId();
    if (labelAsymId === undefined) return [];
    return this.primaryAnnotationsByLabelAsymId()[labelAsymId] ?? [];
  });

  /** Annotations from primary citation in the current selected chain, filtered by the currently selected residue (if any) */
  public readonly filteredAnnotations = computed<LLMAnnotation[]>(() => {
    const annotationsInChain = this.primaryAnnotationsInCurrentChain();
    const residueFilter = this.annotationResidueFilter();
    if (residueFilter === undefined) {
      return annotationsInChain;
    } else {
      const filtered = annotationsInChain.filter((a) => a.pdbResidue === residueFilter);
      return removeDuplicatesByKey(filtered, 'sentence');
    }
  });

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

  public isUniprotMappingsClosed = true;
  public isUniprotMappingsBig = computed(() => {
    const currentMacromoleculeDatum = this.currentMacromoleculeDatum();
    const currentChain = this.selectedChainAuthAsymId();
    const mappedUnps = this.uniprotMappedData();

    if (!currentMacromoleculeDatum) return false;
    if (!mappedUnps) return false;
    if (!currentChain) return false;

    const mappingsForChains = mappedUnps.labelUniProtMappings.filter((mapped) => mapped.chainIds.includes(currentChain));

    if (mappingsForChains.length > 1 || mappingsForChains[0].uniprotSegments.length > 2) {
      return true;
    }
    return false;
  });

  public uniprotProcessedMappings = computed(() => {
    const currentMacromoleculeDatum = this.currentMacromoleculeDatum();
    const currentChain = this.selectedChainAuthAsymId();
    const mappedUnps = this.uniprotMappedData();

    if (!currentMacromoleculeDatum) return undefined;
    if (!mappedUnps) return undefined;
    if (!currentChain) return undefined;

    const mappingsForChains = mappedUnps.labelUniProtMappings;
    return mappingsForChains.filter((mapped) => mapped.chainIds.includes(currentChain));
  });

  public macromoleculeSequence = computed(() => {
    return this.sequenceDetails()?.sequenceForViewer;
  });

  public indexWithMultipleResidues = computed(() => {
    return this.sequenceDetails()?.indexWithMultipleResidues;
  });

  public backgroundAnnotation = computed<SmartSequenceAnnotation | undefined>(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return undefined;
    const sequence = macromolecule.additionalData.molecule.sequence;
    if (!sequence) return undefined;

    const outliers = this.residueWiseOutliers();
    const entityId = macromolecule.additionalData.molecule.entity_id;
    const chainId = this.selectedChainAuthAsymId();
    if (chainId === undefined) return undefined;
    const modelId = this.currentModelId() ?? '1';
    return convertOutliersToSmartSequenceAnnotation(sequence, entityId, chainId, modelId, outliers);
  });

  public readonly llmAnnotationForSeq = computed<SmartSequenceAnnotation>(() => getCircleAnnotationsForSeqViewer(this.primaryAnnotationsInCurrentChain()));

  /** undefined means residueListing hasn't been retrieved yet, [] means it has been retrieved and is empty  */
  public readonly altSequences = computed<AlternativeNumbering[] | undefined>(() => {
    const residueListing = this.residueListing();
    if (!residueListing || residueListing.chain_id !== this.selectedChainAuthAsymId()) return undefined;
    if (residueListing.residues.length === 0) return [];
    const authNumbering = createAuthAlternateNumbering(residueListing.residues);
    return [authNumbering];
  });

  public readonly nonObserved = computed<number[] | undefined>(() => {
    const residueListing = this.residueListing();
    if (!residueListing || residueListing.chain_id !== this.selectedChainAuthAsymId()) return undefined;
    return getNonObserved(residueListing.residues);
  });

  public getCleanSelectionName = getCleanSelectionName;

  public seqViewerReady = computed(() => {
    const hasSequence = this.macromoleculeSequence() !== undefined;
    const hasAltSequences = this.altSequences() !== undefined;
    const hasNonObserved = this.nonObserved() !== undefined;
    const hasBgAnnotations = this.backgroundAnnotation() !== undefined;
    const hasLlmAnnotationForSeq = this.llmAnnotationForSeq() !== undefined;
    const hasCurrentSelectionEntityId = this.currentSelectionEntityId() !== undefined;
    const hasCurrentSelectionChainId = this.selectedChainAuthAsymId() !== undefined;
    return (
      hasSequence && hasAltSequences && hasNonObserved && hasBgAnnotations && hasLlmAnnotationForSeq && hasCurrentSelectionEntityId && hasCurrentSelectionChainId
    );
  });

  /** Number of unique annotated residues for the currently selected macromolecule (residues with the same number in different chains count as only one residue) */
  public nAnnotatedResiduesForCurrentMacromolecule = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return undefined;

    const annotatedResiduesSet = new Set<number>();
    const annotations = this.primaryAnnotationsByLabelAsymId();
    for (const labelAsymId of macromolecule.additionalData.molecule.in_struct_asyms) {
      for (const annot of annotations[labelAsymId] ?? []) {
        annotatedResiduesSet.add(annot.pdbResidue);
      }
    }
    return annotatedResiduesSet.size;
  });

  private readonly preferredAssemblyId = computed<string | undefined>(() => this.summary()?.assemblies.find((ass) => ass.preferred)?.assembly_id);
  /** Assembly ID of the assembly to be displayed (undefined = deposited model) */
  private readonly displayedAssemblyId = computed<string | undefined>(() => (this.inPrefAssemblyForChain() ? this.preferredAssemblyId() : undefined));

  public readonly configForMolstar = computed(() => EntryPageTabsCommonMolstarParams);

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

  private currentModelId$ = new BehaviorSubject<string>('1');
  private currentModelId = toSignal(this.currentModelId$);

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

  public readonly visInteractivity = inject(VisualisationInteractivityService);

  /** For filtering annotations in the table by pdbResidue (label_seq_id) */
  private annotationResidueFilter = signal<number | undefined>(undefined);

  @HostListener('document:llm-reset-list')
  public resetAnnotationFilter() {
    this.annotationResidueFilter.set(undefined);
  }

  @HostListener('document:llm-filter-list', ['$event'])
  public filterAnnotationList(event: Event) {
    const eventData = (event as any).detail.eventData;
    const residueNumber = eventData.residueNumber;
    this.annotationResidueFilter.set(residueNumber);
  }

  constructor() {
    whenSignalFirstTrue(this.molstarFirstRenderFinished).subscribe(() => {
      // run after molstar rendered
      const mvsHandler = MVSHandler(this._molstarComponent);
      this.mvsSnapshotSpec$.subscribe((spec) => mvsHandler.loadMVSSnapshotSpec(spec));

      // Once molstar has rendered, initializes mutation observer for NMR model Id
      initializeModelIdTracking(this.currentModelId$, this._molstarComponent?.getContainer()); // do not await, this never resolves unless a multi-model structure is loaded (promise keeps ref to this.currentModelId$, is this is memory leak?)
    });

    // Reset annotation filter for the table when entity/chain/symmetry operator changes
    effect(async () => {
      this.currentMacromoleculeDatum();
      this.dropdown.selectedOption();
      this.symmetryDropdown.selectedOption();

      this.resetAnnotationFilter();
    });

    // Get author numbering when chain changes
    effect(() => {
      const chainId = this.selectedChainAuthAsymId();
      if (chainId !== undefined) {
        this.fetchAuthorNumberingForChain(chainId);
      }
    });

    effect(() => this.visInteractivity.currentSelectionEntityId.set(this.currentSelectionEntityId()));
    effect(() => this.visInteractivity.currentSelectionChainId.set(this.selectedChainAuthAsymId()));
    effect(() => this.visInteractivity.selectedSymOpInstanceId.set(this.selectedInstanceId()));
  }

  public readonly tutorialTourService = inject(EntryPageTutorialTourService);

  public sequenceDetails = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return undefined;
    const chainId = this.dropdown.selectedOption()?.data.authAsymId;
    if (chainId === undefined) return undefined;
    return getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, chainId);
  });

  public selectionIdentifier = 'None';
  public selectionTypeText?: string;

  private fetchAuthorNumberingForChain(chainId: string) {
    this.globalStore.dispatch(EntryActions.getResidueListing({ chainId: chainId }));
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.utilService.generateQueryURL(term, 'q_organism_name');
  }

  public async onDropdownSelect(event: string) {
    this.dropdown.select(event);
  }

  public async onSymmetryDropdownSelect(event: string) {
    this.symmetryDropdown.select(event);
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  public copySequence(sequenceDetails?: { title: string; fullSequence: string }) {
    if (!sequenceDetails) return;
    const text = `${sequenceDetails.title}\r\n${sequenceDetails.fullSequence}`;
    this.utilService.copy(text);
  }

  private readonly mvsSnapshotSpec = computed<SnapshotSpec | undefined>(() => {
    const entryId = this.entryId();
    if (!entryId) return undefined;

    const macromolecule = this.currentMacromoleculeDatum();
    const llmAnnotations = this.primaryAnnotationsInCurrentChain();
    const assemblyId = this.displayedAssemblyId();
    const labelAsymId = this.selectedChainLabelAsymId();
    if (labelAsymId === undefined) return undefined;
    const instanceId = this.selectedInstanceId();

    return {
      name: 'Text annotations',
      kind: 'pdbconnect_text_annotation',
      params: {
        entry: entryId,
        assemblyId: assemblyId,
        labelAsymId: labelAsymId,
        annotations: llmAnnotations ?? [],
        chainColor: macromolecule?.molstarColorHex,
        annotationMarkerColor: TEXT_ANNOTATION_HIGHLIGHT_COLOR,
        instanceId: instanceId,
        focus: true,
        volumeStreaming: true,
      },
    };
  });
  private readonly mvsSnapshotSpec$ = toObservable(this.mvsSnapshotSpec);

  public openDialog(type: string) {
    const component: ComponentType<UnpMappingListComponent> = UnpMappingListComponent;
    const dialogData = this.uniprotMappedData();
    this.dialog.open(component, {
      disableClose: false,
      panelClass: 'entry-Dialog',
      data: dialogData,
    });
  }
}
