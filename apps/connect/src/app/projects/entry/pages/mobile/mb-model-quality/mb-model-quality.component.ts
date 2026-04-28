import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, OnInit, Optional, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { filter, mergeMap } from 'rxjs';
import { ProcessedExperimentalDetails } from '../../../components/model-quality-tab/data-models-and-definitions/processed-experimental-details.model';
import { ValidationDataProcessingFacade } from '../../../components/model-quality-tab/validation-data.facade';
import { StrucQualityGradientsComponent } from '../../../components/shared/struc-quality-gradients/struc-quality-gradients.component';
import { OUTLIER_TYPE_LABELS, VALIDATION_LEGENDS_AND_COLORS } from '../../../entry-constant';
import { SnapshotSpec } from '../../../helpers/mvs-views/mvs-snapshot-types';
import { ApplicationAPIDispatcher } from '../../../services/application-api-dispacher.service';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntryActions } from '../../../store/entry.actions';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MobileStateService } from '../mobile-state.service';

@Component({
  selector: 'pdbc-mb-model-quality',
  imports: [CommonModule, StrucQualityGradientsComponent],
  templateUrl: './mb-model-quality.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-model-quality.component.scss'],
})
export class MbModelQualityComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly destroyRef = inject(DestroyRef);
  public readonly dataFacade = inject(ValidationDataProcessingFacade);
  private readonly state = inject(MobileStateService);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  public readonly compCommunication = inject(ComponentCommunicationService);

  public currentData = signal<ProcessedExperimentalDetails | undefined>(undefined);
  public readonly pdbRedoData = toSignal(this.globalStore.select(EntrySelectors.pdbRedoQualityScores));
  public readonly entryIdObs = this.globalStore.select(EntrySelectors.entryId);
  public readonly entryId = toSignal(this.entryIdObs);
  public readonly summaryObs = this.globalStore.select(EntrySelectors.summaryData);
  public readonly summary = toSignal(this.summaryObs);
  public readonly residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));
  private readonly modelId = toSignal(this.compCommunication.mobileModelIdx$);
  // TODO: @adam Change modelId to toSignal also in desktop

  public expanded = signal<boolean>(false);

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbModelQualityComponent>) {
    effect(() => this.compCommunication.mvsSnapshotSpec$.next(this.mvsSnapshotSpec()));
  }

  async ngOnInit() {
    /* 1. Fetch tab data */
    this.applicationApiDispatcher.dispatchForList([
      EntryActions.getExperiment,
      EntryActions.getPDBRedoQualityScores,
      EntryActions.getEntryResidueWiseOutliers,
      EntryActions.getExperimentSBGridRawData,
      EntryActions.getExperimentIRRMCRawData,
      EntryActions.getExperimentEMPIARRawData,
      EntryActions.getExperimentPDBRawData,
      EntryActions.getExperimentBMRBRawData,
      EntryActions.getValidationKeyStats,
    ]);

    /* 2. (TODO: Refactor) Data processing for tab */
    this.globalStore
      .select(EntrySelectors.experimentalDetails)
      .pipe(
        filter(Boolean),
        mergeMap(() => {
          return this.dataFacade.processData();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((processedExpValData) => {
        this.currentData.set(processedExpValData?.[0]);
      });

    // await this.molstarVisualisation.resetMobileMolstarInitial();
  }

  public async closeBottomSheet() {
    this.bottomSheetRef.dismiss();
    this.state.updateSelectedComponent(null);
    this.state.updateSelectedTabName('');
    // await this.molstarVisualisation.resetMobileMolstarInitial();
  }

  toggleBottomsheetHeight() {
    this.expanded.update((olamide) => !olamide);
    const container = document.querySelector('.custom-bottom-sheet') as HTMLElement;
    if (container) {
      container.style.height = this.expanded() ? '80%' : '40%';
    }
  }

  private readonly mvsSnapshotSpec = computed<SnapshotSpec | undefined>(() => {
    const entryId = this.entryId();
    if (!entryId) return undefined;

    const currentModelId = this.modelId() ?? '1';
    const validationData = this.residueWiseOutliers();

    return {
      name: 'Validation',
      kind: 'pdbconnect_quality',
      params: {
        entry: entryId,
        assemblyId: undefined,
        modelId: parseInt(currentModelId),
        validationData: validationData,
        validationType: { kind: 'issue_count' },
        validationColors: VALIDATION_LEGENDS_AND_COLORS.map((t) => t.color),
        niceIssueNames: OUTLIER_TYPE_LABELS,
        volumeStreaming: true,
      },
    };
  });
}
