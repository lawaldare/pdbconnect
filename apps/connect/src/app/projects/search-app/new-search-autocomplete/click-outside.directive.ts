/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, EventEmitter, HostListener, inject, Inject, Output } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  private readonly elementRef = inject(ElementRef);
  @Output() clickOutside = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent): void {
    const targetElement = event.target;
    if (!(targetElement instanceof Node)) return; // covers null + non-Node targets

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
