import { Directive, ElementRef, Input, Renderer2, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { truncateText } from '../helpers/truncate-text';

@Directive({
  selector: '[pdbcTruncateText]',
  standalone: true,
})
export class TruncateTextDirective implements AfterViewInit, OnDestroy {
  @Input() maxLines = 2;
  @Input() tooltip = false;

  private fullText = '';
  private observer: ResizeObserver | null = null;

  public readonly el = inject(ElementRef);
  public readonly renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    const element = this.el.nativeElement as HTMLElement;
    this.fullText = element.textContent?.trim() ?? '';
    if (!this.fullText) return;

    this.truncate();

    // Observe element size changes
    this.observer = new ResizeObserver(() => this.truncate());
    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private truncate(): void {
    const element = this.el.nativeElement as HTMLElement;

    const { bestFit, isTruncated } = truncateText(element, this.fullText, this.maxLines);

    this.renderer.setProperty(element, 'textContent', bestFit);

    if (this.tooltip && isTruncated) {
      this.renderer.setAttribute(element, 'title', this.fullText);
    } else {
      this.renderer.removeAttribute(element, 'title');
    }
  }
}
