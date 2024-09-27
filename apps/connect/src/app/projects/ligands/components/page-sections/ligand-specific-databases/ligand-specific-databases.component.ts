import { Component, inject, input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossLink } from '../../../services/aggregated-api.service';
import { LigandSpecificDatabasesComponentFacade } from './ligand-specific-databases.facade';

export interface MappedCrossLink {
  resource: string;
  resourceIds: string[];
  description?: string;
  link?: string;
}

@Component({
  selector: 'pdbc-ligand-specific-databases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ligand-specific-databases.component.html',
  styleUrl: './ligand-specific-databases.component.scss',
})
export class LigandSpecificDatabasesComponent implements OnChanges {
  public crossLinks = input.required<CrossLink[]>();
  private readonly facade = inject(LigandSpecificDatabasesComponentFacade);
  public mappedCrossLinks = this.facade.crosslinks;
  private readonly unwantedDatabases = ['actor', 'nih', 'rxnorm', 'dailymed', 'pdbe', 'atlas'];

  public chembl: string | undefined;
  public chebi: string | undefined;
  public drugbank: string | undefined;
  public zinc: string | undefined;
  public pubchem: string | undefined;
  public bindingdb: string | undefined;
  public brenda: string | undefined;

  ngOnChanges(): void {
    this.facade.init(this.crossLinks());
    console.log('Mapped crosslinks:', this.mappedCrossLinks());
    this.chembl = this.crossLinks().find((link) => link.resource.toLowerCase() === 'ChEMBL'.toLowerCase())?.resource_id;
    this.chebi = this.crossLinks().find((link) => link.resource.toLowerCase() === 'ChEBI'.toLowerCase())?.resource_id;
    this.drugbank = this.crossLinks().find((link) => link.resource.toLowerCase() === 'DrugBank'.toLowerCase())?.resource_id;
    this.zinc = this.crossLinks().find((link) => link.resource.toLowerCase() === 'ZINC'.toLowerCase())?.resource_id;
    this.pubchem = this.crossLinks().find((link) => link.resource.toLowerCase() === 'PubChem'.toLowerCase())?.resource_id;
    this.bindingdb = this.crossLinks().find((link) => link.resource.toLowerCase() === 'BindingDb'.toLowerCase())?.resource_id;
    this.brenda = this.crossLinks().find((link) => link.resource.toLowerCase() === 'BRENDA'.toLowerCase())?.resource_id;
  }
}
