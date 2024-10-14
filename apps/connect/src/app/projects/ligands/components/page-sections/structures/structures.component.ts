import { Component, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Chain, LigandStructure } from '../../../data-models/structure.model';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { ActivatedRoute } from '@angular/router';
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
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { LigandTotalDialogComponent } from '../../section-components/ligand-total-dialog/ligand-total-dialog.component';
import { environment } from '../../../../../../environments/environment';
import { LigandInteractingChainsNumberPipe } from '../../../pipes/ligandInteractingChainsNumber.pipe';
import { MatRadioChange } from '@angular/material/radio';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { TotalStructureRendererComponent } from '../../cell renderers/total-structure.component';
import { LigandAnnotationRendererComponent } from '../../cell renderers/ligand-annotation.component';

@Component({
  selector: 'pdbc-structures',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LigandInteractingChainsNumberPipe, AgGridAngular, MaterialModule],
  templateUrl: './structures.component.html',
  styleUrls: ['./structures.component.scss'],
  providers: [LigandInteractingChainsNumberPipe],
})
export class StructuresComponent {
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly chainPipe = inject(LigandInteractingChainsNumberPipe);
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  private readonly downloadService = inject(DownloadService);
  private readonly fileDownloadUrl = `${environment.pdbeBaseUrl}download/api/pdb/`;

  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

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
      headerName: 'Species',
      field: 'species',
      valueGetter: (params: any) => {
        const scientificName = params.data.species?.scientific_name ?? '';
        const commonName = params.data.species?.common_name ? `(${params.data.species.common_name})` : '';
        return scientificName + commonName || '---';
      },
      comparator: (a, b): number => {
        return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase(), 'en', { sensitivity: 'base' });
      },
      filter: 'agTextColumnFilter',
      minWidth: 160,
      cellClass: 'species-cell',
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

  public paginationPageSizeSelector = signal<number[]>([10, 20, 50]);
  private gridApi!: GridApi;

  onGridReady(event: GridReadyEvent<any>) {
    // this.rowData = this.assemblies();
    // event.api.autoSizeAllColumns();
    this.gridApi = event.api;
    this.route.params
      .pipe(
        switchMap((params: { [x: string]: string }) => {
          this.resetColumns();
          this.setLoading(true);
          const ligandId = params['ligandId'].toUpperCase();
          this.ligandId.set(ligandId);
          return this.aggregatedApiService.fetchLigandStructures(ligandId);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(
        (data: LigandStructure[]) => {
          this.generateStructures(data);
          this.proteins.update(() => [...data]);
          this.rowData.update(() => [...this.proteins()]);
          this.fetchDataStatistics(data);
          this.paginationPageSizeSelector.update((options) => [...new Set([...options, data.length])]);
          this.setLoading(false);
        },
        (error) => {
          console.error('Error fetching ligand structures:', error);
          this.setLoading(false);
          this.rowData.update(() => []);
        }
      );
  }

  private setLoading(value: boolean) {
    this.gridApi.setGridOption('loading', value);
  }

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
    this.paginationPageSizeSelector.update((options) => [...new Set([...options, this.rowData().length])]);
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
