import { Component, OnInit, HostListener, AfterViewInit, signal, DestroyRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonLdService } from '../json-ld.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { HeaderJumbotronComponent } from '../header-jumbotron/header-jumbotron.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
import { HomeBookmarksComponent } from '../home-bookmarks/home-bookmarks.component';
import { KeyFeaturesListComponent } from '../key-features-list/key-features-list.component';
import { FaqsListComponent } from '../faqs-list/faqs-list.component';

declare const $: any;

@Component({
  selector: 'pdbc-app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [CommonModule, HeaderComponent, HeaderJumbotronComponent, NavTabsComponent, HomeBookmarksComponent, KeyFeaturesListComponent, FaqsListComponent],
})
export class HomePageComponent implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  public release_data_url = signal('assets/corporate-page/data/latest_release_data.json');
  public releaseDate = signal<string>('');
  public releaseHeader = signal<string>('');
  public releaseDescriptions = signal<string[]>([]);
  public releaseLink = signal<string>('');
  public jsonLdAdded = signal<boolean>(false);
  public readonly jsonLdData: any = {
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

  constructor(
    private httpClient: HttpClient,
    private jsonLdService: JsonLdService
  ) {
    if (!this.jsonLdAdded()) {
      this.jsonLdAdded.set(true);
      this.jsonLdService.insertSchema(this.jsonLdData);
    }
  }

  ngOnInit(): void {
    this.httpClient
      .get(this.release_data_url())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        this.releaseDate.set(data['date']);
        this.releaseHeader.set(data['header']);
        this.releaseDescriptions.update(() => data['descriptions']);
        this.releaseLink.set(data['link']);
      });
  }

  test() {
    console.log('his');
  }

  ngAfterViewInit() {
    $(document).foundation();
    $(document).foundationExtendEBI();
  }
}
