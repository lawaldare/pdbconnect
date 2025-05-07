/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, ViewChild, ElementRef, AfterViewInit, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewMolstarFacade } from './data-processing.facade';
import { ComponentCommunicationService } from '../../../../services/component-comm.service';
import { OverviewStateManagementService } from './state-management.service';
import { MolstarOverviewForTopPage } from '../../../../helpers/molstar/molstar-overview-for-top-page';
import { OverviewMolstarControBarComponent } from './sub-components/molstar-control-bar/molstar-control-bar.component';
import { OverviewMolstarTabListViewComponent } from './sub-components/tab-listview-content/tab-listview-content.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LigandsRowData, MacromoleculesRowData } from '../../../shared/interactive-tables/data-models-and-definitions/row-and-table.model';

@Component({
  selector: 'pdbc-overview-molstar',
  standalone: true,
  imports: [CommonModule, OverviewMolstarControBarComponent, NgxSkeletonLoaderModule, OverviewMolstarTabListViewComponent],
  templateUrl: './overview-molstar.component.html',
  styleUrl: './overview-molstar.component.scss',
})
export class OverviewMolstarComponent implements AfterViewInit {
  public readonly dataProcessing = inject(OverviewMolstarFacade);
  public readonly stateManagement = inject(OverviewStateManagementService);
  public readonly molstarVisualisation = inject(MolstarOverviewForTopPage);
  public readonly compCommunication = inject(ComponentCommunicationService);

  @ViewChild('infoControls') infoControls!: ElementRef;
  @ViewChild('molstarContainer') molstarContainer!: ElementRef;

  public isOverviewSectionDisplayed = signal(false);

  public assemblyData = computed(() => this.dataProcessing.preferredAssemblyData());
  public molstarFirstRenderFinished = computed(() => this.compCommunication.molstarFirstRenderFinished());
  public molstarOverviewRendered = signal(false);

  constructor() {
    effect(async () => {
      const currentTab = this.compCommunication.currentTab();
      const hasMacromoleculesData = Object.keys(this.compCommunication.tabTableData()).indexOf('Macromolecules') > -1;
      const hasLigandsData = Object.keys(this.compCommunication.tabTableData()).indexOf('Ligands') > -1;
      if (this.assemblyData() && this.molstarVisualisation.preferredAssemblyId === undefined) {
        const assemblyToUse = this.assemblyData()!.preferred ? this.assemblyData()!.preferred + '' : '1';
        this.molstarVisualisation.preferredAssemblyId = assemblyToUse;
      }
      if (currentTab !== 'summary' && currentTab !== 'overview') return;
      if (!hasMacromoleculesData) return;
      if (!hasLigandsData) return;
      if (!this.molstarFirstRenderFinished()) return;

      if (this.molstarVisualisation.currentViewName.includes('Overview')) return;

      const macromoleculesData = this.compCommunication.getTabData('Macromolecules').tableRows() as MacromoleculesRowData[];
      const ligandsRawData = this.compCommunication.getTabData('Ligands').tableRows() as LigandsRowData[];
      const ligandsData = ligandsRawData.filter((lig) => lig.type === 'ligand');
      const modificationsData = ligandsRawData.filter((lig) => lig.type === 'modification');

      const previousConfig = this.molstarVisualisation.currentConfigName + '';

      await this.molstarVisualisation.checkOverviewReady();
      await this.molstarVisualisation.checkAndCreateComponents(macromoleculesData, ligandsData, modificationsData);
      this.isOverviewSectionDisplayed.set(true);
      const newConfig = this.molstarVisualisation.currentConfigName + '';
      if (this.molstarOverviewRendered() == false) {
        this.molstarVisualisation.currentViewName = 'Overview-Preferred Assembly';
        await this.molstarVisualisation.renderOverviewPreferredAssembly();
        this.molstarOverviewRendered.set(true);
      } else if (previousConfig !== newConfig) {
        // if coming from different tab, refresh state
        await this.stateManagement.updateMolstarAccordionSelection(this.stateManagement.currentView);
      }
    });
  }

  async ngAfterViewInit() {
    this.stateManagement.infoControls.set(this.infoControls);
    this.dataProcessing.parseRelatedEntries();
  }
}
