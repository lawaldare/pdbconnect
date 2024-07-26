import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameAndValue } from '@pdbc/core';

@Component({
  selector: 'pdbc-name-value',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './name-value.component.html',
  styleUrls: ['./name-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameValueComponent {
  @Input() data!: NameAndValue;
}
