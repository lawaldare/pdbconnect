import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Molecule } from '../../models/molecule.model';
import { MaterialModule } from '@pdbc/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'pdbe-entry-macromolecules',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './entry-macromolecules.component.html',
  styleUrl: './entry-macromolecules.component.scss',
})
export class EntryMacromoleculesComponent {
  public readonly molecules = input.required<Molecule[]>();
  public readonly displayedColumns = ['name', 'length', 'theoritical_weight', 'expression_system', 'source_organism', 'gene_names'];
  public readonly dataSource = new MatTableDataSource(this.molecules());
}
