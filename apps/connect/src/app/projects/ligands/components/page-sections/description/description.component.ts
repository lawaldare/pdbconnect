import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionData } from '../../../services/aggregated-api.service';
import { GoogleAnalyticsService, MaterialModule, TruncateTextDirective, UtilService } from '@pdbc/core';
import { MatDialog } from '@angular/material/dialog';
import { BondsTableDialogComponent } from '../../section-components/bonds-table-dialog/bonds-table-dialog.component';
import { AtomsTableDialogComponent } from '../../section-components/atoms-table-dialog/atoms-table-dialog.component';
import { CCDsDirective } from '../../../directives/description-contains-ccds.directive';
import { RouterModule } from '@angular/router';
import { LigandSmilesPipe, Smile } from '../../../pipes/ligandsmiles.pipe';
import { LigandUtilService } from '../../../ligand-util.service';
import { IsPartOfDirective } from '../../../directives/is-part-of.directive';
import { ComponentType } from '@angular/cdk/overlay';
import { LigandSmilesDirective } from '../../../directives/ligandsmiles.directive';
import { combineLatest, map } from 'rxjs';
import { LigandStoreState } from '../../../store/ligand-store.model';
import { Store } from '@ngrx/store';
import { LigandSelectors } from '../../../store/ligand.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pdbc-description',
  standalone: true,
  imports: [CommonModule, TruncateTextDirective, IsPartOfDirective, MaterialModule, CCDsDirective, RouterModule, LigandSmilesDirective],
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  providers: [LigandSmilesPipe],
})
export class DescriptionComponent implements OnInit {
  public description = signal<DescriptionData>({} as DescriptionData);
  public ligandId = signal<string>('');
  public supercomponents = signal<string[]>([]);
  public isMainLigandId = signal(true);
  private readonly destroyRef = inject(DestroyRef);

  private readonly dialog = inject(MatDialog);
  private readonly utilService = inject(UtilService);
  private readonly smilesPipe = inject(LigandSmilesPipe);
  private readonly ligandUtilService = inject(LigandUtilService);

  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly globalStore = inject(Store<LigandStoreState>);

  ngOnInit(): void {
    combineLatest([
      this.globalStore.select(LigandSelectors.ligandId),
      this.globalStore.select(LigandSelectors.description),
      this.globalStore.select(LigandSelectors.supercomponents),
    ])
      .pipe(
        map(([ligandId, description, supercomponents]) => {
          if (ligandId.startsWith('CLC') || ligandId.startsWith('PRD')) {
            this.isMainLigandId.set(false);
          } else {
            this.isMainLigandId.set(true);
          }
          this.description.update(() => description);
          this.supercomponents.update(() => supercomponents);
          this.ligandId.update(() => ligandId);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public downloadIds(): void {
    this.ligandUtilService.downloadTxt(this.supercomponents(), 'supercomponents');
    this.googleAnalyticsService.logClickEvents('download_clc_id_list', 'Download', 'download_clc_ids', 'CLC ID List');
  }

  public copy(value: string, label: string): void {
    this.utilService.copy(value);
    this.googleAnalyticsService.logClickEvents('copy_chemical_data', 'Chemical Info', 'copy_formula', label);
  }

  public copySmiles(smiles: Smile[], label: string): void {
    const result = this.smilesPipe.transform(smiles);
    this.utilService.copy(result ?? '');
    this.googleAnalyticsService.logClickEvents('copy_chemical_data', 'Chemical Info', 'copy_formula', label);
  }

  public openDialog(type: string) {
    const eventName = type === 'atom' ? 'view_atoms_button_click' : 'view_bonds_button_click';
    const eventLabel = type === 'atom' ? 'View Atoms' : 'View Bonds';
    const eventAction = type === 'atom' ? 'view_atoms' : 'view_bonds';
    this.googleAnalyticsService.logClickEvents(eventName, 'Interaction', eventAction, eventLabel);
    const component: ComponentType<any> = type === 'atom' ? AtomsTableDialogComponent : BondsTableDialogComponent;
    this.dialog.open(component, {
      disableClose: false,
      panelClass: 'bond-Dialog',
      data: {
        ligandId: this.ligandId(),
      },
    });
  }
}
