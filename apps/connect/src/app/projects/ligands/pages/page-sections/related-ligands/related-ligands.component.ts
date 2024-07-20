import { Component, OnInit, Input, ViewChild, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RelatedLigand, SimilarLigand, LigandGrid, SameScaffold } from '../../../data-models/related-ligands.model';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { LigandGridComponent } from '../ligand-grid/ligand-grid.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { forkJoin, of, catchError, switchMap, tap, mergeMap, map, filter } from 'rxjs';
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
  similarLigands: SimilarLigand[] = [];
  similarLigandsGrid: LigandGrid[] = [];
  unfilteredSimilarLigandsGrid: LigandGrid[] = [];
  filtSimilarLigandsGrid: LigandGrid[] = [];
  similarLigandsPage: LigandGrid[] = [];
  sameScaffolds: SameScaffold[] = [];
  sameScaffoldGrid: LigandGrid[] = [];
  unfilteredSameScaffoldGrid: LigandGrid[] = [];
  filtSameScaffoldGrid: LigandGrid[] = [];
  sameScaffoldPage: LigandGrid[] = [];
  similarLigandpageLength = 0;
  similarLigandpageIndex = 0;
  similarLigandpageSize = 6;
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

  applyFilter(filterOn: string) {
    switch (filterOn) {
      case 'similar': {
        if (this.similarLigandSearchText != null && this.similarLigandSearchText.trim() !== '') {
          this.filtSimilarLigandsGrid = this.similarLigandsGrid.filter((x) => {
            return x.chem_comp_id == this.similarLigandSearchText || Array.from(x.bound_entries).includes(this.similarLigandSearchText);
          });
          this.similarLigandpageLength = this.filtSimilarLigandsGrid.length;
          this.similarLigandpageIndex = 0;
        } else {
          this.filtSimilarLigandsGrid = this.similarLigandsGrid;
          this.similarLigandpageLength = this.filtSimilarLigandsGrid.length;
        }
        const startIndex = this.similarLigandpageIndex * this.similarLigandpageSize;
        const endIndex = startIndex + this.similarLigandpageSize;
        this.similarLigandsPage = this.filtSimilarLigandsGrid.slice(startIndex, endIndex);
        break;
      }
      case 'same': {
        if (this.sameScaffoldSearchText != null && this.sameScaffoldSearchText.trim() !== '') {
          this.filtSameScaffoldGrid = this.sameScaffoldGrid.filter((x) => {
            return x.chem_comp_id == this.sameScaffoldSearchText || Array.from(x.bound_entries).includes(this.sameScaffoldSearchText);
          });
          this.sameScaffoldpageLength = this.filtSameScaffoldGrid.length;
          this.sameScaffoldpageIndex = 0;
        } else {
          this.filtSameScaffoldGrid = this.sameScaffoldGrid;
          this.sameScaffoldpageLength = this.filtSameScaffoldGrid.length;
        }
        const startIndex = this.sameScaffoldpageIndex * this.sameScaffoldpageSize;
        const endIndex = startIndex + this.sameScaffoldpageSize;
        this.sameScaffoldPage = this.filtSameScaffoldGrid.slice(startIndex, endIndex);
        break;
      }
    }
  }

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

          const similarLigandBoundEntries = this.similarLigands.map((similarLigand) => this.aggregatedApiService.fetchBoundEntries(similarLigand.chem_comp_id));

          const sameScaffoldBoundEntries = this.sameScaffolds.map((sameScaffold) => this.aggregatedApiService.fetchBoundEntries(sameScaffold.chem_comp_id));

          return forkJoin(similarLigandBoundEntries).pipe(
            mergeMap((similarLigandBoundEntriesArray) => {
              return forkJoin(sameScaffoldBoundEntries).pipe(
                mergeMap((sameScaffoldBoundEntriesArray) => {
                  return of({
                    similarLigandBoundEntriesArray,
                    sameScaffoldBoundEntriesArray,
                  });
                })
              );
            })
          );
        }),
        map(({ similarLigandBoundEntriesArray, sameScaffoldBoundEntriesArray }) => {
          this.unfilteredSimilarLigandsGrid = this.similarLigands.map((similarLigand, index) => ({
            chem_comp_id: similarLigand.chem_comp_id,
            name: similarLigand.name,
            similarity_score: similarLigand.similarity_score,
            substructure_match: similarLigand.substructure_match,
            bound_entries: similarLigandBoundEntriesArray[index],
          }));
          this.similarLigandsGrid = this.unfilteredSimilarLigandsGrid;
          this.setUpPagination(false);

          this.unfilteredSameScaffoldGrid = this.sameScaffolds.map((sameScaffolds, index) => ({
            chem_comp_id: sameScaffolds.chem_comp_id,
            name: sameScaffolds.name,
            similarity_score: sameScaffolds.similarity_score,
            substructure_match: sameScaffolds.substructure_match,
            bound_entries: sameScaffoldBoundEntriesArray[index],
          }));
          this.sameScaffoldGrid = this.unfilteredSameScaffoldGrid;
          this.setUpPagination(true);
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
        this.setUpPagination(true);
      });

    this.sameLigandsTerm.valueChanges
      .pipe(
        map((searchQuery) => {
          console.log(this.unfilteredSimilarLigandsGrid);
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
        this.setUpPagination(false);
      });
  }

  // private filterItemsBySearchQuery(searchQuery: string, items: any[]): any[] {
  //   return items.filter((asset) => asset.name.toLocaleLowerCase().indexOf(searchQuery.toLocaleLowerCase()) !== -1);
  // }

  private filterItemsBySearchQuery(searchQuery: string, items: any[]): any[] {
    return items.filter((item) => {
      const searchQueryLower = searchQuery.toLocaleLowerCase();
      return item.name.toLocaleLowerCase().indexOf(searchQueryLower) !== -1 || item.chem_comp_id.toString().toLocaleLowerCase().indexOf(searchQueryLower) !== -1;
    });
  }

  private setUpPagination(isScaffoldGrid: boolean): void {
    if (isScaffoldGrid) {
      this.filtSameScaffoldGrid = this.sameScaffoldGrid;
      this.sameScaffoldpageLength = this.filtSameScaffoldGrid.length;
      this.sameScaffoldPage = this.filtSameScaffoldGrid.slice(0, this.sameScaffoldpageSize);
    } else {
      this.filtSimilarLigandsGrid = this.similarLigandsGrid;
      this.similarLigandpageLength = this.filtSimilarLigandsGrid.length;
      this.similarLigandsPage = this.filtSimilarLigandsGrid.slice(0, this.similarLigandpageSize);
    }
  }
}
