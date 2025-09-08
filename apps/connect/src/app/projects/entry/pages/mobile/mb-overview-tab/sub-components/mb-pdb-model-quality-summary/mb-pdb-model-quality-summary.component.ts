import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../../../store/entry-store.model';
import { EntrySelectors } from '../../../../../store/entry.selectors';
import { EntryActions } from '../../../../../store/entry.actions';
import { StrucQualityGradientsComponent } from '../../../../../components/shared/struc-quality-gradients/struc-quality-gradients.component';
import { ApplicationAPIDispatcher } from '../../../../../services/application-api-dispacher.service';

@Component({
  selector: 'pdbc-mb-model-quality-summary-overview',
  standalone: true,
  imports: [CommonModule, StrucQualityGradientsComponent],
  templateUrl: './mb-pdb-model-quality-summary.component.html',
  styleUrl: './mb-pdb-model-quality-summary.component.scss',
})
export class MbModelQualitySummaryOverviewComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);
  public readonly qualityScores = toSignal(this.globalStore.select(EntrySelectors.summaryQualityScores));

  ngOnInit() {
    this.applicationApiDispatcher.dispatchForList([EntryActions.getSummaryQualityScores]);
    // this.globalStore.dispatch(EntryActions.getSummaryQualityScores()); // used in summary, mb-overview
  }
}
