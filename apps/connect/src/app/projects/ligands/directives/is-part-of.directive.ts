/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */

import { Directive, ElementRef, Renderer2, Input, OnChanges, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[libIsPartOf]',
  standalone: true,
})
export class IsPartOfDirective implements OnChanges {
  @Input() truncateTexts: string[] = [];
  @Input() limit = 60;

  constructor(private el: ElementRef, private renderer: Renderer2, private router: Router) {}

  @HostListener('scroll', ['$event'])
  onScroll() {
    const container = this.el.nativeElement;
    if (container.scrollTop === 0) {
      container.classList.remove('top-shadow');
      container.classList.add('bottom-shadow');
    } else {
      container.classList.add('top-shadow');
      container.classList.remove('bottom-shadow');
    }

    // Check if the container is at the bottom
    // if (container.scrollHeight - container.scrollTop >= container.clientHeight) {
    //   container.classList.remove('bottom-shadow');
    //   // container.classList.add('top-shadow');
    // } else {
    //   container.classList.add('bottom-shadow');
    // }
  }

  ngOnChanges(): void {
    this.init();
  }

  private init(): void {
    this.renderContent(this.truncateTexts);
    if (this.truncateTexts.length > 4) {
      this.el.nativeElement.classList.add('bottom-shadow');
    }
  }

  private renderContent(textArray: string[]): void {
    while (this.el.nativeElement.firstChild) {
      this.renderer.removeChild(this.el.nativeElement, this.el.nativeElement.firstChild);
    }
    for (const text of textArray) {
      const a = this.renderer.createElement('a');
      a.textContent = textArray.indexOf(text) !== textArray.length - 1 ? `${text} ` : `${text}.`;
      this.renderer.appendChild(this.el.nativeElement, a);
      this.renderer.setAttribute(a, 'style', 'margin-right:5px;');

      this.renderer.listen(a, 'click', (event) => {
        event.preventDefault();
        this.router.navigate([`/ligands/${text.trim()}`]);
      });
    }
  }
}
