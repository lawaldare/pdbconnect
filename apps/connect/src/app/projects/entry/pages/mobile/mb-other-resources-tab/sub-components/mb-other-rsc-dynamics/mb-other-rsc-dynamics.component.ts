import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../../../store/entry-store.model';
import { EntrySelectors } from '../../../../../store/entry.selectors';
import { EntryActions } from '../../../../../store/entry.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationAPIDispatcher } from '../../../../../services/application-api-dispacher.service';

@Component({
  selector: 'pdbc-mb-other-rsc-dynamics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mb-other-rsc-dynamics.component.html',
  styleUrl: './mb-other-rsc-dynamics.component.scss',
})
export class MbOtherRscDynamics implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);
  public readonly entryStoreId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  ngOnInit() {
    this.applicationApiDispatcher.dispatchForList([EntryActions.getHasMDDB]);
  }

  public readonly hasMDDB = toSignal(this.globalStore.select(EntrySelectors.hasMDDB));
  public readonly upperCaseEntry = computed(() => this.entryStoreId()?.toUpperCase() ?? '');
}
