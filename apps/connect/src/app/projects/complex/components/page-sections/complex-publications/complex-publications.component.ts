/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexAPIService } from '../../../services/complex-api.service';
import { Publication } from '../../../models/complex-publication.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'pdbc-complex-publications',
  standalone: true,
  imports: [CommonModule, MatPaginator, NgxSkeletonLoaderModule],
  templateUrl: './complex-publications.component.html',
  styleUrl: './complex-publications.component.scss',
})
export class ComplexPublicationsComponent implements OnInit {
  private readonly globalStore = inject(Store<ComplexStoreState>);
  public summaryData = toSignal(this.globalStore.select(ComplexSelectors.complexData));
  public complexAPIService = inject(ComplexAPIService);
  public complexPublications = signal<Publication[]>([]);

  public publicationsPageSize = signal<number>(5);
  public publicationsLength = computed(() => this.complexPublications().length);
  public publicationsPage: Publication[] | null = null;
  public pageSizeOptions = computed(() => [5, 10, 15, this.publicationsLength()]);

  ngOnInit(): void {
    const mappedAssemblies = this.summaryData()?.assemblies.map((assembly) => assembly.pdb_id);
    const uniquePDBIdsString = [...new Set(mappedAssemblies)];
    const chunks = this.splitIntoChunks(uniquePDBIdsString);
    const observablePublications: Observable<any>[] = chunks.map((chunk) =>
      this.fetchPublications(chunk.join(',')).pipe(
        catchError((error) => {
          console.error('Error fetching publications:', error);
          return of(null);
        })
      )
    );
    combineLatest(observablePublications).subscribe((publications) => {
      this.complexPublications.update(() => [...publications.flat()]);
      this.publicationsPage = this.complexPublications().slice(0, this.publicationsPageSize());
    });
  }

  private fetchPublications(pdbIds: string): Observable<Publication[] | null> {
    return this.complexAPIService.getPublications(pdbIds).pipe(
      map((publications: Record<string, Publication[]>) => {
        const mappedPublications = Object.values(publications).reduce((acc: Publication[], publication) => {
          if (publication[0]?.doi) {
            acc.push(publication[0]);
          }
          return acc;
        }, []);
        const uniqueMappedPublications = mappedPublications.filter(
          (publication, index, self) => index === self.findIndex((p) => p.pubmed_id === publication.pubmed_id)
        );
        return uniqueMappedPublications;
      }),
      catchError((error) => {
        console.error('Error fetching publications:', error);
        return of([]);
      })
    );
  }

  public handlePageEvent(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.publicationsPage = this.complexPublications().slice(startIndex, endIndex);
  }

  private splitIntoChunks(arr: string[], chunkSize = 100) {
    const result = [];
    for (let index = 0; index < arr.length; index += chunkSize) {
      result.push(arr.slice(index, index + chunkSize));
    }
    return result;
  }
}
