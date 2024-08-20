import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataContentModels } from '../../models/data-content.model';
import { MaterialModule } from '@pdbc/core';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';

@Component({
  selector: 'app-data-content',
  standalone: true,
  imports: [CommonModule, MaterialModule, ToolTipComponent],
  templateUrl: './data-content.component.html',
  styleUrl: './data-content.component.scss',
})
export class DataContentComponent {
  public readonly dataContent = input.required<DataContentModels>();
}
