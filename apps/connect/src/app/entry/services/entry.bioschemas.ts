import { inject, Injectable, Renderer2 } from '@angular/core';
import { BioschemasService } from '@pdbc/core';
import { ProcessedSummary } from '../data-models/summary.model';
import { CitationDetail } from '../data-models/publication.model';

@Injectable({
  providedIn: 'root',
})
export class EntryBioschemasService {
  private readonly bioschemasService = inject(BioschemasService);

  public buildBioschemasJSONFromData(renderer: Renderer2, entryId?: string, summaryData?: ProcessedSummary, primaryPublication?: CitationDetail): void {
    const JSON = {
      '@context': 'http://schema.org/',
      '@type': 'Dataset',
      identifier: {
        '@id': `https://doi.org/10.2210/pdb/${entryId}/pdb`,
        '@type': 'PropertyValue',
        propertyID: 'https://registry.identifiers.org/registry.doi',
        value: `doi:10.2210/pdb/${entryId}/pdb`,
        url: `https://doi.org/10.2210/pdb/${entryId}/pdb`,
      },
      'dct:confromsTo': 'https://bioschemas.org/profiles/Dataset/1.0-RELEASE',
      name: summaryData?.entryTitle,
      description: summaryData?.entryTitle,
      url: `https://www.ebi.ac.uk/pdbe/entry/pdb/${entryId}`,
      datePublished: new Date(summaryData?.releaseDate ?? '').toISOString().split('T')[0],
      license: 'https://creativecommons.org/publicdomain/zero/1.0/',
      keywords: summaryData?.experimentalMethods.join(', '),
      ...(primaryPublication?.pubmed_id && {
        citation: {
          '@id': `https://identifiers.org/pubmed:${primaryPublication?.pubmed_id}`,
          '@type': 'ScholarlyArticle',
          headline: primaryPublication?.title,
          datePublished: primaryPublication?.journal_info?.year,
        },
      }),
      creator: {
        '@type': 'Organization',
        name: 'Protein Data Bank in Europe (PDBe)',
        url: 'https://www.ebi.ac.uk/pdbe',
      },
      publisher: {
        '@type': 'Organization',
        name: 'European Bioinformatics Institute (EMBL-EBI)',
        url: 'https://ebi.ac.uk/',
      },
      maintainer: {
        '@type': 'Organization',
        name: 'Protein Data Bank in Europe (PDBe)',
        url: 'https://www.ebi.ac.uk/pdbe',
      },
      includedInDataCatalog: {
        '@type': 'DataCatalog',
        name: 'Worldwide Protein Data Bank (WWPDB)',
        url: 'https://www.wwpdb.org/',
      },
      measurementTechnique: (summaryData?.experimentalMethods ?? []).length > 1 ? 'Hybrid' : summaryData?.experimentalMethods[0],
      distribution: {
        '@type': 'DataDownload',
        encodingFormat: 'application/cif',
        contentUrl: `https://www.ebi.ac.uk/pdbe/entry-files/${entryId}.cif`,
      },
      mainEntity: {
        '@type': 'BioChemEntity',
        name: summaryData?.entryTitle,
        identifier: entryId,
      },
      isAccessibleForFree: true,
    };

    this.bioschemasService.setJsonLd(renderer, JSON);
  }
}
