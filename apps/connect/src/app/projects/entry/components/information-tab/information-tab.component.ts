import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainInformationAreaComponent } from '../main-information-area/main-information-area.component';
import { OverviewMolstarComponent } from '../overview-molstar/overview-molstar.component';

@Component({
  selector: 'pdbc-information-tab',
  imports: [CommonModule, MainInformationAreaComponent, OverviewMolstarComponent],
  templateUrl: './information-tab.component.html',
  styleUrl: './information-tab.component.scss',
})
export class InformationTabComponent {}
