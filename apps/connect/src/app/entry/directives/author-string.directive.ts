/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */

import { Directive, Input, SimpleChanges, OnChanges, ElementRef, inject, Renderer2 } from '@angular/core';
import { UtilService } from '@pdbc/core';

@Directive({
  selector: '[authorsString]',
  standalone: true,
})
export class AuthorsStringDirective implements OnChanges {
  @Input() authors!: string;
  public readonly renderer = inject(Renderer2);
  public readonly el = inject(ElementRef);
  private readonly util = inject(UtilService);

  ngOnChanges(changes: SimpleChanges) {
    const authors = changes['authors']?.currentValue;

    const authorsArray = authors?.split('.,').map((author: string) => author.trim().replace(',', '')) ?? [];

    for (const text of authorsArray) {
      const a = this.renderer.createElement('a');
      a.textContent = authorsArray.indexOf(text) !== authorsArray.length - 1 ? `${text}, ` : `${text}`;
      a.href = this.util.generateSortedQueryURL(text, 'q_entry_authors');
      this.renderer.setAttribute(a, 'target', '_blank');
      this.renderer.appendChild(this.el.nativeElement, a);
      this.renderer.setAttribute(a, 'style', 'margin-right:5px;');
    }
  }
}
