/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computed, inject, Injectable, signal } from '@angular/core';
import { DataToTable } from '../../components/interactive-tables/data-processing/abstract-base-row-class';
import { AssemblyDataToTable } from '../../components/interactive-tables/data-processing/assembly-row-class';
import { DomainDataToTable } from '../../components/interactive-tables/data-processing/domain-row-class';
import { LigandDataToTable } from '../../components/interactive-tables/data-processing/ligand-row-class';
import { MacromoleculeDataToTable } from '../../components/interactive-tables/data-processing/macromolecule-row';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { TableNames } from './main.component';
import { TabConfig } from '../../components/overview-molstar/state-management.service';
import { allTabs, tableTabs } from '../../entry-constant';
import { TabNames } from '../../helpers/tab-names.enum';
import { EntryActions } from '../../store/entry.actions';

@Injectable({
  providedIn: 'root',
})
export class MainDataProcessingFacade {
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly complexDetails = toSignal(this.globalStore.select(EntrySelectors.complexDetails));
  public readonly assemblyData = toSignal(this.globalStore.select(EntrySelectors.assemblies));
  public readonly pisaAssemblyData = toSignal(this.globalStore.select(EntrySelectors.pisaAssemblies));
  public readonly pfamMappings = toSignal(this.globalStore.select(EntrySelectors.pfamMapping));
  public readonly cathMappings = toSignal(this.globalStore.select(EntrySelectors.cathMapping));
  public readonly scopMappings = toSignal(this.globalStore.select(EntrySelectors.scop175Mapping));
  public readonly ligands = toSignal(this.globalStore.select(EntrySelectors.boundLigands));
  public readonly modifications = toSignal(this.globalStore.select(EntrySelectors.modifications));
  public readonly carbohydrates = toSignal(this.globalStore.select(EntrySelectors.carbohydrates));
  public readonly uniprotMapping = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));
  public readonly bestStrMapUniProtId = toSignal(this.globalStore.select(EntrySelectors.bestStructuresMappingsByUniProtIds));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));
  public molstarResidueInfo = computed(() => this.compCommunication.molstarResidueInfo());

  public tabDataLoaded = signal<boolean>(false);
  public tableData = signal<DataToTable>({} as DataToTable);
  private tabName = signal<TableNames>('' as TableNames);

  public isNotUndefined(data: any[]) {
    for (const datum of data) {
      if (datum === undefined) return false;
    }
    return true;
  }

  public setTabName(tabName: TableNames) {
    this.tabName.set(tabName);
  }

  public getTableName(tabName: string) {
    return tabName as TableNames;
  }

  public processInteractiveTablesData() {
    const macromolecules = this.macromolecules() ?? [];
    const modifications = this.modifications() ?? [];
    const cathMappings = this.cathMappings();
    const pfamMappings = this.pfamMappings();
    const scopMappings = this.scopMappings();
    const ligands = this.ligands() ?? [];
    const carbohydrates = this.carbohydrates() ?? [];
    const uniprotMapping = this.uniprotMapping();
    const bestStrMapUniProtId = this.bestStrMapUniProtId();
    const complexDetails = this.complexDetails() ?? [];
    const assemblyData = this.assemblyData() ?? [];
    const pisaAssemblyData = this.pisaAssemblyData() ?? [];

    for (const tabName of [TabNames.Assemblies, TabNames.Domains, TabNames.Ligands, TabNames.Macromolecules]) {
      let tempTableData: DataToTable;
      if (tabName === TabNames.Assemblies && this.isNotUndefined([complexDetails, assemblyData, pisaAssemblyData])) {
        tempTableData = new AssemblyDataToTable(complexDetails, assemblyData, pisaAssemblyData);
      } else if (
        tabName === TabNames.Domains &&
        pfamMappings &&
        cathMappings &&
        scopMappings &&
        this.isNotUndefined([pfamMappings, cathMappings, scopMappings, macromolecules, this.molstarResidueInfo()])
      ) {
        tempTableData = new DomainDataToTable(pfamMappings!, cathMappings!, scopMappings!, macromolecules, this.molstarResidueInfo());
      } else if (tabName === TabNames.Ligands && this.isNotUndefined([ligands, modifications, this.molstarResidueInfo()])) {
        tempTableData = new LigandDataToTable(ligands, modifications, this.molstarResidueInfo());
      } else if (
        tabName === TabNames.Macromolecules &&
        this.isNotUndefined([carbohydrates, uniprotMapping, bestStrMapUniProtId, macromolecules, this.molstarResidueInfo()])
      ) {
        tempTableData = new MacromoleculeDataToTable(carbohydrates, uniprotMapping!, bestStrMapUniProtId!, macromolecules, this.molstarResidueInfo());
      } else {
        return;
      }
      // we call functions to convert ag-grid table rows and filters
      tempTableData.generateTableData();
      tempTableData.generateTableFilters();
      // and save all data in the component communication service
      this.compCommunication.setTabData(tabName, tempTableData);
    }
    // and set that table data has already been generated to avoid re-processing
    this.compCommunication.isTabDataGenerated.set(true);
    this.tabDataLoaded.set(true);
    const tableData = this.compCommunication.getTabData(this.tabName());
    this.tableData.set(tableData);
  }

  public processFilesData(data: any) {
    const order = ['Archive mmCIF file', 'Updated mmCIF file', 'PDB file', 'Compatible PDB file bundle (tar.gz)', 'FASTA (Entry)', 'Full report (PDF)'];

    let downloads: any[] = [];
    let views: any[] = [];

    Object.keys(data).forEach((key) => {
      if (data[key].downloads) {
        downloads = downloads.concat(data[key].downloads);
      }
      if (data[key].views) {
        views = views.concat(data[key].views);
      }
    });

    downloads.sort((a, b) => {
      const indexA = order.indexOf(a.label);
      const indexB = order.indexOf(b.label);

      if (indexA === -1 && indexB === -1) {
        return 0;
      } else if (indexA === -1) {
        return 1;
      } else if (indexB === -1) {
        return -1;
      } else {
        return indexA - indexB;
      }
    });

    views.sort((a, b) => {
      const indexA = order.indexOf(a.label);
      const indexB = order.indexOf(b.label);

      if (indexA === -1 && indexB === -1) {
        return 0;
      } else if (indexA === -1) {
        return 1;
      } else if (indexB === -1) {
        return -1;
      } else {
        return indexA - indexB;
      }
    });

    const downloadsUpdated = downloads.map((d) => {
      return {
        name: d.label,
        url: d.url,
        downloadable: true,
      };
    });

    const viewsUpdated = views.map((d) => {
      return {
        name: d.label,
        url: d.url,
        downloadable: false,
      };
    });

    return { downloads: downloadsUpdated, views: viewsUpdated };
  }

  public tabsInfo = computed(() => {
    // const isTabDataGenerated = this.compCommunication.isTabDataGenerated();
    const tabsConfig: TabConfig[] = [];
    const tabsStatus: { [key: string]: string } = {};
    const tableTabsData = allTabs.filter((tab) => tableTabs.indexOf(tab.name) > -1);
    for (const tab of tableTabsData) {
      // an interactive table has data if the data has been loaded and the number of table rows is bigger than 0
      tabsStatus[tab.name] = this.tabDataLoaded() ? 'loaded' : 'loading';
      const dataExists = this.tabDataLoaded() ? this.compCommunication.getTabData(tab.name).tableRows().length > 0 : false;
      if (this.tabDataLoaded()) tabsStatus[tab.name] = dataExists ? 'has-data' : 'empty-data';

      const hasData = this.tabDataLoaded() && dataExists;
      tabsConfig.push({
        id: tab.name,
        displayName: tab.display,
        width: '229px',
        tagContent: hasData ? '' : 'N/A',
        tagClass: hasData ? 'no-chip' : 'na',
      });
    }
    tabsConfig.push({
      id: 'Experiments',
      displayName: 'Experiments and Validation',
      width: '229px',
      tagContent: '',
      tagClass: 'no-chip',
    });
    tabsConfig.push({
      id: 'Citations',
      displayName: 'Citations',
      width: '96px',
      tagContent: '',
      tagClass: 'no-chip',
    });
    return {
      config: tabsConfig,
      status: tabsStatus,
    };
  });

  public getPageData(): void {
    this.globalStore.dispatch(EntryActions.getSummaryData());
    this.globalStore.dispatch(EntryActions.getEntryMolecules());
    this.globalStore.dispatch(EntryActions.getExperiment());
    this.globalStore.dispatch(EntryActions.getUniprotMapping());
    this.globalStore.dispatch(EntryActions.getInterproMapping());
    this.globalStore.dispatch(EntryActions.getPfamMapping());
    this.globalStore.dispatch(EntryActions.getDownloadOptions());
    this.globalStore.dispatch(EntryActions.getSummaryQualityScores());
    this.globalStore.dispatch(EntryActions.getCathMapping());
    this.globalStore.dispatch(EntryActions.getScop175Mapping());
    this.globalStore.dispatch(EntryActions.getModifications());
    this.globalStore.dispatch(EntryActions.getValidationKeyStats());
    this.globalStore.dispatch(EntryActions.getValidationXrayRefine());
    this.globalStore.dispatch(EntryActions.getPrimaryPublication());
    this.globalStore.dispatch(EntryActions.getArticleCitingPDBEntry());
    this.globalStore.dispatch(EntryActions.getPreferredAssembly());
    this.globalStore.dispatch(EntryActions.getAssemblies());
    this.globalStore.dispatch(EntryActions.getCarbohydrates());
    this.globalStore.dispatch(EntryActions.getExperimentBMRBRawData());
    this.globalStore.dispatch(EntryActions.getPDBRedoQualityScores());
    this.globalStore.dispatch(EntryActions.getExperimentSBGridRawData());
    this.globalStore.dispatch(EntryActions.getExperimentIRRMCRawData());
    this.globalStore.dispatch(EntryActions.getExperimentEMPIARRawData());
    this.globalStore.dispatch(EntryActions.getExperimentPDBRawData());
    this.globalStore.dispatch(EntryActions.getUniprotMapping());
  }
}
