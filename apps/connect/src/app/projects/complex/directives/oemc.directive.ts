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

    for (const [key, value] of Object.entries(this.data)) {
      const li = this.renderer.createElement('li');
      const anchor = this.renderer.createElement('a');
      anchor.href = this.util.generateQueryURLForExperimentalMethod(this.complexId(), key);
      anchor.target = '_blank';
      const firstText = this.renderer.createText(`${key} (`);
      this.renderer.appendChild(li, firstText);
      const anchorText = this.renderer.createText(`${value} `);
      this.renderer.appendChild(anchor, anchorText);
      this.renderer.appendChild(li, anchor);
      const lastText = this.renderer.createText(`PDB entries)`);
      this.renderer.appendChild(li, lastText);
      this.renderer.appendChild(orderedList, li);
    }

    this.orderedList = orderedList;
  }

  resetEnv(): void {
    if (this.orderedList) {
      this.renderer.removeChild(this.el.nativeElement, this.orderedList);
    }
  }
}
