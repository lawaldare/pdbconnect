import { effect, EnvironmentInjector, inject, Injectable, PLATFORM_ID, Renderer2, runInInjectionContext } from '@angular/core';
import { BioschemasService } from '@pdbc/core';
import { EntryStoreState } from '../store/entry-store.model';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../store/entry.selectors';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class EntryBioschemasService {
  private readonly bioschemasService = inject(BioschemasService);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly platformId = inject(PLATFORM_ID);

  public setUpRenderedForBioschemas(renderer: Renderer2): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.buildDataSetJsonLd(renderer);
    this.buildBreadcrumbJsonLd(renderer);
  }
  private buildDataSetJsonLd(renderer: Renderer2): void {
    runInInjectionContext(this.environmentInjector, () => {
      const entryIdSignal = toSignal(this.globalStore.select(EntrySelectors.entryId));
      const summaryDataSignal = toSignal(this.globalStore.select(EntrySelectors.summaryData));
      const primaryPublicationSignal = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));

      effect(() => {
        const entryId = entryIdSignal();
        const summaryData = summaryDataSignal();
        const primaryPublication = primaryPublicationSignal();

        if (!entryId || !summaryData || !primaryPublication) {
          return;
        }

        const JSON = {
          '@context': 'https://schema.org/',
          '@type': 'Dataset',
          identifier: [
            {
              '@type': 'PropertyValue',
              propertyID: 'PDB',
              value: entryId,
              url: `https://www.ebi.ac.uk/pdbe/entry/pdb/${entryId}`,
            },
            {
              '@id': `https://doi.org/10.2210/pdb/${entryId}/pdb`,
              '@type': 'PropertyValue',
              propertyID: 'https://registry.identifiers.org/registry.doi',
              value: `doi:10.2210/pdb/${entryId}/pdb`,
              url: `https://doi.org/10.2210/pdb/${entryId}/pdb`,
            },
          ],
          'dct:conformsTo': 'https://bioschemas.org/profiles/Dataset/1.0-RELEASE',
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

        this.bioschemasService.setJsonLd(renderer, JSON, 'entry-structured-data');
      });
    });
  }

  private buildBreadcrumbJsonLd(renderer: Renderer2): void {
    runInInjectionContext(this.environmentInjector, () => {
      const entryIdSignal = toSignal(this.globalStore.select(EntrySelectors.entryId));

      effect(() => {
        const id = entryIdSignal();

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
              name: `${id} in PDBe Entry Pages`,
              item: `https://www.ebi.ac.uk/pdbe/entry/pdb/${id}`,
            },
          ],
        };
        this.bioschemasService.setJsonLd(renderer, JSON, 'entry-bread-crumb-list');
      });
    });
  }
}
