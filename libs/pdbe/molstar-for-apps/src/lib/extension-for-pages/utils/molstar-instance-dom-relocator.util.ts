import { inject, Renderer2 } from '@angular/core';
import { firstValueFrom, timer } from 'rxjs';

export class MolstarInstanceDOMRelocator {
  isInsideParent = true;
  molstarViewerElement: HTMLElement;
  molstarParentElement: HTMLElement;
  renderer = inject(Renderer2);

  constructor(molstarViewerElement: HTMLElement, molstarParentElement: HTMLElement) {
    this.molstarViewerElement = molstarViewerElement;
    this.molstarParentElement = molstarParentElement;
  }

  moveMolstarViewerFromParent(newMolstarContainer: HTMLElement) {
    if (!this.isInsideParent) {
      this.sendMolstarViewerToParent();
    }
    // Move the molstar WebGL container into the child component
    this.renderer.appendChild(newMolstarContainer, this.molstarViewerElement);
    // Add a delay to ensure synchronicity
    this.isInsideParent = false;
  }

  sendMolstarViewerToParent() {
    if (this.isInsideParent) {
      return;
    }
    // Move the molstar WebGL container back to the parent component
    this.renderer.appendChild(this.molstarParentElement, this.molstarViewerElement);
    this.isInsideParent = true;
  }
}
