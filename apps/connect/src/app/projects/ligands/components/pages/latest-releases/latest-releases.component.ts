import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { headerLogoMenuConfig, ligandHomePageSeaderSearchConfig } from '../../../ligand.constant';
import { AG_Grid_Theme_Class, agGridOptionsBase, HeaderLogoMenuConfig } from '@pdbc/core';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { UniProtAccessionRendererComponent } from '../../cell renderers/lr-uniprot-accession/lr-uniprot-accession.component';

export interface LatestRelease {
  ligandCode: string;
  pdb_id: string | string[];
  pubmed_id: string;
  uniprot_accession: string[];
}

@Component({
  selector: 'pdbc-latest-releases',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent, AgGridAngular],
  templateUrl: './latest-releases.component.html',
  styleUrl: './latest-releases.component.scss',
})
export class LatestReleasesComponent {
  public readonly headerLogoMenuConfig = { ...headerLogoMenuConfig, isHomePage: true } as HeaderLogoMenuConfig;
  public readonly headerSearchConfig = { ...ligandHomePageSeaderSearchConfig, backgroundColor: 'rgba(8, 95, 92, 0.80)' };
  private readonly aggregatedApiService = inject(AggregatedApiService);

  public readonly gridOptions: GridOptions = {
    ...agGridOptionsBase,
    paginationPageSize: 10,
  };

  public readonly themeClass = AG_Grid_Theme_Class;

  public readonly colDefs: ColDef[] = [
    {
      headerName: 'Ligand code',
      field: 'ligandCode',
      width: 150,
      cellRenderer: UniProtAccessionRendererComponent,
      cellRendererParams: {
        type: 'ligandCode',
      },
      valueFormatter: () => '',
    },
    {
      headerName: 'Structure',
      field: 'ligandCode',
      filter: false,
      width: 300,
      cellRenderer: UniProtAccessionRendererComponent,
      cellRendererParams: {
        type: 'structure',
      },
      valueFormatter: () => '',
    },
    {
      headerName: 'PDBe entry',
      field: 'pdb_id',
      width: 300,
      cellRenderer: UniProtAccessionRendererComponent,
      cellRendererParams: {
        type: 'pdbeentry',
      },
      valueFormatter: () => '',
    },
    {
      headerName: 'PubMed',
      field: 'pubmed_id',
      width: 150,
      cellRenderer: UniProtAccessionRendererComponent,
      cellRendererParams: {
        type: 'pubmed',
      },
      valueFormatter: () => '',
    },
    {
      headerName: 'UniProt accession',
      field: 'uniprot_accession',
      cellRenderer: UniProtAccessionRendererComponent,
      cellRendererParams: {
        type: 'uniprot',
      },
      width: 470,
      filter: false,
      valueFormatter: () => '',
    },
  ];

  public rowData = signal<LatestRelease[]>([]);

  public paginationPageSizeSelector = signal<number[]>([10, 20, 50, 100]);

  onGridReady(event: GridReadyEvent): void {
    this.aggregatedApiService.getLatestReleases().subscribe((releases) => {
      const mapToGetLigandCode = releases.response.docs.map((release: any) => {
        const ligandCode = release.new_revised_ligand[0].split(':')[0].trim();
        delete release['new_revised_ligand'];
        return {
          ...release,
          ligandCode,
        };
      });
      const mappedresult = this.transformData(mapToGetLigandCode);
      this.rowData.update(() => mappedresult);
    });
  }

  private transformData(input: { pdb_id: string; pubmed_id: string; uniprot_accession: string[]; ligandCode: string }[]) {
    const result = [];
    const ligandMap = {} as any;

    input.forEach((item) => {
      const { pdb_id, pubmed_id, uniprot_accession, ligandCode } = item;

      // Filter out uniprot_accession values containing '-' or 'PRO'
      const filteredAccessions = uniprot_accession ? uniprot_accession.filter((acc) => !acc.includes('-') && !acc.includes('PRO')) : [];

      // Check if ligandCode is already in the map
      if (ligandMap[ligandCode]) {
        // Update existing entry in the map
        const existingEntry = ligandMap[ligandCode];

        // Add new pdb_id if not already present
        if (!existingEntry.pdb_id.includes(pdb_id)) {
          existingEntry.pdb_id = Array.isArray(existingEntry.pdb_id) ? [...existingEntry.pdb_id, pdb_id] : [existingEntry.pdb_id, pdb_id];
        }

        // Add pubmed_id if present since it's gonna be the same for the same ligandCode
        if (pubmed_id) {
          existingEntry.pubmed_id = pubmed_id;
        }

        // Add unique uniprot_accession codes if available
        if (filteredAccessions.length) {
          const filteredExistingAccessions = existingEntry.uniprot_accession.filter((acc: string | string[]) => !acc.includes('-') && !acc.includes('PRO'));
          existingEntry.uniprot_accession = [...new Set([...filteredExistingAccessions, ...filteredAccessions])];
        }
      } else {
        // Add new entry in the map
        ligandMap[ligandCode] = {
          pdb_id: pdb_id,
          pubmed_id: pubmed_id || null,
          uniprot_accession: filteredAccessions || [],
          ligandCode: ligandCode,
        };
      }
    });

    // Convert map to result array and handle single pdb_id
    for (const key in ligandMap) {
      const entry = ligandMap[key];
      if (Array.isArray(entry.pdb_id) && entry.pdb_id.length === 1) {
        entry.pdb_id = entry.pdb_id[0]; // If only one pdb_id, convert to string
      }
      result.push(entry);
    }

    return result;
  }
}

const a = [
  {
    pdb_id: '8s85',
    pubmed_id: '39447537',
    uniprot_accession: ['P23458'],
    ligandCode: 'A1H5R',
  },
  {
    pdb_id: '8rpc',
    pubmed_id: '39441986',
    uniprot_accession: ['W7JM86'],
    ligandCode: 'A1H19',
  },
  {
    pdb_id: '8s00',
    pubmed_id: '39441903',
    uniprot_accession: ['Q5CR27'],
    ligandCode: 'A1H4W',
  },
  {
    pdb_id: '3rme',
    pubmed_id: '20666458',
    uniprot_accession: ['Q9BZP6', 'PRO_0000011944', 'Q9BZP6-3', 'Q9BZP6-2'],
    ligandCode: 'A1BEM',
  },
  {
    pdb_id: '8z2i',
    pubmed_id: '39419144',
    uniprot_accession: ['W0TJ64'],
    ligandCode: 'A1L0L',
  },
  {
    pdb_id: '8yup',
    ligandCode: 'A1LZ3',
  },
  {
    pdb_id: '8yup',
    uniprot_accession: ['P0A7V0', 'PRO_0000134165'],
    ligandCode: 'A1LZ3',
  },
  {
    pdb_id: '8yup',
    uniprot_accession: ['P0A7V3', 'PRO_0000130113'],
    ligandCode: 'A1LZ3',
  },
  {
    pdb_id: '8yup',
    uniprot_accession: ['P0A7S9', 'PRO_0000132089'],
    ligandCode: 'A1LZ3',
  },
  {
    pdb_id: '8yup',
    uniprot_accession: ['P0A7T3'],
    ligandCode: 'A1LZ3',
  },
  {
    pdb_id: '8mnp',
    uniprot_accession: ['P0A883', 'PRO_0000134165'],
    ligandCode: 'A1LZ3',
  },
  {
    pdb_id: '8mnp',
    uniprot_accession: ['P0A7U7', 'PRO_0000167958'],
    ligandCode: 'A1LZ3',
  },
];

const b = [
  {
    pdb_id: '8s85',
    pubmed_id: '39447537',
    uniprot_accession: ['P23458'],
    ligandCode: 'A1H5R',
  },
  {
    pdb_id: '8rpc',
    pubmed_id: '39441986',
    uniprot_accession: ['W7JM86'],
    ligandCode: 'A1H19',
  },
  {
    pdb_id: '8s00',
    pubmed_id: '39441903',
    uniprot_accession: ['Q5CR27'],
    ligandCode: 'A1H4W',
  },
  {
    pdb_id: '3rme',
    pubmed_id: '20666458',
    uniprot_accession: ['Q9BZP6', 'PRO_0000011944', 'Q9BZP6-3', 'Q9BZP6-2'],
    ligandCode: 'A1BEM',
  },
  {
    pdb_id: '8z2i',
    pubmed_id: '39419144',
    uniprot_accession: ['W0TJ64'],
    ligandCode: 'A1L0L',
  },
  {
    pdb_id: ['8yup', '8mnp'],
    ligandCode: 'A1LZ3',
    uniprot_accession: ['W0TJ64', 'P0A7V0', 'PRO_0000134165', 'P0A7V3', 'PRO_0000130113', 'P0A7S9', 'PRO_0000132089', 'P0A7T3', 'P0A7U7', 'PRO_0000167958'],
    pubmed_id: '39419144',
  },
];
