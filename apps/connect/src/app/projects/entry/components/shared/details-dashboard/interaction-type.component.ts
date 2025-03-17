import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';

export const INTX_NAME_STANDARDIZER = {
  clash: 'Covalent clashes',
  covalent: 'Covalent',
  vdw_clash: 'Van der Waals clashes',
  vdw: 'Van der Waals',
  hbond: 'Hydrogen bonds',
  xbond: 'Halogen bonds',
  ionic: 'Ionic',
  metal_complex: 'Metal complex',
  aromatic: 'Aromatic',
  hydrophobic: 'Hydrophobic',
  carbonyl: 'Carbonyl',
  polar: 'Polar',
  CARBONPI: 'Carbon-pi',
  CATIONPI: 'Cation-pi',
  DONORPI: 'Hydrogen bond donor-pi',
  HALOGENPI: 'Halogen-pi',
  METSULPHURPI: 'Methionine sulphur-pi',
  plane_plane: 'Plane-Plane',
  AMIDEAMIDE: 'Amide-Amide',
  AMIDERING: 'Amide-Ring',
};

type InteractionType =
  | 'clash'
  | 'covalent'
  | 'vdw_clash'
  | 'vdw'
  | 'hbond'
  | 'xbond'
  | 'ionic'
  | 'metal_complex'
  | 'aromatic'
  | 'hydrophobic'
  | 'carbonyl'
  | 'polar'
  | 'CARBONPI'
  | 'CATIONPI'
  | 'DONORPI'
  | 'HALOGENPI'
  | 'METSULPHURPI'
  | 'plane_plane'
  | 'AMIDEAMIDE'
  | 'AMIDERING';

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    @for (type of value; track type) {
      <p>{{ type }}</p>
    }
  `,
  styleUrls: [],
})
export class InteractionTypeRendererComponent implements ICellRendererAngularComp {
  // Init Cell Value
  public value!: string[];
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.generateInteractionType(params.value);
    return true;
  }
  private generateInteractionType(types: string[]): void {
    this.value = types.map((type) => INTX_NAME_STANDARDIZER[type as InteractionType]);
  }
}
