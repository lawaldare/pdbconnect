import { Component, inject, input, OnChanges, signal } from '@angular/core';
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
  public complexInteraction = input.required<ComplexInteraction>();
  public complexImageSrc = signal<string>('');

  ngOnChanges(): void {
    const link = `https://www.ebi.ac.uk/pdbe/static/entry/${this.complexInteraction().representative_structure.pdb_id}_assembly_${
      this.complexInteraction().representative_structure.assembly_id
    }_chain_front_image-800x800.png`;
    this.complexImageSrc.set(link);
  }

  public openComplexPage(complexId: string): void {
    this.util.redirectToSearchTerm(complexId);
  }
}
