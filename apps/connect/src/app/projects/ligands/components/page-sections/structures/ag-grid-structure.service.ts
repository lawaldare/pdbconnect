import { inject, Injectable, signal } from '@angular/core';
import { agGridOptionsBase, ExternalLinkRendererComponent } from '@pdbc/core';
import { GridOptions, ColDef } from 'ag-grid-community';
import { TotalStructureRendererComponent } from '../../cell renderers/total-structure.component';
import { Chain } from '../../../data-models/structure.model';
import { LigandTotalDialogComponent } from '../../section-components/ligand-total-dialog/ligand-total-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PDBIdChainRendererComponent } from '../../cell renderers/pdb-id-chain.component';
import { SpeciesRendererComponent } from '../../cell renderers/species.component';
import { LigandAnnotationRendererComponent } from '../../cell renderers/ligand-annotation.component';

@Injectable({
  providedIn: 'root',
})
export class AgGridStructureService {
  private readonly dialog = inject(MatDialog);
  public ligandId = signal<string>('');

  public readonly gridOptions = signal<GridOptions>({
    ...agGridOptionsBase,
    paginationPageSize: 10,
  });

  public readonly structureColDefs = signal<ColDef[]>([
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
        return this.transform(params.data.interacting_chains);
      },
      hide: false,
      width: 150,
      comparator: (a, b): number => a - b,
      filter: 'agNumberColumnFilter',
      sort: 'desc',
      valueFormatter: () => '',
    },
    {
      headerName: 'PDB ID and Chain',
      field: 'pdb_id',
      cellRenderer: PDBIdChainRendererComponent,
      cellRendererParams: {
        ligandId: this.ligandId,
      },
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
      filter: 'agTextColumnFilter',
      minWidth: 160,
      valueFormatter: () => '',
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
      valueFormatter: () => '',
    },
  ]);

  public openTotalDialog(data: Chain[]) {
    this.dialog.open(LigandTotalDialogComponent, {
      disableClose: false,
      panelClass: 'ligand-total-Dialog',
      data: data,
    });
  }

  private transform(value: Chain[]): number {
    if (value === null || value.length === 0) {
      return 0;
    }

    const mappedValue = value.map((val) => val.pdb_id);

    return [...new Set(mappedValue)].length;
  }
}
