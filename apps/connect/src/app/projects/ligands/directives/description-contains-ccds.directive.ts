/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */

import { Directive, Input, ElementRef, Renderer2, inject, SimpleChanges, OnChanges } from '@angular/core';

@Directive({
  selector: '[ccds]',
  standalone: true,
})
export class CCDsDirective implements OnChanges {
  @Input() subcomponentOccurrences!: Record<string, number>;

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngOnChanges(changes: SimpleChanges) {
    const subcomponentOccurrences = changes['subcomponentOccurrences']?.currentValue;

    const occurrences = Object.keys(subcomponentOccurrences).join(', ');

    this.renderer.appendChild(this.el.nativeElement, occurrences);
  }
}
