import { Injectable, inject } from '@angular/core';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntryActions } from '../../store/entry.actions';

@Injectable({
  providedIn: 'root',
})
export class DesktopAPIDispatcher {
  private readonly globalStore = inject(Store<EntryStoreState>);

  private desktopTabs = ['summary', 'model-quality', 'assemblies', 'macromolecules', 'ligands', 'domains', 'llm', 'citations'];

  public dispatchForTab(tabName: string): void {
    // To load tabs states
    if (this.desktopTabs.includes(tabName)) {
      // data for processing
      // this.globalStore.dispatch(EntryActions.getSummaryData()); // always dispatched in main.component.ts
      this.globalStore.dispatch(EntryActions.getAssemblies());
      this.globalStore.dispatch(EntryActions.getPreferredAssembly());
      this.globalStore.dispatch(EntryActions.getEntryMolecules());
      this.globalStore.dispatch(EntryActions.getCarbohydrates());
      this.globalStore.dispatch(EntryActions.getEntryLigandMonomers());
      this.globalStore.dispatch(EntryActions.getModifications());
      this.globalStore.dispatch(EntryActions.getCathMapping());
      this.globalStore.dispatch(EntryActions.getPfamMapping());
      this.globalStore.dispatch(EntryActions.getScop175Mapping());
      this.globalStore.dispatch(EntryActions.getEntryPolymerCoverage());
      this.globalStore.dispatch(EntryActions.getLLMAnnotations());
      this.globalStore.dispatch(EntryActions.getUniprotMapping());
      // processed data

      /**
       * Requires
       * assemblies (y)
       * pisaAssemblies (y)
       * summaryData (y)
       * complexDetails (y)
       */
      this.globalStore.dispatch(EntryActions.getProcessedAssemblies());
      /**
       * Requires
       * summaryData (y)
       * assemblies (y)
       * polymerCoverage (y)
       * cathMapping (y)
       * scop175Mapping (y)
       * pfamMapping (y)
       * macroMolecules (y)
       */
      this.globalStore.dispatch(EntryActions.getProcessedDomains());

      /**
       * Requires
       * summaryData (y)
       * assemblies (y)
       * boundLigands (y)
       * ligandMonomers (y)
       * modifications (y)
       */
      this.globalStore.dispatch(EntryActions.getProcessedLigands());
      /**
       * Requires
       * summaryData (y)
       * assemblies (y)
       * macroMolecules (y)
       * carbohydrates (y)
       */
      this.globalStore.dispatch(EntryActions.getProcessedMacromolecules());

      /**
       * Requires
       * summaryData (y)
       * assemblies (y)
       * polymerCoverage (y)
       * cathMapping (y)
       * scop175Mapping (y)
       * pfamMapping (y)
       * macroMolecules (y)
       * carbohydrates (y)
       */
      this.globalStore.dispatch(EntryActions.getProcessedDomainsWithMacromols());
      /**
       * Requires
       * summaryData (y)
       * assemblies (y)
       * macroMolecules (y)
       * carbohydrates (y)
       * uniprotMapping (y)
       * llmAnnotations (y)
       * polymerCoverage (y)
       */
      this.globalStore.dispatch(EntryActions.getProcessedMacromolsForLLM());
    }

    if (tabName === 'summary') {
      // To load tabs states
      // this.globalStore.dispatch(EntryActions.getPrimaryPublication()); // always dispatched in main.component.ts
      this.globalStore.dispatch(EntryActions.getSummaryQualityScores());

      // this.globalStore.dispatch(EntryActions.getProcessedDomains()); // see desktopTabs above
      // this.globalStore.dispatch(EntryActions.getProcessedLigands()); // see desktopTabs above
      // this.globalStore.dispatch(EntryActions.getProcessedMacromolecules()); // see desktopTabs above
      // this.globalStore.dispatch(EntryActions.getProcessedDomainsWithMacromols()); // see desktopTabs above

      /**
       * Requires:
       * summaryData (y)
       * complexDetails (y)
       */
      this.globalStore.dispatch(EntryActions.getProcessedPrefAssembly());
    } else if (tabName === 'model-quality') {
      this.globalStore.dispatch(EntryActions.getExperiment());
      this.globalStore.dispatch(EntryActions.getPDBRedoQualityScores());
      this.globalStore.dispatch(EntryActions.getEntryResidueWiseOutliers());
      this.globalStore.dispatch(EntryActions.getModelQualityXray());
      this.globalStore.dispatch(EntryActions.getExperimentSBGridRawData());
      this.globalStore.dispatch(EntryActions.getExperimentIRRMCRawData());
      this.globalStore.dispatch(EntryActions.getExperimentEMPIARRawData());
      this.globalStore.dispatch(EntryActions.getExperimentPDBRawData());
      this.globalStore.dispatch(EntryActions.getExperimentBMRBRawData());
      this.globalStore.dispatch(EntryActions.getValidationKeyStats());
      this.globalStore.dispatch(EntryActions.getValidationXrayRefine());
    } else if (tabName === 'assemblies') {
      this.globalStore.dispatch(EntryActions.getSymmetry()); // used in assemblies and mb-assemblies
      // this.globalStore.dispatch(EntryActions.getProcessedAssemblies()); // see desktopTabs above
    } else if (tabName === 'macromolecules') {
      this.globalStore.dispatch(EntryActions.getGOMapping());
      this.globalStore.dispatch(EntryActions.getECMapping());
      this.globalStore.dispatch(EntryActions.getIsoformsMapping()); // used in llm, macro, mb-overview, mb-macro
      this.globalStore.dispatch(EntryActions.getEntryResidueWiseOutliers());
      // this.globalStore.dispatch(EntryActions.getProcessedMacromolecules()); // see desktopTabs above
    } else if (tabName === 'ligands') {
      this.globalStore.dispatch(EntryActions.getLigandSummary());
      // this.globalStore.dispatch(EntryActions.getProcessedLigands()); // see desktopTabs above
    } else if (tabName === 'domains') {
      //this.globalStore.dispatch(EntryActions.getProcessedDomains()); // see desktopTabs above
    } else if (tabName === 'llm') {
      // this.globalStore.dispatch(EntryActions.getPrimaryPublication()); // always dispatched in main.component.ts
      this.globalStore.dispatch(EntryActions.getIsoformsMapping());
      //this.globalStore.dispatch(EntryActions.getProcessedMacromolsForLLM()); // see desktopTabs above
    } else if (tabName === 'citations') {
      this.globalStore.dispatch(EntryActions.getArticleCitingPDBEntry());
      // this.globalStore.dispatch(EntryActions.getPrimaryPublication()); // always dispatched in main.component.ts
    }
  }
}
