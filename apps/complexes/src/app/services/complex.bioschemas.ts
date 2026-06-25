/* eslint-disable @angular-eslint/prefer-inject */

import { effect, EnvironmentInjector, inject, Injectable, Renderer2, runInInjectionContext } from '@angular/core';
import { Store } from '@ngrx/store';
import { BioschemasService } from '@pdbc/core';
import { ComplexStoreState } from '../store/complex-store.model';
import { ComplexSelectors } from '../store/complex.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComplexInteraction, Participant } from '../models/complex-structure.model';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComplexBioschemasService {
  private readonly globalStore = inject(Store<ComplexStoreState>);
  private readonly bioschemasService = inject(BioschemasService);
  private readonly environmentInjector = inject(EnvironmentInjector);

  public setUpRenderedForBioschemas(renderer: Renderer2): void {
    this.buildProteinJsonLd(renderer);
    this.buildBreadcrumbJsonLd(renderer);
  }

  private buildProteinJsonLd(renderer: Renderer2): void {
    runInInjectionContext(this.environmentInjector, () => {
      const complexId = toSignal(this.globalStore.select(ComplexSelectors.complexId));
      const complexData = toSignal(this.globalStore.select(ComplexSelectors.complexData).pipe(filter(Boolean)));
      const complexLigands = toSignal(this.globalStore.select(ComplexSelectors.complexLigands));
      const superComplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.superComplexInteractions));

      effect(() => {
        const id = complexId();
        const complexLigandsValue = complexLigands();
        const superComplexInteractionsValue = superComplexInteractions();
        const complexDataValue = complexData();

        if (!id || !complexLigandsValue || !superComplexInteractionsValue || !complexDataValue) {
          return;
        }

        const participants = (complexDataValue.participants ?? []).map((participant: Participant) => {
          return {
            '@type': 'Protein',
            name: participant.name,
            identifier: participant.accession,
            description: `Occurs as ${participant.stoichiometry} ${participant.stoichiometry > 1 ? 'copies' : 'copy'} in complex ${id}.`,
          };
        });

        const superComplexes = (superComplexInteractionsValue ?? []).map((c: ComplexInteraction) => {
          return {
            '@type': 'Protein',
            name: c.name,
            identifier: c.pdb_complex_id,
            isPartOfBioChemEntity: [
              {
                '@type': 'Protein',
                name: complexDataValue.name,
                identifier: id,
              },
              {
                '@type': 'Protein',
                name: c?.additional_participants?.[0]?.name,
                identifier: c?.additional_participants?.[0]?.accession,
              },
            ],
          };
        });

        const ligands = (complexLigandsValue ?? []).map((ligand) => {
          return {
            '@type': 'MolecularEntity',
            name: ligand.name,
            identifier: ligand.ligandId,
            url: `https://www.ebi.ac.uk/pdbe/connect/chemicalCompound/show/${ligand.ligandId}`,
          };
        });

        const JSON = {
          '@context': 'https://schema.org/',
          '@type': 'Protein',
          '@id': `https://www.ebi.ac.uk/pdbe/connect/complex/${id}`,
          identifier: id,
          name: complexDataValue.name,
          'dct:conformsTo': 'https://bioschemas.org/profiles/Protein/0.11-RELEASE',
          url: `https://www.ebi.ac.uk/pdbe/connect/complex/${id}`,
          description: complexDataValue.name,
          additionalProperty: [
            {
              '@type': 'PropertyValue',
              name: 'Global symmetry',
              value: `${complexDataValue.symmetry?.type} (${complexDataValue.symmetry?.symbol})`,
            },
            {
              '@type': 'PropertyValue',
              propertyID: 'Oligomeric state',
              value: complexDataValue.oligomeric_state,
            },
          ],
          ...(participants.length > 0 && {
            hasBioChemEntityPart: participants,
          }),
          ...(superComplexes.length > 0 && {
            isPartOfBioChemEntity: superComplexes,
          }),
          ...(ligands.length > 0 && {
            bioChemInteraction: ligands,
          }),
        };
        this.bioschemasService.setJsonLd(renderer, JSON, 'complexes-structured-data');
      });
    });
  }

  private buildBreadcrumbJsonLd(renderer: Renderer2): void {
    runInInjectionContext(this.environmentInjector, () => {
      const complexId = toSignal(this.globalStore.select(ComplexSelectors.complexId));
      effect(() => {
        const id = complexId();

        if (!id) {
          return;
        }

        const JSON = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'PDBe',
              item: 'https://www.ebi.ac.uk/pdbe/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'PDBe-KB',
              item: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: `${id} in PDBe-KB Complexes`,
              item: `https://www.ebi.ac.uk/pdbe/pdbe-kb/complexes/${id}`,
            },
          ],
        };
        this.bioschemasService.setJsonLd(renderer, JSON, 'complexes-bread-crumb-list');
      });
    });
  }
}
