import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { UtilService } from '@pdbc/core';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';

@Component({
  selector: 'pdbc-mb-overview-tab',
  imports: [CommonModule],
  templateUrl: './mb-overview-tab.component.html',
  styleUrl: './mb-overview-tab.component.scss',
})
export class MbOverviewTabComponent {
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly util = inject(UtilService);

  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly organismScientificNames = toSignal(this.globalStore.select(EntrySelectors.organismScientificNames));
  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));
  public readonly qualityScores = toSignal(this.globalStore.select(EntrySelectors.summaryQualityScores));
}
