import { Directive, ElementRef, Renderer2, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[pdbcOEMC]',
  standalone: true,
})
export class OEMCDirective implements OnChanges {
  @Input() data!: Record<string, number>;

  private orderedList: any;
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.init();
  }

  private init(): void {
    this.resetEnv();
    const orderedList = this.renderer.createElement('ul');
    this.renderer.appendChild(this.el.nativeElement, orderedList);

    for (const [key, value] of Object.entries(this.data)) {
      const li = this.renderer.createElement('li');
      const text = this.renderer.createText(`${key} (${value})`);
      this.renderer.appendChild(li, text);
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
