/* eslint-disable @angular-eslint/no-input-rename */
import { Directive, Input, ElementRef, OnInit, Renderer2, inject, SimpleChanges, OnChanges, DestroyRef } from '@angular/core';
import { PlaygroundService } from '../services/playground.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';

@Directive({
  selector: '[uniprotMapping]',
  standalone: true,
})
export class UniprotMappingDirective implements OnInit, OnChanges {
  @Input() entityId!: number;
  @Input() uniprotMappings!: any;

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly playgroundService = inject(PlaygroundService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes['entityId'].currentValue);
    // console.log(changes['uniprotMappings'].currentValue);
    const entityId = changes['entityId'].currentValue;
    const uniprotMappings = changes['uniprotMappings'].currentValue;

    const key = this.getKeyByEntityId(uniprotMappings, entityId);

    if (key) {
      const keyUpdated = `Canonical: <span>${key}</span>`;

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

  private getKeyByEntityId(data: any, entityId: number): string | null {
    // Iterate over each key in the data object
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Access the mappings array for the current key
        const mappings = data[key].mappings;

        // Check each mapping object for the specified entity_id
        for (const mapping of mappings) {
          if (mapping.entity_id === entityId) {
            // Return the key if entity_id matches
            return key;
          }
        }
      }
    }

    // Return null if no matching entity_id is found
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
