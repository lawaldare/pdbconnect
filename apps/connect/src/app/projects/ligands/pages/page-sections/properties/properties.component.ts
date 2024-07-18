import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysChemProperties, LigandProperty } from '../../../data-models/description.model';
import { NameValueComponent } from '../../section-components/name-value/name-value.component';

@Component({
  selector: 'pdbc-properties',
  standalone: true,
  imports: [CommonModule, NameValueComponent],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent implements OnChanges {
  public molProperties: LigandProperty[] = [];
  public confProperties: LigandProperty[] = [];
  public ringProperties: LigandProperty[] = [];
  public surfProperties: LigandProperty[] = [];
  public funProperties: LigandProperty[] = [];
  public stereoProperties: LigandProperty[] = [];
  @Input() properties!: PhysChemProperties;

  ngOnChanges() {
    this.molProperties = [
      { name: 'Molecular weight', value: `${this.properties.exactmw} Da` },
      {
        name: 'Heavy atoms',
        value: `${this.properties.num_heavy_atoms}`,
      },
      {
        name: 'Heteroatoms',
        value: `${this.properties.num_heteroatoms}`,
      },
      {
        name: 'Labute accessible surface area',
        value: `${this.properties.labute_asa} &#8491; <sup>2</sup>`,
      },
      {
        name: 'Carbon SP3 value',
        value: `${this.properties.fraction_csp3}`,
      },
      {
        name: 'Wildman-Crippen molar refractivity',
        value: `${this.properties.crippen_mr}`,
      },
      {
        name: 'Wildman-Crippen Log P',
        value: `${this.properties.crippen_clog_p}`,
      },
    ];

    this.confProperties = [
      {
        name: 'Rotatable bonds',
        value: `${this.properties.num_rotatable_bonds}`,
      },
    ];
    this.ringProperties = [
      {
        name: 'Aromatic Rings',
        value: `${this.properties.num_aromatic_rings}`,
      },
      {
        name: 'Rings',
        value: `${this.properties.num_rings}`,
      },
      {
        name: 'Aliphatic rings',
        value: `${this.properties.num_aliphatic_rings}`,
      },
      {
        name: 'Heterocycles',
        value: `${this.properties.num_heterocycles}`,
      },
      {
        name: 'Saturated rings',
        value: `${this.properties.num_saturated_rings}`,
      },
      {
        name: 'Aromatic heterocycles',
        value: `${this.properties.num_aromatic_heterocycles}`,
      },
      {
        name: 'Saturated heterocycles',
        value: `${this.properties.num_saturated_heterocycles}`,
      },
      {
        name: 'Aliphatic heterocycles',
        value: `${this.properties.num_aliphatic_heterocycles}`,
      },
      {
        name: 'Spiro atoms',
        value: `${this.properties.num_spiro_atoms}`,
      },
      {
        name: 'Bridgehead atoms',
        value: `${this.properties.num_bridgehead_atoms}`,
      },
    ];
    this.surfProperties = [
      {
        name: 'Topological surface area',
        value: `${this.properties.tpsa}`,
      },
    ];
    this.funProperties = [
      {
        name: 'Hydrogen bond donors',
        value: `${this.properties.num_hbd}`,
      },
      {
        name: 'Hydrogen bond',
        value: `${this.properties.num_hba}`,
      },
      {
        name: 'Amide bonds',
        value: `${this.properties.num_amide_bonds}`,
      },
    ];
    this.stereoProperties = [
      {
        name: 'Stereocenters',
        value: `${this.properties.num_atom_stereo_centers}`,
      },
    ];
  }
}
