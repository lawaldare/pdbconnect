import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataContentModels } from '../../models/data-content.model';

@Component({
  selector: 'app-data-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-content.component.html',
  styleUrl: './data-content.component.scss',
})
export class DataContentComponent {
  public readonly dataContent = input.required<DataContentModels>();
}
