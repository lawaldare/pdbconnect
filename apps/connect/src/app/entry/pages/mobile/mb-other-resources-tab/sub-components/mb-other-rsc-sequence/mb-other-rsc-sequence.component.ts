import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../../../store/entry-store.model';
import { EntrySelectors } from '../../../../../store/entry.selectors';
import { EntryActions } from '../../../../../store/entry.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationAPIDispatcher } from '../../../../../services/application-api-dispacher.service';

const removeEmpty = (obj: any) => (obj ? (({ empty, ...rest }) => rest)(obj) : obj);

@Component({
  selector: 'pdbc-mb-other-rsc-sequence',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mb-other-rsc-sequence.component.html',
  styleUrl: './mb-other-rsc-sequence.component.scss',
})
export class MbOtherRscSequence implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  ngOnInit() {
    this.applicationApiDispatcher.dispatchForList([EntryActions.getUniprotMapping]);
  }

  public readonly uniprotMappings = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));

  public readonly uniprotKeys = computed(() => {
    let uniprotMappings = this.uniprotMappings();
    uniprotMappings = removeEmpty(uniprotMappings);
    const uniprotKeys = uniprotMappings ? Object.keys(uniprotMappings) : [];
    return uniprotKeys;
  });

  public expandedLinkGroups = signal<Record<string, boolean>>({});

  public toggleLinkGroup(key: string): void {
    this.expandedLinkGroups.update((state) => ({
      ...state,
      [key]: !state[key],
    }));
  }

  public isLinkGroupExpanded(key: string): boolean {
    return !!this.expandedLinkGroups()[key];
  }
}
