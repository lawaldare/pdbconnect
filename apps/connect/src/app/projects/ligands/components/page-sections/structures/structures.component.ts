import { Component, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Chain, LigandStructure } from '../../../data-models/structure.model';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AG_Grid_Theme_Class, agGridOptionsBase, DownloadFileTypeService, DownloadService, ExternalLinkRendererComponent, MaterialModule } from '@pdbc/core';
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

  public dataStatistics = signal<string>('');
  public filter = new FormControl('proteins');

  public readonly gridOptions: GridOptions = {
    ...agGridOptionsBase,
    defaultColDef: {
      ...agGridOptionsBase.defaultColDef,
      filter: false,
    },
    paginationPageSize: 10,
    context: this,
  };

  public readonly themeClass = AG_Grid_Theme_Class;

  public readonly colDefs: ColDef[] = [
    {
      headerName: 'Protein name',
      field: 'name',
    },
    {
      headerName: 'PDBe-KB link',
      field: 'uniprot_id',
      cellRenderer: ExternalLinkRendererComponent,
    },
    {
      headerName: 'Total structures',
      field: 'count',
      cellRenderer: TotalStructureRendererComponent,
      cellRendererParams: {
        onValueClicked: (params: any) => this.openTotalDialog(params.data.interacting_chains),
      },
    },
    {
      headerName: 'Species',
    },
    {
      headerName: 'EC number',
      field: 'ec_number',
      cellRenderer: (params: any) => {
        return params.data.ec_numbers?.join(', ');
      },
    },
    {
      headerName: 'Ligand annotation',
      field: 'annotations',
      filter: true,
      cellRenderer: LigandAnnotationRendererComponent,
    },
  ];

  public rowData = signal<LigandStructure[]>([]);
  public paginationPageSizeSelector = signal<number[]>([10, 20, 50]);

  onGridReady(params: GridReadyEvent<any>) {
    // this.rowData = this.assemblies();
    // this.gridApi = params.api;
    this.route.params
      .pipe(
        switchMap((params: { [x: string]: string }) => {
          const ligandId = params['ligandId'].toUpperCase();
          return this.aggregatedApiService.fetchLigandStructures(ligandId);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: LigandStructure[]) => {
        this.rowData.update(() => [...data]);
        this.fetchDataStatistics(data);
        this.paginationPageSizeSelector.update((options) => [...new Set([...options, data.length])]);
      });
  }

  onChange(event: MatRadioChange) {
    const filterSelected = event.value;
    console.log(filterSelected);
  }

  private fetchDataStatistics(data: LigandStructure[]): void {
    let proteins = 0;
    const proteinsArray = [];
    let structures = 0;

    for (const structure of data) {
      if (structure.uniprot_id) {
        proteins++;
        proteinsArray.push(structure);
      }
      const total = this.chainPipe.transform(structure.interacting_chains);
      structures += total;
    }
    console.log(proteinsArray);
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
