/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */

import { Directive, ElementRef, Renderer2, Input, OnChanges } from '@angular/core';
import { Smile } from '../pipes/ligandsmiles.pipe';

@Directive({
  selector: '[ligandsmiles]',
  standalone: true,
})
export class LigandSmilesDirective implements OnChanges {
  @Input() smiles!: Smile[];
  @Input() isMainLigand = true;
  private truncateText = '';
  private limit = 60;
  private truncated = true;
  private fullText = '';
  private truncatedText = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(): void {
    this.init();
  }

  private init(): void {
    if (this.isMainLigand) {
      for (const smile of this.smiles) {
        if (smile.program === 'OpenEye OEToolkits') {
          this.truncateText = smile.name;
          break;
        }
      }
    } else {
      this.truncateText = this.smiles[0].name;
    }

    this.fullText = this.truncateText;
    this.truncatedText = this.truncateText.length > this.limit ? this.truncateText.substring(0, this.limit) + '...' : this.truncateText;
    this.renderer.setProperty(this.el.nativeElement, 'innerText', this.truncatedText);
    if (this.truncateText.trim().length > this.limit) {
      this.addShowMore('Show more');
    }
  }

  private addShowMore(text: string): void {
    const showMore = this.renderer.createElement('a');
    this.renderer.setAttribute(showMore, 'href', '#');
    this.renderer.setAttribute(showMore, 'style', 'color: #3B6FB6; border: none; text-decoration: none;');
    this.renderer.listen(showMore, 'click', (event) => this.toggleText(event));

    const showMoreText = this.renderer.createText(text);
    this.renderer.appendChild(showMore, showMoreText);

    const icon = this.renderer.createElement('i');
    this.renderer.addClass(icon, 'icon');
    this.renderer.addClass(icon, 'icon-common');
    this.renderer.addClass(icon, this.truncated ? 'icon-angle-down' : 'icon-angle-up'); // Toggle the icon classes
    this.renderer.setStyle(icon, 'margin-left', '5px'); // Add some spacing between the text and icon

    this.renderer.appendChild(showMore, icon);
    this.renderer.appendChild(this.el.nativeElement, showMore);
  }

  private toggleText(event: Event): void {
    event.preventDefault();
    this.truncated = !this.truncated;
    const displayText = this.truncated ? this.truncatedText : this.fullText;
    const showMoreText = this.truncated ? 'Show more' : 'Show less';
    this.renderer.setProperty(this.el.nativeElement, 'innerText', displayText);
    this.addShowMore(showMoreText);
  }
}
