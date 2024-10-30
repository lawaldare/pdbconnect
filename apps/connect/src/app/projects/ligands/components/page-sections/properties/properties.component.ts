import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LigandProperty } from '../../../data-models/description.model';
import { NameValueComponent } from '../../section-components/name-value/name-value.component';
import { LigandUtilService } from '../../../ligand-util.service';
import { GoogleAnalyticsService } from '@pdbc/core';
import { LigandStoreState } from '../../../store/ligand.model';
import { Store } from '@ngrx/store';
import { LigandSelectors } from '../../../store/ligand.selectors';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pdbc-properties',
  standalone: true,
  imports: [CommonModule, NameValueComponent],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent implements OnInit {
  public molProperties: LigandProperty[] = [];
  public confProperties: LigandProperty[] = [];
  public ringProperties: LigandProperty[] = [];
  public surfProperties: LigandProperty[] = [];
  public funProperties: LigandProperty[] = [];
  public stereoProperties: LigandProperty[] = [];
  private propertiesToJSON!: Record<string, any[]>; // eslint-disable-line @typescript-eslint/no-explicit-any

  private readonly ligandUtilService = inject(LigandUtilService);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly globalStore = inject(Store<LigandStoreState>);

  ngOnInit() {
    this.globalStore
      .select(LigandSelectors.description)
      .pipe(
        map((description) => {
          const properties = description.properties;
          this.molProperties = [
            { name: 'Molecular weight', value: `${properties.exactmw.toFixed(1)} Da`, toolTip: 'Total mass of the molecule in Daltons' },
            {
              name: 'Labute accessible surface area',
              value: `${properties.labute_asa.toFixed(1)} &#8491; <sup>2</sup>`,
              toolTip: `Accessible surface area according to the Labute's definition`,
            },
            {
              name: 'Heavy atoms',
              value: `${properties.num_heavy_atoms.toFixed(0)}`,
              toolTip: 'Number of non-hydrogen atoms',
            },
            {
              name: 'Heteroatoms',
              value: `${properties.num_heteroatoms.toFixed(0)}`,
              toolTip: 'Number of non-oxygen and non-carbon atoms',
            },

            {
              name: 'Carbon SP3 value',
              value: `${properties.fraction_csp3.toFixed(1)}`,
              toolTip: 'Fraction of C atoms that are SP3 hybridized',
            },
            {
              name: 'Wildman-Crippen molar refractivity',
              value: `${properties.crippen_mr.toFixed(1)}`,
              toolTip: 'Wildman-Crippen molar refractivity is a common descriptor accounting for molecular size and polarizability',
            },
            {
              name: 'Wildman-Crippen Log P',
              value: `${properties.crippen_clog_p.toFixed(1)}`,
              toolTip: `Octanol/Water partition coefficient predicted using Wildman-Crippen method `,
            },
          ];

          this.confProperties = [
            {
              name: 'Rotatable bonds',
              value: `${properties.num_rotatable_bonds.toFixed(0)}`,
              toolTip: `Number of single bonds, not part of a ring bound to a nonterminal heavy atom`,
            },
          ];
          this.ringProperties = [
            {
              name: 'Aromatic rings',
              value: `${properties.num_aromatic_rings.toFixed(0)}`,
              toolTip: `Number of aromatic rings`,
            },
            {
              name: 'Rings',
              value: `${properties.num_rings.toFixed(0)}`,
              toolTip: `Number of rings`,
            },
            {
              name: 'Aliphatic rings',
              value: `${properties.num_aliphatic_rings.toFixed(0)}`,
              toolTip: `Number of aliphatic rings`,
            },
            {
              name: 'Heterocycles',
              value: `${properties.num_heterocycles.toFixed(0)}`,
              toolTip: `Number or rings with at least two different elements`,
            },
            {
              name: 'Saturated rings',
              value: `${properties.num_saturated_rings.toFixed(0)}`,
              toolTip: `Number of saturated rings`,
            },
            {
              name: 'Aromatic heterocycles',
              value: `${properties.num_aromatic_heterocycles.toFixed(0)}`,
              toolTip: `Number of aromatic heterocyles`,
            },
            {
              name: 'Saturated heterocycles',
              value: `${properties.num_saturated_heterocycles.toFixed(0)}`,
              toolTip: `Number of saturated heterocyles`,
            },
            {
              name: 'Aliphatic heterocycles',
              value: `${properties.num_aliphatic_heterocycles.toFixed(0)}`,
              toolTip: `Number of aliphatic heterocycles`,
            },
            {
              name: 'Spiro atoms',
              value: `${properties.num_spiro_atoms.toFixed(0)}`,
              toolTip: `Atoms shared between rings that share exactly one atom`,
            },
            {
              name: 'Bridgehead atoms',
              value: `${properties.num_bridgehead_atoms.toFixed(0)}`,
              toolTip: `Number of atoms shared between rings that share at least two bonds`,
            },
          ];
          this.surfProperties = [
            {
              name: 'Topological surface area',
              value: `${properties.tpsa.toFixed(1)}`,
              toolTip: `Topological surface area`,
            },
          ];
          this.funProperties = [
            {
              name: 'Hydrogen bond donors',
              value: `${properties.num_hbd.toFixed(0)}`,
              toolTip: `Number of hydrogen bond donors`,
            },
            {
              name: 'Hydrogen bond acceptors',
              value: `${properties.num_hba.toFixed(0)}`,
              toolTip: `Number of hydrogen bond acceptors`,
            },
            {
              name: 'Amide bonds',
              value: `${properties.num_amide_bonds.toFixed(0)}`,
              toolTip: `Number of amide bonds`,
            },
          ];
          this.stereoProperties = [
            {
              name: 'Stereocenters',
              value: `${properties.num_atom_stereo_centers.toFixed(0)}`,
              toolTip: `Number of atoms with four attachments different from each other`,
            },
          ];

          this.propertiesToJSON = {
            molProperties: [
              { name: 'Molecular weight', value: properties.exactmw.toFixed(1) },
              {
                name: 'Labute accessible surface area',
                value: properties.labute_asa,
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
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public downloadJSON(): void {
    this.ligandUtilService.downloadJSON(this.propertiesToJSON, 'physiochemical-properties');
    this.googleAnalyticsService.logClickEvents('download_physicochemical_properties', 'Download', 'download_properties', 'Physicochemical Properties');
  }
}
