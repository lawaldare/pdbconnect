/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'tooltip-dialog',
  templateUrl: './tooltip-dialog.component.html',
  styleUrls: ['./tooltip-dialog.component.css'],
})
export class TooltipDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}
}
