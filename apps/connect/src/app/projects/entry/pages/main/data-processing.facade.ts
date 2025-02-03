/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { inject, Injectable, signal } from '@angular/core';
import { DataToTable } from '../../components/interactive-tables/data-processing/abstract-base-row-class';
import { AssemblyDataToTable } from '../../components/interactive-tables/data-processing/assembly-row-class';
import { DomainDataToTable } from '../../components/interactive-tables/data-processing/domain-row-class';
import { LigandDataToTable } from '../../components/interactive-tables/data-processing/ligand-row-class';
import { MacromoleculeDataToTable } from '../../components/interactive-tables/data-processing/macromolecule-row';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { ComplexDetails } from '../../data-models/complex-details.model';
import { AssemblyData } from '../../data-models/assembly.model';
import { PisaAssembly } from '../../data-models/pisa-assembly.model';
import { CathMappings, PfamMappings, ScopMappings } from '../../data-models/domains.model';
import { Molecule } from '../../data-models/molecule.model';
import { ModifiedResidue } from '../../data-models/modified-residues.model';
import { CarbohydrateMolecule } from '../../data-models/carbohydrate-polymer.model';
import { UniProtMapping } from '../../data-models/uniprot-mapping.model';
import { BestStructureMapping } from '../../data-models/uniport-best-structures.model';
import { MolstarResidueInfo } from '../../helpers/molstar/molstar-helpers';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { TableNames } from './main.component';

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
  public molstarResidueInfo = this.compCommunication.molstarResidueInfo;

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

  public processInteractiveTablesData() {
    // molstarResidueInfo: MolstarResidueInfo[] // macromolecules: Molecule[], // bestStrMapUniProtId: { [key: string]: BestStructureMapping[] }, // uniprotMapping: UniProtMapping, // carbohydrates: CarbohydrateMolecule[], // modifications: ModifiedResidue[], // ligands: Molecule[], // scopMappings: ScopMappings, // cathMappings: CathMappings, // pfamMappings: PfamMappings, // pisaAssemblyData: PisaAssembly[], // assemblyData: AssemblyData[], // complexDetails: ComplexDetails[],
    // for each table type
    for (const tabName of ['Assemblies', 'Domains', 'Ligands', 'Macromolecules']) {
      // we create the instances of the data to table objects, sending API data
      let tempTableData: DataToTable;
      if (tabName === 'Assemblies' && this.isNotUndefined([this.complexDetails(), this.assemblyData(), this.pisaAssemblyData()])) {
        tempTableData = new AssemblyDataToTable(this.complexDetails()!, this.assemblyData()!, this.pisaAssemblyData()!);
      } else if (
        tabName === 'Domains' &&
        this.isNotUndefined([this.pfamMappings()!, this.cathMappings()!, this.scopMappings()!, this.macromolecules()!, this.molstarResidueInfo()!])
      ) {
        tempTableData = new DomainDataToTable(this.pfamMappings()!, this.cathMappings()!, this.scopMappings()!, this.macromolecules()!, this.molstarResidueInfo()!);
      } else if (tabName === 'Ligands' && this.isNotUndefined([this.ligands()!, this.modifications()!, this.molstarResidueInfo()!])) {
        tempTableData = new LigandDataToTable(this.ligands()!, this.modifications()!, this.molstarResidueInfo()!);
      } else if (
        tabName === 'Macromolecules' &&
        this.isNotUndefined([this.carbohydrates()!, this.uniprotMapping()!, this.bestStrMapUniProtId()!, this.macromolecules()!, this.molstarResidueInfo()!])
      ) {
        tempTableData = new MacromoleculeDataToTable(
          this.carbohydrates()!,
          this.uniprotMapping()!,
          this.bestStrMapUniProtId()!,
          this.macromolecules()!,
          this.molstarResidueInfo()!
        );
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
}
