import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '@pdbc/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';

/** Human-friendly name from atom interactions.
 * This is not exhaustive (e.g. 'OE' in 1og5).
 * Use `standardizeInteractionType` instead if you can. */
export const INTX_NAME_STANDARDIZER = {
  clash: 'Covalent clash',
  covalent: 'Covalent',
  vdw_clash: 'Van der Waals clash',
  vdw: 'Van der Waals',
  hbond: 'Hydrogen bond',
  xbond: 'Halogen bond',
  ionic: 'Ionic',
  metal_complex: 'Metal complex',
  aromatic: 'Aromatic',
  FF: 'Plane-Plane',
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
  weak_polar: 'Weak polar',
  weak_hbond: 'Weak hydrogen bond',
};

type InteractionType = keyof typeof INTX_NAME_STANDARDIZER;

/** Return human-friendly name for atom interaction type, e.g. 'hbond' -> 'Hydrogen bond'.
 * Return the original name if not found in the list of known interaction types, e.g. 'OE' -> 'OE' (in 1og5). */
export function standardizeInteractionType(interactionTypeName: string): string {
  return INTX_NAME_STANDARDIZER[interactionTypeName as InteractionType] ?? interactionTypeName;
}

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <ul>
      @for (type of value; track type) {
        <li>{{ type }}</li>
      }
    </ul>
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
    this.value = types.map(standardizeInteractionType);
  }
}
