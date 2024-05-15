import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedLigand } from '../../../data-models/related-ligands.model';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { LigandGridComponent } from '../ligand-grid/ligand-grid.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map } from 'rxjs';

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
  relatedLigand$?: Observable<RelatedLigand>;

  dataSource = new MatTableDataSource<RelatedLigand>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private aggregatedApiService: AggregatedApiService) {}

  // filterSimilarLigands(minSim: number, maxSim: number) {
  //   return this.similarLigands.filter((x: SimilarLigand) => {
  //     x.similarity_score >= minSim && x.similarity_score <= maxSim;
  //   });
  // }

  ngOnInit() {
    if (this.ligandId) {
      this.relatedLigand$ = this.aggregatedApiService.fetchRelatedLigands(this.ligandId);
    }
  }
}
