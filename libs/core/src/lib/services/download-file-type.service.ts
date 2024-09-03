import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class DownloadFileTypeService {
  public downloadCSV(data: any[], fileTile: string): void {
    const timeStamp = new Date().toISOString();
    const fileName = `${fileTile}-${timeStamp}`;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Structures');
    XLSX.writeFile(workbook, `${fileName}.csv`, { compression: true });
  }
}
