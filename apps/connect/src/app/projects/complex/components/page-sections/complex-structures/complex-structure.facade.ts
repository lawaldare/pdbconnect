import { inject, Injectable } from '@angular/core';
import { DownloadFileTypeService, DownloadService } from '@pdbc/core';
import { GridApi } from 'ag-grid-community';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ComplexStructureFacade {
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  private readonly downloadService = inject(DownloadService);
  private readonly fileDownloadUrl = `${environment.baseUrl}pdbe/download/api/pdb/`;

  public filterItemsBySearchQuery(searchQuery: string, items: any[]): any[] {
    return items.filter((item) => {
      const searchQueryLower = searchQuery.toLocaleLowerCase();
      const pdb = item.pdb_id;
      const expMethod = item.experimental_method;
      const title = item.title;
      const resolution = String(item.resolution);
      const rowString = pdb + expMethod + title + resolution;
      return rowString.toLocaleLowerCase().indexOf(searchQueryLower) !== -1;
    });
  }

  public downloadCSV(gridApi: GridApi): void {
    const mappedData: any[] = [];
    gridApi?.forEachNodeAfterFilter((node: any) => {
      mappedData.push({
        PDB: node.data.pdb_id,
        ID: node.data.assembly_id,
        Title: node.data.title,
        'Experimental Method': node.data.experimental_method,
        Resolution: node.data.resolution,
      });
    });

    this.downloadFileTypeService.downloadCSV(mappedData, 'structures');
  }

  public downloadMMCIF(gridApi: GridApi): void {
    let pdbIds = '';
    gridApi?.forEachNodeAfterFilter((node: any) => {
      pdbIds += node.data.pdb_id + ',';
    });
    pdbIds = pdbIds.slice(0, -1);

    if (pdbIds.split(',').length <= 100) {
      this.downloadService.initiateDownload(this.fileDownloadUrl, 'entry', pdbIds, 'updated-mmCIF');
    } else {
      //go to download service
      localStorage.setItem('pdbIds', pdbIds);
      const url = `${environment.baseUrl}pdbe/download/docs`;
      window.open(url);
    }
  }
}
