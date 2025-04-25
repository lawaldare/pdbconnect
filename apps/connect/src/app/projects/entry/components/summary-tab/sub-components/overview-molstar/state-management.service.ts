import { ElementRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { COLORBREWER_SET2_COLORS, DEFAULT_SET_25, ELEMENT_COLORS_HEX, MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { MolstarOverviewForTopPage } from '../../../../helpers/molstar/molstar-overview-for-top-page';
import { OverviewMolstarFacade } from './data-processing.facade';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../../../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { getLigandEntityId, getMacromoleculeEntityId } from '../../../../helpers/processed-data-to-controls';
import { BANG_WONG_COLORBLIND_SCALE, FILTERED_KELLY22_COLORBLIND_SCALE } from '../../../../entry-constant';

@Injectable({
  providedIn: 'root',
})
export class OverviewStateManagementService {
  public readonly dataProcessing = inject(OverviewMolstarFacade);
  public readonly molstarOverview = inject(MolstarOverviewForTopPage);
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

    if (newView === 'Assembly') {
      // await this.molstarOverview.viewPreferredAssembly();
      await this.molstarOverview.renderOverviewPreferredAssembly();
      this.molstarOverview.currentViewName = 'Overview-Preferred Assembly';

      this.currentSelectionIdx.set(-1);
      this.currentMolstarSelectionsNames.set([]);
      this.currentMolstarSelections.set([]);
    } else if (newView === 'Macromolecules') {
      let macromoleculeIdx: number | undefined = undefined;
      let selectionIdx: number | undefined = undefined;
      let macromolecule: MacromoleculesRowData | undefined = undefined;
      let macromoleculeSelections: MolstarSelectionObj[] = [];
      let macromoleculeSelectionsNames: string[] = [];

      if (this.lastMacromoleculeState !== 'none' && this.lastMacromoleculeState.includes('/')) {
        macromoleculeIdx = parseInt(this.lastMacromoleculeState.split('/')[1]);
        selectionIdx = parseInt(this.lastMacromoleculeState.split('/')[2]);
        macromolecule = this.dataProcessing.processedMacromolecules()[macromoleculeIdx];
        macromoleculeSelections = macromolecule.additionalData.selections;
        macromoleculeSelectionsNames = macromolecule.additionalData.selectionNames;

        this.currentSelectionIdx.set(selectionIdx);
        this.currentMolstarSelections.set(macromoleculeSelections);
        this.currentMolstarSelectionsNames.set(macromoleculeSelectionsNames);

        await this.molstarOverview.renderOverviewSpecificMacromolecule(macromolecule, macromoleculeIdx, selectionIdx);
        this.lastMacromoleculeState = `Overview-Macromolecules/${macromoleculeIdx}/${selectionIdx}`;
        this.molstarOverview.currentViewName = `Overview-Macromolecules/${macromoleculeIdx}/${selectionIdx}`;
      } else {
        this.currentMolstarSelections.set(macromoleculeSelections);
        this.currentMolstarSelectionsNames.set(macromoleculeSelectionsNames);
        await this.molstarOverview.renderOverviewMacromolecules();
        this.lastMacromoleculeState = 'Overview-Macromolecules';
        this.molstarOverview.currentViewName = 'Overview-Macromolecules';
      }
      // const macromoleculesState = await this.molstarOverview.viewMacromolecules(macromolecule, macromoleculeIdx, selectionIdx);
      // this.lastMacromoleculeState = macromoleculesState;
    } else if (newView === 'Ligands') {
      let ligandsIdx: number | undefined = undefined;
      let selectionIdx: number | undefined = undefined;
      let ligand: LigandsRowData | undefined = undefined;
      let ligandSelections: MolstarSelectionObj[] = [];
      let ligandSelectionNames: string[] = [];
      if (this.lastLigandsState !== 'none' && this.lastLigandsState.includes('/')) {
        ligandsIdx = parseInt(this.lastLigandsState.split('/')[1]);
        selectionIdx = parseInt(this.lastLigandsState.split('/')[2]);

        ligand = this.dataProcessing.processedLigands()[ligandsIdx];
        ligandSelections = ligand.additionalData.selections;
        ligandSelectionNames = ligand.additionalData.selectionNames;

        this.currentSelectionIdx.set(selectionIdx);
        this.currentMolstarSelections.set(ligandSelections);
        this.currentMolstarSelectionsNames.set(ligandSelectionNames);

        await this.molstarOverview.renderOverviewSpecificLigand(ligand, ligandsIdx, selectionIdx);
        this.lastLigandsState = `Overview-Ligands/${ligandsIdx}/${selectionIdx}`;
        this.molstarOverview.currentViewName = `Overview-Ligands/${ligandsIdx}/${selectionIdx}`;
      } else {
        this.currentMolstarSelections.set(ligandSelections);
        this.currentMolstarSelectionsNames.set(ligandSelectionNames);

        await this.molstarOverview.renderOverviewLigands();
        this.lastLigandsState = 'Overview-Ligands';
        this.molstarOverview.currentViewName = 'Overview-Ligands';
      }
      // const ligandsState = await this.molstarOverview.viewLigands(ligand, ligandsIdx, selectionIdx);
      // this.lastLigandsState = ligandsState;
    } else if (newView === 'Domains') {
      let domainsIdx: number | undefined = undefined;
      let domain = undefined;
      let domainColor = undefined;

      const domainsOfResource = this.dataProcessing
        .processedDomainsAsList()
        .filter((eachDomain) => eachDomain.resource === this.dataProcessing.currentDomainResource());
      const domainColors = domainsOfResource.map((eachDomain) => this.getMolstarColor(eachDomain, 'domain'));

      // each domain has a single selection
      this.currentMolstarSelections.set([]);
      this.currentMolstarSelectionsNames.set([]);

      if (this.lastDomainsState !== 'none' && this.lastDomainsState.includes('/')) {
        domainsIdx = parseInt(this.lastDomainsState.split('/')[1]);
        domain = this.dataProcessing.processedDomainsAsList()[domainsIdx];
        domainColor = this.getMolstarColor(domain, 'domain');
        this.currentSelectionIdx.set(domainsIdx);
        await this.molstarOverview.renderOverviewSpecificDomain(domain, domainColor, domainsIdx);
        this.lastDomainsState = `Overview-Domains/${domainsIdx}`;
        this.molstarOverview.currentViewName = `Overview-Domains/${domainsIdx}`;
      } else {
        await this.molstarOverview.renderOverviewDomains(domainsOfResource, domainColors);
        this.lastDomainsState = 'Overview-Domains';
        this.molstarOverview.currentViewName = 'Overview-Domains';
      }

      // const domainsState = await this.molstarOverview.viewDomains(domainsOfResource, domainColors, domain, domainColor, domainsIdx);
      // this.lastDomainsState = domainsState;
    } else if (newView === 'Modifications') {
      let modificationsIdx: number | undefined = undefined;
      let selectionIdx: number | undefined = undefined;
      let modification: LigandsRowData | undefined = undefined;
      let modificationSelections: MolstarSelectionObj[] = [];
      let modificationSelectionNames: string[] = [];
      if (this.lastModificationsState !== 'none' && this.lastModificationsState.includes('/')) {
        modificationsIdx = parseInt(this.lastModificationsState.split('/')[1]);
        selectionIdx = parseInt(this.lastModificationsState.split('/')[2]);

        modification = this.dataProcessing.processedModifications()[modificationsIdx];
        modificationSelections = modification.additionalData.selections;
        modificationSelectionNames = modification.additionalData.selectionNames;

        this.currentSelectionIdx.set(selectionIdx);
        this.currentMolstarSelections.set(modificationSelections);
        this.currentMolstarSelectionsNames.set(modificationSelectionNames);
        await this.molstarOverview.renderOverviewSpecificModification(modification, modificationsIdx, selectionIdx);
        this.lastModificationsState = `Overview-Modifications/${modificationsIdx}/${selectionIdx}`;
        this.molstarOverview.currentViewName = `Overview-Modifications/${modificationsIdx}/${selectionIdx}`;
      } else {
        this.currentMolstarSelections.set(modificationSelections);
        this.currentMolstarSelectionsNames.set(modificationSelectionNames);
        await this.molstarOverview.renderOverviewModifications();
        this.lastModificationsState = 'Overview-Modifications';
        this.molstarOverview.currentViewName = 'Overview-Modifications';
      }
      // const modificationsState = await this.molstarOverview.viewModifications(modification, modificationsIdx, selectionIdx);
      // this.lastModificationsState = modificationsState;
    }
  }

  public async updateMolstarItemSelection(listViewItem: MacromoleculesRowData | LigandsRowData | DomainsRowData | undefined, selectionType: string) {
    const sameListViewItem = this.lastListViewItem !== undefined && this.lastListViewItem === listViewItem;

    if (sameListViewItem) {
      // reset view name so deselection can occur
      this.molstarOverview.currentViewName = 'none';
      this.currentSelectionIdx.set(-1);
      listViewItem = undefined;
    }
    this.lastListViewItem = listViewItem;
    this.listViewItemType = selectionType;

    // deselect macromolecule if clicked 2 times in a row
    if (sameListViewItem && selectionType === 'macromolecule') {
      this.currentMolstarSelections.set([]);
      this.currentMolstarSelectionsNames.set([]);
      // const macromoleculesState = await this.molstarOverview.viewMacromolecules();
      // this.lastMacromoleculeState = macromoleculesState;
      await this.molstarOverview.renderOverviewMacromolecules();
      this.lastMacromoleculeState = 'Overview-Macromolecules';
      this.molstarOverview.currentViewName = 'Overview-Macromolecules';
    }
    // deselect ligand if clicked 2 times in a row
    else if (sameListViewItem && selectionType === 'ligand') {
      this.currentMolstarSelections.set([]);
      this.currentMolstarSelectionsNames.set([]);
      // const ligandsState = await this.molstarOverview.viewLigands();
      // this.lastLigandsState = ligandsState;
      await this.molstarOverview.renderOverviewLigands();
      this.lastLigandsState = 'Overview-Ligands';
      this.molstarOverview.currentViewName = 'Overview-Ligands';
    }
    // deselect domain if clicked 2 times in a row
    else if (sameListViewItem && selectionType === 'domain') {
      this.currentMolstarSelections.set([]);
      this.currentMolstarSelectionsNames.set([]);

      const domainsOfResource = this.dataProcessing
        .processedDomainsAsList()
        .filter((eachDomain) => eachDomain.resource === this.dataProcessing.currentDomainResource());
      const domainColors = domainsOfResource.map((eachDomain) => this.getMolstarColor(eachDomain, 'domain'));
      // const domainsState = await this.molstarOverview.viewDomains(domainsOfResource, domainColors);
      // this.lastDomainsState = domainsState;

      await this.molstarOverview.renderOverviewDomains(domainsOfResource, domainColors);
      this.lastDomainsState = 'Overview-Domains';
      this.molstarOverview.currentViewName = 'Overview-Domains';
    } else if (sameListViewItem && selectionType === 'modification') {
      this.currentMolstarSelections.set([]);
      this.currentMolstarSelectionsNames.set([]);

      await this.molstarOverview.renderOverviewModifications();
      this.lastModificationsState = 'Overview-Modifications';
      this.molstarOverview.currentViewName = 'Overview-Modifications';
    }

    // select macromolecule
    else if (selectionType === 'macromolecule') {
      let selectionIdx = 0;
      const macromolecule = listViewItem as MacromoleculesRowData;
      const macromoleculeIdx = this.dataProcessing.processedMacromolecules().indexOf(macromolecule);
      if (this.lastMacromoleculeState !== 'none' && this.lastMacromoleculeState.includes('/')) {
        const lastMacromoleculeIdx = parseInt(this.lastMacromoleculeState.split('/')[1]);
        if (lastMacromoleculeIdx === macromoleculeIdx) {
          selectionIdx = parseInt(this.lastMacromoleculeState.split('/')[2]) || 0;
        }
      }

      const macromoleculeSelections = macromolecule ? macromolecule.additionalData.selections : [];
      const macromoleculeSelectionNames = macromolecule ? macromolecule.additionalData.selectionNames : [];

      this.currentSelectionIdx.set(selectionIdx);
      this.currentMolstarSelections.set(macromoleculeSelections);
      this.currentMolstarSelectionsNames.set(macromoleculeSelectionNames);

      await this.molstarOverview.renderOverviewSpecificMacromolecule(macromolecule, macromoleculeIdx, selectionIdx);
      this.lastMacromoleculeState = `Overview-Macromolecules/${macromoleculeIdx}/${selectionIdx}`;
      this.molstarOverview.currentViewName = `Overview-Macromolecules/${macromoleculeIdx}/${selectionIdx}`;

      // const macromoleculesState = await this.molstarOverview.viewMacromolecules(macromolecule, macromoleculeIdx, selectionIdx);
      // this.lastMacromoleculeState = macromoleculesState;
    }
    // select ligand
    else if (selectionType === 'ligand') {
      let ligand = listViewItem as LigandsRowData;
      const ligandsIdx = this.dataProcessing.processedLigands().indexOf(ligand);
      let selectionIdx = 0;
      if (this.lastLigandsState !== 'none' && this.lastLigandsState.includes('/')) {
        const lastLigandIdx = parseInt(this.lastLigandsState.split('/')[1]);
        if (lastLigandIdx === ligandsIdx) {
          selectionIdx = parseInt(this.lastLigandsState.split('/')[2]) || 0;
        }
        ligand = this.dataProcessing.processedLigands()[ligandsIdx];
      }

      const ligandSelections = ligand ? ligand.additionalData.selections : [];
      const ligandSelectionNames = ligand ? ligand.additionalData.selectionNames : [];

      this.currentSelectionIdx.set(selectionIdx);
      this.currentMolstarSelections.set(ligandSelections);
      this.currentMolstarSelectionsNames.set(ligandSelectionNames);

      await this.molstarOverview.renderOverviewSpecificLigand(ligand, ligandsIdx, selectionIdx);
      this.lastLigandsState = `Overview-Ligands/${ligandsIdx}/${selectionIdx}`;
      this.molstarOverview.currentViewName = `Overview-Ligands/${ligandsIdx}/${selectionIdx}`;

      // const ligandsState = await this.molstarOverview.viewLigands(ligand, ligandsIdx, selectionIdx);
      // this.lastLigandsState = ligandsState;
    }
    // select domain
    else if (selectionType === 'domain') {
      const domain = listViewItem as DomainsRowData;
      const domainColor = this.getMolstarColor(domain, 'domain');
      const domainsIdx = this.dataProcessing.processedDomainsAsList().indexOf(domain);

      // const domainsOfResource = this.dataProcessing
      //   .processedDomainsAsList()
      //   .filter((eachDomain) => eachDomain.resource === this.dataProcessing.currentDomainResource());
      // const domainColors = domainsOfResource.map((eachDomain) => this.getMolstarColor(eachDomain, 'domain'));

      // const domainsState = await this.molstarOverview.viewDomains(domainsOfResource, domainColors, domain, domainColor, domainsIdx);
      // this.lastDomainsState = domainsState;

      this.currentSelectionIdx.set(0);
      this.currentMolstarSelections.set([]);
      this.currentMolstarSelectionsNames.set([]);

      await this.molstarOverview.renderOverviewSpecificDomain(domain, domainColor, domainsIdx);
      this.lastDomainsState = `Overview-Domains/${domainsIdx}`;
      this.molstarOverview.currentViewName = `Overview-Domains/${domainsIdx}`;
    } else if (selectionType === 'modification') {
      const modification = listViewItem as LigandsRowData;
      const modificationsIdx = this.dataProcessing.processedModifications().indexOf(modification);

      let selectionIdx = 0;
      if (this.lastModificationsState !== 'none' && this.lastModificationsState.includes('/')) {
        const lastModificationIdx = parseInt(this.lastModificationsState.split('/')[1]);
        if (lastModificationIdx === modificationsIdx) {
          selectionIdx = parseInt(this.lastModificationsState.split('/')[2]) || 0;
        }
      }

      const modificationSelections = modification ? modification.additionalData.selections : [];
      const modificationSelectionNames = modification ? modification.additionalData.selectionNames : [];

      this.currentSelectionIdx.set(selectionIdx);
      this.currentMolstarSelections.set(modificationSelections);
      this.currentMolstarSelectionsNames.set(modificationSelectionNames);

      await this.molstarOverview.renderOverviewSpecificModification(modification, modificationsIdx, selectionIdx);
      this.lastModificationsState = `Overview-Modifications/${modificationsIdx}/${selectionIdx}`;
      this.molstarOverview.currentViewName = `Overview-Modifications/${modificationsIdx}/${selectionIdx}`;

      // const modificationsState = await this.molstarOverview.viewModifications(modification, modificationsIdx, selectionIdx);
      // this.lastModificationsState = modificationsState;
    }
    return;
  }

  async switchMolstarZoomed(molstarSelection?: MolstarSelectionObj) {
    if (molstarSelection) {
      await this.molstarOverview.focusLoci(molstarSelection);
    } else {
      await this.molstarOverview.focusStructure();
    }
  }

  public getMolstarColor(listItem: MacromoleculesRowData | LigandsRowData | DomainsRowData, selectionType: string) {
    let colorScale = DEFAULT_SET_25;
    let idx = -1;
    if (selectionType === 'macromolecule') {
      idx = getMacromoleculeEntityId(listItem as MacromoleculesRowData) - 1;
      colorScale = DEFAULT_SET_25;
    } else if (selectionType === 'ligand') {
      const ligand = listItem as LigandsRowData;
      idx = getLigandEntityId(ligand) - 1;
      const elementKeys = Object.keys(ELEMENT_COLORS_HEX);
      if (elementKeys.indexOf(ligand.id) > -1) {
        return ELEMENT_COLORS_HEX[ligand.id];
      }
      colorScale = COLORBREWER_SET2_COLORS;
    } else if (selectionType === 'modification') {
      idx = this.dataProcessing.processedModifications().indexOf(listItem as LigandsRowData);
      colorScale = BANG_WONG_COLORBLIND_SCALE;
    } else if (selectionType === 'domain') {
      const uniqueAccessions = [...new Set(this.dataProcessing.processedDomainsAsList().map((domain) => domain.accessionName))];

      // idx = this.processedDomainsAsList().indexOf(listItem as DomainsRowData)
      const domain = listItem as DomainsRowData;
      idx = uniqueAccessions.indexOf(domain.accessionName);

      colorScale = FILTERED_KELLY22_COLORBLIND_SCALE;
    }
    if (idx === -1) throw 'wrong color idx';
    const entityColor = colorScale[idx % colorScale.length];
    return entityColor;
  }
}
