import { inject, Injectable, Injector, signal } from '@angular/core';
import { OutliersByModelId } from '../pages/main/data-processing.facade';
import { OverviewStateManagementService } from '../components/summary-tab/sub-components/overview-molstar/state-management.service';
import { MolstarForEntryPages } from '../helpers/molstar-for-entry-pages';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../components/shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';

@Injectable({
  providedIn: 'root',
})
export class MolstarStateService {
  public molstarFirstRenderFinished = signal(false);
  public molstarOverviewFirstRenderFinished = signal(false);

  // lazy load state management to avoid circular dependency problem
  private injector = inject(Injector);
  private _summaryStateManagement?: OverviewStateManagementService;
  public get summaryStateManagement(): OverviewStateManagementService {
    if (!this._summaryStateManagement) {
      this._summaryStateManagement = this.injector.get(OverviewStateManagementService);
    }
    return this._summaryStateManagement;
  }
  public readonly molstarVisualisation = inject(MolstarForEntryPages);

  // state and data variables for Overview

  // state and data variables for Model Quality
  public currentModelId = toSignal(this.molstarVisualisation.currentModelId$);
  public currentLLMTabId = toSignal(this.molstarVisualisation.currentLLMTabId$);
  public outliersByModelId = signal<OutliersByModelId | undefined>(undefined);
  public modelQualityValidationType = signal<string>('issue_count');
  public modelQualitySpecificIssueKind = signal<string>('');

  private lastMolstarSelection?: MolstarSelectionObj;

  // state and data variables for Assemblies
  // state and data variables for Macromolecules
  // state and data variables for Ligands
  // state and data variables for Domains
  // INFO: none needed for now. maybe if we keep row state on future

  public async renderMolstarForOverview(isNewTab: boolean) {
    await this.molstarVisualisation.checkOverviewReady();

    if (this.molstarOverviewFirstRenderFinished() == false) {
      this.molstarVisualisation.currentViewName = 'Overview-Preferred Assembly';
      await this.molstarVisualisation.renderOverviewPreferredAssembly();

      this.molstarOverviewFirstRenderFinished.set(true);
    } else if (isNewTab) {
      // if coming from different tab, refresh state
      await this.summaryStateManagement.updateMolstarAccordionSelection(this.summaryStateManagement.currentView);
    }
  }

  public async renderMolstarForLLM(macromolecule: MacromoleculesRowData, selection: MolstarSelectionObj) {
    const entityId = selection.entityId;
    const chainId = selection.authChainId;
    const modelId = this.currentLLMTabId();
    // const currentOutlierData = this.outliersByModelId()![modelId];

    // const displayName = `LLM-Tab-${modelId}`;
    const displayName = `Tab-LLM/${macromolecule.name.molecule}-${entityId}-${chainId}`;
    // if (issueType !== 'issue_count') {
    //   displayName = `Model Quality(${modelId})-Specific issue-${specificIssue}`;
    // }
    if (this.molstarVisualisation.currentViewName === displayName) return;
    this.molstarVisualisation.currentViewName = displayName;
    this.lastMolstarSelection = selection;
    await this.molstarVisualisation.checkLLMReady();
    await this.molstarVisualisation.renderTabsMacromolecules(macromolecule, selection);
  }

  public async renderMolstarForModelQuality() {
    const issueType = this.modelQualityValidationType();
    const specificIssue = this.modelQualitySpecificIssueKind();

    const modelId = this.currentModelId()!;
    const currentOutlierData = this.outliersByModelId()![modelId];

    let displayName = `Model Quality(${modelId})-All issues`;
    if (issueType !== 'issue_count') {
      displayName = `Model Quality(${modelId})-Specific issue-${specificIssue}`;
    }
    if (this.molstarVisualisation.currentViewName === displayName) return;
    this.molstarVisualisation.currentViewName = displayName;
    await this.molstarVisualisation.checkModelQualityReady();

    if (issueType === 'issue_count') {
      await this.molstarVisualisation.renderModelQualityAllIssues(
        currentOutlierData.residuesWith1Outlier,
        currentOutlierData.residuesWith2Outliers,
        currentOutlierData.residuesWith3OrMoreOutliers
      );
    } else if (specificIssue.length > 0) {
      await this.molstarVisualisation.renderModelQualitySpecificIssue(currentOutlierData.molstarSelectionsByOutlierType[specificIssue]);
    }
  }

  public async renderMolstarForAssemblies(assemblyId?: string) {
    if (assemblyId === undefined) assemblyId = '1';

    const displayName = `Tab-Assemblies/${assemblyId}`;

    if (this.molstarVisualisation.currentViewName === displayName) return;
    this.molstarVisualisation.currentViewName = displayName;
    await this.molstarVisualisation.checkAssembliesReady(assemblyId, true);

    // if Assemblies config not loaded, load it
    if (!this.molstarVisualisation.currentViewName.includes('Tab-Assemblies')) {
      const symmetryView = true;
      await this.molstarVisualisation.checkAssembliesReady(assemblyId, symmetryView);
    }

    await this.molstarVisualisation.renderTabsAssemblies();
  }

  public async focusLastSelection() {
    if (this.lastMolstarSelection) await this.molstarVisualisation.focusLoci(this.lastMolstarSelection, 50)!;
  }

  public async renderMolstarForMacromolecules(macromolecule: MacromoleculesRowData, selection: MolstarSelectionObj) {
    const entityId = selection.entityId;
    const chainId = selection.authChainId;

    const displayName = `Tab-Macromolecules/${macromolecule.name.molecule}-${entityId}-${chainId}`;

    if (this.molstarVisualisation.currentViewName === displayName) return;
    this.molstarVisualisation.currentViewName = displayName;
    this.lastMolstarSelection = selection;
    await this.molstarVisualisation.checkMacromoleculesReady();

    await this.molstarVisualisation.renderTabsMacromolecules(macromolecule, selection);
  }

  public async renderMolstarForLigands(entryId: string, ligand: LigandsRowData, selection: MolstarSelectionObj) {
    // retrieve necessary data for composing ligands and environments URL
    const urlToDownload = '';
    const entityId = selection.entityId;
    const chainId = selection.authChainId;
    const residueId = selection.residues[0].authBegin;

    // // create URL according to whether a modification or a ligand is selected
    // if (ligand.type === 'modification') {
    //   urlToDownload = `https://www.ebi.ac.uk/pdbe/model-server/v1/${entryId}/atoms?label_entity_id=${entityId}&auth_asym_id=${chainId}&encoding=bcif`;
    // } else {
    //   const authSeqId = selection.residues[0].authBegin;
    //   const authInsCode = selection.residues[0].authBeginIns;
    //   urlToDownload = `https://www.ebi.ac.uk/pdbe/model-server/v1/${entryId}/residueSurroundings?auth_seq_id=${authSeqId}&pdbx_PDB_ins_code=${authInsCode}&auth_asym_id=${chainId}&radius=10&encoding=bcif`;
    // }
    const displayName = `Tab-Ligands/${ligand.id}-${entityId}-${chainId}-${residueId}`;

    if (this.molstarVisualisation.currentViewName === displayName) return;
    this.molstarVisualisation.currentViewName = displayName;
    this.lastMolstarSelection = selection;
    await this.molstarVisualisation.checkLigandsReady();

    // since URL based force Ligands config reload with forceReset: true
    // await this.molstarVisualisation.checkLigandsReady(urlToDownload, true);

    await this.molstarVisualisation.renderTabsLigands(ligand, selection);
  }

  public async renderMolstarInteractions(residuesMolstarSelections: MolstarSelectionObj[], interactionsMolstarSelection: any) {
    if (this.molstarFirstRenderFinished() === false) return;
    await this.molstarVisualisation.showResiduesAsSticks(residuesMolstarSelections);
    await this.molstarVisualisation.showInteractions(interactionsMolstarSelection);
  }

  public async zoomMolstarInteraction(
    atomSelections: {
      auth_asym_id?: string | undefined;
      auth_seq_id?: number;
      auth_ins_code_id?: string | undefined;
      atoms?: string[];
    }[]
  ) {
    if (this.molstarFirstRenderFinished() === false) return;
    await this.molstarVisualisation.focusLociPDBe(atomSelections);
    await this.molstarVisualisation.highlightLociPDBe({ data: atomSelections });
  }

  public async renderMolstarForDomains(domain: DomainsRowData) {
    const displayName = `Tab-Domains/${domain.domain}_${domain.segmentsAsText}`;

    if (this.molstarVisualisation.currentViewName === displayName) return;
    this.molstarVisualisation.currentViewName = displayName;
    this.lastMolstarSelection = domain.additionalData.selections[0];
    await this.molstarVisualisation.checkDomainsReady();

    // domains always have single selection
    await this.molstarVisualisation.renderTabsDomains(domain.additionalData.selections[0]);
  }
}
