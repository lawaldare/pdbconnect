import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionData } from '../../../services/aggregated-api.service';
import { MaterialModule, TruncateTextDirective } from '@pdbc/core';
import { ClipboardModule, Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pdbc-description',
  standalone: true,
  imports: [CommonModule, TruncateTextDirective, MaterialModule, ClipboardModule],
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionComponent {
  @Input() description!: DescriptionData;

  private clipboard = inject(Clipboard);
  private _snackBar = inject(MatSnackBar);

  public copy(value: string): void {
    const result = this.clipboard.copy(value);
    if (result) {
      this.openSnackBar('Copied to clipboard successfully', 'Dismiss');
    }
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
