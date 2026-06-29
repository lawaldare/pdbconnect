import { Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LigandSpecificDatabasesComponentFacade } from './ligand-specific-databases.facade';
import { GoogleAnalyticsService, MaterialModule } from '@pdbc/core';
import { LigandStoreState } from '../../../store/ligand-store.model';
import { Store } from '@ngrx/store';
import { LigandSelectors } from '../../../store/ligand.selectors';
import { combineLatest, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MDpositTooltip } from '../../../ligand.constant';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

export interface MappedCrossLink {
  resource: string;
  resourceIds: string[];
  description?: string;
  link?: string;
}

@Component({
  selector: 'pdbc-ligand-specific-databases',
  standalone: true,
  imports: [CommonModule, MaterialModule, NgxSkeletonLoaderModule],
  templateUrl: './ligand-specific-databases.component.html',
  styleUrl: './ligand-specific-databases.component.scss',
})
export class LigandSpecificDatabasesComponent implements OnInit {
  public readonly facade = inject(LigandSpecificDatabasesComponentFacade);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

  public mappedCrossLinks = this.facade.crosslinks;

  private readonly globalStore = inject(Store<LigandStoreState>);

  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('crosslink', { read: ElementRef }) crosslink!: ElementRef;

  protected readonly inchikey = signal<string>('');
  protected readonly isInchkeyAvailable = signal(false);

  protected readonly MDpositTooltip = MDpositTooltip;

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    if (element.scrollTop === 0) {
      element.classList.remove('top-shadow');
      element.classList.add('bottom-shadow');
    } else {
      element.classList.add('top-shadow');
      element.classList.remove('bottom-shadow');
    }
  }

  ngOnInit(): void {
    combineLatest([this.globalStore.select(LigandSelectors.description), this.globalStore.select(LigandSelectors.mdpositInchikeys)])
      .pipe(
        map(([description, inchikeys]) => {
          const inchkeyAvailable = inchikeys.includes(description.inchikey);
          this.inchikey.set(description.inchikey);
          this.isInchkeyAvailable.set(inchkeyAvailable);
          this.facade.init(description.crossLinks ?? []);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
