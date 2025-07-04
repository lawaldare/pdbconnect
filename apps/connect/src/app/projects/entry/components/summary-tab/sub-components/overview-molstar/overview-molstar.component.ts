/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, ViewChild, ElementRef, AfterViewInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewMolstarFacade } from './data-processing.facade';
import { ComponentCommunicationService } from '../../../../services/component-comm.service';
import { OverviewStateManagementService } from './state-management.service';
import { MolstarForEntryPages } from '../../../../helpers/molstar-for-entry-pages';
import { OverviewMolstarControBarComponent } from './sub-components/molstar-control-bar/molstar-control-bar.component';
import { OverviewMolstarTabListViewComponent } from './sub-components/tab-listview-content/tab-listview-content.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MolstarStateService } from '../../../../services/molstar-state.service';
import { MaterialModule, PopupWindowService } from '@pdbc/core';

@Component({
  selector: 'pdbc-overview-molstar',
  standalone: true,
  imports: [CommonModule, OverviewMolstarControBarComponent, NgxSkeletonLoaderModule, OverviewMolstarTabListViewComponent, MaterialModule],
  templateUrl: './overview-molstar.component.html',
  styleUrl: './overview-molstar.component.scss',
})
export class OverviewMolstarComponent implements AfterViewInit {
  public readonly dataProcessing = inject(OverviewMolstarFacade);
  public readonly stateManagement = inject(OverviewStateManagementService);
  public readonly molstarVisualisation = inject(MolstarForEntryPages);
  public readonly molstarState = inject(MolstarStateService);

  public readonly compCommunication = inject(ComponentCommunicationService);

  @ViewChild('infoControls') infoControls!: ElementRef;
  @ViewChild('molstarContainer') molstarContainer!: ElementRef;

  public isOverviewSectionDisplayed = signal(false);
  public molstarFirstRenderFinished = computed(() => this.molstarState.molstarFirstRenderFinished());

  public readonly popService = inject(PopupWindowService);

  public popupMolstar(): void {
    const fullMode = this.popService.isMaximizedOnMac();
    if (!fullMode) {
      this.popService.popOut(this.molstarContainer, 'ligand-molstar');
    }
  }

  async ngAfterViewInit() {
    this.stateManagement.infoControls.set(this.infoControls);
    this.dataProcessing.parseRelatedEntries();
    this.isOverviewSectionDisplayed.set(true);
  }
}
