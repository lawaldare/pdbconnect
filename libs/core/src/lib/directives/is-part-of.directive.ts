import { Directive, ElementRef, Renderer2, Input, OnChanges, signal } from '@angular/core';

@Directive({
  selector: '[libIsPartOf]',
  standalone: true,
})
export class IsPartOfDirective implements OnChanges {
  @Input() truncateText = '';
  @Input() limit = 60;
  private truncated = signal(true);
  private fullText = '';
  private truncatedText = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.init();
  }

  private init(): void {
    this.fullText = this.truncateText;
    this.truncatedText = this.truncateText.length > this.limit ? this.truncateText.substring(0, this.limit) + '...' : this.truncateText;
    const textArray = this.truncatedText.endsWith('...') ? this.truncatedText.slice(0, -5).split(',') : this.truncatedText.split(',');
    this.renderContent(textArray);
    if (this.truncateText.trim().length > this.limit) {
      this.addShowMore('show more');
    }
  }

  private addShowMore(text: string): void {
    const showMore = this.renderer.createElement('a');
    this.renderer.setAttribute(showMore, 'href', '#');
    this.renderer.setAttribute(showMore, 'style', 'display:block; color: #3B6FB6; border: none; text-decoration: none;');
    this.renderer.listen(showMore, 'click', (event) => this.toggleText(event));

    const showMoreText = this.renderer.createText(text);
    this.renderer.appendChild(showMore, showMoreText);

    const icon = this.renderer.createElement('i');
    this.renderer.addClass(icon, 'icon');
    this.renderer.addClass(icon, 'icon-common');
    this.renderer.addClass(icon, this.truncated() ? 'icon-arrow-down' : 'icon-arrow-up'); // Toggle the icon classes
    this.renderer.setStyle(icon, 'margin-left', '5px'); // Add some spacing between the text and icon

    this.renderer.appendChild(showMore, icon);
    this.renderer.appendChild(this.el.nativeElement, showMore);

    this.renderer.setAttribute(
      this.el.nativeElement,
      'style',
      this.truncated() ? 'height: 70px' : this.el.nativeElement.offsetHeight >= 55 ? 'height: 300px' : 'height: 55px'
    );
  }

  private toggleText(event: Event): void {
    event.preventDefault();
    this.truncated.update((value) => !value);
    const displayText = this.truncated() ? this.truncatedText : this.fullText;

    const textArray = displayText.endsWith('...') ? displayText.slice(0, -5).split(',') : displayText.split(',');
    this.renderContent(textArray);

    const showMoreText = this.truncated() ? 'Show more' : 'Show less';
    this.renderer.setAttribute(
      this.el.nativeElement,
      'style',
      this.truncated() ? 'height: 70px' : this.el.nativeElement.offsetHeight >= 55 ? 'height: 300px' : 'height: 55px'
    );
    this.addShowMore(showMoreText);
  }

  private renderContent(textArray: string[]): void {
    while (this.el.nativeElement.firstChild) {
      this.renderer.removeChild(this.el.nativeElement, this.el.nativeElement.firstChild);
    }
    for (const text of textArray) {
      const a = this.renderer.createElement('a');
      a.textContent =
        textArray.indexOf(text) !== textArray.length - 1 ? `${text}, ` : textArray.length === 1 ? `${text}.` : this.truncated() ? `${text}...` : `${text}.`;
      this.renderer.setAttribute(a, 'ng-reflect-router-link', `/ligands,${text.trim()}`);
      this.renderer.setAttribute(a, 'href', `/ligands/${text.trim()}`);
      this.renderer.appendChild(this.el.nativeElement, a);
      this.renderer.setAttribute(a, 'style', 'margin-left:5px;');
    }
  }
}
