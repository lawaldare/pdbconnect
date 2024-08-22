import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DownloadService, MaterialModule } from '@pdbc/core';
import { DataType } from '../../models/data-type-box.model';
import { DataContentComponent } from '../data-content/data-content.component';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';

@Component({
  selector: 'app-data-type-box',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, DataContentComponent, ToolTipComponent],
  templateUrl: './data-type-box.component.html',
  styleUrl: './data-type-box.component.scss',
})
export class DataTypeBoxComponent implements OnInit {
  private readonly downloadService = inject(DownloadService);
  public readonly dataType = input.required<DataType>();
  public chosenformat!: string;
  public pdbid!: string;
  public isLoadingEntry = this.downloadService.isLoadingEntry;
  public errorEntryText = this.downloadService.errorEntryText;

  ngOnInit(): void {
    if (localStorage['pdbIds']) {
      this.pdbid = localStorage.getItem('pdbIds') ?? '';
    }
  }

  public submit(apiType: string): void {
    if (!this.pdbid) {
      const errorText = `Please enter at least one ${this.dataType().descriptorType['idType']} ID.`;
      this.downloadService.showErrorText(errorText);
      return;
    }

    if (!this.chosenformat) {
      const errorText = `Please choose the type of ${this.dataType().descriptorType['idType']} data to download.`;
      this.downloadService.showErrorText(errorText);
      return;
    }

    this.downloadService.initiateDownload(apiType, this.pdbid, this.chosenformat);
  }
}
