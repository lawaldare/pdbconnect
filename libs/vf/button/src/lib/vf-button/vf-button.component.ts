import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export enum ButtonType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
}

@Component({
  selector: 'pdbc-vf-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vf-button.component.html',
  styleUrls: ['./vf-button.component.scss'],
})
export class VfButtonComponent {
  @Input() type = ButtonType.PRIMARY;
  @Input() disabled = false;
  @Input() small = false;
  @Input() label = 'Button';
}
