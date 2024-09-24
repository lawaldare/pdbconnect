import { Component, computed, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assembly } from '../../../models/complex-structure.model';
import { ComplexAPIService } from '../../../services/complex-api.service';
import { Publication } from '../../../models/complex-publication.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'pdbc-complex-publications',
  standalone: true,
  imports: [CommonModule, MatPaginator],
  templateUrl: './complex-publications.component.html',
  styleUrl: './complex-publications.component.scss',
})
export class ComplexPublicationsComponent implements OnChanges {
  public assemblies = input.required<Assembly[]>();
  public complexAPIService = inject(ComplexAPIService);
  public complexPublications = signal<Publication[]>([]);

  public publicationsPageSize = signal<number>(5);
  public publicationsLength = computed(() => this.complexPublications().length);
  public publicationsPage: Publication[] = [];
  public pageSizeOptions = computed(() => [5, 10, 15, this.publicationsLength()]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assemblies'] && changes['assemblies'].currentValue) {
      const mappedAssemblies = this.assemblies().map((assembly) => assembly.pdb_id);
      const uniquePDBIdsString = [...new Set(mappedAssemblies)].slice(0, 50).join(',');
      this.fetchPublications(uniquePDBIdsString);
    }
  }

  private fetchPublications(pdbIds: string): void {
    this.complexAPIService.getPublications(pdbIds).subscribe((publications: Record<string, Publication[]>) => {
      const mappedPublications = Object.values(publications).reduce((acc: Publication[], publication) => {
        if (publication[0].doi) {
          acc.push(publication[0]);
        }
        return acc;
      }, []);
      this.complexPublications.update(() => mappedPublications);
      this.publicationsPage = this.complexPublications().slice(0, this.publicationsPageSize());
    });
  }

  public handlePageEvent(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.publicationsPage = this.complexPublications().slice(startIndex, endIndex);
  }
}
