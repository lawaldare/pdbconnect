import { ElementRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { MolstarOverviewForTopPage } from '../../../../helpers/molstar/molstar-overview-for-top-page';
import { OverviewMolstarFacade } from './data-processing.facade';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../../../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { ActionQueueService } from '../../../../services/action-queue.service';

@Injectable({
  providedIn: 'root',
})
export class OverviewStateManagementService {
  public readonly dataProcessing = inject(OverviewMolstarFacade);
  public readonly molstarOverview = inject(MolstarOverviewForTopPage);
  private readonly actionQueue = inject(ActionQueueService);
  public infoControls = signal<ElementRef | undefined>(undefined);

  public currentSelectionIdx: WritableSignal<number> = signal(-1);
  public currentMolstarSelectionsNames: WritableSignal<string[]> = signal([]);
  public currentMolstarSelections: WritableSignal<MolstarSelectionObj[]> = signal([]);

  public currentView = 'Assembly';

  public lastMacromoleculeState = 'none';
  public lastLigandsState = 'none';
  public lastDomainsState = 'none';
  public lastModificationsState = 'none';
  public lastListViewItem?: MacromoleculesRowData | LigandsRowData | DomainsRowData;
  public listViewItemType?: string;

  // 'assets/img/interfaces_example2.png'
  public async updateMolstarAccordionSelection(newView: string) {
    this.currentView = newView;

    let lastStateName = '';
    let accordionType = '';
    if (newView === 'Assembly') {
      // await this.molstarOverview.viewPreferredAssembly();

      // trigger molstar update
      this.actionQueue.addAction(
        `renderOverviewPreferredAssembly`,
        async () => {
          await this.molstarOverview.renderOverviewPreferredAssembly();
        },
        true // skippable
      );
      this.molstarOverview.currentViewName = 'Overview-Preferred Assembly';

      this.currentSelectionIdx.set(-1);
      this.currentMolstarSelectionsNames.set([]);
      this.currentMolstarSelections.set([]);
    } else if (newView === 'Macromolecules') {
      lastStateName = this.lastMacromoleculeState;
      accordionType = 'macromolecule';
    } else if (newView === 'Ligands') {
      lastStateName = this.lastLigandsState;
      accordionType = 'ligand';
    } else if (newView === 'Domains') {
      lastStateName = this.lastDomainsState;
      accordionType = 'domain';
    } else if (newView === 'Modifications') {
      lastStateName = this.lastModificationsState;
      accordionType = 'modification';
    }
    // if state string has selection and sub-selection items (separated by '/')
    if (lastStateName !== 'none' && lastStateName.includes('/')) {
      // guess selected list view item from last state name
      await this.renderListViewSelectionState(accordionType, undefined, lastStateName);
    } else {
      // show pre-selection 3D state
      await this.renderPreSelectionState(accordionType);
    }
  }

  public async updateMolstarItemSelection(listViewItem: MacromoleculesRowData | LigandsRowData | DomainsRowData | undefined, accordionType: string) {
    const sameListViewItem = this.lastListViewItem !== undefined && this.lastListViewItem === listViewItem;

    // if list view item is deselected (clicked 2 times)
    if (sameListViewItem) {
      // reset view name so deselection can occur
      this.molstarOverview.currentViewName = 'none';
      this.currentSelectionIdx.set(-1);
      listViewItem = undefined;

      // deselect macromolecule, ligand, domain or modification
      await this.renderPreSelectionState(accordionType);
    }
    this.lastListViewItem = listViewItem;
    this.listViewItemType = accordionType;

    // select macromolecule, ligand , domain, modification
    await this.renderListViewSelectionState(accordionType, listViewItem);
    return;
  }

  private async renderListViewSelectionState(accordionType: string, listViewItem?: MacromoleculesRowData | LigandsRowData | DomainsRowData, stateName?: string) {
    if (!listViewItem && !stateName) return;
    if (!listViewItem && stateName) {
      listViewItem = this.getSelectionFromStateName(accordionType);
    }

    const molstarSelections: MolstarSelectionObj[] =
      accordionType !== 'domain' ? (listViewItem as MacromoleculesRowData | LigandsRowData).additionalData.selections : [];
    const molstarSelectionsNames: string[] = accordionType !== 'domain' ? (listViewItem as MacromoleculesRowData | LigandsRowData).additionalData.selectionNames : [];

    this.currentMolstarSelections.set(molstarSelections);
    this.currentMolstarSelectionsNames.set(molstarSelectionsNames);

    if (accordionType === 'macromolecule') {
      const macromolecule = listViewItem as MacromoleculesRowData;
      const macromoleculeIdx = this.dataProcessing.processedMacromolecules().indexOf(macromolecule);

      const selectionIdx = stateName ? parseInt(stateName.split('/')[2]) : this.getLastListItemSubSelection(macromoleculeIdx, this.lastMacromoleculeState);
      this.currentSelectionIdx.set(selectionIdx);

      // trigger molstar update
      this.actionQueue.addAction(
        `renderOverviewSpecificMacromolecule`,
        async () => {
          await this.molstarOverview.renderOverviewSpecificMacromolecule(macromolecule, macromoleculeIdx, selectionIdx);
        },
        true // skippable
      );
      this.lastMacromoleculeState = `Overview-Macromolecules/${macromoleculeIdx}/${selectionIdx}`;
    }
    if (accordionType === 'ligand') {
      const ligand = listViewItem as LigandsRowData;
      const ligandsIdx = this.dataProcessing.processedLigands().indexOf(ligand);

      const selectionIdx = stateName ? parseInt(stateName.split('/')[2]) : this.getLastListItemSubSelection(ligandsIdx, this.lastLigandsState);
      this.currentSelectionIdx.set(selectionIdx);

      // trigger molstar update
      this.actionQueue.addAction(
        `renderOverviewSpecificLigand`,
        async () => {
          await this.molstarOverview.renderOverviewSpecificLigand(ligand, ligandsIdx, selectionIdx);
        },
        true // skippable
      );
      this.lastLigandsState = `Overview-Ligands/${ligandsIdx}/${selectionIdx}`;
    }
    if (accordionType === 'domain') {
      const domain = listViewItem as DomainsRowData;
      const domainsIdx = this.dataProcessing.processedDomainsAsList().indexOf(domain);

      this.currentSelectionIdx.set(0);

      // trigger molstar update
      this.actionQueue.addAction(
        `renderOverviewSpecificDomain`,
        async () => {
          await this.molstarOverview.renderOverviewSpecificDomain(domain);
        },
        true // skippable
      );
      this.updateAccordionStateName(accordionType, `Overview-Domains/${domainsIdx}`);
    }
    if (accordionType === 'modification') {
      const modification = listViewItem as LigandsRowData;
      const modificationsIdx = this.dataProcessing.processedModifications().indexOf(modification);

      const selectionIdx = stateName ? parseInt(stateName.split('/')[2]) : this.getLastListItemSubSelection(modificationsIdx, this.lastModificationsState);
      this.currentSelectionIdx.set(selectionIdx);

      // trigger molstar update
      this.actionQueue.addAction(
        `renderOverviewSpecificModification`,
        async () => {
          await this.molstarOverview.renderOverviewSpecificModification(modification, modificationsIdx, selectionIdx);
        },
        true // skippable
      );
      this.updateAccordionStateName(accordionType, `Overview-Modifications/${modificationsIdx}/${selectionIdx}`);
    }
  }

  private getSelectionFromStateName(accordionType: string) {
    if (accordionType === 'macromolecule') {
      const macromoleculeIdx = parseInt(this.lastMacromoleculeState.split('/')[1]);
      const macromolecule = this.dataProcessing.processedMacromolecules()[macromoleculeIdx];
      return macromolecule;
    }
    if (accordionType === 'ligand') {
      const ligandsIdx = parseInt(this.lastLigandsState.split('/')[1]);
      const ligand = this.dataProcessing.processedLigands()[ligandsIdx];
      return ligand;
    }
    if (accordionType === 'domain') {
      const domainsIdx = parseInt(this.lastDomainsState.split('/')[1]);
      const domain = this.dataProcessing.processedDomainsAsList()[domainsIdx];
      return domain;
    } else {
      // same as if (accordionType === 'modification') {
      const modificationsIdx = parseInt(this.lastModificationsState.split('/')[1]);
      const modification = this.dataProcessing.processedModifications()[modificationsIdx];
      return modification;
    }
  }

  private getLastListItemSubSelection(listItemSelectionIdx: number, stateName: string) {
    let subSelectionIdx = 0;
    // if state has '/' we have selections (specific macromolecule, ligand, etc)
    // and sub-selections (specific chain or residue in dropdown)
    if (stateName !== 'none' && stateName.includes('/')) {
      // selection and sub-selections indexes are split by '/' inside state string
      const nestedStateIndexes = stateName.split('/');

      const lastListItemSelectionState = parseInt(nestedStateIndexes[1]);
      const lastListItemSubSelectionState = parseInt(nestedStateIndexes[2]);

      // we only load a sub-selection if last selected state was the same as the currently clicked
      if (lastListItemSelectionState === listItemSelectionIdx) {
        subSelectionIdx = lastListItemSubSelectionState || 0;
      }
    }
    return subSelectionIdx;
  }

  private async renderPreSelectionState(accordionType: string) {
    // update signals to remove Chain/Residue subselection dropdowns
    this.currentMolstarSelections.set([]);
    this.currentMolstarSelectionsNames.set([]);

    if (accordionType === 'macromolecule') {
      // trigger molstar update
      this.actionQueue.addAction(
        `renderOverviewMacromolecules`,
        async () => {
          await this.molstarOverview.renderOverviewMacromolecules();
        },
        true // skippable
      );

      // memorize last state by string
      this.updateAccordionStateName(accordionType, 'Overview-Macromolecules');
    }
    if (accordionType === 'ligand') {
      // trigger molstar update
      this.actionQueue.addAction(
        `renderOverviewLigands`,
        async () => {
          await this.molstarOverview.renderOverviewLigands();
        },
        true // skippable
      );
      // memorize last state by string
      this.updateAccordionStateName(accordionType, 'Overview-Ligands');
    }
    if (accordionType === 'domain') {
      const domainsOfResource = this.dataProcessing
        .processedDomainsAsList()
        .filter((eachDomain) => eachDomain.resource === this.dataProcessing.currentDomainResource());

      // trigger molstar update
      this.actionQueue.addAction(
        `renderOverviewDomains`,
        async () => {
          await this.molstarOverview.renderOverviewDomains(domainsOfResource);
        },
        true // skippable
      );
      // memorize last state by string
      this.updateAccordionStateName(accordionType, 'Overview-Domains');
    }
    if (accordionType === 'modification') {
      // trigger molstar update
      this.actionQueue.addAction(
        `renderOverviewModifications`,
        async () => {
          await this.molstarOverview.renderOverviewModifications();
        },
        true // skippable
      );
      // memorize last state by string
      this.updateAccordionStateName(accordionType, 'Overview-Modifications');
    }
  }

  private updateAccordionStateName(accordionType: string, newStateName: string) {
    if (accordionType === 'macromolecule') {
      this.lastMacromoleculeState = newStateName;
    }
    if (accordionType === 'ligand') {
      this.lastLigandsState = newStateName;
    }
    if (accordionType === 'domain') {
      this.lastDomainsState = newStateName;
    }
    if (accordionType === 'modification') {
      this.lastModificationsState = newStateName;
    }
    this.molstarOverview.currentViewName = newStateName;
  }

  async switchMolstarZoomed(molstarSelection?: MolstarSelectionObj) {
    if (molstarSelection) {
      await this.molstarOverview.focusLoci(molstarSelection);
    } else {
      await this.molstarOverview.focusStructure();
    }
  }
}
