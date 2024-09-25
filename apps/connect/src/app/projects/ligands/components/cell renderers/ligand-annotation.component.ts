import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { MaterialModule } from '@pdbc/core';

@Component({
  standalone: true,
  imports: [CommonModule, ToolTipComponent, MaterialModule],
  template: `
    @if(value && value.length){ @for(type of value; track type){ @if(type === 'cofactor-like'){
    <p class="cofactor-like" matTooltipClass="complex-name-tooltip" [matTooltip]="cofactorTooltip" matTooltipPosition="above">Cofactor-like</p>

    } @if(type === 'drug-like'){
    <p class="drug-like" matTooltipClass="complex-name-tooltip" [matTooltip]="drugTooltip" matTooltipPosition="above">Drug-like</p>
    } @if(type === 'reactant-like'){
    <p class="reactant-like" matTooltipClass="complex-name-tooltip" [matTooltip]="reactantTooltip" matTooltipPosition="above">Reactant-like</p>
    } } } @else {
    <p class="unannotated" matTooltipClass="complex-name-tooltip" [matTooltip]="unannotatedTooltip" matTooltipPosition="above">Unannotated</p>
    }
  `,
  styleUrls: ['./renderer-styling.scss'],
})
export class LigandAnnotationRendererComponent implements ICellRendererAngularComp {
  public cofactorTooltip = `Using the PARITY method, ligands are initially compared to a template library of 27 cofactor classes. If they meet the similarity threshold, they are further compared to the representative molecule for the matched cofactor class. If the similarity score remains above the threshold and the ligand is found in a PDB entry with an approved EC number for the matched class, it is classified as cofactor-like; otherwise, it is flagged for manual annotation. For more information, please refer to: https://doi.org/10.1093/bioinformatics/btz115.`;
  public drugTooltip = `Drug-like molecules are annotated by mapping to the DrugBank database (https://go.drugbank.com/). Ligands bound to PDB structures of pharmacologically active targets listed in DrugBank are classified as drug-like.`;
  public reactantTooltip = `Reactants are annotated based on mapping to the Rhea database (https://www.rhea-db.org/), an expert-curated resource that uses the ChEBI ontology to describe reaction participants and their structures. For each reaction in Rhea, we map all associated PDB structures based on the protein (UniProt accession) that catalyses the reaction. Using the PARITY method, we then compare the bound ligands in these PDB structures to ChEBI compounds involved in the reaction, annotating those with a minimum similarity score of 0.7 as reactant-like.`;
  public unannotatedTooltip = `The functional role of these ligands has not yet been annotated.`;
  // Init Cell Value
  public value!: string[];
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    return true;
  }
}
