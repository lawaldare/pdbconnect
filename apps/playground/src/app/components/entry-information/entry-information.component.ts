import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbe-entry-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-information.component.html',
  styleUrl: './entry-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryInformationComponent {}
