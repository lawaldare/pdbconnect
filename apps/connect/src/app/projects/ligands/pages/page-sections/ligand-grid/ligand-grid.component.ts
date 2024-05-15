import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimilarLigand, BoundEntries } from '../../../data-models/related-ligands.model';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { Depiction } from '../../../data-models/structure.model';

@Component({
  selector: 'pdbc-ligand-grid',
  standalone: true,
  imports: [CommonModule, PdbeLinkButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ligand-grid.component.html',
  styleUrl: './ligand-grid.component.scss',
})
export class LigandGridComponent implements OnInit, AfterViewInit {
  @Input() ligand: SimilarLigand = {
    chem_comp_id: '',
    name: '',
    similarity_score: 0,
    substructure_match: [],
  };
  ligandUrl = '';
  boundEntryLabel = '';
  boundProteinLabel = '';

  @ViewChild('ligandImg', { read: ElementRef }) ligandImgContainer!: ElementRef;
  constructor(private aggregatedApiService: AggregatedApiService, private renderer: Renderer2) {}

  renderLigandImg(ligandId: string) {
    const ligandImg = this.ligandImgContainer.nativeElement;
    this.aggregatedApiService.fetchDepiction(ligandId).subscribe((depiction: Depiction) => {
      this.renderer.setProperty(ligandImg, 'depiction', depiction);
      this.renderer.setProperty(ligandImg, 'highlightSubstructure', this.ligand.substructure_match);
    });
  }

  ngOnInit() {
    this.ligandUrl = `/pdbe/pdbe-kb/ligands/${this.ligand.chem_comp_id}`;
    this.aggregatedApiService.fetchBoundEntries(this.ligand.chem_comp_id).subscribe((boundEntries: BoundEntries) => {
      const numBoundEntries = boundEntries[this.ligand.chem_comp_id].length;
      const boundEntryLabelSuffix = numBoundEntries <= 1 ? 'PDB Entry' : 'PDB Entries';
      this.boundEntryLabel = `${numBoundEntries} ${boundEntryLabelSuffix}`;
    });
  }

  ngAfterViewInit() {
    this.renderLigandImg(this.ligand.chem_comp_id);
  }
}
