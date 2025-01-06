// tab-nav.component.ts
import { Component, computed, effect, inject } from '@angular/core';
import { OverviewStateManagementService } from '../../state-management.service';
import { MolstarSelectionObj } from '../../../../helpers/molstar/molstar-helpers';
import { OverviewMolstarFacade } from '../../data-processing.facade';
import { MolstarOverviewForTopPage } from '../../../../helpers/molstar/molstar-overview-for-top-page';
import { CommonModule } from '@angular/common';
import { EntryDropdownComponent } from '../../../../components/entry-dropdown/entry-dropdown.component';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';

@Component({
  selector: 'pdbc-overview-molstar-control-bar',
  standalone: true,
  imports: [CommonModule, EntryDropdownComponent],
  templateUrl: './molstar-control-bar.component.html',
  styleUrl: './molstar-control-bar.component.scss',
})
export class OverviewMolstarControBarComponent {
  public readonly molstarOverview = inject(MolstarOverviewForTopPage);
  public readonly dataProcessing = inject(OverviewMolstarFacade);
  public readonly stateManagement = inject(OverviewStateManagementService);

  public selectedItem = 'Loading...';
  public selectionList: string[] = [];
  public selectionOptions: DownloadOption[] = [];

  public listViewSelectablesByTab = this.dataProcessing.listViewSelectablesByTab;

  public currentTab = this.stateManagement.currentTab;
  public tabsStates = this.stateManagement.tabsStates;

  // Create a computed signal for a specific property
  public currentListViewSelectionIdx = computed(() => {
    const tabName = this.currentTab();
    return this.tabsStates()[tabName]?.currentListViewSelectionIdx;
  });

  // Create a computed signal for a specific property
  public currentListViewSelectionTemp = computed(() => {
    const tabName = this.currentTab();
    return this.tabsStates()[tabName]?.currentListViewSelectionTemp;
  });

  // Create a computed signal for a specific property
  public currentMolstarSelection = computed(() => {
    const tabName = this.currentTab();
    return this.tabsStates()[tabName]?.currentMolstarSelection || undefined;
  });

  constructor() {
    effect(async () => {
      const currentListView = this.currentListViewSelectionTemp()!;
      const currentSelection = currentListView.molstarNamedSelections[this.currentListViewSelectionIdx()];

      this.selectedItem = currentSelection.name;
      this.selectionList = currentListView.molstarNamedSelections.map((eachSelection) => eachSelection.name);

      this.selectionOptions = currentListView.molstarNamedSelections.map((eachSelection, idx) => {
        return {
          name: eachSelection.name,
          url: `${idx + 1}`,
          downloadable: false,
        };
      });

      this.stateManagement.switchMolstarZoomed(currentSelection.selection);
    });
  }

  public async onMolstarSelect(event: string) {
    const currentTabName = this.currentTab();

    // get index of dropdown value
    const idx = this.selectionList.indexOf(event);
    this.stateManagement.updateStatePropertyOfTab(currentTabName, 'currentListViewSelectionIdx', idx);

    // update current molstar selection obj
    const newSelection = this.currentListViewSelectionTemp()!.molstarNamedSelections[idx];
    this.stateManagement.updateStatePropertyOfTab(currentTabName, 'currentMolstarSelection', newSelection.selection);

    // refresh display of current
    this.stateManagement.switchMolstarZoomed(this.currentMolstarSelection());
  }
}
