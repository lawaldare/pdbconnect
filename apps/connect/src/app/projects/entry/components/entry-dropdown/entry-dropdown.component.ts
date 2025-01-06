import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, Output, output, signal } from '@angular/core';
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

  public readonly isdark = input<boolean>(false);
  public readonly fullwidth = input<boolean>(false);
  public readonly issmall = input<boolean>(false);

  public readonly downloadable = input.required<boolean>();
  @Output() optionClickedEvent = new EventEmitter<string>();

  public currentSelection = signal<string | undefined>(undefined);

  public optionClicked(optionName: string) {
    this.currentSelection.set(optionName);
    this.optionClickedEvent.emit(optionName);
  }
}
