import { Component, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Chain, LigandStructure } from '../../../data-models/structure.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AG_Grid_Theme_Class,
  agGridOptionsBase,
  DownloadFileTypeService,
  DownloadService,
  ExternalLinkRendererComponent,
  GoogleAnalyticsService,
  MaterialModule,
} from '@pdbc/core';
import { catchError, map, take, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LigandTotalDialogComponent } from '../../section-components/ligand-total-dialog/ligand-total-dialog.component';
import { environment } from '../../../../../../environments/environment';
import { LigandInteractingChainsNumberPipe } from '../../../pipes/ligandInteractingChainsNumber.pipe';
import { MatRadioChange } from '@angular/material/radio';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { TotalStructureRendererComponent } from '../../cell renderers/total-structure.component';
import { LigandAnnotationRendererComponent } from '../../cell renderers/ligand-annotation.component';
import { LigandUtilService } from '../../../ligand-util.service';
import { SpeciesRendererComponent } from '../../cell renderers/species.component';
import { combineLatest, of } from 'rxjs';
import { LigandStoreState } from '../../../store/biodata.model';
import { Store } from '@ngrx/store';
import { LigandSelectors } from '../../../store/ligand.selectors';

@Component({
  selector: 'pdbc-structures',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LigandInteractingChainsNumberPipe, AgGridAngular, MaterialModule],
  templateUrl: './structures.component.html',
  styleUrls: ['./structures.component.scss'],
  providers: [LigandInteractingChainsNumberPipe],
})
export class StructuresComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly chainPipe = inject(LigandInteractingChainsNumberPipe);
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  private readonly downloadService = inject(DownloadService);
  private readonly fileDownloadUrl = `${environment.pdbeBaseUrl}download/api/pdb/`;
  private readonly ligandUtilService = inject(LigandUtilService);

  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly globalStore = inject(Store<LigandStoreState>);

  public dataStatistics = signal<string>('');
  public filter = new FormControl('proteins');
  private ligandId = signal<string>('');
  public readonly gridOptions: GridOptions = {
    ...agGridOptionsBase,
    defaultColDef: {
      ...agGridOptionsBase.defaultColDef,
      // filter: false,
    },
    paginationPageSize: 10,
    context: this,
  };

  public readonly themeClass = AG_Grid_Theme_Class;

  public readonly colDefs: ColDef[] = [
    {
      headerName: 'Protein name',
      field: 'name',
      width: 300,
    },
    {
      headerName: 'PDBe-KB link',
      field: 'uniprot_id',
      cellRenderer: ExternalLinkRendererComponent,
      width: 160,
    },
    {
      headerName: 'Total structures',
      field: 'interacting_chains',
      cellRenderer: TotalStructureRendererComponent,
      cellRendererParams: {
        onValueClicked: (params: any) => this.openTotalDialog(params.data.interacting_chains),
      },
      valueGetter: (params: any) => {
        return this.chainPipe.transform(params.data.interacting_chains);
      },
      hide: false,
      width: 150,
      comparator: (a, b): number => a - b,
      filter: 'agNumberColumnFilter',
      sort: 'desc',
    },
    {
      headerName: 'PDB ID and Chain',
      field: 'pdb_id',
      cellRenderer: (params: any) => `<div>
      <a href="https://www.ebi.ac.uk/pdbe/entry/pdb/${params.value}/bound/${this.ligandId()}" target="_blank">${params.value}</a>
      <i class="icon icon-link icon-common" style="margin-left: 5px;"></i>
      </div>`,
      hide: true,
      width: 150,
    },
    {
      headerName: 'Organism',
      field: 'organism',
      cellRenderer: SpeciesRendererComponent,
      comparator: (a, b): number => {
        return a.scientific_name?.toLocaleLowerCase().localeCompare(b.scientific_name?.toLocaleLowerCase(), 'en', { sensitivity: 'base' });
      },
      // valueGetter: (params) => params.data.organism?.scientific_name ?? 'Unspecified',
      filter: 'agTextColumnFilter',
      minWidth: 160,
    },
    {
      headerName: 'EC number',
      field: 'ec_number',
      valueFormatter: (params: any) => {
        return params.data.ec_numbers?.join(', ');
      },
      width: 150,
    },
    {
      headerName: 'Ligand function',
      field: 'annotations',
      filter: true,
      cellRenderer: LigandAnnotationRendererComponent,
      width: 170,
    },
  ];

  public rowData = signal<LigandStructure[]>([]);
  public proteins = signal<LigandStructure[]>([]);
  public structures = signal<LigandStructure[]>([]);

  public paginationPageSizeSelector = signal<number[]>([10, 20, 50, 100]);
  private gridApi!: GridApi;

  onGridReady(event: GridReadyEvent<any>) {
    // this.rowData = this.assemblies();
    // event.api.autoSizeAllColumns();
    this.gridApi = event.api;
    combineLatest([this.globalStore.select(LigandSelectors.ligandId), this.globalStore.select(LigandSelectors.structures)])
      .pipe(
        tap(([ligandId, structures]) => {
          this.ligandId.set(ligandId);
        }),
        map(([, structures]) => {
          this.generateStructures(structures);
          this.proteins.update(() => [...structures]);
          this.rowData.update(() => [...this.proteins()]);
          this.fetchDataStatistics(structures);
        }),
        catchError((error) => {
          console.error('Error fetching ligand structures:', error);
          this.rowData.update(() => []);
          return of([]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  // private setLoading(value: boolean) {
  //   this.gridApi.setGridOption('loading', value);
  // }

  onChange(event: MatRadioChange) {
    const filterSelected = event.value;
    if (filterSelected === 'proteins') {
      this.gridApi.setColumnsVisible(['pdb_id'], false);
      this.gridApi.setColumnsVisible(['interacting_chains'], true);
      this.rowData.update(() => [...this.proteins()]);
    } else {
      this.gridApi.setColumnsVisible(['pdb_id'], true);
      this.gridApi.setColumnsVisible(['interacting_chains'], false);
      this.rowData.update(() => [...this.structures()]);
    }
  }

  public resetColumns() {
    this.gridApi.setColumnsVisible(['pdb_id'], false);
    this.gridApi.setColumnsVisible(['interacting_chains'], true);
  }

  private generateStructures(data: LigandStructure[]): void {
    const structures = data.reduce((acc: any, structure) => {
      structure.interacting_chains.forEach((chain) => {
        acc.push({
          ...structure,
          name: chain.entity_name,
          organism: chain.organisms[0],
          pdb_id: `${chain.pdb_id}_${chain.auth_asym_id}`,
        });
      });
      return acc;
    }, []);
    this.structures.update(() => [...structures]);
  }

  private fetchDataStatistics(data: LigandStructure[]): void {
    let proteins = 0;
    let structures = 0;

    for (const structure of data) {
      if (structure.uniprot_id) {
        proteins++;
      }
      const total = this.chainPipe.transform(structure.interacting_chains);
      structures += total;
    }
    this.dataStatistics.set(`Found in ${proteins} Proteins and ${structures} PDB Structures. Group data by: `);
  }

  public downloadMMCIF() {
    const mappedData = this.rowData().reduce((acc: string[], structure) => {
      acc = [...acc, ...structure.interacting_chains.map((c) => c.pdb_id)];
      return acc;
    }, []);

    const uniqueData = [...new Set(mappedData)];

    if (uniqueData.length <= 100) {
      this.downloadService.initiateDownload(this.fileDownloadUrl, 'entry', uniqueData.join(','), 'updated-mmCIF');
    } else {
      //go to download service
      localStorage.setItem('pdbIds', uniqueData.join(','));
      const url = `${environment.pdbeBaseUrl}download/docs`;
      window.open(url);
    }
    this.googleAnalyticsService.logClickEvents('download_coordinates_mmcif', 'Download', 'download_mmcif', 'Download coordinates');
  }

  public downloadCSV(): void {
    const mappedData = this.rowData().map((structure) => {
      return {
        'Protein Name': structure.name,
        'PDBe-KB Proteins': structure.uniprot_id,
        'EC Numbers': (structure.ec_numbers ?? []).join(','),
        'Ligand Annotation': (structure.annotations ?? []).join(','),
        'All Structures (list:pdb:auth_asym_id:struct_asym_id)': this.getInteractingChain(structure.interacting_chains),
        'Total Structures': this.chainPipe.transform(structure.interacting_chains),
      };
    });

    this.downloadFileTypeService.downloadCSV(mappedData, 'structures');
    this.googleAnalyticsService.logClickEvents('download_structure_csv', 'Download', 'download_csv', 'Download structures');
  }

  private getInteractingChain(chains: Chain[]): string {
    return chains.map((chain) => `${chain.pdb_id}:${chain.auth_asym_id}:${chain.struct_asym_id}`).join(', ');
  }

  public openTotalDialog(data: Chain[]) {
    this.dialog.open(LigandTotalDialogComponent, {
      disableClose: false,
      panelClass: 'ligand-total-Dialog',
      data: data,
    });
  }
}
