/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */

import { Directive, Input, ElementRef, Renderer2, inject, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from '@pdbc/core';

@Directive({
  selector: '[ccds]',
  standalone: true,
})
export class CCDsDirective implements OnChanges {
  @Input() subcomponentOccurrences!: Record<string, number>;

  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  public readonly el = inject(ElementRef);
  public readonly renderer = inject(Renderer2);
  public readonly router = inject(Router);

  ngOnChanges(changes: SimpleChanges) {
    const subcomponentOccurrences = changes['subcomponentOccurrences']?.currentValue;

    const occurrences = Object.keys(subcomponentOccurrences);

    for (const text of occurrences) {
      const a = this.renderer.createElement('a');
      a.textContent = occurrences.indexOf(text) !== occurrences.length - 1 ? `${text}, ` : `${text}.`;
      this.renderer.appendChild(this.el.nativeElement, a);
      this.renderer.setAttribute(a, 'style', 'margin-right:5px;');

      this.renderer.listen(a, 'click', (event) => {
        event.preventDefault();
        this.googleAnalyticsService.logClickEvents('click_ccd_id', 'CLC CCD List', 'click_ccd_id', text.trim());
        this.router.navigate([`/ligands/${text.trim()}`]);
      });
    }
  }
}
