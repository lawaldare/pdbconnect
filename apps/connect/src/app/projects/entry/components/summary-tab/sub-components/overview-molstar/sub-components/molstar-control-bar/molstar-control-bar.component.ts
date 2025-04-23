// tab-nav.component.ts
import { Component, computed, effect, inject } from '@angular/core';
import { OverviewStateManagementService } from '../../state-management.service';
import { OverviewMolstarFacade } from '../../data-processing.facade';
import { MolstarOverviewForTopPage } from '../../../../../../helpers/molstar/molstar-overview-for-top-page';
import { CommonModule } from '@angular/common';
import { EntryDropdownComponent } from '../../../../../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
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

  public stateSelectionIdx = this.stateManagement.currentSelectionIdx;
  public stateMolstarSelections = this.stateManagement.currentMolstarSelections;
  public stateMolstarSelectionNames = this.stateManagement.currentMolstarSelectionsNames;

  // Create a computed signal for a specific property
  public currentMolstarSelection = computed(() => {
    const currentIdx = this.stateSelectionIdx();
    return this.stateMolstarSelections()[currentIdx];
  });

  constructor() {
    effect(async () => {
      if (this.stateMolstarSelections().length > 0) {
        const currentIdx = this.stateSelectionIdx();
        this.selectedItem = this.stateMolstarSelectionNames()[currentIdx];
        this.selectionList = this.stateMolstarSelectionNames();
        this.selectionOptions = this.stateMolstarSelectionNames().map((selName, idx) => {
          return {
            name: selName,
            url: `${idx + 1}`,
            downloadable: false,
          };
        });
        this.stateManagement.switchMolstarZoomed(this.currentMolstarSelection());
      }
    });
  }

  public async onMolstarSelect(event: string) {
    // get index of dropdown value
    const newSelectionIdx = this.selectionList.indexOf(event);
    const sameSelectedItem = this.selectedItem === this.selectionList[newSelectionIdx];
    if (sameSelectedItem) return;

    const listViewItem = this.stateManagement.lastListViewItem!;
    const listViewItemType = this.stateManagement.listViewItemType!;

    let viewName = '';
    if (listViewItemType === 'macromolecule') {
      const tabType = this.stateManagement.lastMacromoleculeState.split('/')[0];
      const macroIdx = this.stateManagement.lastMacromoleculeState.split('/')[1];
      this.stateManagement.lastMacromoleculeState = `${tabType}/${macroIdx}/${newSelectionIdx}`;
      viewName = 'Macromolecules';
    } else if (listViewItemType === 'ligand') {
      const tabType = this.stateManagement.lastLigandsState.split('/')[0];
      const ligandIdx = this.stateManagement.lastLigandsState.split('/')[1];
      this.stateManagement.lastLigandsState = `${tabType}/${ligandIdx}/${newSelectionIdx}`;
      viewName = 'Ligands';
    } else if (listViewItemType === 'modification') {
      const tabType = this.stateManagement.lastModificationsState.split('/')[0];
      const modIdx = this.stateManagement.lastModificationsState.split('/')[1];
      this.stateManagement.lastModificationsState = `${tabType}/${modIdx}/${newSelectionIdx}`;
      viewName = 'Modifications';
    } else if (listViewItemType === 'domain') {
      console.error('Domains should not contain sub-selections!');
    }
    this.stateManagement.lastListViewItem = undefined;
    this.stateManagement.updateMolstarItemSelection(listViewItem, listViewItemType);
    // this.stateManagement.updateMolstarAccordionSelection(viewName);
  }
}
