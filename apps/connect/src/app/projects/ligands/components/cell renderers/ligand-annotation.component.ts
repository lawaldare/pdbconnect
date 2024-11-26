import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { cofactorTooltip, drugTooltip, reactantTooltip, unannotatedTooltip } from '../../ligand.constant';

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule],
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
  public cofactorTooltip = cofactorTooltip;
  public drugTooltip = drugTooltip;
  public reactantTooltip = reactantTooltip;
  public unannotatedTooltip = unannotatedTooltip;
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
