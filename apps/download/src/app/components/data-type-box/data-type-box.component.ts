import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DownloadService, MaterialModule } from '@pdbc/core';
import { DataType } from '../../models/data-type-box.model';
import { DataContentComponent } from '../data-content/data-content.component';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { environment } from '../../../environments/environment';
import { DownloadType } from '../../enums/downloadType.enum';

@Component({
  selector: 'app-data-type-box',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, DataContentComponent, ToolTipComponent],
  templateUrl: './data-type-box.component.html',
  styleUrl: './data-type-box.component.scss',
})
export class DataTypeBoxComponent implements OnInit {
  public readonly downloadService = inject(DownloadService);
  private readonly fileDownloadUrl = `${environment.baseUrl}pdbe/download/api/pdb/`;

  public readonly dataType = input.required<DataType>();
  public readonly downloadType = input.required<DownloadType>();

  public readonly types = DownloadType;

  public chosenformat!: string;
  public pdbid!: string;

  ngOnInit(): void {
    if (localStorage['pdbIds']) {
      this.pdbid = localStorage.getItem('pdbIds') ?? '';
    }
  }

  public submit(apiType: string): void {
    if (!this.pdbid) {
      const errorText = `Please enter at least one ${this.dataType().descriptorType['idType']} ID.`;
      this.downloadService.updateErrorText(this.downloadType(), errorText);
      return;
    }

    if (!this.chosenformat) {
      const errorText = `Please choose the type of ${this.dataType().descriptorType['idType']} data to download.`;
      this.downloadService.updateErrorText(this.downloadType(), errorText);
      return;
    }

    this.downloadService.initiateDownload(this.fileDownloadUrl, apiType, this.pdbid, this.chosenformat, this.downloadType());
    localStorage.clear();
  }
}
