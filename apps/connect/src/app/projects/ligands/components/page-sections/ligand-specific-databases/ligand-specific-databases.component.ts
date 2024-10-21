import { Component, ElementRef, inject, input, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossLink } from '../../../services/aggregated-api.service';
import { LigandSpecificDatabasesComponentFacade } from './ligand-specific-databases.facade';
import { GoogleAnalyticsService } from '@pdbc/core';

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
export class LigandSpecificDatabasesComponent implements OnChanges {
  public crossLinks = input.required<CrossLink[]>();
  public readonly facade = inject(LigandSpecificDatabasesComponentFacade);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

  public mappedCrossLinks = this.facade.crosslinks;

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

  ngOnChanges(): void {
    this.facade.init(this.crossLinks());
  }
}
