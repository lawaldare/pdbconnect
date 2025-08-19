import { Component, DestroyRef, inject, OnInit, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, distinctUntilChanged, filter, firstValueFrom, mergeMap, take, timer } from 'rxjs';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { ProcessedExperimentalDetails } from '../../../components/model-quality-tab/data-models-and-definitions/processed-experimental-details.model';
import { ValidationDataProcessingFacade } from '../../../components/model-quality-tab/validation-data.facade';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { StrucQualityGradientsComponent } from '../../../components/shared/struc-quality-gradients/struc-quality-gradients.component';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { cameraResetInMolstar, drawSelectionInMolstar } from '../../../helpers/molstar-helpers';
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

  public readonly compCommunication = inject(ComponentCommunicationService);

  public currentData = signal<ProcessedExperimentalDetails | undefined>(undefined);
  public readonly pdbRedoData = toSignal(this.globalStore.select(EntrySelectors.pdbRedoQualityScores));
  public readonly entryIdObs = this.globalStore.select(EntrySelectors.entryId);
  public readonly entryId = toSignal(this.entryIdObs);
  public readonly summaryObs = this.globalStore.select(EntrySelectors.summaryData);
  public readonly summary = toSignal(this.summaryObs);

  private outliers$ = toObservable(this.compCommunication.outliersByModelId);

  public expanded = signal<boolean>(false);
  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbModelQualityComponent>) {
    combineLatest([
      this.outliers$.pipe(
        debounceTime(50),
        distinctUntilChanged(),
        filter((otl) => otl !== undefined)
      ),
      this.compCommunication.mobileModelIdx$.pipe(debounceTime(50), distinctUntilChanged()),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef)) // Ensures cleanup when the component is destroyed
      .subscribe(async ([_outliers, _modelIdx]) => {
        // Wait until mobileMolstarLoaded$ is true before proceeding
        await firstValueFrom(
          this.compCommunication.mobileMolstarLoaded$.pipe(
            filter((ready) => ready), // Proceed only when it's true
            take(1) // Take the first value, then complete
          )
        );

        // Now that mobileMolstarLoaded$ is true, proceed with the logic
        this.displayMolstarMQuality();
      });
  }

  async ngOnInit() {
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

  public async displayMolstarMQuality() {
    if (this.compCommunication.mobileMolstarDisplay === 'mquality') return;
    const currentModelIdx = this.compCommunication.mobileModelIdx$.getValue();
    // get model quality data and display here
    const allOutliers = this.compCommunication.outliersByModelId();
    if (!allOutliers) return;
    const outliers = allOutliers[currentModelIdx];

    const colours = ['#D4D5D4', '#E5E501', '#DA6E03', '#B2182B'];
    const outlierList = [outliers.residuesWith1Outlier, outliers.residuesWith2Outliers, outliers.residuesWith3OrMoreOutliers];
    const selectionData: QueryParam[] = [];

    for (let i = 0; i < outlierList.length; i++) {
      const outlierResids = outlierList[i];
      selectionData.push(
        ...outlierResids.map((outlier) => {
          return {
            ...outlier,
            color: colours[i + 1],
            focus: false,
          };
        })
      );
    }
    const instance = this.compCommunication.mobileMolstar?.getInstance() ?? null;
    if (!instance) return;
    await drawSelectionInMolstar(instance, selectionData, colours[0]);

    timer(500).subscribe(async () => {
      await cameraResetInMolstar(instance);
    });
    this.compCommunication.mobileMolstarDisplay = 'mquality';
  }
}
