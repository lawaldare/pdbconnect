import { EnvironmentInjector, inject, Injectable, Renderer2, runInInjectionContext } from '@angular/core';
import { Store } from '@ngrx/store';
import { BioschemasService } from '@pdbc/core';
import { ComplexStoreState } from '../store/complex-store.model';
import { ComplexSelectors } from '../store/complex.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { Participant } from '../models/complex-structure.model';

@Injectable({
  providedIn: 'root',
})
export class LigandsBioschemasService {
  private readonly globalStore = inject(Store<ComplexStoreState>);
  private readonly bioschemasService = inject(BioschemasService);

  constructor(private environmentInjector: EnvironmentInjector) {}

  public buildBioschemasJSON(renderer: Renderer2): void {
    runInInjectionContext(this.environmentInjector, () => {
      const complexId = toSignal(this.globalStore.select(ComplexSelectors.complexId));
      const complexData = toSignal(this.globalStore.select(ComplexSelectors.complexData));
      const complexLigands = toSignal(this.globalStore.select(ComplexSelectors.complexLigands));

      const JSON = {
        '@context': 'http://schema.org/',
        '@type': 'Protein',
        '@id': `https://www.ebi.ac.uk/pdbe/connect/complex/${complexId()}`,
        identifier: complexId(),
        name: complexData()?.name,
        'dct:conformsTo': 'https://bioschemas.org/profiles/Protein/0.11-RELEASE',
        url: `https://www.ebi.ac.uk/pdbe/connect/complex/${complexId()}`,
        description: complexData()?.name,
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'Global symmetry',
            value: `${complexData()?.symmetry.type} (${complexData()?.symmetry.symbol})`,
          },
          {
            '@type': 'PropertyValue',
            propertyID: 'Oligomeric state',
            value: complexData()?.oligomeric_state,
          },
        ],
        hasBioChemEntityPart: complexData()?.participants.map((participant: Participant) => {
          return {
            '@type': 'Protein',
            name: participant.name,
            identifier: participant.accession,
            additionProperty: [
              {
                '@type': 'PropertyValue',
                propertyID: 'Stoichiometry',
                value: `${participant.stoichiometry} copies`,
              },
            ],
          };
        }),
        isPartOfBioChemEntity: complexData()?.supercomplexes.map((c: string) => {
          return {
            '@type': 'Protein',
            isPartOfBioChemEntity: `https://www.ebi.ac.uk/pdbe/connect/complex/${complexId()}`,
          };
        }),
      };

      this.bioschemasService.setJsonLd(renderer, JSON);
    });
  }
}
