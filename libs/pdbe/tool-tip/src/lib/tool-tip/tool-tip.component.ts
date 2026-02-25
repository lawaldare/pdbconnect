import { Component, ElementRef, HostListener, input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetPipe } from '@pdbc/core';

@Component({
  selector: 'lib-tool-tip',
  standalone: true,
  imports: [CommonModule, AssetPipe],
  templateUrl: './tool-tip.component.html',
  styleUrl: './tool-tip.component.scss',
})
export class ToolTipComponent {
  public readonly minWidth = input<string>('323px');
  public readonly textIcon = input<string>('');
  public readonly helpLogoSrc = 'images/help_outline_24px.svg';
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

  @HostListener('mouseleave')
  handleMouseLeave() {
    const toolTip = this.toolTip.nativeElement;
    toolTip.style.visibility = 'hidden';
  }
}
