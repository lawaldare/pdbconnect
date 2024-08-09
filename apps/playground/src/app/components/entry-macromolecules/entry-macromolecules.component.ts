import { Component, effect, Input, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Molecule } from '../../models/molecule.model';
import { MaterialModule } from '@pdbc/core';
import { MatTableDataSource } from '@angular/material/table';
import { MoleculeTypePipe } from '../../pipe/molecule-type.pipe';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'pdbe-entry-macromolecules',
  standalone: true,
  imports: [CommonModule, MaterialModule, MoleculeTypePipe, ReactiveFormsModule],
  templateUrl: './entry-macromolecules.component.html',
  styleUrl: './entry-macromolecules.component.scss',
})
export class EntryMacromoleculesComponent implements OnChanges {
  @Input({ required: true }) molecules!: Molecule[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public readonly displayedColumns = ['name', 'length', 'theoretical_weight', 'expression_system', 'source_organism', 'gene_names'];

  public dataSource!: MatTableDataSource<Molecule, MatPaginator>;

  public filter = new FormControl('all');

  public moleculesUpdated = signal<Molecule[]>([]);

  constructor() {
    effect(() => {
      this.dataSource = new MatTableDataSource(this.moleculesUpdated());
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue = changes['molecules']?.currentValue;
    if (currentValue) {
      this.moleculesUpdated.update((molecules) => [...molecules, ...currentValue]);
    }
  }

  onChange(event: MatRadioChange) {
    const filterSelected = event.value;

    if (filterSelected === 'proteins') {
      const proteinMolecules = this.molecules.filter((mol) => mol.molecule_type === 'polypeptide(L)' || mol.molecule_type === 'polypeptide(R)');
      this.moleculesUpdated.update(() => proteinMolecules);
      return;
    }

    if (filterSelected === 'dna') {
      const dnaMolecules = this.molecules.filter(
        (mol) =>
          mol.molecule_type === 'polyribonucleotide' ||
          mol.molecule_type === 'polydeoxyribonucleotide' ||
          mol.molecule_type === 'polydeoxyribonucleotide/polyribonucleotide hybrid'
      );
      this.moleculesUpdated.update(() => dnaMolecules);
      return;
    }

    this.moleculesUpdated.update(() => this.molecules);
  }
}
