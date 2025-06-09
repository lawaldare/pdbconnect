import { Component, computed, inject, input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexInteraction } from '../../../models/complex-structure.model';
import { RouterModule } from '@angular/router';
import { MaterialModule, UtilService } from '@pdbc/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'pdbc-complex-card',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule, MaterialModule],
  templateUrl: './complex-card.component.html',
  styleUrl: './complex-card.component.scss',
})
export class ComplexCardComponent implements OnChanges {
  private readonly util = inject(UtilService);
  public baseUrl = this.util.baseUrl();

  public complexInteraction = input.required<ComplexInteraction>();
  public complexImageSrc = signal<string>('');
  public participants = computed(() => {
    return this.complexInteraction().relationship_type === 'sub-complex'
      ? this.complexInteraction().common_participants
      : this.complexInteraction().additional_participants;
  });
  public subTitle = computed(() => {
    return this.complexInteraction().relationship_type === 'sub-complex' ? 'Common' : 'Additional';
  });
  public showLess = signal<boolean>(true);

  ngOnChanges(): void {
    const link = `https://www.ebi.ac.uk/pdbe/static/entry/${this.complexInteraction().representative_structure.pdb_id}_assembly_${
      this.complexInteraction().representative_structure.assembly_id
    }_chemically_distinct_molecules_front_image-800x800.png`;
    this.complexImageSrc.set(link);
  }

  public openComplexPage(complexId: string): void {
    this.util.redirectToSearchTerm(complexId, '_blank');
  }
  viewMore(): void {
    this.showLess.update((value) => !value);
  }
}
