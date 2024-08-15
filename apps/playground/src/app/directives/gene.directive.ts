/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/directive-selector */
import { Directive, Input, ElementRef, Renderer2, inject, SimpleChanges, OnChanges } from '@angular/core';

@Directive({
  selector: '[gene]',
  standalone: true,
})
export class GeneDirective implements OnChanges {
  @Input() geneNames!: string[];

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngOnChanges(changes: SimpleChanges) {
    const names = changes['geneNames']?.currentValue;

    if (names?.length) {
      names.forEach((name: string) => {
        const a = this.renderer.createElement('a');
        a.textContent = `${name}, `;
        a.href = '';
        this.renderer.appendChild(this.el.nativeElement, a);
      });
    }
  }
}
