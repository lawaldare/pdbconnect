import { Component, DestroyRef, inject, input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexAPIService } from '../../../services/complex-api.service';
import { ComplexData } from '../../../models/complex-structure.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly complexAPIService = inject(ComplexAPIService);
  private readonly util = inject(UtilService);
  public complexId = input.required<string>();
  public complexData = signal<ComplexData>({} as ComplexData);
  public complexImageSrc = signal<string>('');

  ngOnChanges(): void {
    this.renderComplexImage();
  }

  private renderComplexImage(): void {
    this.complexAPIService
      .getSummaryForComplexData(this.complexId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: ComplexData) => {
        this.complexData.set(data);
        const link = `https://www.ebi.ac.uk/pdbe/static/entry/${data.representative_structure.pdb_id}_assembly_${data.representative_structure.assembly_id}_chain_front_image-800x800.png`;
        this.complexImageSrc.set(link);
      });
  }

  public openComplexPage(complexId: string): void {
    this.util.redirectToSearchTerm(complexId);
  }
}
