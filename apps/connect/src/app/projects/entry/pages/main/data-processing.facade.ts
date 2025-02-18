/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computed, inject, Injectable, signal } from '@angular/core';
import { DataToTable } from '../../components/shared/interactive-tables/data-processing/abstract-base-row-class';
import { AssemblyDataToTable } from '../../components/shared/interactive-tables/data-processing/assembly-row-class';
import { DomainDataToTable } from '../../components/shared/interactive-tables/data-processing/domain-row-class';
import { LigandDataToTable } from '../../components/shared/interactive-tables/data-processing/ligand-row-class';
import { MacromoleculeDataToTable } from '../../components/shared/interactive-tables/data-processing/macromolecule-row';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { TableNames } from './main.component';
import { TabNames } from '../../helpers/tab-names.enum';
import { EntryActions } from '../../store/entry.actions';
import { catchError, combineLatest, first, forkJoin, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainDataProcessingFacade {
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public molstarResidueInfo = computed(() => this.compCommunication.molstarResidueInfo());

  public tabDataLoaded = signal<boolean>(false);
  public tableData = signal<DataToTable>({} as DataToTable);
  private tabName = signal<TableNames>('' as TableNames);

  // public readonly routeTabs = ['summary', 'model quality', 'assemblies', 'macromolecules', 'ligands and environments', 'domains', 'citations'];

  public readonly routeTabs = [
    { label: 'Summary', id: 'summary' },
    { label: 'Model quality', id: 'model-quality' },
    { label: 'Assemblies', id: 'assemblies' },
    { label: 'Macromolecules', id: 'macromolecules' },
    { label: 'Ligands and Environments', id: 'ligands' },
    { label: 'Domains', id: 'domains' },
    { label: 'Citations', id: 'citations' },
  ];

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
    // Step 1: Load All APIs Initially Using `forkJoin`
    forkJoin({
      complexDetails: this.globalStore.select(EntrySelectors.complexDetails).pipe(
        first(),
        catchError(() => of(null))
      ),
      assemblyData: this.globalStore.select(EntrySelectors.assemblies).pipe(
        first(),
        catchError(() => of([]))
      ),
      pisaAssemblyData: this.globalStore.select(EntrySelectors.pisaAssemblies).pipe(
        first(),
        catchError(() => of([]))
      ),
      pfamMappings: this.globalStore.select(EntrySelectors.pfamMapping).pipe(
        first(),
        catchError(() => of(null))
      ),
      cathMappings: this.globalStore.select(EntrySelectors.cathMapping).pipe(
        first(),
        catchError(() => of(null))
      ),
      scopMappings: this.globalStore.select(EntrySelectors.scop175Mapping).pipe(
        first(),
        catchError(() => of(null))
      ),
      ligands: this.globalStore.select(EntrySelectors.boundLigands).pipe(
        first(),
        catchError(() => of(null))
      ),
      modifications: this.globalStore.select(EntrySelectors.modifications).pipe(
        first(),
        catchError(() => of(null))
      ),
      carbohydrates: this.globalStore.select(EntrySelectors.carbohydrates).pipe(
        first(),
        catchError(() => of(null))
      ),
      uniprotMapping: this.globalStore.select(EntrySelectors.uniprotMapping).pipe(
        first(),
        catchError(() => of(null))
      ),
      bestStrMapUniProtId: this.globalStore.select(EntrySelectors.bestStructuresMappingsByUniProtIds).pipe(
        first(),
        catchError(() => of(null))
      ),
      macromolecules: this.globalStore.select(EntrySelectors.macroMolecules).pipe(
        first(),
        catchError(() => of(null))
      ),
    })
      .pipe(
        tap((initialData) => this.processTableData(initialData)),
        switchMap(() =>
          combineLatest({
            complexDetails: this.globalStore.select(EntrySelectors.complexDetails).pipe(catchError(() => of(null))),
            assemblyData: this.globalStore.select(EntrySelectors.assemblies).pipe(catchError(() => of([]))),
            pisaAssemblyData: this.globalStore.select(EntrySelectors.pisaAssemblies).pipe(catchError(() => of([]))),
            pfamMappings: this.globalStore.select(EntrySelectors.pfamMapping).pipe(catchError(() => of(null))),
            cathMappings: this.globalStore.select(EntrySelectors.cathMapping).pipe(catchError(() => of(null))),
            scopMappings: this.globalStore.select(EntrySelectors.scop175Mapping).pipe(catchError(() => of(null))),
            ligands: this.globalStore.select(EntrySelectors.boundLigands).pipe(catchError(() => of(null))),
            modifications: this.globalStore.select(EntrySelectors.modifications).pipe(catchError(() => of(null))),
            carbohydrates: this.globalStore.select(EntrySelectors.carbohydrates).pipe(catchError(() => of(null))),
            uniprotMapping: this.globalStore.select(EntrySelectors.uniprotMapping).pipe(catchError(() => of(null))),
            bestStrMapUniProtId: this.globalStore.select(EntrySelectors.bestStructuresMappingsByUniProtIds).pipe(catchError(() => of(null))),
            macromolecules: this.globalStore.select(EntrySelectors.macroMolecules).pipe(catchError(() => of(null))),
          }).pipe(tap((updatedData) => this.processTableData(updatedData)))
        )
      )
      .subscribe();
  }

  // Extracted function to process data
  private processTableData(data: any) {
    for (const tabName of [TabNames.Assemblies, TabNames.Domains, TabNames.Ligands, TabNames.Macromolecules]) {
      let tempTableData: DataToTable;

      if (tabName === TabNames.Assemblies && this.isNotUndefined([data.complexDetails, data.assemblyData, data.pisaAssemblyData])) {
        tempTableData = new AssemblyDataToTable(data.complexDetails, data.assemblyData, data.pisaAssemblyData);
      } else if (
        tabName === TabNames.Domains &&
        this.isNotUndefined([data.pfamMappings, data.cathMappings, data.scopMappings, data.macromolecules, this.molstarResidueInfo()])
      ) {
        tempTableData = new DomainDataToTable(data.pfamMappings!, data.cathMappings!, data.scopMappings!, data.macromolecules, this.molstarResidueInfo());
      } else if (tabName === TabNames.Ligands && this.isNotUndefined([data.ligands, data.modifications, this.molstarResidueInfo()])) {
        tempTableData = new LigandDataToTable(data.ligands, data.modifications, this.molstarResidueInfo());
      } else if (
        tabName === TabNames.Macromolecules &&
        this.isNotUndefined([data.carbohydrates, data.uniprotMapping, data.bestStrMapUniProtId, data.macromolecules, this.molstarResidueInfo()])
      ) {
        tempTableData = new MacromoleculeDataToTable(
          data.carbohydrates,
          data.uniprotMapping!,
          data.bestStrMapUniProtId!,
          data.macromolecules,
          this.molstarResidueInfo()
        );
      } else {
        continue;
      }

      tempTableData.generateTableData();
      tempTableData.generateTableFilters();
      this.compCommunication.setTabData(tabName, tempTableData);
    }

    this.compCommunication.isTabDataGenerated.set(true);
    this.tabDataLoaded.set(true);
    this.tableData.set(this.compCommunication.getTabData(this.tabName()));
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
