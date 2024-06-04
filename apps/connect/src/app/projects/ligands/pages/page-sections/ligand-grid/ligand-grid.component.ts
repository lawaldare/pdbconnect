import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LigandGrid } from '../../../data-models/related-ligands.model';
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
  @Input() ligand!: LigandGrid;
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
    if (this.ligand) {
      this.ligandUrl = `/pdbe/pdbe-kb/ligands/${this.ligand.chem_comp_id}`;
      const numBoundEntries = this.ligand.bound_entries.length;
      const boundEntryLabelSuffix = numBoundEntries <= 1 ? 'PDB Entry' : 'PDB Entries';
      this.boundEntryLabel = `${numBoundEntries} ${boundEntryLabelSuffix}`;
    }
  }

  ngAfterViewInit() {
    if (this.ligand) {
      this.renderLigandImg(this.ligand.chem_comp_id);
    }
  }
}
