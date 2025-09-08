import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../store/entry.selectors';
import { EntryDropdownComponent } from './sub-components/entry-dropdown/entry-dropdown.component';
import { tap } from 'rxjs';
import { EntryActions } from '../../store/entry.actions';
import { ApplicationAPIDispatcher } from '../../services/application-api-dispacher.service';

@Component({
  selector: 'pdbc-entry-page-header',
  imports: [CommonModule, EntryDropdownComponent],
  templateUrl: './entry-page-header.component.html',
  styleUrl: './entry-page-header.component.scss',
})
export class EntryPageHeaderComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly resolutionValues = toSignal(this.globalStore.select(EntrySelectors.resolutionValues));
  public readonly experimentalMethod = toSignal(this.globalStore.select(EntrySelectors.experimentalMethod));
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly downloadOptions = toSignal(this.globalStore.select(EntrySelectors.downloadOptions));
  public readonly viewOptions = toSignal(this.globalStore.select(EntrySelectors.viewOptions));

  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  ngOnInit() {
    /* 1. Fetch data for header  */
    // this.globalStore.dispatch(EntryActions.getDownloadOptions());
    // // getExperiment also used in entry-page-header, model-quality, mb-overview, mb-model-quality
    // this.globalStore.dispatch(EntryActions.getExperiment());
    this.applicationApiDispatcher.dispatchForList([
      // EntryActions.getSummaryData // dispatched in main.ts
      EntryActions.getDownloadOptions,
      EntryActions.getExperiment,
    ]);
  }
}
