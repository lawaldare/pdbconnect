import { EnvironmentInjector, inject, Injectable, Renderer2, runInInjectionContext } from '@angular/core';
import { Store } from '@ngrx/store';
import { BioschemasService } from '@pdbc/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../store/entry-store.model';
import { EntrySelectors } from '../store/entry.selectors';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class EntryBioschemasService {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly bioschemasService = inject(BioschemasService);

  constructor(private environmentInjector: EnvironmentInjector) {}

  public buildBioschemasJSON(renderer: Renderer2): void {
    runInInjectionContext(this.environmentInjector, () => {
      const entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
      const summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));
      const citation = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));

      setTimeout(() => {
        const JSON = {
          '@context': 'http://schema.org/',
          '@type': 'Dataset',
          identifier: {
            '@id': `https://doi.org/10.2210/pdb/${entryId()}/pdb`,
            '@type': 'PropertyValue',
            propertyID: 'https://registry.identifiers.org/registry.doi',
            value: `doi:10.2210/pdb/${entryId()}/pdb`,
            url: `https://doi.org/10.2210/pdb/${entryId()}/pdb`,
          },
          'dct:confromsTo': 'https://bioschemas.org/profiles/Dataset/1.0-RELEASE',
          name: summaryData()?.entryTitle,
          description: summaryData()?.entryTitle,
          url: `https://www.ebi.ac.uk/pdbe/entry/pdb/${entryId()}`,
          datePublished: moment(summaryData()?.releaseDate).format('YYYY-MM-DD'),
          license: 'https://creativecommons.org/publicdomain/zero/1.0/',
          keywords: summaryData()?.experimentalMethods.join(', '),
          citation: {
            '@id': `https://identifiers.org/pubmed:${citation()?.pubmed_id}`,
            '@type': 'ScholarlyArticle',
            headline: citation()?.title,
            datePublished: citation()?.journal_info?.year,
          },
          creator: {
            '@type': 'Organization',
            name: 'Protein Data Bank in Europe',
            url: 'https://www.ebi.ac.uk/pdbe',
          },
          publisher: {
            '@type': 'Organization',
            name: 'European Bioinformatics Institute (EMBL-EBI)',
            url: 'https://ebi.ac.uk/',
          },
          maintainer: {
            '@type': 'Organization',
            name: 'Protein Data Bank in Europe',
            url: 'https://www.ebi.ac.uk/pdbe',
          },
          includedInDataCatalog: {
            '@type': 'DataCatalog',
            name: 'Worldwide Protein Data Bank (WWPDB)',
            url: 'https://www.wwpdb.org/',
          },
          measurementTechnique: (summaryData()?.experimentalMethods ?? []).length > 1 ? 'Hybrid' : summaryData()?.experimentalMethods[0],
          distribution: {
            '@type': 'DataDownload',
            encodingFormat: 'application/cif',
            contentUrl: `https://www.ebi.ac.uk/pdbe/entry-files/${entryId()}.cif`,
          },
          mainEntity: {
            '@type': 'BioChemEntity',
            name: 'PropertyValue',
            identifier: entryId(),
          },
          isAccessibleForFree: true,
        };

        this.bioschemasService.setJsonLd(renderer, JSON);
      }, 2000);
    });
  }
}
