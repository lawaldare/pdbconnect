import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionData } from '../../../services/aggregated-api.service';
import { MaterialModule, TruncateTextDirective, UtilService } from '@pdbc/core';
import { MatDialog } from '@angular/material/dialog';
import { BondsTableDialogComponent } from '../../section-components/bonds-table-dialog/bonds-table-dialog.component';
import { AtomsTableDialogComponent } from '../../section-components/atoms-table-dialog/atoms-table-dialog.component';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { CCDsDirective } from '../../../directives/description-contains-ccds.directive';
import { RouterModule } from '@angular/router';
import { LigandSmilesPipe, Smile } from '../../../pipes/ligandsmiles.pipe';
import { LigandUtilService } from '../../../ligand-util.service';
import { IsPartOfDirective } from '../../../directives/is-part-of.directive';
import { ComponentType } from '@angular/cdk/overlay';

@Component({
  selector: 'pdbc-description',
  standalone: true,
  imports: [CommonModule, TruncateTextDirective, IsPartOfDirective, MaterialModule, LigandSmilesPipe, ToolTipComponent, CCDsDirective, RouterModule],
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  providers: [LigandSmilesPipe],
})
export class DescriptionComponent {
  public description = input.required<DescriptionData>();
  public ligandId = input.required<string>();
  public supercomponents = input.required<string[]>();
  public isMainLigandId = signal(true);

  private readonly dialog = inject(MatDialog);
  private readonly utilService = inject(UtilService);
  private readonly smilesPipe = inject(LigandSmilesPipe);
  private readonly ligandUtilService = inject(LigandUtilService);

  constructor() {
    effect(
      () => {
        if (this.ligandId().startsWith('CLC') || this.ligandId().startsWith('PRD')) {
          this.isMainLigandId.set(false);
        } else {
          this.isMainLigandId.set(true);
        }
      },
      { allowSignalWrites: true }
    );
  }

  public downloadIds(): void {
    this.ligandUtilService.downloadTxt(this.supercomponents(), 'supercomponents');
  }

  public copy(value: string): void {
    this.utilService.copy(value);
  }

  public copySmiles(smiles: Smile[]) {
    const result = this.smilesPipe.transform(smiles);
    this.utilService.copy(result ?? '');
  }

  public openDialog(type: string) {
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
