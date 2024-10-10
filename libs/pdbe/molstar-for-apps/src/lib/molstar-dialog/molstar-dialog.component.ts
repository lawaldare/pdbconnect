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
  caption?: string;
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
  private cells: any[] = [];

  public selections: { viewValue: string; value: string }[] = [];
  public selected = signal('');
  public selectedControl = computed(() => new FormControl(this.selected(), { nonNullable: true }));

  public selectedFrament = signal('');
  public selectedFragmentControl = computed(() => new FormControl(this.selectedFrament(), { nonNullable: true }));

  private selectionConfig = {};
  public fragments = signal<Fragment[]>([]);
  private atoms!: string[];
  public showFragmentOptions = signal<boolean>(false);

  private readonly highlightColor = { r: 249, g: 207, b: 59 };
  private readonly defaultColor = { r: 152, g: 152, b: 152 };

  public caption = signal<string>('');
  public count = signal<number>(0);

  private selectedFramentObject: Fragment | undefined;

  @ViewChild('viewContainer') viewContainer!: ElementRef;

  constructor(public dialogRef: MatDialogRef<MolstarDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    if (dialogData.fragments) {
      this.showFragmentOptions.set(true);
      this.fragments.update(() => {
        return dialogData.fragments().reduce(
          (acc: Fragment[], curr: Fragment) => {
            acc.push({
              ...curr,
              name: curr.name.toLocaleLowerCase().includes('murcko') ? 'Murcko scaffold highlighted' : `${curr.name} highlighted fragment`,
              caption: curr.name.toLocaleLowerCase().includes('murcko')
                ? `The Murco scaffold is highlighted in yellow in the PDB ligand ${this.dialogData.moleculeId}`
                : `The ${curr.name} fragment is highlighted in yellow in the PDB ligand ${this.dialogData.moleculeId}`,
            });
            return acc;
          },
          [{ name: 'Default View (no highlight)', atoms: [], descriptors: {}, caption: `PDB Ligand ${this.dialogData.moleculeId}` }]
        );
      });
      this.selectedFrament.set(this.fragments()[0].name);
      this.caption.set(this.fragments()[0].caption ?? '');
      this.atoms = this.fragments()[0].atoms.length ? this.fragments()[0].atoms[0] : [];
    } else {
      this.showFragmentOptions.set(false);
      this.atoms = dialogData.atoms;
    }

    this.selectionConfig = {
      data: [
        {
          struct_asym_id: 'A',
          atoms: this.atoms,
          color: this.atoms.length ? this.highlightColor : this.defaultColor,
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
      landscape: true,
      selection: this.selectionConfig,
      hideControls: true,
    };

    this.molstarViewInstance.render(container, molstarParams);
    this.molstarViewInstance.events.loadComplete.subscribe(() => {
      if (this.count() === 0 || this.selectedFramentObject?.name === 'Default View (no highlight)') {
        this.displayLabel();
      } else {
        this.removeLabel();
        this.cells = [];
      }
    });
  }

  private async displayLabel() {
    this.count.update((value) => value + 1);
    for (const structure of this.molstarViewInstance.plugin.managers.structure.hierarchy.current.structures) {
      for (const component of structure.components) {
        const sel = await this.molstarViewInstance.plugin.builders.structure.representation.addRepresentation(component.cell, {
          type: 'label',
          typeParams: { level: 'element', borderColor: 'black', sizeFactor: 1.5 },
        });
        this.cells.push(sel);
      }
    }
  }

  private removeLabel() {
    for (const cell of this.cells) {
      this.molstarViewInstance.plugin.build().delete(cell).commit();
    }
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
    this.selectedFramentObject = this.fragments().find((fragment) => fragment.name === event.value);

    if (this.selectedFramentObject?.caption) {
      this.caption.set(this.selectedFramentObject.caption);
    }

    this.selectionConfig = {
      data: [
        {
          struct_asym_id: 'A',
          atoms: this.selectedFramentObject?.atoms[0],
          color: this.selectedFramentObject?.atoms.length ? this.highlightColor : this.defaultColor,
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
