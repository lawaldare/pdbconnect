import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `@if(value){
    <span
      >@if(value.scientific_name){
      <i>{{ value.scientific_name }}</i>
      } @if(value.common_name){ ({{ value.common_name }}) }</span
    >
    }`,
  styleUrls: ['./renderer-styling.scss'],
})
export class SpeciesRendererComponent implements ICellRendererAngularComp {
  // Init Cell Value
  public value!: { scientific_name: string; common_name: string };
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    return true;
  }
}
