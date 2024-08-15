/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */

import { Directive, Input, ElementRef, Renderer2, inject, SimpleChanges, OnChanges } from '@angular/core';

@Directive({
  selector: '[uniprotMapping]',
  standalone: true,
})
export class UniprotMappingDirective implements OnChanges {
  @Input() entityId!: number;
  @Input() uniprotMappings!: any;

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngOnChanges(changes: SimpleChanges) {
    const entityId = changes['entityId']?.currentValue;
    const uniprotMappings = changes['uniprotMappings']?.currentValue;

    if (entityId && Object.keys(uniprotMappings).length) {
      const key = this.getKeyByEntityId(uniprotMappings, entityId);

      if (key) {
        const keyUpdated = `Canonical: <a href="">${key}</a>`;

        const pCanonical = this.renderer.createElement('p');
        pCanonical.innerHTML = keyUpdated;
        this.renderer.appendChild(this.el.nativeElement, pCanonical);
      }

      const coverage = this.generateRandomNumber(40, 90);

      const pCoverage = this.renderer.createElement('p');
      pCoverage.innerHTML = coverage;
      this.renderer.appendChild(this.el.nativeElement, pCoverage);

      if (key) {
        const residue = this.getResidues(uniprotMappings[key]);

        const pResidue = this.renderer.createElement('p');
        pResidue.innerHTML = residue;
        this.renderer.appendChild(this.el.nativeElement, pResidue);
      }
    }
  }

  private getKeyByEntityId(data: any, entityId: number): string | null {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const mappings = data[key].mappings;

        for (const mapping of mappings) {
          if (mapping.entity_id === entityId) {
            return key;
          }
        }
      }
    }
    return null;
  }

  private generateRandomNumber(min: number, max: number): string {
    min = Math.ceil(min);
    max = Math.floor(max);
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    return `Coverage: ${result}%`;
  }

  private getResidues(data: any): string {
    const mapping = data.mappings[0];

    const start = mapping.start.residue_number;
    const end = mapping.end.residue_number;

    return `(${start}-${end}) residues`;
  }
}
