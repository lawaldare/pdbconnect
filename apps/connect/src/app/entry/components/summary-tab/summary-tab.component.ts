import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryInfoSectionComponent } from './sub-components/summary-info-section/summary-info-section.component';
import { Summary3DSectionComponent } from './sub-components/summary-3d-section/summary-3d-section.component';
@Component({
  selector: 'pdbc-summary-tab',
  imports: [CommonModule, SummaryInfoSectionComponent, Summary3DSectionComponent],
  templateUrl: './summary-tab.component.html',
  styleUrl: './summary-tab.component.scss',
})
export class SummaryTabComponent {}
