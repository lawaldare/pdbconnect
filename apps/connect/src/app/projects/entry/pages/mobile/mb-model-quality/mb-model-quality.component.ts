import { Component, DestroyRef, inject, OnInit, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { filter, mergeMap } from 'rxjs';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { ProcessedExperimentalDetails } from '../../../components/model-quality-tab/data-models-and-definitions/processed-experimental-details.model';
import { ValidationDataProcessingFacade } from '../../../components/model-quality-tab/validation-data.facade';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MobileFacade } from '../mobile.facade';
import { StrucQualityGradientsComponent } from '../../../components/shared/struc-quality-gradients/struc-quality-gradients.component';

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
  private readonly mbFacade = inject(MobileFacade);

  public currentData = signal<ProcessedExperimentalDetails | undefined>(undefined);
  public readonly pdbRedoData = toSignal(this.globalStore.select(EntrySelectors.pdbRedoQualityScores));

  public expanded = signal<boolean>(false);

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbModelQualityComponent>) {}

  ngOnInit() {
    this.globalStore
      .select(EntrySelectors.experimentalDetails)
      .pipe(
        filter(Boolean),
        mergeMap((experimentalDetails) => {
          // if (experimentalDetails.length > 1) {
          //   this.isHybrid.set(true);
          // }

          return this.dataFacade.processData();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((processedExpValData) => {
        // this.processedData.set(processedExpValData);
        this.currentData.set(processedExpValData?.[0]);
      });
  }

  public closeBottomSheet() {
    this.bottomSheetRef.dismiss();
    this.mbFacade.updateSelectedComponent(null);
    this.mbFacade.updateSelectedTabName('');
  }

  toggleBottomsheetHeight() {
    this.expanded.update((olamide) => !olamide);
    const container = document.querySelector('.custom-bottom-sheet') as HTMLElement;
    if (container) {
      container.style.height = this.expanded() ? '80%' : '40%';
    }
  }
}
