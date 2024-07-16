import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[libTruncateText]',
  standalone: true,
})
export class TruncateTextDirective implements OnInit {
  @Input() truncateText = '';
  @Input() limit = 60;
  private truncated = true;
  private fullText = '';
  private truncatedText = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.fullText = this.truncateText;
    this.truncatedText = this.truncateText.length > this.limit ? this.truncateText.substring(0, this.limit) + '...' : this.truncateText;
    this.renderer.setProperty(this.el.nativeElement, 'innerText', this.truncatedText);
    this.addShowMore();
  }

  private addShowMore() {
    const showMore = this.renderer.createElement('a');
    const text = this.renderer.createText('Show more');
    this.renderer.appendChild(showMore, text);
    this.renderer.setAttribute(showMore, 'href', '#');
    this.renderer.setAttribute(showMore, 'style', 'color: #3B6FB6; border: none');
    this.renderer.listen(showMore, 'click', (event) => this.toggleText(event));
    this.renderer.appendChild(this.el.nativeElement, showMore);
  }

  private toggleText(event: Event) {
    event.preventDefault();
    this.truncated = !this.truncated;
    const displayText = this.truncated ? this.truncatedText : this.fullText;
    const showMoreText = this.truncated ? 'Show more' : 'Show less';
    this.renderer.setProperty(this.el.nativeElement, 'innerText', displayText);
    this.addShowMoreWithText(showMoreText);
  }

  private addShowMoreWithText(text: string) {
    const showMore = this.renderer.createElement('a');
    const showMoreText = this.renderer.createText(text);
    this.renderer.appendChild(showMore, showMoreText);
    this.renderer.setAttribute(showMore, 'href', '#');
    this.renderer.setAttribute(showMore, 'style', 'color: #3B6FB6; border: none');
    this.renderer.listen(showMore, 'click', (event) => this.toggleText(event));
    this.renderer.appendChild(this.el.nativeElement, showMore);
  }
}
