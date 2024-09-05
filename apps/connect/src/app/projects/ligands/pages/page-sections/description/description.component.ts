import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionData } from '../../../services/aggregated-api.service';
import { MaterialModule, TruncateTextDirective, UtilService } from '@pdbc/core';
import { MatDialog } from '@angular/material/dialog';
import { BondsTableDialogComponent } from '../../section-components/bonds-table-dialog/bonds-table-dialog.component';
import { AtomsTableDialogComponent } from '../../section-components/atoms-table-dialog/atoms-table-dialog.component';
import { LigandSmilesPipe, Smile } from '../../../ligandsmiles.pipe';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { CCDsDirective } from '../../../description-contains-ccds.directive';

@Component({
  selector: 'pdbc-description',
  standalone: true,
  imports: [CommonModule, TruncateTextDirective, MaterialModule, LigandSmilesPipe, ToolTipComponent, CCDsDirective],
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LigandSmilesPipe],
})
export class DescriptionComponent {
  public description = input.required<DescriptionData>();
  public ligandId = input.required<string>();

  private readonly dialog = inject(MatDialog);
  private readonly utilService = inject(UtilService);
  private readonly smilesPipe = inject(LigandSmilesPipe);

  public copy(value: string): void {
    this.utilService.copy(value);
  }

  public copySmiles(smiles: Smile[]) {
    const result = this.smilesPipe.transform(smiles);
    this.utilService.copy(result ?? '');
  }

  public openAtomsDialog() {
    this.dialog.open(AtomsTableDialogComponent, {
      disableClose: false,
      panelClass: 'bond-Dialog',
      data: {
        ligandId: this.ligandId(),
      },
    });
  }

  public openBondsDialog() {
    this.dialog.open(BondsTableDialogComponent, {
      disableClose: false,
      panelClass: 'bond-Dialog',
      data: {
        ligandId: this.ligandId(),
      },
    });
  }
}
