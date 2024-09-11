import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['../../../../ligands/components/pages/main/main.component.scss', './summary.component.scss'],
})
export class SummaryComponent {}
