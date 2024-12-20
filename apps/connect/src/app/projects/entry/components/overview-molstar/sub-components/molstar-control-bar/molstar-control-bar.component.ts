// tab-nav.component.ts
import { Component, computed, effect, inject } from '@angular/core';
import { OverviewStateManagementService } from '../../state-management.service';
import { MolstarSelectionObj } from '../../../../helpers/molstar/molstar-helpers';
import { OverviewMolstarFacade } from '../../data-processing.facade';
import { MolstarOverviewForTopPage } from '../../../../helpers/molstar/molstar-overview-for-top-page';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pdbc-overview-molstar-control-bar',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatOptionModule, MatFormFieldModule, MatLabel, FormsModule],
  templateUrl: './molstar-control-bar.component.html',
  styleUrl: './molstar-control-bar.component.scss',
})
export class OverviewMolstarControBarComponent {
  public readonly molstarOverview = inject(MolstarOverviewForTopPage);
  public readonly dataProcessing = inject(OverviewMolstarFacade);
  public readonly stateManagement = inject(OverviewStateManagementService);

  public selectedItem: string | undefined;
  public selectionList: string[] = [];

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

      this.stateManagement.switchMolstarZoomed(currentSelection.selection);
    });
  }

  public async onMolstarSelect(event: MatSelectChange) {
    const currentTabName = this.currentTab();

    // get index of dropdown value
    const idx = this.selectionList.indexOf(event.value);
    this.stateManagement.updateStatePropertyOfTab(currentTabName, 'currentListViewSelectionIdx', idx);

    // update current molstar selection obj
    const newSelection = this.currentListViewSelectionTemp()!.molstarNamedSelections[idx];
    this.stateManagement.updateStatePropertyOfTab(currentTabName, 'currentMolstarSelection', newSelection.selection);

    // refresh display of current
    this.stateManagement.switchMolstarZoomed(this.currentMolstarSelection());
  }
}
