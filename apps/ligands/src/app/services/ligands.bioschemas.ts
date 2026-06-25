import { effect, EnvironmentInjector, inject, Injectable, Renderer2, runInInjectionContext } from '@angular/core';
import { LigandStoreState } from '../store/ligand-store.model';
import { Store } from '@ngrx/store';
import { LigandSelectors } from '../store/ligand.selectors';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { BioschemasService } from '@pdbc/core';

@Injectable({
  providedIn: 'root',
})
export class LigandsBioschemasService {
  private readonly globalStore = inject(Store<LigandStoreState>);
  private readonly bioschemasService = inject(BioschemasService);
  private readonly environmentInjector = inject(EnvironmentInjector);

  public setUpRenderedForBioschemas(renderer: Renderer2): void {
    this.buildMolecularEntityJsonLd(renderer);
    this.buildBreadcrumbJsonLd(renderer);
  }

  private buildMolecularEntityJsonLd(renderer: Renderer2): void {
    runInInjectionContext(this.environmentInjector, () => {
      const summary = toSignal(this.globalStore.select(LigandSelectors.summary));
      const structures = toSignal(this.globalStore.select(LigandSelectors.structures));
      const relatedLigands = toSignal(this.globalStore.select(LigandSelectors.relatedLigands).pipe(map((relatedLigands) => relatedLigands.similar_ligands)));
      const ligandId = toSignal(this.globalStore.select(LigandSelectors.ligandId));

      effect(() => {
        const s = summary();
        const st = structures();
        const rl = relatedLigands();
        const id = ligandId();

        if (!s || !st || !rl || !id) {
          return;
        }

        const JSON = {
          '@context': 'https://schema.org/',
          '@type': 'MolecularEntity',
          identifier: `https://identifiers.org/pdb.ligand:${id}`,
          name: id,
          description: '',
          molecularFormula: s.formula,
          molecularWeight: `${s.weight?.toFixed(2)} g/mol`,
          inChI: s.inchi,
          inChIKey: s.inchi_key,
          iupacName: s.name,
          smiles: s.smiles?.find((s: any) => s.program === 'OpenEye OEToolkits')?.name ?? '',
          alternateName: (s.synonyms ?? []).map((synonym: any) => synonym.value),
          chemicalRole: (s.functional_annotations ?? []).map((annotation: any) => annotation.name.split('-')[0]),
          url: `https://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/${id}`,
          hasRepresentation: {
            '@type': 'PropertyValue',
            propertyID: 'SMILES',
            value: (s.smiles ?? []).find((s: any) => s.program === 'OpenEye OEToolkits')?.name ?? '',
          },
          image: `https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${id}_400.svg`,
          bioChemInteraction: (st ?? []).map((structure: any) => {
            return {
              '@type': 'BioChemEntity',
              name: structure.uniprot_id,
              description: structure.name,
              url: `https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/${structure.uniprot_id}`,
              identifier: `https://identifiers.org/uniprot:${structure.uniprot_id}`,
            };
          }),
          bioChemSimilarity: (rl ?? []).map((ligand: any) => {
            return {
              '@type': 'BioChemEntity',
              name: ligand.chem_comp_id,
              description: ligand.name,
              url: `https://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/${ligand.chem_comp_id}`,
              identifier: `https://identifiers.org/pdb.ligand:${ligand.chem_comp_id}`,
            };
          }),
        };
        this.bioschemasService.setJsonLd(renderer, JSON, 'ligands-structured-data');
      });
    });
  }

  private buildBreadcrumbJsonLd(renderer: Renderer2): void {
    runInInjectionContext(this.environmentInjector, () => {
      const ligandId = toSignal(this.globalStore.select(LigandSelectors.ligandId));

      effect(() => {
        const id = ligandId();

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
              name: `${id} in PDBeChem | PDBe-KB Ligands`,
              item: `https://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/${id}`,
            },
          ],
        };
        this.bioschemasService.setJsonLd(renderer, JSON, 'ligands-bread-crumb-list');
      });
    });
  }
}
