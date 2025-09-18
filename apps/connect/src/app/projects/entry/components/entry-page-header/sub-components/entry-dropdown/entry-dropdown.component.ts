/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, input, linkedSignal, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import Clarity from '@microsoft/clarity';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EntryDropdownFacade } from './entry-dropdown.facade';

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
  private readonly facade = inject(EntryDropdownFacade);

  public readonly title = input.required<string>();

  public readonly options = input.required<any[] | undefined>();
  public readonly searchTitle = input.required<string>();
  public readonly backgroundColor = input<string>('#FFF');
  public readonly islink = input.required<boolean>();

  public readonly isdark = input<boolean>(false);
  public readonly fullwidth = input<boolean>(false);
  public readonly issmall = input<boolean>(false);

  public readonly downloadable = input.required<boolean>();
  public readonly searchable = input<boolean>(true);

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
            return this.facade.filterItemsBySearchQuery(searchQuery, this.options() ?? []);
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

  public optionClicked(optionName: string) {
    this.currentSelection.set(optionName);
    this.optionClickedEvent.emit(optionName);
  }

  public menuOpened() {
    const tag = this.facade.nameToEventTag(this.title());
    if ((window as any).clarity) {
      Clarity.event(`file-menu-opened-${tag}`);
    }
  }

  public optionDownloaded(optionName: string) {
    const tag = this.facade.nameToEventTag(optionName);
    if ((window as any).clarity) {
      Clarity.event('file-downloaded');
      Clarity.event(`file-downloaded-${tag}`);
    }
  }

  public optionViewed(optionName: string) {
    const tag = this.facade.nameToEventTag(optionName);
    if ((window as any).clarity) {
      Clarity.event('file-viewed');
      Clarity.event(`file-viewed-${tag}`);
    }
  }
}
