/* eslint-disable @angular-eslint/prefer-inject */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  public update(config: { title: string; description: string; canonicalUrl: string }) {
    this.title.setTitle(config.title);

    this.meta.updateTag({
      name: 'description',
      content: config.description,
    });

    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', config.canonicalUrl);
  }
}
