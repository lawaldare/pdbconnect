/* eslint-disable @angular-eslint/prefer-inject */
import { DOCUMENT } from '@angular/common';
import { inject, Injectable, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  public update(config: { title: string; description: string; url: string }, renderer: Renderer2) {
    this.titleService.setTitle(config.title);

    // Set the window / crawler title
    this.titleService.setTitle(config.title);

    // Standard SEO Tags
    this.metaService.updateTag({ name: 'description', content: config.description });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });

    // Open Graph (Social Sharing / Slack / Teams Previews)
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    this.metaService.updateTag({ property: 'og:url', content: config.url });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");

    if (!link) {
      link = renderer.createElement('link');
      renderer.setAttribute(link, 'rel', 'canonical');
      renderer.appendChild(this.document.head, link);
    }

    renderer.setAttribute(link, 'href', config.url);
  }
}
