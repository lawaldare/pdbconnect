import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { MobileFacade } from '../mobile.facade';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, filter, map } from 'rxjs';
import { MbTableOfContentsComponent, NavigationLink } from '../mb-table-of-contents/mb-table-of-contents.component';
import { MobileTabNames } from '../mobile-tab.model';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MbOtherRscSequence } from './sub-components/mb-other-rsc-sequence/mb-other-rsc-sequence.component';
import { MbOtherRscDynamics } from './sub-components/mb-other-rsc-dynamics/mb-other-rsc-dynamics.component';
import { MbOtherRscDomains } from './sub-components/mb-other-rsc-domains/mb-other-rsc-domains.component';
import { MbOtherRscFunctional } from './sub-components/mb-other-rsc-functional/mb-other-rsc-functional.component';
import { MbOtherRscOthers } from './sub-components/mb-other-rsc-others/mb-other-rsc-others.component';
import { MbOtherRscStructures } from './sub-components/mb-other-rsc-structures/mb-other-rsc-structures.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'pdbc-mb-other-resources-tab',
  standalone: true,
  imports: [
    CommonModule,
    MbTableOfContentsComponent,
    MbOtherRscStructures,
    MbOtherRscSequence,
    MbOtherRscDynamics,
    MbOtherRscDomains,
    MbOtherRscOthers,
    MbOtherRscFunctional,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './mb-other-resources-tab.component.html',
  styleUrl: './mb-other-resources-tab.component.scss',
})
export class MbOtherResourcesTabComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mbFacade = inject(MobileFacade);

  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly entryStoreId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly entryId = signal<string>('');

  public baseUrl = environment.baseUrl;

  ngOnInit(): void {
    combineLatest([this.globalStore.select(EntrySelectors.entryId).pipe(filter(Boolean))])
      .pipe(
        map(([entryId]) => {
          this.entryId.set(entryId);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public readonly navigationLinks: NavigationLink[] = [
    { id: 'related-pdbe-resources', title: 'Related PDBe resources' },
    { id: 'protein-dynamics', title: 'Protein dynamics' },
    { id: '3d-structure-dbs', title: '3D structure databases' },
    { id: 'sequence-db', title: 'Sequence databases' },
    { id: 'family-domain-db', title: 'Family and domain databases' },
    { id: 'functional', title: 'Functional annotation' },
    { id: 'other-resources', title: 'Other resources' },
  ];

  public goBackToOverviewPage(): void {
    this.mbFacade.selectPage(MobileTabNames.Overview);
  }
}
