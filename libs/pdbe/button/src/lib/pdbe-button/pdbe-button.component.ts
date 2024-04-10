import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { VfButtonComponent } from '@vf-lib/button';

@Component({
  selector: 'pdbc-pdbe-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdbe-button.component.html',
  styleUrls: ['./pdbe-button.component.scss'],
})
export class PdbeButtonComponent {
  @Input() backgroundColor = '';
  @Input() fontSize = '18px';
  @Input() fontColor = '';
  @Input() borderColor = '';
  @Input() shadowColor = '';
  @Input() label = '';
  @Input() paddingSize = '';
  @Input() mobileIconName = '';
}
