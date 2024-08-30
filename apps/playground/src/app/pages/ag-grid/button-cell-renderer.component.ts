import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  standalone: true,
  template: `<button (click)="buttonClicked()">Push Me!</button>`,
})
export class CustomButtonComponent implements ICellRendererAngularComp {
  text!: string;

  agInit(params: ICellRendererParams): void {
    console.log(params);
    this.text = params.value;
  }
  refresh(params: ICellRendererParams) {
    return true;
  }
  buttonClicked() {
    alert(this.text);
  }
}
