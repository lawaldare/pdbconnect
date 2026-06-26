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
  selector: 'pdbc-mb-other-rsc-domains',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mb-other-rsc-domains.component.html',
  styleUrl: './mb-other-rsc-domains.component.scss',
})
export class MbOtherRscDomains implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  ngOnInit() {
    this.applicationApiDispatcher.dispatchForList([
      EntryActions.getPfamMapping,
      EntryActions.getCathMapping,
      EntryActions.getScop175Mapping,
      EntryActions.getInterproMapping,
      EntryActions.getRfamMapping,
    ]);
  }

  public readonly pfamMappings = toSignal(this.globalStore.select(EntrySelectors.pfamMapping));
  public readonly cathMappings = toSignal(this.globalStore.select(EntrySelectors.cathMapping));
  public readonly scop175Mappings = toSignal(this.globalStore.select(EntrySelectors.scop175Mapping));
  public readonly interproMappings = toSignal(this.globalStore.select(EntrySelectors.interproMapping));
  public readonly rfamMappings = toSignal(this.globalStore.select(EntrySelectors.rfamMapping));

  public readonly pfamKeys = computed(() => {
    let pfamMappings = this.pfamMappings();
    pfamMappings = removeEmpty(pfamMappings);
    return pfamMappings ? Object.keys(pfamMappings) : [];
  });

  public readonly cathKeys = computed(() => {
    let cathMappings = this.cathMappings();
    cathMappings = removeEmpty(cathMappings);
    return cathMappings ? Object.keys(cathMappings) : [];
  });

  public readonly scop175Keys = computed(() => {
    let scop175Mappings = this.scop175Mappings();
    scop175Mappings = removeEmpty(scop175Mappings);
    const scop175Keys = scop175Mappings ? Object.keys(scop175Mappings) : [];
    return scop175Keys;
  });

  public readonly interProKeys = computed(() => {
    let interproMappings = this.interproMappings();
    interproMappings = removeEmpty(interproMappings);
    const interproKeys = interproMappings ? Object.keys(interproMappings) : [];
    return interproKeys;
  });

  public readonly rfamKeys = computed(() => {
    let rfamMappings = this.rfamMappings();
    rfamMappings = removeEmpty(rfamMappings);
    const rfamKeys = rfamMappings ? Object.keys(rfamMappings) : [];
    return rfamKeys;
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
