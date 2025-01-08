import { Component, computed, effect, inject, Signal } from '@angular/core';
import { OverviewStateManagementService } from '../../state-management.service';
import { CommonModule } from '@angular/common';
import { ListSelectable, NestedListSelectable, OverviewMolstarFacade } from '../../data-processing.facade';
import { Molecule } from '../../../../data-models/molecule.model';
import { ComponentCommunicationService } from '../../../../services/component-comm.service';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../../../interactive-tables/data-models-and-definitions/row-and-table.model';
import { ModifiedResidue } from '../../../../data-models/modified-residues.model';
import { MaterialModule } from '@pdbc/core';
import { assemblyCompositionTooltip, assemblyNameTooltip, complexIdTooltip, preferredAssemblyTooltip } from '../../../../entry-constant';
import { EntryDropdownComponent } from '../../../../components/entry-dropdown/entry-dropdown.component';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';

@Component({
  selector: 'pdbc-overview-tab-listview',
  standalone: true,
  imports: [CommonModule, MaterialModule, EntryDropdownComponent],
  templateUrl: './tab-listview-content.component.html',
  styleUrl: './tab-listview-content.component.scss',
})
export class OverviewMolstarTabListViewComponent {
  // javascript functions exposed to template for parsing domains nested data
  public readonly objectKeys = Object.keys;
  public readonly objectValues = Object.values;

  public readonly dataProcessing = inject(OverviewMolstarFacade);
  private readonly compCommunication = inject(ComponentCommunicationService);
  public readonly stateManagement = inject(OverviewStateManagementService);

  public currentTab = this.stateManagement.currentTab;
  public tabsStates = this.stateManagement.tabsStates;

  public numLigands = this.dataProcessing.numLigands;
  public numModifications = this.dataProcessing.numModifications;

  // data processed for all views
  public isDataLoaded = this.dataProcessing.dataParsed;
  public listViewSelectablesByTab = this.dataProcessing.listViewSelectablesByTab;

  //  data used in template for assembly
  public assemblyData = this.dataProcessing.assemblyData;
  public entryContentsDescription = this.dataProcessing.entryContentsDescription;
  public preferredAssemblyTooltip = preferredAssemblyTooltip;
  public assemblyNameTooltip = assemblyNameTooltip;
  public complexIdTooltip = complexIdTooltip;
  public assemblyCompositionTooltip = assemblyCompositionTooltip;

  //  data used in template for domains
  public domainCountByResource = this.dataProcessing.domainCountByResource;

  // data used in empty state template
  public relatedEntriesText = '';

  // Create a computed signal for having related entries
  public hasRelatedEntries = computed(() => {
    const relatedEntries = this.dataProcessing.relatedEntries();
    const hasRelatedEntries = relatedEntries.length > 0;
    if (hasRelatedEntries) this.relatedEntriesText = ' or explore related entries';
    return hasRelatedEntries;
  });

  // Create a computed signal for current tab selection property
  public currentTabSelection = computed(() => {
    const tabName = this.currentTab();
    return this.tabsStates()[tabName]?.currentListViewSelectionTemp || undefined;
  });

  // Create a computed signal for the specific property
  public currentListViewData: Signal<ListSelectable[]> = computed(() => {
    const tabName = this.currentTab();
    const simpleListTabs = ['Macromolecules', 'Ligands', 'Modifications'];
    if (simpleListTabs.indexOf(tabName) > -1) {
      const listViewItems = this.listViewSelectablesByTab()[tabName] as ListSelectable[];
      return listViewItems;
    }
    return [];
  });

  // Create a computed signal for the specific property
  public domainsDataByResource: Signal<{ [key: string]: NestedListSelectable[] } | undefined> = computed(() => {
    const tabName = this.currentTab();
    if (tabName === 'Domains') {
      return this.listViewSelectablesByTab()[tabName] as { [key: string]: NestedListSelectable[] };
    }
    return undefined;
  });

  public currentDomainResource = this.tabsStates()['Domains'].currentDomainResource || 'CATH';
  public domainResourceCounts: DownloadOption[] = [];

  constructor() {
    effect(
      () => {
        const domainCountByResource = this.domainCountByResource();

        if (domainCountByResource['CATH'] > 0) this.currentDomainResource = 'CATH';
        else if (domainCountByResource['Pfam'] > 0) this.currentDomainResource = 'Pfam';
        else if (domainCountByResource['SCOP'] > 0) this.currentDomainResource = 'SCOP';

        this.domainResourceCounts = [];

        this.domainResourceCounts.push({
          name: this.getDomainResourceCountTxt('CATH'),
          downloadable: false,
          url: '1',
        });

        this.domainResourceCounts.push({
          name: this.getDomainResourceCountTxt('Pfam'),
          downloadable: false,
          url: '2',
        });

        this.domainResourceCounts.push({
          name: this.getDomainResourceCountTxt('SCOP'),
          downloadable: false,
          url: '3',
        });

        this.stateManagement.updateStatePropertyOfTab('Domains', 'currentDomainResource', this.currentDomainResource);
      },
      {
        allowSignalWrites: true, // Enable writing to signals inside effects
      }
    );
  }

  public getDomainResourceCountTxt(domainName: string) {
    const domainCountByResource = this.domainCountByResource();
    const plural = domainCountByResource[domainName] > 1 ? 's' : '';
    return `${domainName} - ${domainCountByResource[domainName]} unique accession${plural}`;
  }

  public isSelected(listItem: ListSelectable) {
    return this.currentTabSelection() && this.currentTabSelection()!.id === listItem.id;
  }

  public getTitle() {
    let title = '';
    if (this.currentTab() === 'Assembly') {
      // title = 'Preferred assembly details';
      const preferredAssemblyId = this.dataProcessing.assemblyData().preferred;
      title = `Asssembly ${preferredAssemblyId} (preferred)`;
    }
    if (this.currentTab() === 'Macromolecules') {
      title += this.dataProcessing.macromoleculesDescription();
    }
    if (this.currentTab() === 'Ligands') {
      const count = this.numLigands();
      title = `${count} bound ligand${count === 1 ? '' : 's'}`;
    }
    if (this.currentTab() === 'Domains') {
      // const count = this.domainCountByResource()[this.currentDomainResource!];
      // return `${count} unique ${this.currentDomainResource!} ${count > 1 ? 'accessions' : 'accession'} in this entry`;
      return 'Select domain resource';
    }
    if (this.currentTab() === 'Modifications') {
      const count = this.numModifications();
      return `${count} modification${count === 1 ? '' : 's'}`;
    }
    return title;
  }

  public getDomainsListViewData() {
    return this.domainsDataByResource()![this.currentDomainResource!];
  }

  public onDomainResourceSelect(event: string) {
    this.currentDomainResource = event.split(' - ')[0];
    this.stateManagement.updateStatePropertyOfTab('Domains', 'currentDomainResource', this.currentDomainResource);
  }

  public viewDetails() {
    const tabName = this.currentTab();
    let detailsTabName = `${tabName}`;

    // in details tabs, Ligands and Modifications are together
    if (detailsTabName === 'Modifications') detailsTabName = 'Ligands';

    const currentMolstarSelection = this.tabsStates()[tabName].currentMolstarSelection;

    // if no molstar selection object, stop function
    if (!currentMolstarSelection) return;

    const detailsRows = this.compCommunication.getTabData(detailsTabName).tableRows();
    let foundDetailsRowsIndex = -1;
    if (tabName === 'Macromolecules') {
      // for Macromolecules we search for first row that has same entityId as the current Molstar selection
      const selectionEntityId = currentMolstarSelection.entityId!;
      for (let idx = 0; idx < detailsRows.length; idx++) {
        const rowDatum = detailsRows[idx] as MacromoleculesRowData;
        const rowEntityId = `${rowDatum.additionalData.molecule.entity_id}`;
        if (rowEntityId === selectionEntityId) {
          foundDetailsRowsIndex = idx;
          break;
        }
      }
    }
    if (tabName === 'Ligands') {
      // for Ligands we search for first row that has same entityId as the current Molstar selection
      const selectionEntityId = currentMolstarSelection.entityId!;
      for (let idx = 0; idx < detailsRows.length; idx++) {
        const rowDatum = detailsRows[idx] as LigandsRowData;
        if (rowDatum.type !== 'ligand') continue;
        const rowEntityId = `${(rowDatum.additionalData.source as Molecule).entity_id}`;
        if (rowEntityId === selectionEntityId) {
          foundDetailsRowsIndex = idx;
          break;
        }
      }
    }
    if (tabName === 'Modifications') {
      // for Modifications we search for first row that has the modification with
      // same entityId, chainId, resId and resIns as the current Molstar selection
      const selectionEntityId = currentMolstarSelection!.entityId!;
      const selectionChainId = currentMolstarSelection!.authChainId!;
      const selectionResId = currentMolstarSelection!.residues[0].authBegin;
      const selectionResIns = currentMolstarSelection!.residues[0].authBeginIns;

      for (let idx = 0; idx < detailsRows.length; idx++) {
        const rowDatum = detailsRows[idx] as LigandsRowData;
        if (rowDatum.type !== 'modification') continue;
        const sourceModifications = rowDatum.additionalData.source as ModifiedResidue[];
        const found = sourceModifications.some((mod) => {
          const modEntityId = `${mod.entity_id}`;
          const modChainId = `${mod.chain_id}`;
          const modResId = `${mod.author_residue_number}`;
          const modResIns = mod.author_insertion_code;

          return modEntityId === selectionEntityId && modChainId === selectionChainId && modResId === selectionResId && modResIns === selectionResIns;
        });
        if (found) {
          foundDetailsRowsIndex = idx;
          break;
        }
      }
    }
    if (tabName === 'Domains') {
      // for domains we get data from the displayed domains gallery image
      const domainsImgName = this.currentTabSelection()!.molstarGalleryImg;

      // data is extracted from the gallery img name
      const domainImgEntity = domainsImgName.split('_')[1];
      const domainImgChain = domainsImgName.split('_')[2];
      const domainImgSource = domainsImgName.split('_')[3];
      const domainImgAccession = domainsImgName.split('_')[4];

      // and the segments from the current molstar selection converted into strings
      const domainSegments = currentMolstarSelection.residues.map((resid) => {
        return `${resid.authBegin}${resid.authBeginIns} - ${resid.authEnd}${resid.authEndIns}`;
      });

      for (let idx = 0; idx < detailsRows.length; idx++) {
        const rowDatum = detailsRows[idx] as DomainsRowData;

        const domainRowEntity = rowDatum.additionalData.boundaries[0].entity + '';

        // we check whether row data matches the gallery image extracted data
        const isSameEntity = domainImgEntity === domainRowEntity;
        const hasChain = rowDatum.segments.join(' ').includes(`${domainImgChain}:`);
        const hasSource = rowDatum.resource.includes(domainImgSource);
        const hasAccession = rowDatum.additionalData.accession.includes(domainImgAccession);

        // we then check whether the row segments contain the molstar selection segments
        const trimmedSegments = rowDatum.segments.map((domainSegment) => {
          if (domainSegment.includes(':')) {
            domainSegment = domainSegment.split(':')[1];
          }
          return domainSegment.trim();
        });
        const hasSegments = trimmedSegments.every((domainSegment) => domainSegments.join(' ').includes(domainSegment));

        if (isSameEntity && hasAccession && hasSource && hasChain && hasSegments) {
          foundDetailsRowsIndex = idx;
          break;
        }
      }
    }
    // if a corresponding row in the details tab has been found according to the rules above
    if (foundDetailsRowsIndex > -1) {
      // we set that row as the currently displayed one
      this.compCommunication.setTabState(detailsTabName, foundDetailsRowsIndex);
      // we switch over tabs and trigger the page scroll using tabSwitchOrigin
      if (this.compCommunication.currentTab() !== detailsTabName) {
        this.compCommunication.currentTab.set(detailsTabName);
        this.compCommunication.tabSwitchOrigin.set('explorer');
      }
    }
  }
}
