import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-tool-tip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tool-tip.component.html',
  styleUrl: './tool-tip.component.scss',
})
export class ToolTipComponent {
  @Input() minWidth = '323px';
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';
  public showTooltips = false;

  @ViewChild('toolTip', { read: ElementRef }) toolTip!: ElementRef;

  @HostListener('mouseover', ['$event'])
  handleMouseOver(event: MouseEvent) {
    const isIcon = (event.target as HTMLElement).classList.contains('icon');
    const toolTip = this.toolTip.nativeElement;
    if (isIcon) {
      toolTip.style.visibility = 'visible';
    }
  }

  @HostListener('mouseleave', ['$event'])
  handleMouseLeave() {
    const toolTip = this.toolTip.nativeElement;
    toolTip.style.visibility = 'hidden';
  }
}
