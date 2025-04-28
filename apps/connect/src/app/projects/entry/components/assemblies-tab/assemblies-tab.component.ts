import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { AssembliesRowData, LigandsRowData, MacromoleculesRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MolstarOverviewForTopPage } from '../../helpers/molstar/molstar-overview-for-top-page';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'pdbc-assemblies-tab',
  standalone: true,
  imports: [CommonModule, InteractiveTablesComponent, NgxSkeletonLoaderModule],
  templateUrl: './assemblies-tab.component.html',
  styleUrl: './assemblies-tab.component.scss',
})
export class AssembliesTabComponent {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly dataProcessing = inject(MainDataProcessingFacade);

  public molstarVisualisation = inject(MolstarOverviewForTopPage);
  public molstarFirstRenderFinished = computed(() => this.compCommunication.molstarFirstRenderFinished());

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  public readonly assemblyTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    if (isLoaded) {
      const tabData = this.compCommunication.getTabData('Assemblies');
      return tabData.tableRows() as AssembliesRowData[];
    }
    return [];
  });

  public currentAssemblyDatum = computed(() => {
    let selectedIdx = this.compCommunication.tabState()['Assemblies'] ?? 0;
    if (selectedIdx === 'Main') selectedIdx = 0;
    return this.assemblyTableRows()[selectedIdx as number];
  });

  constructor() {
    effect(async () => {
      const molstarFirstRenderFinished = this.molstarFirstRenderFinished();

      const hasMacromoleculesData = Object.keys(this.compCommunication.tabTableData()).indexOf('Macromolecules') > -1;
      const hasLigandsData = Object.keys(this.compCommunication.tabTableData()).indexOf('Ligands') > -1;

      // do not render dashboard until molstar first page render is finished
      if (!molstarFirstRenderFinished) return;

      // do not render dashboard until data necessary to check molstar state not loaded
      if (!hasMacromoleculesData) return;
      if (!hasLigandsData) return;
      if (!this.currentAssemblyDatum()) return;

      const macromoleculesData = this.compCommunication.getTabData('Macromolecules').tableRows() as MacromoleculesRowData[];
      const ligandsRawData = this.compCommunication.getTabData('Ligands').tableRows() as LigandsRowData[];
      const ligandsData = ligandsRawData.filter((lig) => lig.type === 'ligand');
      const modificationsData = ligandsRawData.filter((lig) => lig.type === 'modification');
      const datum = this.currentAssemblyDatum()!;

      // if Assemblies config not loaded, load it
      if (!this.molstarVisualisation.currentViewName.includes('Tab-Assemblies')) {
        const symmetryView = true;
        await this.molstarVisualisation.checkAssembliesReady(datum.assemblyId, symmetryView);
        await this.molstarVisualisation.checkAndCreateComponents(macromoleculesData, ligandsData, modificationsData);
      }
      this.molstarVisualisation.currentViewName = `Tab-Assemblies/${datum.assemblyId}`;
      await this.molstarVisualisation.renderTabsAssemblies();
    });
  }

  public getAdditionalData(name: string) {
    // this function is used to get specific data shown in Assembly dashboard view
    type AssembliesAddDataKeys = 'accessibleSurfaceArea' | 'buriedSurfaceArea' | 'dissociationArea' | 'dissociationEnergy' | 'dissociationEntropy' | 'symmetryNumber';
    return this.currentAssemblyDatum()?.additionalData[name as AssembliesAddDataKeys];
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }
}
