import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class JsonLdService {
  static websiteSchema = (schemaData: any) => {
    return {
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
  };

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  insertSchema(schema: Record<string, any>, className = 'structured-data'): void {
    // 	let script;
    // 	let shouldAppend = false;
    // 	if (this._document.head.getElementsByClassName(className).length) {
    // 		script = this._document.head.getElementsByClassName(className)[0];
    // 	} else {
    // 		script = this._document.createElement('script');
    // 		shouldAppend = true;
    // 	}
    // 	script.setAttribute('class', className);
    // 	script.type = 'application/ld+json';
    // 	script.text = JSON.stringify(schema);
    // 	if (shouldAppend) {
    // 		this._document.head.appendChild(script);
    // 	}
  }
}
