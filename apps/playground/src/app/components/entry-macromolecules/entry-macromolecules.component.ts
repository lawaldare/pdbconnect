import { Component, effect, Input, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Molecule } from '../../models/molecule.model';
import { MaterialModule } from '@pdbc/core';
import { MatTableDataSource } from '@angular/material/table';
import { MoleculeTypePipe } from '../../pipe/molecule-type.pipe';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { UniprotMappingDirective } from '../../directives/uniprot-mapping.directive';
import { SequenceDomainDirective } from '../../directives/sequence-domain.directives';
import { GeneDirective } from '../../directives/gene.directive';

@Component({
  selector: 'pdbe-entry-macromolecules',
  standalone: true,
  imports: [CommonModule, MaterialModule, MoleculeTypePipe, ReactiveFormsModule, UniprotMappingDirective, SequenceDomainDirective, GeneDirective],
  templateUrl: './entry-macromolecules.component.html',
  styleUrl: './entry-macromolecules.component.scss',
})
export class EntryMacromoleculesComponent implements OnChanges {
  @Input({ required: true }) molecules!: Molecule[];
  @Input({ required: true }) uniprotMapping!: any;
  @Input({ required: true }) interproMapping!: any;
  @Input({ required: true }) pfamMapping!: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public readonly displayedColumns = [
    'name',
    'length',
    'theoretical_weight',
    'expression_system',
    'uniprot_mapping',
    'source_organism',
    'gene_names',
    'sequence_domain',
  ];

  public dataSource!: MatTableDataSource<Molecule, MatPaginator>;

  public filter = new FormControl('all');

  public moleculesUpdated = signal<Molecule[]>([]);
  public uniprotMappingUpdated = signal<any>({});
  public interproMappingUpdated = signal<any>({});
  public pfamMappingUpdated = signal<any>({});

  constructor() {
    effect(() => {
      this.dataSource = new MatTableDataSource(this.moleculesUpdated());
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue = changes['molecules']?.currentValue;
    const currentUniprotMapping = changes['uniprotMapping']?.currentValue;
    const currentInterproMapping = changes['interproMapping']?.currentValue;
    const currentPfamMapping = changes['pfamMapping']?.currentValue;

    if (currentValue) {
      this.moleculesUpdated.update((molecules) => [...molecules, ...currentValue]);
    }

    if (currentUniprotMapping) {
      this.uniprotMappingUpdated.update(() => currentUniprotMapping);
    }

    if (currentInterproMapping) {
      this.interproMappingUpdated.update(() => currentInterproMapping);
    }

    if (currentPfamMapping) {
      this.pfamMappingUpdated.update(() => currentPfamMapping);
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
