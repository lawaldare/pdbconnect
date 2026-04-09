import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwaggerUIBundle } from 'swagger-ui-dist';
import { SwaggerUIStandalonePreset } from 'swagger-ui-dist';
import { OpenApiPathSearchItem } from '../../models/openapi.model';
import { FetchDocsService } from '../../services/fetch-docs.service';

@Component({
  selector: 'pdbc-swagger-docs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swagger-docs.component.html',
  styleUrls: ['./swagger-docs.component.scss'],
})
export class SwaggerDocsComponent implements OnInit {
  @Input() jsonUrl = '';
  @Input() apiKeyValue?: string = undefined;
  @Input() hasSearch?: boolean = false;
  @Input() hasNav?: boolean = false;

  private readonly fetchDocsService = inject(FetchDocsService);

  private allEntries: OpenApiPathSearchItem[] = [];
  private totalEndpoints = 0;
  private counterElement: HTMLElement | null = null;

  async ngOnInit() {
    function HideInfoUrlPlugin() {
      return {
        components: {
          InfoUrl: function () {
            return null;
          },
        },
      };
    }

    // Start (Hacky): fix for deep linking
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    function fixSwaggerUrl(url: string | URL | null | undefined) {
      if (typeof url === 'string' && url.startsWith('#/')) {
        return window.location.pathname + url;
      }
      return url;
    }

    window.history.pushState = function (state, title, url) {
      return originalPushState.apply(this, [state, title, fixSwaggerUrl(url)]);
    };

    window.history.replaceState = function (state, title, url) {
      return originalReplaceState.apply(this, [state, title, fixSwaggerUrl(url)]);
    };
    // End fix for deep linking

    SwaggerUIBundle({
      url: this.jsonUrl,
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [SwaggerUIBundle['presets'].apis, SwaggerUIStandalonePreset],
      syntaxHighlight: {
        activate: true,
        theme: 'nord',
      },
      displayRequestDuration: true,
      defaultModelsExpandDepth: -1,
      plugins: [SwaggerUIBundle['plugins'].DownloadUrl, HideInfoUrlPlugin],
      layout: 'BaseLayout',
      requestInterceptor: (req) => {
        if ('method' in req) {
          const [urlPath, urlParams] = req.url.split('?');
          // Params need to be readded if they exist
          const apiUrl = urlParams ? `${urlPath}?${urlParams}` : urlPath;

          const queryParams = new URLSearchParams(urlParams);
          let newParams = undefined;
          if (this.apiKeyValue) {
            queryParams.set('key', this.apiKeyValue);

            newParams = queryParams.toString();
          }

          req.url = newParams ? `${apiUrl}?${newParams}` : apiUrl;
        }
        return req;
      },
    });

    const allItems = await this.fetchDocsService.fetchAndParseOpenApi(this.jsonUrl);
    this.allEntries = allItems;

    // Nav and Search implementation
    if (this.hasNav === true || this.hasSearch === true) {
      setTimeout(() => {
        this.initSwaggerSearch();
      }, 0);
    }
  }

  initSwaggerSearch(): void {
    const observer = new MutationObserver(() => {
      const container = document.querySelector('.scheme-container');

      if (!container) return;

      // prevent duplicate injection
      if (document.querySelector('.swagger-search-container')) return;

      observer.disconnect();
      if (this.hasNav) this.injectNavBar(container);
      if (this.hasSearch) this.injectSearchBar(container);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  injectNavBar(container: Element): void {
    const wrapper = document.createElement('div');
    wrapper.className = 'swagger-nav-container wrapper';
    wrapper.style.marginTop = '16px';
    wrapper.style.marginBottom = '16px';

    const title = document.createElement('h4');
    title.className = 'swagger-nav-title';
    title.textContent = 'API Categories';
    // title.style.fontSize = '14px';
    // title.style.fontWeight = '600';
    // title.style.marginBottom = '8px';
    title.style.color = '#3b4151';

    const nav = document.createElement('div');
    nav.className = 'swagger-nav-links';
    nav.style.display = 'flex';
    nav.style.flexWrap = 'wrap';
    nav.style.gap = '8px';

    const tags = [...new Set(this.allEntries.flatMap((entry) => entry.tags))];

    tags.forEach((tag) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'swagger-nav-link';
      button.textContent = tag;

      button.style.padding = '6px 12px';
      button.style.border = '1px solid #cfd6e0';
      // button.style.borderRadius = '16px';
      button.style.background = '#fff';
      button.style.color = '#3b4151';
      button.style.cursor = 'pointer';
      button.style.fontSize = '13px';
      button.style.fontWeight = '600';

      button.addEventListener('click', () => {
        const section = document.querySelector(`.opblock-tag[data-tag="${CSS.escape(tag)}"]`) as HTMLElement | null;
        if (!section) return;

        const header = section.querySelector('.opblock-tag') as HTMLElement | null;
        const isOpen = header?.getAttribute('data-is-open') === 'true';

        if (header && !isOpen) {
          header.click();
        }

        setTimeout(() => {
          section.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 50);
      });

      nav.appendChild(button);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(nav);

    container.appendChild(wrapper);
  }

  injectSearchBar(container: Element): void {
    const wrapper = document.createElement('div');
    wrapper.className = 'swagger-search-container wrapper';
    wrapper.style.marginTop = '16px';

    const title = document.createElement('h4');
    title.className = 'swagger-nav-title';
    title.textContent = 'Search API endpoints';
    // title.style.fontSize = '14px';
    // title.style.fontWeight = '600';
    // title.style.marginBottom = '8px';
    title.style.color = '#3b4151';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search endpoints...';
    input.className = 'swagger-search-input';
    input.style.width = '100%';
    input.style.maxWidth = '1440px';
    input.style.padding = '8px 12px';

    const allEndpoints = document.querySelectorAll('.opblock');
    this.totalEndpoints = allEndpoints.length;

    this.counterElement = document.createElement('div');
    this.counterElement.className = 'swagger-search-counter';
    this.counterElement.style.marginTop = '8px';
    this.counterElement.style.fontSize = '14px';
    this.counterElement.style.color = '#6b7280';

    this.updateCounter(this.totalEndpoints);

    input.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      this.filterSwagger(value);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(input);
    wrapper.appendChild(this.counterElement);

    container.appendChild(wrapper);
  }

  expandAllTags(): Promise<void> {
    return new Promise((resolve) => {
      const tagHeaders = document.querySelectorAll('.opblock-tag');

      tagHeaders.forEach((header) => {
        const isOpen = header.getAttribute('data-is-open');

        if (isOpen === 'false') {
          (header as HTMLElement).click();
        }
      });

      // wait until all are open
      this.waitUntilAllTagsOpen(resolve);
    });
  }

  private waitUntilAllTagsOpen(resolve: () => void): void {
    let attempts = 0;

    const check = () => {
      const sections = document.querySelectorAll('.opblock-tag');

      const allOpen = Array.from(sections).every((section) => section.getAttribute('data-is-open') === 'true');

      if (allOpen || attempts > 20) {
        resolve();
        return;
      }

      attempts++;
      requestAnimationFrame(check);
    };

    requestAnimationFrame(check);
  }

  filterSwagger(query: string): void {
    this.expandAllTags().then(() => {
      this.applyFilter(query);
    });
  }

  applyFilter(query: string): void {
    // ALWAYS EXPAND BEFORE SEARCHING
    this.expandAllTags();

    const normalized = query.toLowerCase().trim();

    const allTags = document.querySelectorAll('.opblock-tag-section');

    let totalVisible = 0;

    allTags.forEach((tagSection) => {
      const endpoints = tagSection.querySelectorAll('.opblock');

      let visibleCount = 0;

      endpoints.forEach((endpoint) => {
        const id = endpoint.getAttribute('id');
        const data = this.allEntries.filter((entry) => entry.id === id)[0];

        // const text = endpoint.textContent?.toLowerCase() || '';
        const text = data.searchText;

        const match = !normalized || text.includes(normalized);

        (endpoint as HTMLElement).style.display = match ? '' : 'none';

        if (match) {
          visibleCount++;
          totalVisible++;
        }
      });

      // hide tag if no visible endpoints
      (tagSection as HTMLElement).style.display = visibleCount > 0 ? '' : 'none';
    });

    this.updateCounter(totalVisible);
  }

  updateCounter(visible: number): void {
    if (!this.counterElement) return;

    this.counterElement.innerText = visible === this.totalEndpoints ? `${visible} endpoints` : `${visible} / ${this.totalEndpoints} endpoints`;
  }
}
