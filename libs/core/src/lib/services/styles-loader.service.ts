import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StyleLoaderService {
  private loadedStyles: Set<string> = new Set();

  public loadStyle(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedStyles.has(href)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;

      link.onload = () => {
        this.loadedStyles.add(href);
        resolve();
      };
      link.onerror = () => reject(`Failed to load stylesheet: ${href}`);

      document.head.appendChild(link);
    });
  }
}
