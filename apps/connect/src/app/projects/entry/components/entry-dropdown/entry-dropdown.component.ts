import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';

@Component({
  selector: 'pdbc-entry-dropdown',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './entry-dropdown.component.html',
  styleUrl: './entry-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryDropdownComponent {
  public readonly title = input.required<string>();
  public readonly options = input.required<DownloadOption[] | undefined>();
  public readonly backgroundColor = input<string>('#FFF');
  public readonly islink = input.required<boolean>();
  public readonly isdark = input.required<boolean>();
  public readonly downloadable = input.required<boolean>();
  public readonly optionClickedEvent = output<string>();

  public optionClicked(optionName: string) {
    this.optionClickedEvent.emit(optionName);
  }
}
