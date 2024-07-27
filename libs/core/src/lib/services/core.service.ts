import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  public parseAndRenderXML(renderer: Renderer2, xmlString: string, container: HTMLDivElement) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const figElements = xmlDoc.querySelectorAll('fig');

    figElements.forEach((figElement) => {
      this.renderFigElement(renderer, figElement, container);
    });
  }

  private renderFigElement(renderer: Renderer2, figElement: Element, container: HTMLDivElement) {
    // Create and append figure element
    const figure = renderer.createElement('figure');
    renderer.setAttribute(figure, 'id', figElement.getAttribute('id') || '');
    renderer.addClass(figure, 'splide__slide');
    renderer.appendChild(container, figure);

    // Create and append image
    const graphic = figElement.querySelector('graphic');
    if (graphic) {
      const img = renderer.createElement('img');
      const cover = renderer.createElement('div');
      renderer.addClass(cover, 'image-cover');
      const href = 'https://europepmc.org' + graphic.getAttribute('href') || '';
      renderer.setAttribute(img, 'src', href);
      renderer.setAttribute(img, 'alt', figElement.querySelector('name')?.textContent || '');
      renderer.appendChild(cover, img);
      renderer.appendChild(figure, cover);
    }

    // Create and append label
    const label = renderer.createElement('figcaption');
    label.textContent = figElement.querySelector('label')?.textContent || '';
    renderer.appendChild(figure, label);

    // Create and append caption
    const caption = renderer.createElement('figcaption');
    const captionTitle = figElement.querySelector('caption title');
    const captionBody = figElement.querySelector('caption body');

    if (captionTitle) {
      const title = renderer.createElement('h3');
      title.innerHTML = captionTitle.innerHTML; // Use innerHTML to preserve formatting
      renderer.appendChild(caption, title);
    }

    if (captionBody) {
      captionBody.childNodes.forEach((node) => {
        const clonedNode = node.cloneNode(true);
        renderer.appendChild(caption, clonedNode);
      });
    }

    renderer.appendChild(figure, caption);
  }
}
