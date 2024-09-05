import { AfterViewInit, Component, computed, ElementRef, Inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

declare let PDBeMolstarPlugin: any;

export interface Fragment {
  name: string;
  atoms: string[][];
  descriptors: Descriptor;
}

export interface Descriptor {
  inchi: string;
  inchikey: string;
  smiles: string;
}

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

  public selectedFrament = signal('');
  public selectedFragmentControl = computed(() => new FormControl(this.selectedFrament(), { nonNullable: true }));

  private selectionConfig = {};
  public fragments = signal<Fragment[]>([]);
  private atoms!: string[];
  public showFragmentOptions = signal<boolean>(false);

  @ViewChild('viewContainer') viewContainer!: ElementRef;

  constructor(public dialogRef: MatDialogRef<MolstarDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    if (dialogData.fragments) {
      this.showFragmentOptions.set(true);
      this.fragments.update(() => dialogData.fragments());
      this.selectedFrament.set(this.fragments()[0].name);
      this.atoms = this.fragments()[0].atoms[0];
    } else {
      this.showFragmentOptions.set(false);
      this.atoms = dialogData.atoms;
    }

    this.selectionConfig = {
      data: [
        {
          struct_asym_id: 'A',
          atoms: this.atoms,
          color: { r: 249, g: 207, b: 59 },
        },
      ],
    };
  }

  ngAfterViewInit(): void {
    this.molstarViewInstance = new PDBeMolstarPlugin();

    const container = this.viewContainer.nativeElement;

    const entryList = [
      `https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${this.dialogData.moleculeId}_ideal.pdb`,
      `https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${this.dialogData.moleculeId}_model.pdb`,
    ];

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

    const molstarParams = {
      moleculeId: this.dialogData.moleculeId,
      lowPrecisionCoords: false,
      subscribeEvents: true,
      selectInteraction: false,
      visualStyle: 'ball-and-stick',
      bgColor: { r: 255, g: 255, b: 255 },
      customData: {
        url: this.selected(),
        format: 'pdb',
      },
      isLandscape: false,
      selection: this.selectionConfig,
    };

    this.molstarViewInstance.render(container, molstarParams);
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

  public onFragmentChange(event: MatSelectChange) {
    const selectedFrament = this.fragments().find((fragment) => fragment.name === event.value);
    this.selectionConfig = {
      data: [
        {
          struct_asym_id: 'A',
          atoms: selectedFrament?.atoms[0],
          color: { r: 249, g: 207, b: 59 },
        },
      ],
    };
    const updateParams = {
      customData: {
        url: this.selected(),
        format: 'pdb',
      },
      selection: this.selectionConfig,
      bgColor: { r: 255, g: 255, b: 255 },
    };
    this.molstarViewInstance.visual.update(updateParams);
  }
}
