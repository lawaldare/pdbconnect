import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../../../store/entry-store.model';
import { EntrySelectors } from '../../../../../store/entry.selectors';
import { EntryActions } from '../../../../../store/entry.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationAPIDispatcher } from '../../../../../services/application-api-dispacher.service';
import { environment } from '../../../../../../../environments/environment';

const removeEmpty = (obj: any) => (obj ? (({ empty, ...rest }) => rest)(obj) : obj);

@Component({
  selector: 'pdbc-mb-other-rsc-structures',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mb-other-rsc-structures.component.html',
  styleUrl: './mb-other-rsc-structures.component.scss',
})
export class MbOtherRscStructures implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  public baseUrl = environment.baseUrl;

  ngOnInit() {
    this.applicationApiDispatcher.dispatchForList([
      EntryActions.getPrimaryPublication,
      EntryActions.getUniprotMapping,
      EntryActions.getEntryLigandMonomers,
      EntryActions.getPreferredAssembly,
      EntryActions.getSummaryData,
      EntryActions.getPDBRedoQualityScores,
      EntryActions.getExperimentBMRBRawData,
      EntryActions.getExperimentIRRMCRawData,
      EntryActions.getExperimentEMPIARRawData,
      EntryActions.getExperimentSBGridRawData,
    ]);
  }

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));
  public readonly uniprotMappings = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));
  public readonly ligandMonomers = toSignal(this.globalStore.select(EntrySelectors.ligandMonomers));
  public readonly complexDetails = toSignal(this.globalStore.select(EntrySelectors.complexDetails));
  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly pdbRedoData = toSignal(this.globalStore.select(EntrySelectors.pdbRedoQualityScores));
  public readonly experimentRawDataBMRB = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataBMRB));
  public readonly experimentRawDataIRRMC = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataIRRMC));
  public readonly experimentRawDataEMPIAR = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataEMPIAR));
  public readonly experimentRawDataSBGrid = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataSBGrid));

  public readonly relatedEntries = computed(() => {
    const primaryPublication = this.primaryPublication();
    return primaryPublication?.associated_entries ? primaryPublication.associated_entries.split(',').map((entry) => entry.trim()) : [];
  });

  public readonly uniprotIds = computed(() => {
    let uniprotMappings = this.uniprotMappings();
    uniprotMappings = removeEmpty(uniprotMappings);
    return uniprotMappings ? Object.keys(uniprotMappings) : [];
  });

  public readonly uniqueLigandIds = computed(() => {
    let ligandMonomers = this.ligandMonomers();
    if (ligandMonomers && (ligandMonomers as any).empty === true) {
      ligandMonomers = [];
    }
    return ligandMonomers ? Array.from(new Set(ligandMonomers.map((ligand) => ligand.chem_comp_id))) : [];
  });

  public readonly uniqueComplexIds = computed(() => {
    let complexDetails = this.complexDetails();
    if (complexDetails && (complexDetails as any).empty === true) {
      complexDetails = [];
    }
    return complexDetails ? Array.from(new Set(complexDetails.map((complex) => complex.pdb_complex_id))) : [];
  });

  public readonly emdbIds = computed(() => {
    const summary = this.summary();
    return summary?.relatedStructures.map((s) => s.accession) || [];
  });

  public readonly pdbRedoKeys = computed(() => {
    const pdbRedoData = this.pdbRedoData();
    return pdbRedoData ? Object.keys(pdbRedoData) : [];
  });

  public readonly EMPIARIds = computed(() => {
    const experimentRawDataEMPIAR = this.experimentRawDataEMPIAR();
    return experimentRawDataEMPIAR
      ? experimentRawDataEMPIAR.map((dataset) => {
          return {
            urlName: dataset.name,
            url: `https://www.ebi.ac.uk/empiar/${dataset.name}`,
          };
        })
      : [];
  });

  public readonly BMRBIds = computed(() => {
    const experimentRawDataBMRB = this.experimentRawDataBMRB();
    return experimentRawDataBMRB
      ? experimentRawDataBMRB.map((dataset) => {
          return {
            urlName: dataset.bmrb_id,
            url: dataset.url,
          };
        })
      : [];
  });

  public readonly IRRMCId = computed(() => {
    const experimentRawDataIRRMC = this.experimentRawDataIRRMC();
    return experimentRawDataIRRMC?.name || null;
  });

  public readonly SBGridIds = computed(() => {
    const experimentRawDataSBGrid = this.experimentRawDataSBGrid();
    return experimentRawDataSBGrid && Object.keys(experimentRawDataSBGrid).length > 0
      ? experimentRawDataSBGrid.datasets.map((dataset) => {
          return {
            urlName: dataset.data_doi,
            url: `${dataset.landing_page}`,
          };
        })
      : [];
  });

  public expandedLinkGroups = signal<Record<string, boolean>>({});

  public toggleLinkGroup(key: string): void {
    this.expandedLinkGroups.update((state) => ({
      ...state,
      [key]: !state[key],
    }));
  }

  public isLinkGroupExpanded(key: string): boolean {
    return !!this.expandedLinkGroups()[key];
  }
}
