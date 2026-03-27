import { AfterViewInit, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { faqs, headerLogoMenuConfig, homePageUrls, ligandHomePageSeaderSearchConfig, quickLinks, slides } from '../../../ligand.constant';
import { HeaderLogoMenuConfig, MaterialModule } from '@pdbc/core';
import Splide from '@splidejs/splide';
import { Slide } from '../../../data-models/slide';

@Component({
  selector: 'pdbc-ligand-homepage',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent, MaterialModule],
  templateUrl: './ligand-homepage.component.html',
  styleUrl: './ligand-homepage.component.scss',
})
export class LigandHomepageComponent implements AfterViewInit {
  public readonly headerLogoMenuConfig = { ...headerLogoMenuConfig, urls: homePageUrls } as HeaderLogoMenuConfig;
  public readonly headerSearchConfig = ligandHomePageSeaderSearchConfig;
  public readonly links = signal<{ label: string; url: string }[]>(quickLinks);
  public readonly slides = signal<Slide[]>(slides);
  public readonly faqs = signal<{ title: string; content: string }[]>(faqs);

  ngAfterViewInit(): void {
    document.addEventListener('DOMContentLoaded', function () {
      const splide = new Splide('#key-features-slider', {
        perPage: 3,
        rewind: true,
        gap: 20,
        breakpoints: {
          991: {
            perPage: 2,
          },
          768: {
            perPage: 1,
          },
        },
      });

      splide.mount();
    });
  }

  public openQuickLink(link: { label: string; url: string }): void {
    window.open(link.url, '_blank');
  }
}
