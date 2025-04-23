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

  public lastMacromoleculeState = 'none';
  public lastLigandsState = 'none';
  public lastDomainsState = 'none';
  public lastModificationsState = 'none';
  public lastListViewItem?: MacromoleculesRowData | LigandsRowData | DomainsRowData;
  public listViewItemType?: string;

  // 'assets/img/interfaces_example2.png'
  public async updateMolstarAccordionSelection(newView: string) {
    if (newView === 'Assembly') {
      await this.molstarOverview.viewPreferredAssembly();
      this.currentMolstarSelectionsNames.set([]);
      this.currentMolstarSelections.set([]);
      this.currentSelectionIdx.set(-1);
    } else if (newView === 'Macromolecules') {
      let macromoleculeIdx: number | undefined = undefined;
      let selectionIdx: number | undefined = undefined;
      let macromolecule: MacromoleculesRowData | undefined = undefined;
      if (this.lastMacromoleculeState !== 'none' && this.lastMacromoleculeState.includes('/')) {
        macromoleculeIdx = parseInt(this.lastMacromoleculeState.split('/')[1]);
        selectionIdx = parseInt(this.lastMacromoleculeState.split('/')[2]);
        macromolecule = this.dataProcessing.processedMacromolecules()[macromoleculeIdx];
        this.currentSelectionIdx.set(selectionIdx);
      }
      const macromoleculesState = await this.molstarOverview.viewMacromolecules(macromolecule, macromoleculeIdx, selectionIdx);
      this.lastMacromoleculeState = macromoleculesState;

      const macromoleculeSelections = macromolecule ? macromolecule.additionalData.selections : [];
      const macromoleculeSelectionsNames = macromolecule ? macromolecule.additionalData.selectionNames : [];
      this.currentMolstarSelections.set(macromoleculeSelections);
      this.currentMolstarSelectionsNames.set(macromoleculeSelectionsNames);
    } else if (newView === 'Ligands') {
      let ligandsIdx: number | undefined = undefined;
      let selectionIdx: number | undefined = undefined;
      let ligand: LigandsRowData | undefined = undefined;
      if (this.lastLigandsState !== 'none' && this.lastLigandsState.includes('/')) {
        ligandsIdx = parseInt(this.lastLigandsState.split('/')[1]);
        selectionIdx = parseInt(this.lastLigandsState.split('/')[2]);
        ligand = this.dataProcessing.processedLigands()[ligandsIdx];
        this.currentSelectionIdx.set(selectionIdx);
      }
      const ligandsState = await this.molstarOverview.viewLigands(ligand, ligandsIdx, selectionIdx);
      this.lastLigandsState = ligandsState;

      const ligandSelections = ligand ? ligand.additionalData.selections : [];
      const ligandSelectionNames = ligand ? ligand.additionalData.selectionNames : [];
      this.currentMolstarSelections.set(ligandSelections);
      this.currentMolstarSelectionsNames.set(ligandSelectionNames);
    } else if (newView === 'Domains') {
      let domainsIdx: number | undefined = undefined;
      let domain = undefined;
      let domainColor = undefined;
      if (this.lastDomainsState !== 'none' && this.lastDomainsState.includes('/')) {
        domainsIdx = parseInt(this.lastDomainsState.split('/')[1]);
        domain = this.dataProcessing.processedDomainsAsList()[domainsIdx];
        domainColor = this.getMolstarColor(domain, 'domain');
        this.currentSelectionIdx.set(domainsIdx);
      }
      const domainsOfResource = this.dataProcessing
        .processedDomainsAsList()
        .filter((eachDomain) => eachDomain.resource === this.dataProcessing.currentDomainResource());
      const domainColors = domainsOfResource.map((eachDomain) => this.getMolstarColor(eachDomain, 'domain'));
      const domainsState = await this.molstarOverview.viewDomains(domainsOfResource, domainColors, domain, domainColor, domainsIdx);
      this.lastDomainsState = domainsState;

      // each domain has a single selection
      this.currentMolstarSelections.set([]);
      this.currentMolstarSelectionsNames.set([]);
    } else if (newView === 'Modifications') {
      let modificationsIdx: number | undefined = undefined;
      let selectionIdx: number | undefined = undefined;
      let modification: LigandsRowData | undefined = undefined;
      if (this.lastModificationsState !== 'none' && this.lastModificationsState.includes('/')) {
        modificationsIdx = parseInt(this.lastModificationsState.split('/')[1]);
        selectionIdx = parseInt(this.lastModificationsState.split('/')[2]);
        modification = this.dataProcessing.processedModifications()[modificationsIdx];
        this.currentSelectionIdx.set(selectionIdx);
      }
      const modificationsState = await this.molstarOverview.viewModifications(modification, modificationsIdx, selectionIdx);
      this.lastModificationsState = modificationsState;

      const modificationSelections = modification ? modification.additionalData.selections : [];
      const modificationSelectionNames = modification ? modification.additionalData.selectionNames : [];

      this.currentMolstarSelections.set(modificationSelections);
      this.currentMolstarSelectionsNames.set(modificationSelectionNames);
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
      const macromoleculesState = await this.molstarOverview.viewMacromolecules();
      this.lastMacromoleculeState = macromoleculesState;

      this.currentMolstarSelections.set([]);
      this.currentMolstarSelectionsNames.set([]);
    }
    // deselect ligand if clicked 2 times in a row
    else if (sameListViewItem && selectionType === 'ligand') {
      const ligandsState = await this.molstarOverview.viewLigands();
      this.lastLigandsState = ligandsState;

      this.currentMolstarSelections.set([]);
      this.currentMolstarSelectionsNames.set([]);
    }
    // deselect domain if clicked 2 times in a row
    else if (sameListViewItem && selectionType === 'domain') {
      const domainsOfResource = this.dataProcessing
        .processedDomainsAsList()
        .filter((eachDomain) => eachDomain.resource === this.dataProcessing.currentDomainResource());
      const domainColors = domainsOfResource.map((eachDomain) => this.getMolstarColor(eachDomain, 'domain'));
      const domainsState = await this.molstarOverview.viewDomains(domainsOfResource, domainColors);
      this.lastDomainsState = domainsState;

      this.currentMolstarSelections.set([]);
      this.currentMolstarSelectionsNames.set([]);
    }
    // select macromolecule
    else if (selectionType === 'macromolecule') {
      let selectionIdx: number | undefined = undefined;
      const macromolecule = listViewItem as MacromoleculesRowData;
      const macromoleculeIdx = this.dataProcessing.processedMacromolecules().indexOf(macromolecule);
      if (this.lastMacromoleculeState !== 'none' && this.lastMacromoleculeState.includes('/')) {
        const lastMacromoleculeIdx = parseInt(this.lastMacromoleculeState.split('/')[1]);
        if (lastMacromoleculeIdx === macromoleculeIdx) {
          selectionIdx = parseInt(this.lastMacromoleculeState.split('/')[2]) || 0;
        } else {
          selectionIdx = 0;
        }
      }
      const macromoleculesState = await this.molstarOverview.viewMacromolecules(macromolecule, macromoleculeIdx, selectionIdx);
      this.lastMacromoleculeState = macromoleculesState;
      this.currentSelectionIdx.set(parseInt(this.lastMacromoleculeState.split('/')[2]));

      const macromoleculeSelections = macromolecule ? macromolecule.additionalData.selections : [];
      const macromoleculeSelectionNames = macromolecule ? macromolecule.additionalData.selectionNames : [];
      this.currentMolstarSelections.set(macromoleculeSelections);
      this.currentMolstarSelectionsNames.set(macromoleculeSelectionNames);
    }
    // select ligand
    else if (selectionType === 'ligand') {
      let ligand = listViewItem as LigandsRowData;
      const ligandsIdx = this.dataProcessing.processedLigands().indexOf(ligand);
      let selectionIdx: number | undefined = undefined;
      if (this.lastLigandsState !== 'none' && this.lastLigandsState.includes('/')) {
        const lastLigandIdx = parseInt(this.lastLigandsState.split('/')[1]);
        if (lastLigandIdx === ligandsIdx) {
          selectionIdx = parseInt(this.lastLigandsState.split('/')[2]) || 0;
        } else {
          selectionIdx = 0;
        }
        ligand = this.dataProcessing.processedLigands()[ligandsIdx];
      }
      const ligandsState = await this.molstarOverview.viewLigands(ligand, ligandsIdx, selectionIdx);
      this.lastLigandsState = ligandsState;
      this.currentSelectionIdx.set(parseInt(this.lastLigandsState.split('/')[2]));

      const ligandSelections = ligand ? ligand.additionalData.selections : [];
      const ligandSelectionNames = ligand ? ligand.additionalData.selectionNames : [];
      this.currentMolstarSelections.set(ligandSelections);
      this.currentMolstarSelectionsNames.set(ligandSelectionNames);
    }
    // select domain
    else if (selectionType === 'domain') {
      const domain = listViewItem as DomainsRowData;
      const domainColor = this.getMolstarColor(domain, 'domain');
      const domainsIdx = this.dataProcessing.processedDomainsAsList().indexOf(domain);
      const domainsOfResource = this.dataProcessing
        .processedDomainsAsList()
        .filter((eachDomain) => eachDomain.resource === this.dataProcessing.currentDomainResource());
      const domainColors = domainsOfResource.map((eachDomain) => this.getMolstarColor(eachDomain, 'domain'));
      const domainsState = await this.molstarOverview.viewDomains(domainsOfResource, domainColors, domain, domainColor, domainsIdx);
      this.lastDomainsState = domainsState;
      this.currentSelectionIdx.set(parseInt(this.lastDomainsState.split('/')[2]));

      this.currentMolstarSelections.set([]);
      this.currentMolstarSelectionsNames.set([]);
    } else if (selectionType === 'modification') {
      const modification = listViewItem as LigandsRowData;
      const modificationsIdx = this.dataProcessing.processedModifications().indexOf(modification);
      let selectionIdx: number | undefined = undefined;
      if (this.lastModificationsState !== 'none' && this.lastModificationsState.includes('/')) {
        const lastModificationIdx = parseInt(this.lastModificationsState.split('/')[1]);
        if (lastModificationIdx === modificationsIdx) {
          selectionIdx = parseInt(this.lastModificationsState.split('/')[2]) || 0;
        } else {
          selectionIdx = 0;
        }
      }
      const modificationsState = await this.molstarOverview.viewModifications(modification, modificationsIdx, selectionIdx);
      this.lastModificationsState = modificationsState;
      this.currentSelectionIdx.set(parseInt(this.lastModificationsState.split('/')[2]));

      const modificationSelections = modification ? modification.additionalData.selections : [];
      const modificationSelectionNames = modification ? modification.additionalData.selectionNames : [];
      this.currentMolstarSelections.set(modificationSelections);
      this.currentMolstarSelectionsNames.set(modificationSelectionNames);
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
