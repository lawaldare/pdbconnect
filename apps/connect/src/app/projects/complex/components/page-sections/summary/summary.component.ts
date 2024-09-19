import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexParticipantsPipe } from '../../../pipes/participants.pipe';
import { ComplexSymmetryPipe } from '../../../pipes/symmetry.pipe';
import { OEMCPipe } from '../../../pipes/oemc.pipe';
import { ComplexData } from '../../../models/complex-structure.model';

@Component({
  selector: 'pdbc-summary',
  standalone: true,
  imports: [CommonModule, OEMCPipe, ComplexParticipantsPipe, ComplexSymmetryPipe],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
  public summaryData = input.required<ComplexData>();
}
