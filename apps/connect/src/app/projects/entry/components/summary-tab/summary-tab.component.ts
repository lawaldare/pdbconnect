import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainInformationAreaComponent } from '../main-information-area/main-information-area.component';
import { OverviewMolstarComponent } from '../overview-molstar/overview-molstar.component';

@Component({
  selector: 'pdbc-summary-tab',
  imports: [CommonModule, MainInformationAreaComponent, OverviewMolstarComponent],
  templateUrl: './summary-tab.component.html',
  styleUrl: './summary-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryTabComponent {}
