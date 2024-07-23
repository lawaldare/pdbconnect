import { Component, OnInit, Input, ViewChild, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RelatedLigand, SimilarLigand, LigandGrid, SameScaffold } from '../../../data-models/related-ligands.model';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { LigandGridComponent } from '../ligand-grid/ligand-grid.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { forkJoin, of, catchError, switchMap, tap, mergeMap, map, filter, combineLatest, EMPTY, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pdbc-related-ligands',
  standalone: true,
  imports: [CommonModule, FormsModule, LigandGridComponent, MatPaginator, ReactiveFormsModule],
  templateUrl: './related-ligands.component.html',
  styleUrl: './related-ligands.component.scss',
})
export class RelatedLigandsComponent implements OnInit {
  searchLogo = '/assets/images/Search.svg';
  stereoisomers: { name: string; chem_comp_id: string }[] = [];
  stereoisomersGrid: any[] = [];
  similarLigands: SimilarLigand[] = [];
  similarLigandsGrid: LigandGrid[] = [];
  unfilteredSimilarLigandsGrid: LigandGrid[] = [];
  filtSimilarLigandsGrid: LigandGrid[] = [];
  similarLigandsPage: LigandGrid[] = [];
  stereoisomersPage: any[] = [];
  sameScaffolds: SameScaffold[] = [];
  sameScaffoldGrid: LigandGrid[] = [];
  unfilteredSameScaffoldGrid: LigandGrid[] = [];
  unfilteredStereoisomers: { name: string; chem_comp_id: string; bound_entries: any }[] = [];
  filtSameScaffoldGrid: LigandGrid[] = [];
  filtStereoisomersGrid: any[] = [];
  sameScaffoldPage: LigandGrid[] = [];
  similarLigandpageLength = 0;
  similarLigandpageIndex = 0;
  similarLigandpageSize = 6;
  stereoisomerspageLength = 0;
  stereoisomerspageIndex = 0;
  stereoisomerspageSize = 6;
  pageSizeOptions = [6, 12, 18];
  similarLigandSearchText = '';
  sameScaffoldpageLength = 0;
  sameScaffoldpageIndex = 0;
  sameScaffoldpageSize = 6;
  sameScaffoldSearchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  public sameScaffoldTerm = new FormControl('');
  public sameLigandsTerm = new FormControl('');
  public stereoisomerTerm = new FormControl('');

  public similarityFrom = new FormControl(0);
  public similarityTo = new FormControl(100);

  handlePageEvent(event: PageEvent, filterOn: string) {
    switch (filterOn) {
      case 'similar': {
        this.similarLigandpageIndex = event.pageIndex;
        this.similarLigandpageSize = event.pageSize;
        const startIndex = this.similarLigandpageIndex * this.similarLigandpageSize;
        const endIndex = startIndex + this.similarLigandpageSize;
        this.similarLigandsPage = this.filtSimilarLigandsGrid.slice(startIndex, endIndex);
        break;
      }
      case 'same': {
        this.sameScaffoldpageIndex = event.pageIndex;
        this.sameScaffoldpageSize = event.pageSize;
        const startIndex = this.sameScaffoldpageIndex * this.sameScaffoldpageSize;
        const endIndex = startIndex + this.sameScaffoldpageSize;
        this.sameScaffoldPage = this.filtSameScaffoldGrid.slice(startIndex, endIndex);
        break;
      }
    }
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          const ligandId = params['ligandId'].toUpperCase();
          return this.aggregatedApiService.fetchRelatedLigands(ligandId);
        }),
        mergeMap((relatedLigand: RelatedLigand) => {
          this.similarLigands = relatedLigand['similar_ligands'];
          this.sameScaffolds = relatedLigand['same_scaffold'];
          this.stereoisomers = relatedLigand['stereoisomers'];

          const similarLigandBoundEntries = this.similarLigands.map((similarLigand) => this.fetchBoundEntriesWithFallback(similarLigand.chem_comp_id));

          const sameScaffoldBoundEntries = this.sameScaffolds.map((scaffold) => this.fetchBoundEntriesWithFallback(scaffold.chem_comp_id));

          const stereoisomersBoundEntries = this.stereoisomers.map((stereoisomer) => this.fetchBoundEntriesWithFallback(stereoisomer.chem_comp_id));

          return this.aggregateLigandEntries(similarLigandBoundEntries, sameScaffoldBoundEntries, stereoisomersBoundEntries);
        }),
        map(({ similarLigandBoundEntriesArray, sameScaffoldBoundEntriesArray, stereoisomersBoundEntriesArray }) => {
          this.unfilteredSimilarLigandsGrid = this.similarLigands.map((similarLigand, index) => ({
            chem_comp_id: similarLigand.chem_comp_id,
            name: similarLigand.name,
            similarity_score: similarLigand.similarity_score,
            substructure_match: similarLigand.substructure_match,
            bound_entries: similarLigandBoundEntriesArray[index],
          }));
          this.similarLigandsGrid = this.unfilteredSimilarLigandsGrid;
          this.setUpPagination('similarligand');

          this.unfilteredSameScaffoldGrid = this.sameScaffolds.map((sameScaffolds, index) => ({
            chem_comp_id: sameScaffolds.chem_comp_id,
            name: sameScaffolds.name,
            similarity_score: sameScaffolds.similarity_score,
            substructure_match: sameScaffolds.substructure_match,
            bound_entries: sameScaffoldBoundEntriesArray[index],
          }));
          this.sameScaffoldGrid = this.unfilteredSameScaffoldGrid;
          this.setUpPagination('samescaffold');

          this.unfilteredStereoisomers = this.stereoisomers.map((stereoisomer, index) => ({
            chem_comp_id: stereoisomer.chem_comp_id,
            name: stereoisomer.name,
            bound_entries: stereoisomersBoundEntriesArray[index],
          }));
          this.stereoisomersGrid = this.unfilteredStereoisomers;
          this.setUpPagination('stereoisomers');
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.sameScaffoldTerm.valueChanges
      .pipe(
        map((searchQuery) => {
          if (searchQuery) {
            return this.filterItemsBySearchQuery(searchQuery, this.unfilteredSameScaffoldGrid);
          } else {
            return this.unfilteredSameScaffoldGrid;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.sameScaffoldGrid = data;
        this.setUpPagination('samescaffold');
      });

    this.sameLigandsTerm.valueChanges
      .pipe(
        map((searchQuery) => {
          if (searchQuery) {
            return this.filterItemsBySearchQuery(searchQuery, this.unfilteredSimilarLigandsGrid);
          } else {
            return this.unfilteredSimilarLigandsGrid;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.similarLigandsGrid = data;
        this.setUpPagination('similarligand');
      });

    this.stereoisomerTerm.valueChanges
      .pipe(
        map((searchQuery) => {
          if (searchQuery) {
            return this.filterItemsBySearchQuery(searchQuery, this.unfilteredSimilarLigandsGrid);
          } else {
            return this.unfilteredSimilarLigandsGrid;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.stereoisomersGrid = data;
        this.setUpPagination('stereoisomers');
      });

    combineLatest([this.similarityFrom.valueChanges, this.similarityTo.valueChanges])
      .pipe(
        map(([from, to]) => {
          if (from === null || to === null) {
            return this.unfilteredSimilarLigandsGrid;
          }

          if (from > 0 && to > 0) {
            return this.filterItemsBySimilarityPercentage(from, to, this.unfilteredSimilarLigandsGrid);
          } else {
            return this.unfilteredSimilarLigandsGrid;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.similarLigandsGrid = data;
        this.setUpPagination('similarligand');
      });
  }

  private filterItemsBySearchQuery(searchQuery: string, items: LigandGrid[]): LigandGrid[] {
    return items.filter((item) => {
      const searchQueryLower = searchQuery.toLocaleLowerCase();
      return item.name.toLocaleLowerCase().indexOf(searchQueryLower) !== -1 || item.chem_comp_id.toString().toLocaleLowerCase().indexOf(searchQueryLower) !== -1;
    });
  }

  private filterItemsBySimilarityPercentage(min: number, max: number, items: LigandGrid[]): LigandGrid[] {
    return items.filter((item) => item.similarity_score >= min / 100 && item.similarity_score <= max / 100);
  }

  private setUpPagination(type: string): void {
    switch (type) {
      case 'samescaffold':
        this.filtSameScaffoldGrid = this.sameScaffoldGrid;
        this.sameScaffoldpageLength = this.filtSameScaffoldGrid.length;
        this.sameScaffoldPage = this.filtSameScaffoldGrid.slice(0, this.sameScaffoldpageSize);
        break;
      case 'similarligand':
        this.filtSimilarLigandsGrid = this.similarLigandsGrid;
        this.similarLigandpageLength = this.filtSimilarLigandsGrid.length;
        this.similarLigandsPage = this.filtSimilarLigandsGrid.slice(0, this.similarLigandpageSize);
        break;
      case 'stereoisomers':
        this.filtStereoisomersGrid = this.stereoisomersGrid;
        this.stereoisomerspageLength = this.filtStereoisomersGrid.length;
        this.stereoisomersPage = this.filtStereoisomersGrid.slice(0, this.stereoisomerspageSize);
        break;
    }
  }
  private fetchBoundEntriesWithFallback(chemCompId: string): Observable<string[]> {
    return this.aggregatedApiService.fetchBoundEntries(chemCompId).pipe(
      catchError(() => of([])) // Return an empty array on error
    );
  }
  private aggregateLigandEntries(
    similarLigandBoundEntries: Observable<string[]>[],
    sameScaffoldBoundEntries: Observable<string[]>[],
    stereoisomersBoundEntries: Observable<string[] | any>[]
  ): Observable<any> {
    const observablesToJoin = [];

    if (similarLigandBoundEntries.length > 0) {
      observablesToJoin.push(forkJoin(similarLigandBoundEntries));
    } else {
      observablesToJoin.push(of([]));
    }

    if (sameScaffoldBoundEntries.length > 0) {
      observablesToJoin.push(forkJoin(sameScaffoldBoundEntries));
    } else {
      observablesToJoin.push(of([]));
    }

    if (stereoisomersBoundEntries.length > 0) {
      observablesToJoin.push(forkJoin(stereoisomersBoundEntries));
    } else {
      observablesToJoin.push(of([]));
    }

    return forkJoin(observablesToJoin).pipe(
      mergeMap(([similarLigandBoundEntriesArray, sameScaffoldBoundEntriesArray, stereoisomersBoundEntriesArray]) => {
        return of({
          similarLigandBoundEntriesArray,
          sameScaffoldBoundEntriesArray,
          stereoisomersBoundEntriesArray,
        });
      })
    );
  }
}
