import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-description',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
})
export class DescriptionComponent {
  @Input() name = '';
  @Input() synonyms = '';
  @Input() formula = '';
  @Input() inchi = '';
  @Input() inchikey = '';
  @Input() smiles = '';
}
