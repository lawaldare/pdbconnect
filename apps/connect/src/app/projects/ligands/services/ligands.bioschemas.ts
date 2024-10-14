import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LigandsBioschemasService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Set JSON-LD Microdata on the Document Body.
   *
   * @param renderer2             The Angular Renderer
   * @param data                  The data for the JSON-LD script
   * @returns                     Void
   */
  private setJsonLd(renderer: Renderer2, data: any): void {
    this.removeJsonLdScript(renderer);
    const script = renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = `${JSON.stringify(data)}`;
    script.setAttribute('class', 'structured-data');

    renderer.appendChild(this.document.body, script);
  }

  private removeJsonLdScript(renderer: Renderer2): void {
    const script = this.document.querySelector('.structured-data');
    if (script) {
      renderer.removeChild(this.document.body, script);
    }
  }

  public buildBioschemasJSON(renderer: Renderer2, data: Signal<any>): void {
    console.log('Building Bioschemas JSON:', data());
  }
}
