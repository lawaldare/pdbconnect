import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BioschemasService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Set JSON-LD Microdata on the Document Body.
   *
   * @param renderer2             The Angular Renderer
   * @param data                  The data for the JSON-LD script
   * @returns                     Void
   */
  public setJsonLd(renderer: Renderer2, data: any, className: string): void {
    this.removeJsonLdScript(renderer, className);
    const script = renderer.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    script.setAttribute('class', className);
    renderer.appendChild(this.document.head, script);
  }

  private removeJsonLdScript(renderer: Renderer2, className: string): void {
    const scripts = this.document.querySelectorAll(`.${className}`);

    scripts.forEach((script) => {
      renderer.removeChild(this.document.head, script);
    });
  }

  public insertSchema(schema: Record<string, any>): void {
    const className = 'structured-data';
    let script: any;
    let shouldAppend = false;
    if (this.document.head.getElementsByClassName(className).length) {
      script = this.document.head.getElementsByClassName(className)[0];
    } else {
      script = this.document.createElement('script');
      shouldAppend = true;
    }
    script.setAttribute('class', className);
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    if (shouldAppend) {
      this.document.head.appendChild(script);
    }
  }
}
