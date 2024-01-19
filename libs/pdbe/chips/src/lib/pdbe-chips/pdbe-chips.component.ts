import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-pdbe-chips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdbe-chips.component.html',
  styleUrls: ['./pdbe-chips.component.scss'],
})
export class PdbeChipsComponent {
  @Input() label = "";
  @Input() url = "";
  @Input() backgroundColor = "";
  @Input() highlightColor = "";
  @Input() fontColor = "";
}
