import { inject, Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class MainDataProcessingFacade {
  public readonly compCommunication = inject(ComponentCommunicationService);

  public isNotUndefined(data: any[]) {
    for (const datum of data) {
      if (datum === undefined) return false;
    }
    return true;
  }

  public processInteractiveTablesData(
    complexDetails: ComplexDetails[],
    assemblyData: AssemblyData[],
    pisaAssemblyData: PisaAssembly[],
    pfamMappings: PfamMappings,
    cathMappings: CathMappings,
    scopMappings: ScopMappings,
    ligands: Molecule[],
    modifications: ModifiedResidue[],
    carbohydrates: CarbohydrateMolecule[],
    uniprotMapping: UniProtMapping,
    bestStrMapUniProtId: { [key: string]: BestStructureMapping[] },
    macromolecules: Molecule[],
    molstarResidueInfo: MolstarResidueInfo[]
  ) {
    // for each table type
    for (const tabName of ['Assemblies', 'Domains', 'Ligands', 'Macromolecules']) {
      // we create the instances of the data to table objects, sending API data
      let tempTableData: DataToTable;
      if (tabName === 'Assemblies' && this.isNotUndefined([complexDetails, assemblyData, pisaAssemblyData])) {
        tempTableData = new AssemblyDataToTable(complexDetails, assemblyData, pisaAssemblyData);
      } else if (tabName === 'Domains' && this.isNotUndefined([pfamMappings, cathMappings, scopMappings, macromolecules, molstarResidueInfo])) {
        tempTableData = new DomainDataToTable(pfamMappings, cathMappings, scopMappings, macromolecules, molstarResidueInfo);
      } else if (tabName === 'Ligands' && this.isNotUndefined([ligands, modifications, molstarResidueInfo])) {
        tempTableData = new LigandDataToTable(ligands, modifications, molstarResidueInfo);
      } else if (tabName === 'Macromolecules' && this.isNotUndefined([carbohydrates, uniprotMapping, bestStrMapUniProtId, macromolecules, molstarResidueInfo])) {
        tempTableData = new MacromoleculeDataToTable(carbohydrates, uniprotMapping, bestStrMapUniProtId, macromolecules, molstarResidueInfo);
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
