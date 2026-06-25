/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  HostListener,
  inject,
  linkedSignal,
  OnInit,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { ContentNavigator, MaterialModule, UtilService } from '@pdbc/core';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { AgGridAngular } from 'ag-grid-angular';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BehaviorSubject, combineLatest, filter, forkJoin, mergeMap, of, take } from 'rxjs';
import { modelQualityTooltips, MQTContentNavigationLinks, OUTLIER_TYPE_LABELS, VALIDATION_LEGENDS_AND_COLORS } from '../../entry-constant';
import { whenSignalFirstTrue } from '../../helpers/misc';
import { EntryPageTabsCommonMolstarParams } from '../../helpers/molstar-helpers';
import { initializeModelIdTracking } from '../../helpers/molstar-nmr-model-tracking';
import { MVSHandler } from '../../helpers/mvs-handler';
import { SnapshotSpec } from '../../helpers/mvs-views/mvs-snapshot-types';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { EntryPageTutorialTourService } from '../../services/entry-page-tutorial-tour.service';
import { ValueLabel } from '../../store/data-processing/models/other-models';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { StrucQualityGradientsComponent } from '../shared/struc-quality-gradients/struc-quality-gradients.component';
import { ProcessedExperimentalDetails } from './data-models-and-definitions/processed-experimental-details.model';
import { ValidationDataProcessingFacade } from './validation-data.facade';
import { ValidationTablesFacade } from './validation-tables.facade';

/**
 * Examples that should be tested when looking at this component
 * 1xxx (X-Ray Jen)
 * 6gfn (X-Ray with Raw)
 * 1rio (X-Ray with DNA)
 * 5tok (X-Ray with Raw)
 * 4xgu (X-Ray with Raw)
 * 7v08 (EM with RNA)
 * 5irx (EM)
 * 3j7n (EM with multiple EMPIAR Raw)
 * 2kpn (NMR with BMRB id)
 * 2m68 (NMR with BMRB id)
 * 2knr (NMR with BMRB id)
 * 1g03 (NMR with BMRB id)
 * 1ur6 (hybrid)
 * 6yeg (hybrid)
 * 8sch (hybrid)
 * 8ong (hybrid)
 * 6gua (hybrid)
 * 7tx4 (hybrid)
 * 3irj (almost empty state)
 *
 * Documentation URLs:
 * https://www.ebi.ac.uk/pdbe/news/raw-experimental-data-3d-structures-highlighted-pdbe
 * https://www.ebi.ac.uk/seqdb/confluence/display/PDBE/Raw+Experimental+Data+widget
 *
 */

@Component({
  selector: 'pdbc-experiments-validation',
  standalone: true,
  imports: [
    CommonModule,
    AgGridAngular,
    MaterialModule,
    ReactiveFormsModule,
    HelpIconWithTooltipComponent,
    StrucQualityGradientsComponent,
    NgxSkeletonLoaderModule,
    MolstarComponent,
    ContentNavigator,
  ],
  templateUrl: './experiments-validation.component.html',
  styleUrl: './experiments-validation.component.scss',
})
export class ExperimentsValidationComponent implements OnInit, AfterViewInit {
  public readonly utilService = inject(UtilService);
  public readonly renderer = inject(Renderer2);
  public readonly elementRef = inject(ElementRef);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly dataFacade = inject(ValidationDataProcessingFacade);
  public readonly tableFacade = inject(ValidationTablesFacade);
  private readonly compCommunication = inject(ComponentCommunicationService);
  public readonly tutorialTourService = inject(EntryPageTutorialTourService);

  public readonly util = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly moleculeSources = toSignal(this.globalStore.select(EntrySelectors.moleculeSources));
  public readonly sourceOrganismsWithStrains = computed(() => {
    const molSrcs = this.moleculeSources();
    if (!molSrcs || molSrcs.length === 0) return [];

    const seen = new Set<string>();
    const namesWithStrains = [];

    for (const molSrc of molSrcs) {
      if (!molSrc.organism_scientific_name) continue;

      const key = `${molSrc.organism_scientific_name}|${molSrc.strain ?? ''}`;
      if (seen.has(key)) continue;

      seen.add(key);
      namesWithStrains.push({
        name: molSrc.organism_scientific_name,
        strain: molSrc.strain,
      });
    }

    return namesWithStrains;
  });

  public readonly pdbRedoData = toSignal(this.globalStore.select(EntrySelectors.pdbRedoQualityScores));
  public readonly residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));
  public readonly outliersByModelId = toSignal(this.globalStore.select(EntrySelectors.outliersByModelId));
  public readonly experimentalMethod = toSignal(this.globalStore.select(EntrySelectors.experimentalMethod));

  // used in template
  public currentData = signal<ProcessedExperimentalDetails | undefined>(undefined);
  public processedData = signal<ProcessedExperimentalDetails[] | undefined>(undefined);
  public isHybrid = signal(false);
  public noImg = false;

  public leftSideWidth = '400px';
  public processedWidth = signal(false);

  // tooltip constants
  public readonly modelQualityTooltips = modelQualityTooltips;

  public readonly isSticky = signal<boolean>(false);
  public readonly validationTypes = [
    {
      label: 'Issue count',
      value: 'issue_count',
    },
    {
      label: 'Specific issue',
      value: 'specific_issue',
    },
  ];

  public readonly legends = VALIDATION_LEGENDS_AND_COLORS;

  public readonly specificIssueKinds = signal<{ label: string; value: string }[]>([]);

  public selectedValidationType = signal<ValueLabel>(this.validationTypes[0]);
  public selectedSpecificIssueKindValue = signal<ValueLabel | undefined>(undefined);

  public selectedSpecificIssueKind = new FormControl('', { nonNullable: true });

  public molstarModelQualityRendered = signal(false);

  public isXray = linkedSignal({
    source: this.experimentalMethod,
    computation: (experimentalMethod) => {
      if (experimentalMethod?.toLowerCase() === 'hybrid') return true;
      return experimentalMethod?.toLowerCase()?.includes('x-ray diffraction');
    },
  });

  public experimentalInfoRowData = signal<ValueLabel[]>([]);
  public crystalInfoRowData = signal<ValueLabel[]>([]);
  public softwareRowData = signal<ValueLabel[]>([]);
  public dataQualityRowData = signal<ValueLabel[]>([]);
  public refinementRowData = signal<ValueLabel[]>([]);

  public hasOutliers = computed(() => {
    const currentModelId = this.modelId();
    const allOutliers = this.outliersByModelId();
    if (!currentModelId || !allOutliers) return false;
    return !!allOutliers[currentModelId];
  });

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
    return isSlow === false || forceLoad === true;
  });

  public toggleMolstar() {
    const forceLoad = this.compCommunication.forceLoad();
    this.compCommunication.forceLoad.set(!forceLoad);
  }
  public readonly configForMolstar = computed(() => EntryPageTabsCommonMolstarParams);

  public currentModelId$ = new BehaviorSubject<string>('1');
  public readonly modelId = toSignal(this.currentModelId$);
  protected readonly contentNavigatorLinks = MQTContentNavigationLinks;

  constructor() {
    effect(() => {
      const allOutliers = this.outliersByModelId();
      const specificIssueKinds = this.specificIssueKinds();

      if (allOutliers && specificIssueKinds.length === 0) {
        const allIssueKinds = Array.from(setUnion(Object.values(allOutliers).map((t) => t.uniqueOutlierTypes)))
          .map((kind) => ({ label: OUTLIER_TYPE_LABELS[kind] ?? kind, value: kind }))
          .sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : a.label.toLowerCase() === b.label.toLowerCase() ? 0 : -1)); // Thank you JavaScript for making sorting easy
        this.specificIssueKinds.set(allIssueKinds);
        this.selectedSpecificIssueKind.setValue(allIssueKinds[0].value);
      }
    });

    whenSignalFirstTrue(this.molstarFirstRenderFinished).subscribe(() => {
      // run after molstar rendered
      const mvsHandler = MVSHandler(this._molstarComponent);
      this.mvsSnapshotSpec$.subscribe((spec) => mvsHandler.loadMVSSnapshotSpec(spec));

      /* 2a. Once molstar has rendered, initializes mutation observer for NMR model Id */
      initializeModelIdTracking(this.currentModelId$, this._molstarComponent?.getContainer()); // do not await, this never resolves unless a multi-model structure is loaded (promise keeps ref to this.currentModelId$, is this is memory leak?)
      // TODO: (low priority) do not observe changes from Molstar (dirty), implement external model switcher instead
    });
  }

  ngOnInit() {
    /* 3. (TODO: Refactor) Data processing for tab */
    combineLatest([
      this.globalStore.select(EntrySelectors.modelQualityXray),
      this.globalStore.select(EntrySelectors.experimentalDetails),
      this.globalStore.select(EntrySelectors.macroMolecules),
    ])
      .pipe(
        filter(([xray, experimentalDetails, macroMolecules]) => {
          return xray !== undefined && experimentalDetails !== undefined && macroMolecules !== undefined;
        }),
        mergeMap(([xray, experimentalDetails, macroMolecules]) => {
          if (experimentalDetails && experimentalDetails.length > 1) {
            this.isHybrid.set(true);
          }
          const processedExpValData$ = this.dataFacade.processData().pipe(take(1));
          return forkJoin([processedExpValData$, of(xray), of(macroMolecules)]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([processedExpValData, xray, macroMolecules]) => {
        if (this.isXray()) {
          const validationInfo = [...(processedExpValData?.[0].validationInfo ?? [])];
          validationInfo.push({ metric: 'RMSD bond length [Å]', description: String(xray?.model_quality?.rmsd_bond_length ?? 0) });
          validationInfo.push({ metric: 'RMSD bond angle [°]', description: String(xray?.model_quality?.rmsd_bond_angle ?? 0) });
          validationInfo.push({ metric: 'Bulk solvent scaling B [Å²]', description: String(xray?.model_quality?.bulk_solvent_b ?? 0) });
          validationInfo.push({ metric: 'Bulk solvent scaling k [e-/Å³]', description: String(xray?.model_quality?.bulk_solvent_k ?? 0) });
          validationInfo.push({ metric: 'Fo-Fc correlation', description: String(xray?.model_quality?.fo_fc_correlation ?? 0) });
          processedExpValData[0].validationInfo = validationInfo;
        }
        this.processedData.set(processedExpValData);
        this.currentData.set(this.processedData()?.[0]);
        this.experimentalInfoRowData.set([
          {
            label: 'Source organism',
            value: macroMolecules?.[0]?.source?.[0]?.organism_scientific_name ?? 'Not available',
          },
          {
            label: 'Expression system',
            value: macroMolecules?.[0]?.source?.[0]?.expression_host_scientific_name ?? 'Not available',
          },
          ...this.getInfoRowData(xray?.['experimental_info']),
        ]);
        this.crystalInfoRowData.set(this.getInfoRowData(xray?.['crystal_info']));
        this.softwareRowData.set(this.getInfoRowData(xray?.['software']));
        this.dataQualityRowData.set(this.getDataQualityRowData(xray?.['data_quality']));
        this.refinementRowData.set(this.getInfoRowData(xray?.['refinement']));
      });
  }

  private readonly mvsSnapshotSpec = computed<SnapshotSpec | undefined>(() => {
    const entryId = this.entryId();
    const currentModelId = this.modelId();
    if (!entryId || !currentModelId) return;
    const validationData = this.residueWiseOutliers();
    const selectedValidationType = this.selectedValidationType().value;
    const selectedIssueKind = this.selectedSpecificIssueKindValue()?.value || this.selectedSpecificIssueKind.value;

    return {
      name: 'Validation',
      kind: 'pdbconnect_quality',
      params: {
        entry: entryId,
        assemblyId: undefined,
        modelId: parseInt(currentModelId),
        validationData: validationData,
        validationType: selectedValidationType === 'issue_count' ? { kind: 'issue_count' } : { kind: 'specific_issue', issue: selectedIssueKind },
        validationColors: this.legends.map((t) => t.color),
        niceIssueNames: OUTLIER_TYPE_LABELS,
        volumeStreaming: true,
      },
    };
  });
  private readonly mvsSnapshotSpec$ = toObservable(this.mvsSnapshotSpec);

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event) {
    this.updateLeftSideWidth();
  }

  private updateLeftSideWidth() {
    const leftSide = document.querySelector('.left-side');
    if (leftSide) {
      this.leftSideWidth = `${leftSide.getBoundingClientRect().width}px`;
    }
    this.processedWidth.set(true);
  }

  public selectValidationType(option: ValueLabel) {
    this.selectedValidationType.set(option);
  }

  public selectSpecificIssueKind(event: MatSelectChange) {
    // if (!this.selectedSpecificIssueKind()) return;
    this.selectedSpecificIssueKind.setValue(event.value);
    this.selectedSpecificIssueKindValue.set(event.value); // trigger effect
  }

  async ngAfterViewInit() {
    this.updateLeftSideWidth();
    const tabHeaderEl = document.querySelector('.mat-mdc-tab-header');
    if (!tabHeaderEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        this.isSticky.set(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(tabHeaderEl);

    // NEW: footer observer to stop sticky at bottom
    this.waitForFooter((footerEl) => {
      const stickyAside = this.elementRef.nativeElement.querySelector('#molstar-side-tour');
      if (!stickyAside) return;

      const footerObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            footerEl.style.zIndex = '9';
          } else {
            footerEl.style.zIndex = ''; // remove inline z-index
          }
        },
        {
          rootMargin: `0px 0px -${stickyAside.offsetHeight - 120}px 0px`,
          threshold: 0,
        }
      );

      footerObserver.observe(footerEl);
    });
  }

  private waitForFooter(callback: (footer: HTMLElement) => void) {
    const check = () => {
      const footer = document.querySelector('.vf-footer') as HTMLElement | null;
      if (footer) {
        callback(footer);
      } else {
        requestAnimationFrame(check);
      }
    };
    requestAnimationFrame(check);
  }

  /**
   * when a filter is clicked we changed the rendered data
   */
  switchExperimentTypeTab(data: ProcessedExperimentalDetails) {
    this.isXray.update((prev) => !prev);
    this.currentData.set(data);
  }

  private getInfoRowData(data: Record<string, string>): ValueLabel[] {
    return Object.entries(data ?? {}).reduce((acc: ValueLabel[], [metric, value]) => {
      acc.push({ label: metric.charAt(0).toUpperCase() + metric.slice(1).replace(/_/g, ' '), value: value ? value : 'Not available' });
      return acc;
    }, []);
  }

  private getDataQualityRowData(data: Record<string, string>): ValueLabel[] {
    const result = [];
    for (const key in data) {
      if (!key.endsWith('_shell')) {
        const shellKey = `${key}_shell`;
        result.push({
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
          value: data[key] ?? 'Not available',
          shell: data[shellKey] ?? 'Not available',
        });
      }
    }
    return result;
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.utilService.generateQueryURL(term, 'q_organism_name');
  }

  public generateExpSearchUrl(term: string): string {
    return this.utilService.generateQueryURL(term, 'organism_scientific_name');
  }

  public onExpandMolstar(expanded: boolean) {
    const stickyAside = this.elementRef.nativeElement.querySelector('#molstar-side-tour');
    if (expanded) {
      // force disable sticky when Mol* expands
      this.renderer.addClass(stickyAside, 'force-unsticky');
    } else {
      // restore sticky when collapsed
      this.renderer.removeClass(stickyAside, 'force-unsticky');
    }
  }
}

function setUnion<T>(sets: Set<T>[]): Set<T> {
  const out = new Set<T>();
  for (const set of sets) {
    for (const item of set) {
      out.add(item);
    }
  }
  return out;
}
