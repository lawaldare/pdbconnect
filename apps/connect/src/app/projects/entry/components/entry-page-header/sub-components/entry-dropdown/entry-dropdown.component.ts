import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, input, linkedSignal, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import Clarity from '@microsoft/clarity';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pdbc-entry-dropdown',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './entry-dropdown.component.html',
  styleUrl: './entry-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryDropdownComponent implements OnInit {
  /**
   * NOTE
   * This component is a version of libs/pdbe/dropdown-menu adapted
   * for functionality of the new entry pages.
   * Perhaps it should be merged to it in the future
   */
  private readonly destroyRef = inject(DestroyRef);

  public readonly title = input.required<string>();

  public readonly options = input.required<any[] | undefined>();
  public readonly backgroundColor = input<string>('#FFF');
  public readonly islink = input.required<boolean>();

  public readonly isdark = input<boolean>(false);
  public readonly fullwidth = input<boolean>(false);
  public readonly issmall = input<boolean>(false);

  public readonly downloadable = input.required<boolean>();
  @Output() optionClickedEvent = new EventEmitter<string>();

  public searchTerm = new FormControl('');

  public currentSelection = signal<string | undefined>(undefined);

  public filteredOptions = linkedSignal({
    source: this.options,
    computation: () => this.options() ?? [],
  });

  ngOnInit(): void {
    this.searchTerm.valueChanges
      .pipe(
        map((searchQuery: string | null) => {
          if (searchQuery) {
            return this.filterItemsBySearchQuery(searchQuery, this.options() ?? []);
          } else {
            return this.options() ?? [];
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: any) => {
        this.filteredOptions.set(data);
      });
  }

  private filterItemsBySearchQuery(searchQuery: string, items: any[]): any[] {
    return items.filter((item) => {
      const searchQueryLower = searchQuery.toLocaleLowerCase();
      return (
        item.group.toLocaleLowerCase().indexOf(searchQueryLower) !== -1 ||
        item.items
          .map((c: any) => c.name)
          .join(',')
          .toLocaleLowerCase()
          .indexOf(searchQueryLower) !== -1
      );
    });
  }

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
