import { AfterViewInit, Component, computed, ElementRef, Inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

declare let PDBeMolstarPlugin: any;

@Component({
  selector: 'lib-molstar-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './molstar-dialog.component.html',
  styleUrl: './molstar-dialog.component.scss',
})
export class MolstarDialogComponent implements AfterViewInit {
  private molstarViewInstance: any;

  public selections: { viewValue: string; value: string }[] = [];
  public selected = signal('');
  public selectedControl = computed(() => new FormControl(this.selected(), { nonNullable: true }));

  private selectionConfig = {};

  @ViewChild('viewContainer') viewContainer!: ElementRef;

  constructor(public dialogRef: MatDialogRef<MolstarDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    this.selectionConfig = {
      data: [
        {
          struct_asym_id: 'A',
          atoms: dialogData.atoms ?? [],
          color: { r: 255, g: 255, b: 0 },
          focus: true,
        },
      ],
      // nonSelectedColor: { r: 130, g: 130, b: 130 },
    };
  }

  ngAfterViewInit(): void {
    this.molstarViewInstance = new PDBeMolstarPlugin();

    const container = this.viewContainer.nativeElement;

    const entryList = [
      `https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${this.dialogData.moleculeId}_ideal.pdb`,
      `https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${this.dialogData.moleculeId}_model.pdb`,
    ];

    const molstarParams = {
      moleculeId: this.dialogData.moleculeId,
      lowPrecisionCoords: false,
      subscribeEvents: true,
      selectInteraction: false,
      visualStyle: 'ball-and-stick',
      bgColor: { r: 255, g: 255, b: 255 },
      customData: {
        url: entryList[1],
        format: 'pdb',
      },
      isLandscape: false,
      selection: this.selectionConfig,
    };

    this.molstarViewInstance.render(container, molstarParams);

    this.selections = [
      {
        viewValue: 'Ideal Coordinates',
        value: entryList[0],
      },
      {
        viewValue: 'Model Coordinates',
        value: entryList[1],
      },
    ];
    this.selected.set(this.selections[1].value);
  }

  public onSelectionChange(event: MatSelectChange) {
    const updateParams = {
      customData: {
        url: event.value,
        format: 'pdb',
      },
      selection: this.selectionConfig,
      bgColor: { r: 255, g: 255, b: 255 },
    };
    this.molstarViewInstance.visual.update(updateParams);
  }
}
