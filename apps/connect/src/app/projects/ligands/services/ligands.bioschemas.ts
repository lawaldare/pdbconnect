import { EnvironmentInjector, inject, Injectable, Renderer2, runInInjectionContext } from '@angular/core';
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

  constructor(private environmentInjector: EnvironmentInjector) {}

  public buildBioschemasJSON(renderer: Renderer2): void {
    runInInjectionContext(this.environmentInjector, () => {
      const summary = toSignal(this.globalStore.select(LigandSelectors.summary));
      const structures = toSignal(this.globalStore.select(LigandSelectors.structures));
      const relatedLigands = toSignal(this.globalStore.select(LigandSelectors.relatedLigands).pipe(map((relatedLigands) => relatedLigands.similar_ligands)));
      const ligandId = toSignal(this.globalStore.select(LigandSelectors.ligandId));

      const JSON = {
        '@context': 'http://schema.org/',
        '@type': 'MolecularEntity',
        identifier: `https://identifiers.org/pdb.ligand:${ligandId()}`,
        name: ligandId(),
        description: '',
        molecularFormula: summary()?.formula,
        molecularWeight: `${summary()?.weight?.toFixed(2)} g/mol`,
        inChI: summary()?.inchi,
        inChIKey: summary()?.inchi_key,
        iupacName: summary()?.name,
        smiles: summary()?.smiles?.find((s: any) => s.program === 'OpenEye OEToolkits')?.name ?? '',
        alternateName: (summary()?.synonyms ?? []).map((synonym: any) => synonym.value),
        chemicalRole: (summary()?.functional_annotations ?? []).map((annotation: any) => annotation.name.split('-')[0]),
        url: `https://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/${ligandId()}`,
        hasRepresentation: {
          '@type': 'PropertyValue',
          propertyID: 'SMILES',
          value: summary()?.smiles?.find((s: any) => s.program === 'OpenEye OEToolkits')?.name ?? '',
        },
        image: `https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${ligandId()}_400.svg`,
        bioChemInteraction: structures()?.map((structure: any) => {
          return {
            '@type': 'BioChemEntity',
            name: structure.uniprot_id,
            description: structure.name,
            url: `https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/${structure.uniprot_id}`,
            identifier: `https://identifiers.org/uniprot:${structure.uniprot_id}`,
          };
        }),
        bioChemSimilarity: relatedLigands()?.map((ligand: any) => {
          return {
            '@type': 'BioChemEntity',
            name: ligand.chem_comp_id,
            description: ligand.name,
            url: `https://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/${ligand.chem_comp_id}`,
            identifier: `https://identifiers.org/pdb.ligand:${ligand.chem_comp_id}`,
          };
        }),
      };

      this.bioschemasService.setJsonLd(renderer, JSON);
    });
  }
}
