import { EnvironmentInjector, inject, Injectable, Renderer2, runInInjectionContext } from '@angular/core';
import { Store } from '@ngrx/store';
import { BioschemasService } from '@pdbc/core';
import { ComplexStoreState } from '../store/complex-store.model';
import { ComplexSelectors } from '../store/complex.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComplexInteraction, Participant } from '../models/complex-structure.model';

@Injectable({
  providedIn: 'root',
})
export class ComplexBioschemasService {
  private readonly globalStore = inject(Store<ComplexStoreState>);
  private readonly bioschemasService = inject(BioschemasService);

  constructor(private environmentInjector: EnvironmentInjector) {}

  public buildBioschemasJSON(renderer: Renderer2): void {
    runInInjectionContext(this.environmentInjector, () => {
      const complexId = toSignal(this.globalStore.select(ComplexSelectors.complexId));
      const complexData = toSignal(this.globalStore.select(ComplexSelectors.complexData));
      const complexLigands = toSignal(this.globalStore.select(ComplexSelectors.complexLigands));
      const superComplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.superComplexInteractions));

      setTimeout(() => {
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
              value: `${complexData()?.symmetry?.type} (${complexData()?.symmetry?.symbol})`,
            },
            {
              '@type': 'PropertyValue',
              propertyID: 'Oligomeric state',
              value: complexData()?.oligomeric_state,
            },
          ],
          hasBioChemEntityPart: complexData()?.participants?.map((participant: Participant) => {
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
          isPartOfBioChemEntity: superComplexInteractions()?.map((c: ComplexInteraction) => {
            return {
              '@type': 'Protein',
              name: c.name,
              identifier: c.pdb_complex_id,
              isPartOfBioChemEntity: [
                {
                  '@type': 'Protein',
                  name: complexData()?.name,
                  identifier: complexId(),
                },
                {
                  '@type': 'Protein',
                  name: c?.additional_participants?.[0]?.name,
                  identifier: c?.additional_participants?.[0]?.accession,
                },
              ],
            };
          }),
          bioChemInteraction: complexLigands()?.map((ligand) => {
            return {
              '@type': 'MolecularEntity',
              name: ligand.name,
              identifier: ligand.ligandId,
              url: `https://www.ebi.ac.uk/pdbe/connect/chemicalCompound/show/${ligand.ligandId}`,
            };
          }),
        };

        this.bioschemasService.setJsonLd(renderer, JSON);
      }, 2000);
    });
  }
}
