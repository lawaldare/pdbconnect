/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { CommonModule } from '@angular/common';
import { ValidationDataProcessingFacade } from './validation-data.facade';
import { ValidationTablesFacade } from './validation-tables.facade';
import { AgGridAngular } from 'ag-grid-angular';

import { ProcessedExperimentalDetails } from './data-models-and-definitions/processed-experimental-details.model';
import { modelQualityTooltips, OUTLIER_TYPE_LABELS } from '../../entry-constant';
import { MaterialModule, UtilService } from '@pdbc/core';
import { BehaviorSubject, combineLatest, forkJoin, mergeMap, of, take, timer } from 'rxjs';
import { StrucQualityGradientsComponent } from '../shared/struc-quality-gradients/struc-quality-gradients.component';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../store/entry.selectors';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DefaultParams, InitParams } from 'pdbe-molstar/lib/spec';
import { MolstarComponent, MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { Color } from 'molstar/lib/mol-util/color';
import { initializeModelIdTracking } from '../../helpers/molstar-nmr-model-tracking';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { cameraResetInMolstar, drawSelectionInMolstar } from '../../helpers/molstar-helpers';
import { OutlierDict, ValueLabel } from '../../data-classes/data-models-and-definitions/other-models';

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
  ],
  templateUrl: './experiments-validation.component.html',
  styleUrl: './experiments-validation.component.scss',
})
export class ExperimentsValidationComponent implements OnInit, AfterViewInit {
  public readonly renderer = inject(Renderer2);
  public readonly elementRef = inject(ElementRef);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly dataFacade = inject(ValidationDataProcessingFacade);
  public readonly tableFacade = inject(ValidationTablesFacade);

  public readonly dataProcessing = inject(MainDataProcessingFacade);

  public readonly util = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly compCommunication = inject(ComponentCommunicationService);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly sourceOrganisms = toSignal(this.globalStore.select(EntrySelectors.organismScientificNames));
  public readonly pdbRedoData = toSignal(this.globalStore.select(EntrySelectors.pdbRedoQualityScores));
  public readonly residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));
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

  @ViewChild('molstarContainer') molstarContainer!: ElementRef;

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

  public readonly legends = [
    {
      label: '0 outliers',
      color: '#D4D5D4',
    },
    {
      label: '1 outlier',
      color: '#E5E501',
    },
    {
      label: '2 outliers',
      color: '#DA6E03',
    },
    {
      label: '3 and more outliers',
      color: '#B2182B',
    },
  ];

  public readonly specificIssueKinds = signal<{ label: string; value: string }[]>([]);

  public selectedValidationType = signal<ValueLabel>(this.validationTypes[0]);
  public selectedSpecificIssueKindValue = signal<ValueLabel | undefined>(undefined);

  public selectedSpecificIssueKind = new FormControl('', { nonNullable: true });

  // Signal for dynamic model index (default to 1)
  public modelIdx = signal<string>('1');

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
    const currentModelIdx = this.modelIdx();
    const allOutliers = this.compCommunication.outliersByModelId();
    if (!currentModelIdx || !allOutliers) return false;

    const outliers = allOutliers[currentModelIdx];
    if (!outliers) return false;

    return true;
  });

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
    const entryId = this.entryId();
    // const chainSelection = this.chainSelection();

    if (!entryId) return undefined;

    const configForMolstar: InitParams = {
      ...DefaultParams,
      moleculeId: this.entryId(),
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
          colorParams: { value: Color(0xd4d5d4) },
        },
      },
      loadMaps: true,
      // ...(chainSelection && { 'selection': chainSelection }),
    };

    return configForMolstar;
  });

  public currentModelId$ = new BehaviorSubject<string>('1');
  private modelIdObserver?: MutationObserver;

  constructor() {
    // once molstar has rendered, initializes mutation observer for NMR model Id
    this.molstarFirstRenderFinished$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (finished) => {
      if (finished) {
        this.modelIdObserver = await initializeModelIdTracking(this.currentModelId$, this._molstarComponent?.getContainer());
      }
    });
    // every time NMR model Id updates, data for smart seq viewer is refreshed
    this.currentModelId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (newModelId) => {
      this.modelIdx.set(newModelId);
    });
    effect(() => {
      const currentModelIdx = this.modelIdx();
      const allOutliers = this.compCommunication.outliersByModelId();

      if (!currentModelIdx || !allOutliers) return;
      // if (!allOutliers) return;

      const outliers = allOutliers[currentModelIdx];
      if (!outliers) return;

      const uniqueOutlierTypes = outliers.uniqueOutlierTypes;

      if (this.specificIssueKinds().length === 0) {
        this.specificIssueKinds.set(
          [...uniqueOutlierTypes].map((type) => ({
            label: OUTLIER_TYPE_LABELS[type],
            value: type,
          }))
        );
        this.selectedSpecificIssueKind.setValue(this.specificIssueKinds()[0].value);
      }

      if (!this.molstarFirstRenderFinished()) return;
      this.renderInMolstar(outliers);
    });
  }
  private selectionData?: QueryParam[];

  private async renderInMolstar(outliers: OutlierDict) {
    const selectedValidationType = this.selectedValidationType();
    const selectedSpecificIssueKindValue = this.selectedSpecificIssueKindValue();

    this.selectionData = [];

    const colours: string[] = [];

    const outlierList: MolstarSelectionObj[] = [];
    if (selectedValidationType.value === 'issue_count') {
      colours.push(...this.legends.map((legend) => legend.color));
      outlierList.push(...[outliers.residuesWith1Outlier, outliers.residuesWith2Outliers, outliers.residuesWith3OrMoreOutliers]);
    } else {
      const specificIssue = selectedSpecificIssueKindValue?.value || this.selectedSpecificIssueKind.value;
      colours.push('');
      colours.push(this.legends.map((legend) => legend.color)[this.legends.length - 1]);
      outlierList.push(...[outliers.molstarSelectionsByOutlierType[specificIssue]]);
    }
    for (let i = 0; i < outlierList.length; i++) {
      const outlierResids = outlierList[i];
      this.selectionData.push(
        ...outlierResids.residues.map((outlier) => {
          return {
            entity_id: outlier.entityId,
            auth_asym_id: outlier.authChainId,
            auth_residue_number: parseInt(outlier.authBegin),
            auth_ins_code_id: outlier.authBeginIns || undefined,
            color: colours[i + 1],
            focus: false,
          };
        })
      );
    }

    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    await drawSelectionInMolstar(instance, this.selectionData);

    timer(500).subscribe(async () => {
      await cameraResetInMolstar(instance);
    });
  }

  ngOnInit() {
    combineLatest([
      this.globalStore.select(EntrySelectors.modelQualityXray),
      this.globalStore.select(EntrySelectors.experimentalDetails),
      this.globalStore.select(EntrySelectors.macroMolecules),
    ])
      .pipe(
        mergeMap(([xray, experimentalDetails, macroMolecules]) => {
          if (experimentalDetails.length > 1) {
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

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    const tabHeaderEl = document.querySelector('.mat-mdc-tab-header') as HTMLElement;
    let threshold = 394;
    if (tabHeaderEl) {
      // Check if we've scrolled past the top of the tabs header
      const offsetTop = tabHeaderEl.offsetTop;
      const marginBottom = parseFloat(getComputedStyle(tabHeaderEl).marginBottom) || 0;
      threshold = offsetTop + marginBottom;
    }

    this.isSticky.set(scrollPosition >= threshold);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
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
  }

  /**
   * when a filter is clicked we changed the rendered data
   */
  setData(data: ProcessedExperimentalDetails) {
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
}
