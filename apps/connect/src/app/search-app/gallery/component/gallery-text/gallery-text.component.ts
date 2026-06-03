import { Component, Input, OnInit, ElementRef, Renderer2, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef, inject } from '@angular/core';
import { GalleryState } from '../../service/gallery.state';
import { GalleryDescConfig } from '../../config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-gallery-text',
  templateUrl: './gallery-text.component.html',
  styleUrls: ['./gallery-text.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryTextComponent implements OnInit {
  private readonly ref = inject(ChangeDetectorRef);
  private readonly renderer = inject(Renderer2);
  private readonly el = inject(ElementRef);

  @Input() state!: GalleryState;
  @Input() config!: GalleryDescConfig;

  @Input() showDescription!: boolean;
  @Output() showDescriptionChange = new EventEmitter<any>();

  ngOnInit() {
    const el = this.el.nativeElement;
    // text overlay
    if (this.config.overlay) {
      this.renderer.setStyle(el, 'position', 'absolute');
    }

    // text position
    if (this.config.position === 'top') {
      this.renderer.setStyle(el, 'order', 0);
      this.renderer.setStyle(el, 'top', 0);
      this.renderer.setStyle(el, 'bottom', 'unset');
    } else {
      this.renderer.setStyle(el, 'order', 2);
      this.renderer.setStyle(el, 'top', 'unset');
      this.renderer.setStyle(el, 'bottom', 0);
    }

    setTimeout(() => {
      this.showDescription = false;
      this.ref.markForCheck();
      this.showDescriptionChange.emit(this.showDescription);
    }, 1000);
  }
}
