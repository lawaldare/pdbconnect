import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@pdbc/core';
import { DataType } from '../../models/data-type-box.model';
import { DataContentComponent } from '../data-content/data-content.component';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { DownloadService } from '../../ds.service';
import { downloadParams, fdsTypeDict } from '../../constants';
import { UtilsService } from '../../util.service';
import { catchError, EMPTY, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-data-type-box',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, DataContentComponent, ToolTipComponent],
  templateUrl: './data-type-box.component.html',
  styleUrl: './data-type-box.component.scss',
})
export class DataTypeBoxComponent {
  private readonly downloadService = inject(DownloadService);
  private readonly utilService = inject(UtilsService);
  private readonly destroyRef = inject(DestroyRef);

  private fdsConfig!: Record<string, string[]>;

  public readonly dataType = input.required<DataType>();
  public chosenformat!: string;
  public pdbid!: string;
  public isLoadingEntry = signal(false);
  public errorEntryText = signal('');
  public fdstype = signal('');
  public hashedUrl = signal('');

  private readonly downloadParams = downloadParams;
  private readonly fdsTypeDict = fdsTypeDict;

  public submit(apiType: string): void {
    this.fdsConfig = {};

    this.isLoadingEntry.set(true);
    if (!this.pdbid) {
      const errorText = `Please enter at least one ${this.dataType().descriptorType['idType']} ID.`;
      this.showErrorText(errorText);
      return;
    }

    if (!this.chosenformat) {
      const errorText = `Please choose the type of ${this.dataType().descriptorType['idType']} data to download.`;
      this.showErrorText(errorText);
      return;
    }

    const correctIds = this.utilService.cleanUpIds(this.pdbid);

    this.fdsConfig = { ids: correctIds };

    this.getDownloadParams(apiType);
  }

  private getDownloadParams(apiType: string): void {
    this.fdstype.set(this.fdsTypeDict[this.chosenformat]);
    if (this.chosenformat in this.downloadParams) {
      for (const key in this.downloadParams[this.chosenformat]) {
        const value = this.downloadParams[this.chosenformat][key];
        this.fdsConfig[key] = value;
      }
    }
    this.postFile(apiType);
  }

  private getFile(apiType: string): void {
    this.downloadService
      .getFileDownloadServer(this.hashedUrl())
      .pipe(
        map((response) => {
          if (response.status == '200') {
            setTimeout(() => {
              this.utilService.downloadFile(response.body, `${this.chosenformat}.tar.gz`, 'application/tar+gzip');
              this.isLoadingEntry.set(false);
            }, 1000);
          } else if (response.status == '202') {
            setTimeout(() => {
              this.getFile(apiType);
            }, 500);
          } else {
            const errorText = `Error: The download server returns non 200/202 status: ${response.status}`;
            this.showErrorText(errorText);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private postFile(apiType: string): void {
    this.downloadService
      .postFileDownloadServer(apiType, this.fdstype(), this.fdsConfig)
      .pipe(
        map((response) => {
          this.errorEntryText.set('');
          this.hashedUrl.set(response.url.replace('http:', 'https:'));
          this.getFile(apiType);
        }),
        catchError((error) => {
          this.showErrorText(error);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private showErrorText(text: string): void {
    this.errorEntryText.set(text);
    this.isLoadingEntry.set(false);
    setTimeout(() => {
      this.errorEntryText.set('');
    }, 3000);
  }
}
