import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LigandProperty } from '../../../data-models/description.model';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';

@Component({
  selector: 'pdbc-name-value',
  standalone: true,
  imports: [CommonModule, ToolTipComponent],
  templateUrl: './name-value.component.html',
  styleUrls: ['./name-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameValueComponent {
  public readonly data = input.required<LigandProperty>();
}
