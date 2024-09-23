import { Component, inject, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assembly } from '../../../models/complex-structure.model';
import { ComplexAPIService } from '../../../services/complex-api.service';

@Component({
  selector: 'pdbc-complex-publications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complex-publications.component.html',
  styleUrl: './complex-publications.component.scss',
})
export class ComplexPublicationsComponent implements OnChanges {
  public assemblies = input.required<Assembly[]>();
  public complexAPIService = inject(ComplexAPIService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assemblies'] && changes['assemblies'].currentValue) {
      const mappedAssemblies = this.assemblies().map((assembly) => assembly.pdb_id);
      const uniquePDBIdsString = [...new Set(mappedAssemblies)].join(',');
      this.fetchPublications(uniquePDBIdsString);
    }
  }

  private fetchPublications(pdbIds: string): void {
    this.complexAPIService.getPublications(pdbIds).subscribe((publications) => {
      console.log('ComplexPublicationsComponent: fetched publications:', publications);
    });
  }
}
