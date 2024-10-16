import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LigandsBioschemasService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Set JSON-LD Microdata on the Document Body.
   *
   * @param renderer2             The Angular Renderer
   * @param data                  The data for the JSON-LD script
   * @returns                     Void
   */
  private setJsonLd(renderer: Renderer2, data: any): void {
    this.removeJsonLdScript(renderer);
    const script = renderer.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    script.setAttribute('class', 'structured-data');

    renderer.appendChild(this.document.head, script);
  }

  private removeJsonLdScript(renderer: Renderer2): void {
    const script = this.document.querySelector('.structured-data');
    if (script) {
      renderer.removeChild(this.document.body, script);
    }
  }

  public buildBioschemasJSON(renderer: Renderer2, data: Signal<any>, ligandId: string): void {
    const JSON = {
      '@context': 'http://schema.org/',
      '@type': 'MolecularEntity',
      identifier: `https://identifiers.org/pdb.ligand:${ligandId}`,
      name: ligandId,
      description: '',
      molecularFormula: data().summary.formula,
      molecularWeight: `${data().summary.weight?.toFixed(2)} g/mol`,
      inChI: data().summary.inchi,
      inChIKey: data().summary.inchi_key,
      iupacName: data().summary.name,
      smiles: data().summary.smiles.find((s: any) => s.program === 'OpenEye OEToolkits')?.name ?? '',
      alternateName: data().summary.synonyms ?? [].map((synonym: any) => synonym.value),
      chemicalRole: data().summary.functional_annotations.map((annotation: any) => annotation.name.split('-')[0]),
      url: `https://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/${ligandId}`,
      hasRepresentation: {
        '@type': 'PropertyValue',
        propertyID: 'SMILES',
        value: data().summary.smiles.find((s: any) => s.program === 'OpenEye OEToolkits')?.name ?? '',
      },
      image: `https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${ligandId}_400.svg`,
      bioChemInteration: data().structures.map((structure: any) => {
        return {
          '@type': 'BioChemEntity',
          name: structure.uniprot_id,
          description: structure.name,
          url: `https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/${structure.uniprot_id}`,
          identifier: `https://identifiers.org/uniprot:${structure.uniprot_id}`,
        };
      }),
      bioChemSimilarity: data().similarLigands.map((ligand: any) => {
        return {
          '@type': 'BioChemEntity',
          name: ligand.chem_comp_id,
          description: ligand.name,
          url: `https://www.ebi.ac.uk/pdbe-srv/pdbechem/chemicalCompound/show/${ligand.chem_comp_id}`,
          identifier: `https://identifiers.org/pdb.ligand:${ligand.chem_comp_id}`,
        };
      }),
    };

    this.setJsonLd(renderer, JSON);
    console.log('Bioschemas JSON:', JSON);
  }
}
