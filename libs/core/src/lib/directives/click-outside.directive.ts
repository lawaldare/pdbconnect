import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[libClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<HTMLElement>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: EventTarget | null): void {
    if (!(targetElement instanceof HTMLElement)) return;

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    const buttonHasClassIdentifier = targetElement.classList.contains('less-identifier');
    if (!clickedInside && !buttonHasClassIdentifier) {
      this.clickOutside.emit();
    }
  }
}
