import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@pdbc/core';
import { DataType } from '../../models/data-type-box.model';
import { DataContentComponent } from '../data-content/data-content.component';

@Component({
  selector: 'app-data-type-box',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, DataContentComponent],
  templateUrl: './data-type-box.component.html',
  styleUrl: './data-type-box.component.scss',
})
export class DataTypeBoxComponent {
  public readonly dataType = input.required<DataType>();
  public chosenformat!: string;
  public pdbid!: string;
  public isLoadingEntry = signal(false);
  public errorEntryText = signal('');

  buttonClicked(apiType: string): void {}
}
