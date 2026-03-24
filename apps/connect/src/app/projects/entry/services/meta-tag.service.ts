import { DestroyRef, inject, Injectable, Renderer2, signal } from '@angular/core';
import { EntrySelectors } from '../store/entry.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title, Meta } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ENTRY_PAGES_LINKS } from '../entry-constant';
import { EntryStoreState } from '../store/entry-store.model';
import { environment } from '../../../../environments/environment';
import { ProcessedSummary } from '../data-models/summary.model';

@Injectable({
  providedIn: 'root',
})
export class MetaTagService {
  private isTitleAndMetaProcessed = signal(false);

  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly globalStore = inject(Store<EntryStoreState>);
  private entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  public buildMetaTagsFromSummaryData(renderer: Renderer2, summaryData: ProcessedSummary): void {
    if (this.isTitleAndMetaProcessed() === false) {
      const titleAndDescription = `PDB ${this.entryId()}: ${summaryData.entryTitle} | Protein Data Bank in Europe - PDBe`;
      this.titleService.setTitle(titleAndDescription);
      this.metaService.addTag({ name: 'description', content: titleAndDescription });
      this.metaService.addTag({ name: 'author', content: 'Protein Data Bank in Europe - PDBe' });
      this.metaService.addTag({ name: 'email', content: 'pdbegroup@gmail.com' });
      this.metaService.addTag({ name: 'Distribution', content: 'Global' });
      this.metaService.addTag({ name: 'Rating', content: 'General' });

      this.metaService.addTag({ property: 'og:title', content: `PDB: ${this.entryId()} | Protein Data Bank in Europe - PDBe` });
      this.metaService.addTag({ property: 'og:description', content: `Entry title: "${summaryData.entryTitle}"` });
      this.metaService.addTag({ property: 'og:url', content: `${environment.baseUrl}pdbe/entry/pdb/${this.entryId()}` });
      this.metaService.addTag({
        property: 'og:image',
        content: `https://www.ebi.ac.uk/pdbe/static/entry/${this.entryId()}_deposited_chain_front_image-800x800.png`,
      });
      this.metaService.addTag({ property: 'og:image:alt', content: `PDBe ${this.entryId()} Structure` });
      this.metaService.addTag({ property: 'og:type', content: 'website' });
      this.metaService.addTag({ property: 'og:locale', content: 'en_GB' });
      this.metaService.addTag({ property: 'og:site_name', content: 'PDBe Entry Pages' });

      this.metaService.addTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.metaService.addTag({ name: 'twitter:title', content: titleAndDescription });
      this.metaService.addTag({ name: 'twitter:description', content: titleAndDescription });
      this.metaService.addTag({ name: 'twitter:url', content: `${environment.baseUrl}pdbe/entry/pdb/${this.entryId()}` });
      this.metaService.addTag({
        name: 'twitter:image',
        content: `https://www.ebi.ac.uk/pdbe/static/entry/${this.entryId()}_deposited_chain_front_image-800x800.png`,
      });
      this.metaService.addTag({ name: 'twitter:image:alt', content: `PDBe ${this.entryId()} Structure` });
      this.metaService.addTag({ name: 'twitter:site', content: `PDBeurope` });

      for (const linkObj of ENTRY_PAGES_LINKS) {
        const linkEl = renderer.createElement('link');
        renderer.setAttribute(linkEl, 'rel', linkObj.rel);
        renderer.setAttribute(linkEl, 'type', linkObj.type);
        renderer.setAttribute(linkEl, 'href', linkObj.href);
        if (linkObj.sizes) renderer.setAttribute(linkEl, 'sizes', linkObj.sizes!);
        if (linkObj.title) renderer.setAttribute(linkEl, 'title', linkObj.title!);
        renderer.appendChild(document.head, linkEl);
      }
      this.isTitleAndMetaProcessed.set(true);
    }
  }
}
