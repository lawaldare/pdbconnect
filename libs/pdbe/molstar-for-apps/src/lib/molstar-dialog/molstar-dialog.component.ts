import { AfterViewInit, Component, effect, ElementRef, Inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

declare let PDBeMolstarPlugin: any;

@Component({
  selector: 'lib-molstar-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './molstar-dialog.component.html',
  styleUrl: './molstar-dialog.component.scss',
})
export class MolstarDialogComponent implements AfterViewInit {
  private molstarViewInstance: any;

  public selections: { viewValue: string; value: string }[] = [];
  public selected = signal('');

  @ViewChild('viewContainer') viewContainer!: ElementRef;

  constructor(public dialogRef: MatDialogRef<MolstarDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    effect(() => {
      const updateParams = {
        customData: {
          url: this.selected(),
          format: 'pdb',
        },
        bgColor: { r: 255, g: 255, b: 255 },
      };

      this.molstarViewInstance.visual.update(updateParams);
    });
  }

  ngAfterViewInit(): void {
    this.molstarViewInstance = new PDBeMolstarPlugin();

    const container = this.viewContainer.nativeElement;

    const molstarParams = {
      lowPrecisionCoords: false,
      subscribeEvents: true,
      selectInteraction: false,
      visualStyle: 'ball-and-stick',
      bgColor: { r: 255, g: 255, b: 255 },
      customData: {
        url: this.dialogData.entryList[0],
        format: 'pdb',
      },
      isLandscape: false,
    };

    this.molstarViewInstance.render(container, molstarParams);

    this.selections = [
      {
        viewValue: 'Ideal Coordinates',
        value: this.dialogData.entryList[0],
      },
      {
        viewValue: 'Model Coordinates',
        value: this.dialogData.entryList[1],
      },
    ];
    this.selected.set(this.selections[0].value);
  }
}
