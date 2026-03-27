/* eslint-disable @angular-eslint/prefer-inject */

import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { BioschemasService } from '@pdbc/core';

@Injectable({
  providedIn: 'root',
})
export class CorporatePagesBioschemasService {
  private readonly bioschemasService = inject(BioschemasService);

  constructor(private environmentInjector: EnvironmentInjector) {}

  public buildBioschemasJSON(): void {
    runInInjectionContext(this.environmentInjector, () => {
      const JSON = {
        '@context': 'https://schema.org/',
        '@type': 'DataCatalog',
        '@id': 'https://pdbe-kb.org/#DataCatalog',
        'http://purl.org/dc/terms/conformsTo': {
          '@type': 'CreativeWork',
          '@id': 'https://bioschemas.org/profiles/DataCatalog/0.3-RELEASE-2019_07_01',
        },
        name: 'PDBe-KB',
        description:
          'PDBe-KB is an open, collaborative consortium for the integration and enrichment of 3D-structure data and functional annotations to enable basic and translational research.',
        url: 'https://pdbe-kb.org',
        keywords: ['PDBe-KB', 'structural biology', 'structural bioinformatics', 'molecular structures', 'annotations'],
        provider: [
          {
            '@type': 'Organization',
            '@id': 'https://www.ebi.ac.uk/#Organization',
            name: 'European Bioinformatics Institute',
            url: 'https://www.ebi.ac.uk/',
          },
        ],
        dateCreated: '2019-06',
        dateModified: '2022-12',
        citation: {
          '@type': 'ScholarlyArticle',
          '@id': 'https://doi.org/10.1093/nar/gkab988',
          name: 'PDBe-KB: collaboratively defining the biological context of structural data',
          url: 'https://doi.org/10.1093/nar/gkab988',
          sameAs: ['https://academic.oup.com/nar/article/50/D1/D534/6424755', 'https://pubmed.ncbi.nlm.nih.gov/34755867/'],
        },
        license: {
          '@type': 'CreativeWork',
          '@id': 'https://creativecommons.org/licenses/by/4.0/',
          name: 'Creative Commons CC4 Attribution',
          url: 'https://creativecommons.org/licenses/by/4.0/',
        },
        dataset: {
          '@type': 'Dataset',
          '@id': 'https://pdbe-kb.org/#2022-12',
          name: 'PDBe-KB',
          description:
            'PDBe-KB is an open, collaborative consortium for the integration and enrichment of 3D-structure data and functional annotations to enable basic and translational research.',
          url: 'https://pdbe-kb.org',
          identifier: 'https://pdbe-kb.org/#2022-12',
          keywords: ['PDBe-KB', 'structural biology', 'structural bioinformatics', 'molecular structures', 'annotations'],
          'http://purl.org/dc/terms/conformsTo': {
            '@type': 'CreativeWork',
            '@id': 'https://bioschemas.org/profiles/Dataset/0.3-RELEASE-2019_06_14',
          },
          includedInDataCatalog: {
            '@id': 'https://pdbe-kb.org/#DataCatalog',
          },
          creator: {
            '@id': 'https://www.ebi.ac.uk/#Organization',
          },
          license: {
            '@type': 'CreativeWork',
            '@id': 'https://creativecommons.org/licenses/by/4.0/',
            name: 'Creative Commons CC4 Attribution',
            url: 'https://creativecommons.org/licenses/by/4.0/',
          },
        },
      };

      this.bioschemasService.insertSchema(JSON);
    });
  }
}
