import { Directive, ElementRef, Renderer2, Input, OnInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[libIsPartOf]',
  standalone: true,
})
export class IsPartOfDirective implements OnInit, OnChanges {
  @Input() truncateText = '';
  @Input() limit = 60;
  private truncated = true;
  private fullText = '';
  private truncatedText = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.init();
  }

  ngOnChanges(): void {
    this.init();
  }

  private init(): void {
    this.fullText = this.truncateText;
    this.truncatedText = this.truncateText.length > this.limit ? this.truncateText.substring(0, this.limit) + '...' : this.truncateText;
    const textArray = this.truncatedText.split(',');
    for (const text of textArray) {
      const a = this.renderer.createElement('a');
      a.textContent = text;
      this.renderer.setAttribute(a, 'href', `ligands/${text.trim()}`);
      this.renderer.appendChild(this.el.nativeElement, a);
    }
    // this.renderer.setProperty(this.el.nativeElement, 'innerText', this.truncatedText);
    if (this.truncateText.trim().length > this.limit) {
      // this.addShowMore('Show more');
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
    this.renderer.addClass(icon, this.truncated ? 'icon-arrow-down' : 'icon-arrow-up'); // Toggle the icon classes
    this.renderer.setStyle(icon, 'margin-left', '5px'); // Add some spacing between the text and icon

    this.renderer.appendChild(showMore, icon);
    this.renderer.appendChild(this.el.nativeElement, showMore);
  }

  private toggleText(event: Event): void {
    event.preventDefault();
    this.truncated = !this.truncated;
    const displayText = this.truncated ? this.truncatedText : this.fullText;
    const showMoreText = this.truncated ? 'Show more' : 'Show less';
    console.log(this.el.nativeElement.offsetHeight, this.truncated);
    this.renderer.setAttribute(
      this.el.nativeElement,
      'style',
      this.truncated ? 'height: 110px' : this.el.nativeElement.offsetHeight > 300 ? 'height: 110px' : 'height: 300px'
    );

    console.log(displayText);

    this.renderer.setProperty(this.el.nativeElement, 'innerText', displayText);
    this.addShowMore(showMoreText);
  }
}
