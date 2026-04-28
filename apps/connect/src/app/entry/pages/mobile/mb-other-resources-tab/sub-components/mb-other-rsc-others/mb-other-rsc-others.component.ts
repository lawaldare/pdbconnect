import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../../../store/entry-store.model';
import { EntrySelectors } from '../../../../../store/entry.selectors';
import { EntryActions } from '../../../../../store/entry.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationAPIDispatcher } from '../../../../../services/application-api-dispacher.service';

@Component({
  selector: 'pdbc-mb-other-rsc-others',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mb-other-rsc-others.component.html',
  styleUrl: './mb-other-rsc-others.component.scss',
})
export class MbOtherRscOthers implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  ngOnInit() {
    this.applicationApiDispatcher.dispatchForList([EntryActions.getPrimaryPublication]);
  }

  public readonly primaryPubMed = computed(() => {
    const primaryPublication = this.primaryPublication();
    const primaryPubMed = primaryPublication?.pubmed_id;
    return primaryPubMed;
  });
}
