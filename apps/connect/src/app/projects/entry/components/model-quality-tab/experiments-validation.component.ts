/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component, computed, DestroyRef, effect, ElementRef, HostListener, inject, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationDataProcessingFacade } from './validation-data.facade';
import { ValidationTablesFacade } from './validation-tables.facade';
import { AgGridAngular } from 'ag-grid-angular';

import { ProcessedExperimentalDetails } from './data-models-and-definitions/processed-experimental-details.model';
import {
  expInfoTooltip,
  expRawDataTooltip,
  OUTLIER_TYPE_LABELS,
  pdbRedoTooltip,
  sampleInfoTooltip,
  timelineTooltip,
  validationInfoTooltip,
} from '../../entry-constant';
import { MaterialModule, UtilService } from '@pdbc/core';
import { filter, mergeMap } from 'rxjs';
import { StrucQualityGradientsComponent } from '../shared/struc-quality-gradients/struc-quality-gradients.component';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../store/entry.selectors';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { EntryActions } from '../../store/entry.actions';
import { MolstarOverviewForTopPage } from '../../helpers/molstar/molstar-overview-for-top-page';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { LigandsRowData, MacromoleculesRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { MolstarStateService } from '../../services/molstar-state.service';
import { ActionQueueService } from '../../services/action-queue.service';

interface ValueLabel {
  value: string;
  label: string;
}

declare let PDBeMolstarPlugin: any;

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
  imports: [CommonModule, AgGridAngular, MaterialModule, ReactiveFormsModule, HelpIconWithTooltipComponent, StrucQualityGradientsComponent],
  templateUrl: './experiments-validation.component.html',
  styleUrl: './experiments-validation.component.scss',
})
export class ExperimentsValidationComponent implements OnInit, AfterViewInit {
  public readonly renderer = inject(Renderer2);
  public readonly elementRef = inject(ElementRef);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly dataFacade = inject(ValidationDataProcessingFacade);
  public readonly tableFacade = inject(ValidationTablesFacade);
  private readonly actionQueue = inject(ActionQueueService);

  public readonly molstarState = inject(MolstarStateService);
  public readonly util = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly compCommunication = inject(ComponentCommunicationService);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly sourceOrganisms = toSignal(this.globalStore.select(EntrySelectors.organismScientificNames));
  public readonly pdbRedoData = toSignal(this.globalStore.select(EntrySelectors.pdbRedoQualityScores));
  public residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));

  // used in template
  public currentData = signal<ProcessedExperimentalDetails | undefined>(undefined);
  public processedData = signal<ProcessedExperimentalDetails[] | undefined>(undefined);
  public isHybrid = signal(false);
  public noImg = false;

  public leftSideWidth = '400px';
  public processedWidth = signal(false);

  // tooltip constants
  public valInfoTooltip = validationInfoTooltip;
  public sampleInfoTooltip = sampleInfoTooltip;
  public expInfoTooltip = expInfoTooltip;
  public expRawDataTooltip = expRawDataTooltip;
  public timelineTooltip = timelineTooltip;
  public pdbRedoTooltip = pdbRedoTooltip;

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
      color: '#A9ABAA',
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

  public molstarFirstRenderFinished = computed(() => this.molstarState.molstarFirstRenderFinished());
  public molstarModelQualityRendered = signal(false);

  constructor() {
    effect(() => {
      const currentModelIdx = this.molstarState.currentModelId();
      const allOutliers = this.molstarState.outliersByModelId();
      const selectedValidationType = this.selectedValidationType();
      if (!currentModelIdx || !allOutliers) return;

      const outliers = allOutliers[currentModelIdx];
      const uniqueOutlierTypes = outliers.uniqueOutlierTypes;

      if (this.modelIdx() !== currentModelIdx || this.specificIssueKinds().length === 0) {
        this.specificIssueKinds.set(
          [...uniqueOutlierTypes].map((type) => ({
            label: OUTLIER_TYPE_LABELS[type],
            value: type,
          }))
        );
        this.selectedSpecificIssueKind.setValue(this.specificIssueKinds()[0].value);
        this.modelIdx.set(currentModelIdx);
      }

      if (!this.molstarFirstRenderFinished()) return;

      if (selectedValidationType.value !== this.molstarState.modelQualityValidationType()) {
        this.molstarState.modelQualityValidationType.set(selectedValidationType.value);
      }

      if (selectedValidationType.value !== 'issue_count') {
        const issue = this.selectedSpecificIssueKind.value;
        this.molstarState.modelQualitySpecificIssueKind.set(issue);
      }

      this.actionQueue.addAction(
        'exp&val trigger renderMolstarForModelQuality',
        async () => {
          await this.molstarState.renderMolstarForModelQuality();
        },
        true
      );
    });
  }

  ngOnInit() {
    this.globalStore
      .select(EntrySelectors.experimentalDetails)
      .pipe(
        filter(Boolean),
        mergeMap((experimentalDetails) => {
          if (experimentalDetails.length > 1) {
            this.isHybrid.set(true);
          }
          return this.dataFacade.processData();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((processedExpValData) => {
        this.processedData.set(processedExpValData);
        this.currentData.set(this.processedData()?.[0]);
      });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    // Check if we've scrolled past the top of the aside
    if (scrollPosition >= 394) {
      this.isSticky.set(true);
    } else {
      this.isSticky.set(false);
    }
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
    this.currentData.set(data);
  }
}
