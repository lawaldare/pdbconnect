/* eslint-disable @typescript-eslint/no-explicit-any */

import { Directive, ElementRef, Renderer2, Input, OnChanges, input, inject } from '@angular/core';
import { UtilService } from '@pdbc/core';

@Directive({
  selector: '[pdbcOEMC]',
  standalone: true,
})
export class OEMCDirective implements OnChanges {
  @Input() data!: Record<string, number>;
  public readonly complexId = input.required<string>();

  private readonly util = inject(UtilService);
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  private orderedList: any;

  ngOnChanges(): void {
    this.init();
  }

  private init(): void {
    this.resetEnv();
    const orderedList = this.renderer.createElement('ul');
    this.renderer.appendChild(this.el.nativeElement, orderedList);
    const sortedData = this.sortDescending(Object.entries(this.data));
    for (const [key, value] of sortedData) {
      const li = this.renderer.createElement('li');
      const anchor = this.renderer.createElement('a');
      anchor.href = this.util.generateQueryURLForExperimentalMethod(this.complexId(), key);
      anchor.target = '_blank';
      const firstText = this.renderer.createText(`${key} (`);
      this.renderer.appendChild(li, firstText);
      const anchorText = this.renderer.createText(`${value} `);
      this.renderer.appendChild(anchor, anchorText);

      // const icon = this.renderer.createElement('i');
      // this.renderer.addClass(icon, 'icon');
      // this.renderer.addClass(icon, 'icon-link');
      // this.renderer.addClass(icon, 'icon-common');
      // this.renderer.setStyle(icon, 'margin-right', '20px');

      // this.renderer.appendChild(anchor, icon);
      this.renderer.appendChild(li, anchor);
      const lastTextContent = value <= 1 ? 'PDB entry)' : 'PDB entries)';
      const lastText = this.renderer.createText(lastTextContent);
      this.renderer.appendChild(li, lastText);
      this.renderer.appendChild(orderedList, li);
    }

    this.orderedList = orderedList;
  }

  private sortDescending(arr: any) {
    return arr.sort((a: any, b: any) => b[1] - a[1]);
  }

  resetEnv(): void {
    if (this.orderedList) {
      this.renderer.removeChild(this.el.nativeElement, this.orderedList);
    }
  }
}
