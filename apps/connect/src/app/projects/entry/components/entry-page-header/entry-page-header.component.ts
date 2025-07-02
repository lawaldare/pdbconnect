import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../store/entry.selectors';
import { EntryDropdownComponent } from './sub-components/entry-dropdown/entry-dropdown.component';
import { tap } from 'rxjs';

@Component({
  selector: 'pdbc-entry-page-header',
  imports: [CommonModule, EntryDropdownComponent],
  templateUrl: './entry-page-header.component.html',
  styleUrl: './entry-page-header.component.scss',
})
export class EntryPageHeaderComponent {
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly resolutionValues = toSignal(this.globalStore.select(EntrySelectors.resolutionValues));
  public readonly experimentalMethod = toSignal(this.globalStore.select(EntrySelectors.experimentalMethod));
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly downloadOptions = toSignal(this.globalStore.select(EntrySelectors.downloadOptions));
  public readonly viewOptions = toSignal(this.globalStore.select(EntrySelectors.viewOptions));

  public openFeedbackForm(): void {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSe_cs6jrhCM8I7G8zsbtTQWEOjGmR07tC6aJDTrN62gyQ8e0A/viewform', '_blank');
  }
}
