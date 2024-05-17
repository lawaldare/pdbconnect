import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedLigand, SimilarLigand, SameScaffold } from '../../../data-models/related-ligands.model';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { LigandGridComponent } from '../ligand-grid/ligand-grid.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'pdbc-related-ligands',
  standalone: true,
  imports: [CommonModule, LigandGridComponent, MatPaginator],
  templateUrl: './related-ligands.component.html',
  styleUrl: './related-ligands.component.scss',
})
export class RelatedLigandsComponent implements OnInit {
  @Input() ligandId?: string;
  searchLogo = '/assets/images/Search.svg';
  similarLigands: SimilarLigand[] = [];
  similarLigandsPage: SimilarLigand[] = [];
  sameScaffolds: SameScaffold[] = [];
  pageIndex = 0;
  pageSize = 6;
  pageSizeOptions = [6, 12, 18];

  dataSource = new MatTableDataSource<RelatedLigand>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private aggregatedApiService: AggregatedApiService) {}

  // filterSimilarLigands(minSim: number, maxSim: number) {
  //   return this.similarLigands.filter((x: SimilarLigand) => {
  //     x.similarity_score >= minSim && x.similarity_score <= maxSim;
  //   });
  // }

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.similarLigandsPage = this.similarLigands.slice(this.pageIndex, this.pageSize);
  }

  ngOnInit() {
    if (this.ligandId) {
      this.aggregatedApiService.fetchRelatedLigands(this.ligandId).subscribe((relatedLigand: RelatedLigand) => {
        this.similarLigands = relatedLigand['similar_ligands'];
        this.sameScaffolds = relatedLigand['same_scaffold'];
      });
    }
  }
}
