/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, OnInit, ViewChild, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RelatedLigand, SimilarLigand, LigandGrid, SameScaffold, StereoIsomer } from '../../../data-models/related-ligands.model';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { LigandGridComponent } from '../ligand-grid/ligand-grid.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { forkJoin, mergeMap, map, combineLatest, startWith, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LigandUtilService } from '../../../ligand-util.service';
import { GoogleAnalyticsService } from '@pdbc/core';
import { LigandStoreState } from '../../../store/ligand-store.model';
import { Store } from '@ngrx/store';
import { LigandSelectors } from '../../../store/ligand.selectors';

@Component({
  selector: 'pdbc-related-ligands',
  standalone: true,
  imports: [CommonModule, FormsModule, LigandGridComponent, MatPaginator, ReactiveFormsModule, NgxSkeletonLoaderModule],
  templateUrl: './related-ligands.component.html',
  styleUrl: './related-ligands.component.scss',
})
export class RelatedLigandsComponent implements OnInit {
  public stereoisomers = signal<StereoIsomer[]>([]);
  private stereoisomersGrid: any[] = [];
  public similarLigands = signal<SimilarLigand[]>([]);
  private similarLigandsGrid: LigandGrid[] = [];
  private unfilteredSimilarLigandsGrid: LigandGrid[] = [];
  private filtSimilarLigandsGrid: LigandGrid[] = [];
  public similarLigandsPage: LigandGrid[] = [];
  public stereoisomersPage: any[] = [];
  public sameScaffolds = signal<SameScaffold[]>([]);
  private sameScaffoldGrid: LigandGrid[] = [];
  private unfilteredSameScaffoldGrid: LigandGrid[] = [];
  private unfilteredStereoisomers: { name: string; chem_comp_id: string; bound_entries: any }[] = [];
  private filtSameScaffoldGrid: LigandGrid[] = [];
  private filtStereoisomersGrid: any[] = [];
  public sameScaffoldPage: LigandGrid[] = [];
  public similarLigandpageLength = 0;
  private similarLigandpageIndex = 0;
  public similarLigandpageSize = 5;
  public stereoisomerspageLength = 0;
  private stereoisomerspageIndex = 0;
  public stereoisomerspageSize = 5;
  public sameScaffoldPageSizeOptions = signal<number[]>([]);
  public similarLigandPageSizeOptions = signal<number[]>([]);
  public stereoisomersPageSizeOptions = signal<number[]>([]);
  public sameScaffoldpageLength = 0;
  private sameScaffoldpageIndex = 0;
  public sameScaffoldpageSize = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ligandUtilService = inject(LigandUtilService);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly globalStore = inject(Store<LigandStoreState>);

  public sameScaffoldTerm = new FormControl('');
  public sameLigandsTerm = new FormControl('');
  public stereoisomerTerm = new FormControl('');

  public similarityFrom = new FormControl(60);
  public similarityTo = new FormControl(100);

  private relatedLigand!: any;

  public readonly skeletonTheme = {
    'border-radius': '0px',
    height: '150px',
    'background-color': '#f4f4f4',
    border: '1px solid white',
    width: '150px',
  };

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
      case 'stereoisomer': {
        this.stereoisomerspageIndex = event.pageIndex;
        this.stereoisomerspageSize = event.pageSize;
        const startIndex = this.stereoisomerspageIndex * this.stereoisomerspageSize;
        const endIndex = startIndex + this.stereoisomerspageSize;
        this.stereoisomersPage = this.filtStereoisomersGrid.slice(startIndex, endIndex);
        break;
      }
    }
  }

  ngOnInit() {
    this.globalStore
      .select(LigandSelectors.relatedLigands)
      .pipe(
        filter(Boolean),
        mergeMap((relatedLigand: RelatedLigand) => {
          this.relatedLigand = relatedLigand;
          this.sameScaffoldPageSizeOptions.set([]);
          this.similarLigandPageSizeOptions.set([]);
          this.stereoisomersPageSizeOptions.set([]);

          this.similarLigands.update(() => relatedLigand['similar_ligands'] || []);
          this.sameScaffolds.update(() => relatedLigand['same_scaffold'] || []);
          this.stereoisomers.update(() => relatedLigand['stereoisomers'] || []);

          const validIdsArray = [];

          const similarLigandsIds =
            this.similarLigands()
              .map((ligand) => ligand.chem_comp_id)
              .join(',') ?? '';

          const sameScaffoldIds =
            this.sameScaffolds()
              .map((ligand) => ligand.chem_comp_id)
              .join(',') ?? '';

          const stereoisomersIds =
            this.stereoisomers()
              .map((ligand) => ligand.chem_comp_id)
              .join(',') ?? '';

          if (similarLigandsIds) {
            validIdsArray.push(this.aggregatedApiService.fetchBoundEntries(similarLigandsIds));
          }

          if (sameScaffoldIds) {
            validIdsArray.push(this.aggregatedApiService.fetchBoundEntries(sameScaffoldIds));
          }

          if (stereoisomersIds) {
            validIdsArray.push(this.aggregatedApiService.fetchBoundEntries(stereoisomersIds));
          }

          return forkJoin(validIdsArray);
        }),
        map(([similarLigandBoundEntriesArray, sameScaffoldBoundEntriesArray, stereoisomersBoundEntriesArray]) => {
          this.unfilteredSimilarLigandsGrid = this.similarLigands().map((similarLigand) => ({
            chem_comp_id: similarLigand.chem_comp_id,
            name: similarLigand.name,
            similarity_score: similarLigand.similarity_score,
            substructure_match: similarLigand.substructure_match,
            bound_entries: similarLigandBoundEntriesArray?.[similarLigand.chem_comp_id],
          }));
          this.similarLigandsGrid = this.unfilteredSimilarLigandsGrid;
          this.setUpPagination('similarligand');

          this.unfilteredSameScaffoldGrid = this.sameScaffolds().map((sameScaffolds) => ({
            chem_comp_id: sameScaffolds.chem_comp_id,
            name: sameScaffolds.name,
            similarity_score: sameScaffolds.similarity_score,
            substructure_match: sameScaffolds.substructure_match,
            bound_entries: sameScaffoldBoundEntriesArray?.[sameScaffolds.chem_comp_id],
          }));
          this.sameScaffoldGrid = this.unfilteredSameScaffoldGrid;
          this.setUpPagination('samescaffold');

          this.unfilteredStereoisomers = this.stereoisomers().map((stereoisomer) => ({
            chem_comp_id: stereoisomer.chem_comp_id,
            name: stereoisomer.name,
            bound_entries: stereoisomersBoundEntriesArray?.[stereoisomer.chem_comp_id],
          }));
          this.stereoisomersGrid = this.unfilteredStereoisomers;
          this.sameScaffoldPageSizeOptions.update((options) => [...options, 5, 10, 15, 20]);
          this.similarLigandPageSizeOptions.update((options) => [...options, 5, 10, 15, 20]);
          this.stereoisomersPageSizeOptions.update((options) => [...options, 5, 10, 15, 20]);

          this.setUpPagination('stereoisomers');
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.sameScaffoldTerm.valueChanges
      .pipe(
        map((searchQuery: string | null) => {
          if (searchQuery) {
            return this.filterItemsBySearchQuery(searchQuery, this.unfilteredSameScaffoldGrid);
          } else {
            return this.unfilteredSameScaffoldGrid;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: any) => {
        this.sameScaffoldGrid = data;
        this.setUpPagination('samescaffold');
      });

    this.sameLigandsTerm.valueChanges
      .pipe(
        map((searchQuery: string | null) => {
          if (searchQuery) {
            return this.filterItemsBySearchQuery(searchQuery, this.unfilteredSimilarLigandsGrid);
          } else {
            return this.unfilteredSimilarLigandsGrid;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: any) => {
        this.similarLigandsGrid = data;
        this.setUpPagination('similarligand');
      });

    this.stereoisomerTerm.valueChanges
      .pipe(
        map((searchQuery: string | null) => {
          if (searchQuery) {
            return this.filterItemsBySearchQuery(searchQuery, this.unfilteredStereoisomers);
          } else {
            return this.unfilteredStereoisomers;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: any) => {
        this.stereoisomersGrid = data;
        this.setUpPagination('stereoisomers');
      });

    combineLatest([
      this.similarityFrom.valueChanges.pipe(startWith(this.similarityFrom.value)),
      this.similarityTo.valueChanges.pipe(startWith(this.similarityTo.value)),
    ])
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

  private filterItemsBySearchQuery(searchQuery: string, items: any[]): any[] {
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
        this.sameScaffoldPageSizeOptions.update((options) => [...new Set([...options, this.sameScaffoldpageLength])]);
        this.sameScaffoldPage = this.filtSameScaffoldGrid.slice(0, this.sameScaffoldpageSize);
        break;
      case 'similarligand':
        this.filtSimilarLigandsGrid = this.similarLigandsGrid;
        this.similarLigandpageLength = this.filtSimilarLigandsGrid.length;
        this.similarLigandPageSizeOptions.update((options) => [...new Set([...options, this.similarLigandpageLength])]);
        this.similarLigandsPage = this.filtSimilarLigandsGrid.slice(0, this.similarLigandpageSize);
        break;
      case 'stereoisomers':
        this.filtStereoisomersGrid = this.stereoisomersGrid;
        this.stereoisomerspageLength = this.filtStereoisomersGrid.length;
        this.stereoisomersPageSizeOptions.update((options) => [...new Set([...options, this.stereoisomerspageLength])]);
        this.stereoisomersPage = this.filtStereoisomersGrid.slice(0, this.stereoisomerspageSize);
        break;
    }
  }

  public downloadJSON(): void {
    this.ligandUtilService.downloadJSON(this.relatedLigand, 'related-ligands');
    this.googleAnalyticsService.logClickEvents('download_related_ligands', 'Related Ligands', 'download_ligands', 'related_ligands');
  }
}
