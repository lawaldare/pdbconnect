import { Component, computed, inject, signal } from '@angular/core';
import { OverviewStateManagementService } from '../../state-management.service';
import { CommonModule } from '@angular/common';
import { OverviewMolstarFacade } from '../../data-processing.facade';
import { ComponentCommunicationService } from '../../../../../../services/component-comm.service';
import { MaterialModule } from '@pdbc/core';
import { assemblyCompositionTooltip, assemblyNameTooltip, complexIdTooltip, preferredAssemblyTooltip } from '../../../../../../entry-constant';
import { EntryDropdownComponent } from '../../../../../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { EntryStoreState } from '../../../../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntrySelectors } from '../../../../../../store/entry.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../../../../../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { NestedDomainsData } from '../../data-processing.models';

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

  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';

  public readonly panelOpenState = signal(false);

  public readonly dataProcessing = inject(OverviewMolstarFacade);
  private readonly compCommunication = inject(ComponentCommunicationService);
  public readonly stateManagement = inject(OverviewStateManagementService);
  private readonly globalStore = inject(Store<EntryStoreState>);

  // data processed for all views
  public processedMacromolecules = this.dataProcessing.processedMacromolecules;
  public processedLigands = this.dataProcessing.processedLigands;
  public processedDomainsAsList = this.dataProcessing.processedDomainsAsList;
  public processedDomains = this.dataProcessing.processedDomains;
  public processedModifications = this.dataProcessing.processedModifications;

  //  data used in template for assembly
  public assemblyData = computed(() => this.dataProcessing.preferredAssemblyData());
  public entryContentsDescription = computed(() => this.compCommunication.descriptions()?.entryContentsDescription);
  public macromoleculesDescription = computed(() => this.compCommunication.descriptions()?.macromoleculesDescription);

  public preferredAssemblyTooltip = preferredAssemblyTooltip;
  public assemblyNameTooltip = assemblyNameTooltip;
  public complexIdTooltip = complexIdTooltip;
  public assemblyCompositionTooltip = assemblyCompositionTooltip;

  //  data used in template for domains
  public domainCountByResource = this.dataProcessing.domainCountByResource;
  // public domainCountByResource = this.dataProcessing.domainCountByResource;
  public uniqueDomainCountByResource = this.dataProcessing.uniqueDomainCountByResource;

  // data used in empty state template
  public relatedEntriesText = '';

  public assemblies = toSignal(this.globalStore.select(EntrySelectors.summaryData).pipe(map((data) => data?.assemblies)));

  public assembly = computed(() => {
    const assemblies = this.assemblies() ?? [];
    if (assemblies.length > 0) {
      const firstAssembly = assemblies[0];
      const result = firstAssembly.form + ' ' + firstAssembly.name;
      return firstAssembly.name === 'monomer' ? 'monomeric' : result;
    }
    return '';
  });

  public onOpenAssemblyPanel(tabName: string) {
    this.stateManagement.updateMolstarAccordionSelection(tabName);
  }

  // Create a computed signal for having related entries
  public hasRelatedEntries = computed(() => {
    const relatedEntries = this.dataProcessing.relatedEntries();
    const hasRelatedEntries = relatedEntries.length > 0;
    if (hasRelatedEntries) this.relatedEntriesText = ' or explore related entries';
    return hasRelatedEntries;
  });

  public preferredAssemblyId = computed(() => this.dataProcessing.preferredAssemblyData()?.preferred);

  public domainCount = this.dataProcessing.domainCount;
  public currentDomainResource = this.dataProcessing.currentDomainResource() || 'CATH';

  public domainResourceCounts = computed(() => {
    const domainCountByResource = this.domainCountByResource;

    if (domainCountByResource()['CATH'] > 0) this.currentDomainResource = 'CATH';
    else if (domainCountByResource()['Pfam'] > 0) this.currentDomainResource = 'Pfam';
    else if (domainCountByResource()['SCOP'] > 0) this.currentDomainResource = 'SCOP';

    const domainResourceCounts = [];

    domainResourceCounts.push({
      name: this.getDomainResourceCountTxt('CATH'),
      downloadable: false,
      url: '1',
    });

    domainResourceCounts.push({
      name: this.getDomainResourceCountTxt('Pfam'),
      downloadable: false,
      url: '2',
    });

    domainResourceCounts.push({
      name: this.getDomainResourceCountTxt('SCOP'),
      downloadable: false,
      url: '3',
    });

    return domainResourceCounts;
  });

  public lastSelection: {
    [key: string]: MacromoleculesRowData | LigandsRowData | DomainsRowData | undefined;
  } = {};

  public getDomainResourceCountTxt(domainName: string) {
    const domainCountByResource = this.domainCountByResource;
    const plural = domainCountByResource()[domainName] > 1 ? 's' : '';
    return `${domainName} - ${domainCountByResource()[domainName]} domain${plural}`;
  }

  public async selectListItem(listItem: MacromoleculesRowData | LigandsRowData | DomainsRowData, selectionType: string) {
    if (listItem === this.lastSelection[selectionType]) {
      this.lastSelection[selectionType] = undefined;
    } else {
      this.lastSelection[selectionType] = listItem;
    }
    await this.stateManagement.updateMolstarItemSelection(listItem, selectionType);
  }

  public async mouseinListItem(listItem: MacromoleculesRowData | LigandsRowData | DomainsRowData) {
    const mergedSelections = listItem.additionalData.selections;
    await this.stateManagement.molstarOverview.highlightLoci(mergedSelections[0]);
  }

  public async mouseoutListItem() {
    await this.stateManagement.molstarOverview.clearHighlightLoci();
  }

  public isSelected(listItem: MacromoleculesRowData | LigandsRowData | DomainsRowData, selectionType: string) {
    return this.lastSelection[selectionType] === listItem;
  }

  public get getDomainsListViewData() {
    const current = this.processedDomains();
    const result: NestedDomainsData = [];

    for (const entry of current) {
      const macromolecule = entry.macromolecule;
      const filteredDomains = entry.domains.filter((domain) => domain.resource === this.currentDomainResource);

      if (filteredDomains.length > 0) {
        result.push({
          macromolecule,
          domains: filteredDomains,
        });
      }
    }

    return result;
  }

  public onDomainResourceSelect(event: string) {
    this.currentDomainResource = event.split(' - ')[0];
    this.dataProcessing.currentDomainResource.set(this.currentDomainResource);
    this.stateManagement.lastDomainsState = 'none';
    this.stateManagement.molstarOverview.currentViewName = 'none';
    this.stateManagement.updateMolstarAccordionSelection('Domains');
  }
}
