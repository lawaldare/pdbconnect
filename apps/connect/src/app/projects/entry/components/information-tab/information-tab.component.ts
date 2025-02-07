import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../store/entry.selectors';
import { EntryDropdownComponent } from '../entry-dropdown/entry-dropdown.component';
import { MainInformationAreaComponent } from '../main-information-area/main-information-area.component';
import { OverviewMolstarComponent } from '../overview-molstar/overview-molstar.component';

@Component({
  selector: 'pdbc-information-tab',
  imports: [CommonModule, EntryDropdownComponent, MainInformationAreaComponent, OverviewMolstarComponent],
  templateUrl: './information-tab.component.html',
  styleUrl: './information-tab.component.scss',
})
export class InformationTabComponent {
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly resolutionValues = toSignal(this.globalStore.select(EntrySelectors.resolutionValues));
  public readonly experimentalMethod = toSignal(this.globalStore.select(EntrySelectors.experimentalMethod));
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly downloadOptions = toSignal(this.globalStore.select(EntrySelectors.downloadOptions));
  public readonly viewOptions = toSignal(this.globalStore.select(EntrySelectors.viewOptions));
}
