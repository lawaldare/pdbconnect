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
  selector: 'pdbc-mb-other-rsc-functional',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mb-other-rsc-functional.component.html',
  styleUrl: './mb-other-rsc-functional.component.scss',
})
export class MbOtherRscFunctional implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  ngOnInit() {
    this.applicationApiDispatcher.dispatchForList([EntryActions.getGOMapping, EntryActions.getECMapping]);
  }

  public readonly goMappings = toSignal(this.globalStore.select(EntrySelectors.goMapping));
  public readonly ecMappings = toSignal(this.globalStore.select(EntrySelectors.ecMapping));

  public readonly goKeysWithExtra = computed(() => {
    let goMappings = this.goMappings();
    goMappings = removeEmpty(goMappings);
    const goKeys = goMappings ? Object.keys(goMappings) : [];
    const goExtra = goMappings ? Object.values(goMappings).map((v) => v.category.replace('_', ' ')) : [];
    const goKeysWithExtra = goKeys.map((key, index) => ({ name: key, extra: goExtra[index] }));
    return goKeysWithExtra;
  });

  public readonly ecKeys = computed(() => {
    let ecMappings = this.ecMappings();
    ecMappings = removeEmpty(ecMappings);
    const ecKeys = ecMappings ? Object.keys(ecMappings) : [];
    return ecKeys;
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
