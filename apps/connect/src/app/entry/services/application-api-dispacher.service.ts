import { Injectable, inject } from '@angular/core';
import { EntryStoreState } from '../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntryActions } from '../store/entry.actions';
@Injectable({
  providedIn: 'root',
})
export class ApplicationAPIDispatcher {
  private readonly globalStore = inject(Store<EntryStoreState>);

  private dispatched: string[] = [];
  private desktopTabs = ['summary', 'model-quality', 'complexes', 'macromolecules', 'ligands', 'domains', 'llm', 'citations', 'other-resources'];

  public dispatchForTab(tabName: string): void {
    const actions: any[] = [];
    // To load tabs states
    if (this.desktopTabs.includes(tabName)) {
      // data for processing
      actions.push(
        ...[
          // EntryActions.getSummaryData // always dispatched in main.component.ts
          EntryActions.getAssemblies,
          EntryActions.getPreferredAssembly,
          EntryActions.getEntryMolecules,
          EntryActions.getCarbohydrates,
          EntryActions.getEntryLigandMonomers,
          EntryActions.getModifications,
          EntryActions.getCathMapping,
          EntryActions.getPfamMapping,
          EntryActions.getScop175Mapping,
          EntryActions.getEntryPolymerCoverage,
          EntryActions.getLLMAnnotations,
          EntryActions.getUniprotMapping,
          EntryActions.getBoundMolecules,
          // needs: assemblies, pisaAssemblies, summaryData, complexDetails
          EntryActions.getProcessedAssemblies,
          // needs: summaryData, assemblies, polymerCoverage, cathMapping, scop175Mapping, pfamMapping, macroMolecules
          EntryActions.getProcessedDomains,
          // needs: summaryData, assemblies, boundLigands, boundMolecules, ligandMonomers, modifications
          EntryActions.getProcessedLigands,
          // needs: summaryData, assemblies, macroMolecules, carbohydrates
          EntryActions.getProcessedMacromolecules,
          // needs: summaryData, assemblies, polymerCoverage, cathMapping, scop175Mapping, pfamMapping, macroMolecules, carbohydrates
          EntryActions.getProcessedDomainsWithMacromols,
          // needs: summaryData, assemblies, macroMolecules, carbohydrates, uniprotMapping, llmAnnotations, polymerCoverage
          EntryActions.getProcessedMacromolsForLLM,
        ]
      );
    }

    if (tabName === 'summary') {
      // To load tabs states
      // this.globalStore.dispatch(EntryActions.getPrimaryPublication()); // always dispatched in main.component.ts
      actions.push(
        ...[
          // EntryActions.getPrimaryPublication // always dispatched in main.component.ts
          // EntryActions.getProcessedDomains // called in desktop tabs above
          // EntryActions.getProcessedLigands // called in desktop tabs above
          // EntryActions.getProcessedMacromolecules // called in desktop tabs above
          // EntryActions.getProcessedDomainsWithMacromols // called in desktop tabs above
          EntryActions.getSummaryQualityScores,
          // needs: summaryData and complexDetails
          EntryActions.getProcessedPrefAssembly,
        ]
      );
    } else if (tabName === 'model-quality') {
      actions.push(
        ...[
          EntryActions.getExperiment,
          EntryActions.getPDBRedoQualityScores,
          EntryActions.getEntryResidueWiseOutliers,
          EntryActions.getModelQualityXray,
          EntryActions.getExperimentSBGridRawData,
          EntryActions.getExperimentIRRMCRawData,
          EntryActions.getExperimentEMPIARRawData,
          EntryActions.getExperimentPDBRawData,
          EntryActions.getExperimentBMRBRawData,
          EntryActions.getValidationKeyStats,
          EntryActions.getValidationXrayRefine,
        ]
      );
    } else if (tabName === 'complexes') {
      actions.push(
        ...[
          // EntryActions.getProcessedAssemblies // called in desktop tabs above
          EntryActions.getSymmetry,
          EntryActions.getComplexSummary,
        ]
      );
    } else if (tabName === 'macromolecules') {
      actions.push(
        ...[
          EntryActions.getGOMapping,
          EntryActions.getECMapping,
          EntryActions.getIsoformsMapping,
          EntryActions.getEntryResidueWiseOutliers,
          // EntryActions.getProcessedMacromolecules // called in desktop tabs above
        ]
      );
    } else if (tabName === 'ligands') {
      actions.push(
        ...[
          EntryActions.getLigandSummary,
          // EntryActions.getProcessedLigands // called in desktop tabs above
        ]
      );
    } else if (tabName === 'domains') {
      actions.push(
        ...[
          // EntryActions.getProcessedDomains // called in desktop tab above
        ]
      );
    } else if (tabName === 'llm') {
      actions.push(
        ...[
          // EntryActions.getPrimaryPublication // always dispatched in main.component.ts
          // EntryActions.getProcessedMacromolsForLLM // called in desktop tab above
          EntryActions.getEntryResidueWiseOutliers,
          EntryActions.getIsoformsMapping,
        ]
      );
    } else if (tabName === 'citations') {
      actions.push(
        ...[
          // EntryActions.getPrimaryPublication // always dispatched in main.component.ts
          EntryActions.getArticleCitingPDBEntry,
        ]
      );
    } else if (tabName === 'other-resources') {
      actions.push(
        ...[
          EntryActions.getHasMDDB,
          EntryActions.getInterproMapping,
          EntryActions.getCathMapping,
          EntryActions.getRfamMapping,
          EntryActions.getGOMapping,
          EntryActions.getECMapping,
          EntryActions.getPDBRedoQualityScores,
          EntryActions.getExperimentSBGridRawData,
          EntryActions.getExperimentIRRMCRawData,
          EntryActions.getExperimentEMPIARRawData,
          EntryActions.getExperimentPDBRawData,
          EntryActions.getExperimentBMRBRawData,
        ]
      );
    }

    // dispatch for created list of actions
    this.dispatchForList(actions);
  }

  public dispatchForList(actionList: any[]) {
    // for each required data
    actionList.forEach((actionCreator) => {
      const actionType = actionCreator.type;
      // only dispatch if it has not been dispatched yet
      if (!this.dispatched.includes(actionType)) {
        this.globalStore.dispatch(actionCreator());
        this.dispatched.push(actionType);
      }
    });
  }
}
