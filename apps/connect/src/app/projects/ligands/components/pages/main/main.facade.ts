import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { LigandUtilService } from '../../../ligand-util.service';
import { AggregatedApiService, DescriptionData } from '../../../services/aggregated-api.service';
import { catchError, combineLatest, map, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { MatDialog } from '@angular/material/dialog';
import { MolstarDialogComponent } from '@pdbe-lib/molstar-for-apps';

@Injectable({
  providedIn: 'root',
})
export class MainComponentFacade {
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ligandUtilService = inject(LigandUtilService);
  private readonly dialog = inject(MatDialog);

  private ligandId = signal<string>('');

  public supercomponents = signal<string[]>([]);

  public description = signal<DescriptionData>({} as DescriptionData);
  public downloadOptions = signal<DownloadOption[]>([]);

  public init(ligandId: string): void {
    this.ligandId.set(ligandId);
    combineLatest([
      this.aggregatedApiService.fetchDescription(ligandId),
      this.aggregatedApiService.fetchDownload(ligandId).pipe(catchError(() => of({}))),
      this.aggregatedApiService.fetchSupercomponents(ligandId).pipe(catchError(() => of([]))),
      of(ligandId),
    ])
      .pipe(
        map(([descriptionData, downloadData, supercomponents, ligandId]) => {
          this.supercomponents.set(supercomponents);
          return {
            processDescriptionData: this.aggregatedApiService.processDescriptionData(ligandId, descriptionData),
            processDownloadData: this.aggregatedApiService.processDownloadData(ligandId, downloadData),
          };
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: { processDescriptionData: DescriptionData; processDownloadData: { cif: any; idealSDF: any; modelSDF: any; modelCML: any } }) => {
        this.description.set(data.processDescriptionData);
        this.downloadOptions.set([
          { name: 'CIF file', url: data.processDownloadData.cif, downloadable: true },
          { name: 'Ideal SDF', url: data.processDownloadData.idealSDF, downloadable: true },
          { name: 'Model SDF', url: data.processDownloadData.modelSDF, downloadable: true },
          { name: 'Model CML', url: data.processDownloadData.modelCML, downloadable: true },
        ]);
      });
  }

  public openMolstarDialog(): void {
    this.dialog.open(MolstarDialogComponent, {
      disableClose: false,
      panelClass: 'molstarDialog',
      data: {
        moleculeId: this.ligandId(),
        fragments: this.ligandUtilService.fragments,
      },
    });
  }
}
