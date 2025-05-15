import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, Output, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import Clarity from '@microsoft/clarity';

@Component({
  selector: 'pdbc-entry-dropdown',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './entry-dropdown.component.html',
  styleUrl: './entry-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryDropdownComponent {
  /**
   * NOTE
   * This component is a version of libs/pdbe/dropdown-menu adapted
   * for functionality of the new entry pages.
   * Perhaps it should be merged to it in the future
   */
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

  /**
   * When a option that is not a link or a downloadable URL is clicked this function is triggered.
   * It emits a string with the option name to optionClickedEvent that can be listened by parent components
   * @param optionName
   */
  public optionClicked(optionName: string) {
    this.currentSelection.set(optionName);
    this.optionClickedEvent.emit(optionName);
  }

  public menuOpened() {
    const tag = this.nameToEventTag(this.title());
    Clarity.event(`file-menu-opened-${tag}`);
  }

  public optionDownloaded(optionName: string) {
    const tag = this.nameToEventTag(optionName);
    Clarity.event('file-downloaded');
    Clarity.event(`file-downloaded-${tag}`);
  }

  public optionViewed(optionName: string) {
    const tag = this.nameToEventTag(optionName);
    Clarity.event('file-viewed');
    Clarity.event(`file-viewed-${tag}`);
  }

  private nameToEventTag(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
}
