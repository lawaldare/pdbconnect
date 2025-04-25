import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { AssembliesRowData, LigandsRowData, MacromoleculesRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MolstarOverviewForTopPage } from '../../helpers/molstar/molstar-overview-for-top-page';

@Component({
  selector: 'pdbc-assemblies-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assemblies-tab.component.html',
  styleUrl: './assemblies-tab.component.scss',
})
export class AssembliesTabComponent {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public molstarVisualisation = inject(MolstarOverviewForTopPage);
  public molstarFirstRenderFinished = computed(() => this.compCommunication.molstarFirstRenderFinished());

  public currentAssemblyDatum = computed(() => {
    const selectedIdx = this.compCommunication.tabState()['Assemblies'];
    const hasAssembliesData = Object.keys(this.compCommunication.tabTableData()).indexOf('Assemblies') > -1;
    if (selectedIdx === 'Main') return;
    if (!hasAssembliesData) return;
    const assemblies = this.compCommunication.getTabData('Assemblies').tableRows() as AssembliesRowData[];
    return assemblies[selectedIdx as number];
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
}
