import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LigandSpecificDatabasesComponentFacade } from './ligand-specific-databases.facade';
import { GoogleAnalyticsService } from '@pdbc/core';
import { BiodataState } from '../../../../store/biodata.model';
import { Store } from '@ngrx/store';
import { BiodataSelectors } from '../../../../store/biodata.selectors';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface MappedCrossLink {
  resource: string;
  resourceIds: string[];
  description?: string;
  link?: string;
}

@Component({
  selector: 'pdbc-ligand-specific-databases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ligand-specific-databases.component.html',
  styleUrl: './ligand-specific-databases.component.scss',
})
export class LigandSpecificDatabasesComponent implements OnInit {
  public readonly facade = inject(LigandSpecificDatabasesComponentFacade);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

  public mappedCrossLinks = this.facade.crosslinks;

  private readonly globalStore = inject(Store<BiodataState>);

  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('crosslink', { read: ElementRef }) crosslink!: ElementRef;

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
    this.globalStore
      .select(BiodataSelectors.description)
      .pipe(
        map((description) => {
          this.facade.init(description.crossLinks);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
