import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhysChemProperties, LigandProperty } from '../../../data-models/description.model';
import { NameValueComponent } from '../../section-components/name-value/name-value.component';

@Component({
  selector: 'pdbc-properties',
  standalone: true,
  imports: [CommonModule, NameValueComponent],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesComponent implements OnChanges {
  @Input() properties!: PhysChemProperties;

  public molProperties: LigandProperty[] = [];
  public confProperties: LigandProperty[] = [];
  public ringProperties: LigandProperty[] = [];
  public surfProperties: LigandProperty[] = [];
  public funProperties: LigandProperty[] = [];
  public stereoProperties: LigandProperty[] = [];
  private propertiesToJSON!: Record<string, any[]>; // eslint-disable-line @typescript-eslint/no-explicit-any

  ngOnChanges() {
    this.molProperties = [
      { name: 'Molecular weight', value: `${this.properties.exactmw} Da`, toolTip: 'Total mass of the molecule in Daltons' },
      {
        name: 'Labute accessible surface area',
        value: `${this.properties.labute_asa} &#8491; <sup>2</sup>`,
        toolTip: `Accessible surface area according to the Labute's definition`,
      },
      {
        name: 'Heavy atoms',
        value: `${this.properties.num_heavy_atoms}`,
        toolTip: 'Number of non-hydrogen atoms',
      },
      {
        name: 'Heteroatoms',
        value: `${this.properties.num_heteroatoms}`,
        toolTip: 'Number of non-oxygen and non-carbon atoms',
      },

      {
        name: 'Carbon SP3 value',
        value: `${this.properties.fraction_csp3}`,
        toolTip: 'Fraction of C atoms that are SP3 hybridized',
      },
      {
        name: 'Wildman-Crippen molar refractivity',
        value: `${this.properties.crippen_mr}`,
        toolTip: 'Wildman-Crippen molar refractivity is a common descriptor accounting for molecular size and polarizability',
      },
      {
        name: 'Wildman-Crippen Log P',
        value: `${this.properties.crippen_clog_p}`,
        toolTip: `Octanol/Water partition coefficient predicted using Wildman-Crippen method `,
      },
    ];

    this.confProperties = [
      {
        name: 'Rotatable bonds',
        value: `${this.properties.num_rotatable_bonds}`,
        toolTip: `Number of single bonds, not part of a ring bound to a nonterminal heavy atom`,
      },
    ];
    this.ringProperties = [
      {
        name: 'Aromatic Rings',
        value: `${this.properties.num_aromatic_rings}`,
        toolTip: `Number of aromatic rings`,
      },
      {
        name: 'Rings',
        value: `${this.properties.num_rings}`,
        toolTip: `Number of rings`,
      },
      {
        name: 'Aliphatic rings',
        value: `${this.properties.num_aliphatic_rings}`,
        toolTip: `Number of aliphatic rings`,
      },
      {
        name: 'Heterocycles',
        value: `${this.properties.num_heterocycles}`,
        toolTip: `Number or rings with at least two different elements`,
      },
      {
        name: 'Saturated rings',
        value: `${this.properties.num_saturated_rings}`,
        toolTip: `Number of saturated rings`,
      },
      {
        name: 'Aromatic heterocycles',
        value: `${this.properties.num_aromatic_heterocycles}`,
        toolTip: `Number of aromatic heterocyles`,
      },
      {
        name: 'Saturated heterocycles',
        value: `${this.properties.num_saturated_heterocycles}`,
        toolTip: `Number of saturated heterocyles`,
      },
      {
        name: 'Aliphatic heterocycles',
        value: `${this.properties.num_aliphatic_heterocycles}`,
        toolTip: `Number of aliphatic heterocycles`,
      },
      {
        name: 'Spiro atoms',
        value: `${this.properties.num_spiro_atoms}`,
        toolTip: `Atoms shared between rings that share exactly one atom`,
      },
      {
        name: 'Bridgehead atoms',
        value: `${this.properties.num_bridgehead_atoms}`,
        toolTip: `Number of atoms shared between rings that share at least two bonds`,
      },
    ];
    this.surfProperties = [
      {
        name: 'Topological surface area',
        value: `${this.properties.tpsa}`,
        toolTip: `Topological surface area`,
      },
    ];
    this.funProperties = [
      {
        name: 'Hydrogen bond donors',
        value: `${this.properties.num_hbd}`,
        toolTip: `Number of hydrogen bond donors`,
      },
      {
        name: 'Hydrogen bond',
        value: `${this.properties.num_hba}`,
        toolTip: `Number of hydrogen bond acceptors`,
      },
      {
        name: 'Amide bonds',
        value: `${this.properties.num_amide_bonds}`,
        toolTip: `Number of amide bonds`,
      },
    ];
    this.stereoProperties = [
      {
        name: 'Stereocenters',
        value: `${this.properties.num_atom_stereo_centers}`,
        toolTip: `Number of atoms with four attachments different from each other`,
      },
    ];

    this.propertiesToJSON = {
      molProperties: [
        { name: 'Molecular weight', value: this.properties.exactmw },
        {
          name: 'Labute accessible surface area',
          value: this.properties.labute_asa,
        },
        ...this.molProperties.slice(2).map((c) => {
          return {
            name: c.name,
            value: c.value,
          };
        }),
      ],
      confProperties: [
        ...this.confProperties.map((c) => {
          return {
            name: c.name,
            value: c.value,
          };
        }),
      ],
      ringProperties: [
        ...this.ringProperties.map((c) => {
          return {
            name: c.name,
            value: c.value,
          };
        }),
      ],
      surfProperties: [
        ...this.surfProperties.map((c) => {
          return {
            name: c.name,
            value: c.value,
          };
        }),
      ],
      funProperties: [
        ...this.funProperties.map((c) => {
          return {
            name: c.name,
            value: c.value,
          };
        }),
      ],
      stereoProperties: [
        ...this.stereoProperties.map((c) => {
          return {
            name: c.name,
            value: c.value,
          };
        }),
      ],
    };
  }

  public downloadJSON(): void {
    const blob = new Blob([JSON.stringify(this.propertiesToJSON, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'physiochemical-properties.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
