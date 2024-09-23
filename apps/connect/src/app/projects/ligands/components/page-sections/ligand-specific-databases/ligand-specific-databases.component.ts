import { Component, input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossLink } from '../../../services/aggregated-api.service';

@Component({
  selector: 'pdbc-ligand-specific-databases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ligand-specific-databases.component.html',
  styleUrl: './ligand-specific-databases.component.scss',
})
export class LigandSpecificDatabasesComponent implements OnChanges {
  public crossLinks = input.required<CrossLink[]>();

  public chembl: string | undefined;
  public chebi: string | undefined;
  public drugbank: string | undefined;
  public zinc: string | undefined;
  public pubchem: string | undefined;
  public bindingdb: string | undefined;
  public brenda: string | undefined;

  ngOnChanges(): void {
    console.log('CrossLinks updated:', this.crossLinks());
    this.chembl = this.crossLinks().find((link) => link.resource.toLowerCase() === 'ChEMBL'.toLowerCase())?.resource_id;
    this.chebi = this.crossLinks().find((link) => link.resource.toLowerCase() === 'ChEBI'.toLowerCase())?.resource_id;
    this.drugbank = this.crossLinks().find((link) => link.resource.toLowerCase() === 'DrugBank'.toLowerCase())?.resource_id;
    this.zinc = this.crossLinks().find((link) => link.resource.toLowerCase() === 'ZINC'.toLowerCase())?.resource_id;
    this.pubchem = this.crossLinks().find((link) => link.resource.toLowerCase() === 'PubChem'.toLowerCase())?.resource_id;
    this.bindingdb = this.crossLinks().find((link) => link.resource.toLowerCase() === 'BindingDb'.toLowerCase())?.resource_id;
    this.brenda = this.crossLinks().find((link) => link.resource.toLowerCase() === 'BRENDA'.toLowerCase())?.resource_id;
  }
}
