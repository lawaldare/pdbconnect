import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-name-value',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './name-value.component.html',
  styleUrls: ['./name-value.component.scss'],
})
export class NameValueComponent {
  @Input() name = '';
  @Input() value = '';
}
