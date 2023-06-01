import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'pdbc-vf-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vf-link.component.html',
  styleUrls: ['./vf-link.component.scss'],
})
export class VfLinkComponent {
  @Input() external = false;
  @Input() label = 'Link';
  @Input() location = 'JavaScript:Void(0);';

  constructor(private sanitizer: DomSanitizer) {}

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
