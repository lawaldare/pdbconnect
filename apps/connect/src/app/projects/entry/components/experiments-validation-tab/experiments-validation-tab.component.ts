/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component, computed, ElementRef, inject, input, OnDestroy, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentDetail } from '../../data-models/experimental-details.model';
import { KeyValidationStats } from '../../data-models/key-validation-stats.model';
import { XRayRefine } from '../../data-models/x-ray-refine.model';
import { ValidationDataProcessingFacade } from './validation-data.facade';
import { ValidationTablesFacade } from './validation-tables.facade';
import { AgGridAngular } from 'ag-grid-angular';
import { ProcessedQualityScores } from '../../data-models/summary-quality-scores.model';
import {
  BMRBExperimentRawData,
  EMPIARExperimentRawData,
  IRRMCExperimentRawData,
  PDBExperimentRawData,
  SBGRIDExperimentRawData,
} from '../../data-models/experiment-raw-data.model';
import { ProcessedExperimentalDetails, ValidationKeys } from './data-models-and-definitions/processed-experimental-details.model';
import { expInfoTooltip, expRawDataTooltip, pdbRedoTooltip, sampleInfoTooltip, timelineTooltip, validationInfoTooltip } from '../../entry-constant';
import { MaterialModule } from '@pdbc/core';
import { firstValueFrom, timer } from 'rxjs';
import { MolstarVisualisationsForTabs } from '../../helpers/molstar/molstar-visualisations-for-detail-tabs';
import { StrucQualityGradientsComponent } from '../struc-quality-gradients/struc-quality-gradients.component';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../store/entry.selectors';

/**
 * Examples that should be tested when looking at this component
 * 1xxx (X-Ray Jen)
 * 6gfn (X-Ray with Raw)
 * 1rio (X-Ray with DNA)
 * 5tok (X-Ray with Raw)
 * 4xgu (X-Ray with Raw)
 * 7v08 (EM with RNA)
 * 5irx (EM)
 * 3j7n (EM with multiple EMPIAR Raw)
 * 2kpn (NMR with BMRB id)
 * 2m68 (NMR with BMRB id)
 * 2knr (NMR with BMRB id)
 * 1g03 (NMR with BMRB id)
 * 1ur6 (hybrid)
 * 6yeg (hybrid)
 * 8sch (hybrid)
 * 8ong (hybrid)
 * 6gua (hybrid)
 * 7tx4 (hybrid)
 * 3irj (almost empty state)
 *
 * Documentation URLs:
 * https://www.ebi.ac.uk/pdbe/news/raw-experimental-data-3d-structures-highlighted-pdbe
 * https://www.ebi.ac.uk/seqdb/confluence/display/PDBE/Raw+Experimental+Data+widget
 *
 */

@Component({
  selector: 'pdbc-experiments-validation-tab',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MaterialModule, StrucQualityGradientsComponent],
  templateUrl: './experiments-validation-tab.component.html',
  styleUrl: './experiments-validation-tab.component.scss',
})
export class ExperimentsValidationTabComponent implements OnInit, AfterViewInit, OnDestroy {
  public readonly renderer = inject(Renderer2);
  public readonly elementRef = inject(ElementRef);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly dataFacade = inject(ValidationDataProcessingFacade);
  public readonly tableFacade = inject(ValidationTablesFacade);
  public readonly molstarVisualisations = inject(MolstarVisualisationsForTabs);
  /**
   * API endpoint inputs
   */
  // public readonly entryId = input.required<string>();
  // public readonly entryTitle = input.required<string>();
  // public readonly sourceOrganisms = input.required<string[]>();
  // public readonly hasRna = input.required<boolean>();
  // public readonly depositionDate = input.required<string>();
  // public readonly releaseDate = input.required<string>();
  // public readonly revisionDate = input.required<string>();
  // public readonly experimentalDetails = input.required<ExperimentDetail[]>();
  // public readonly keyValidationStats = input.required<KeyValidationStats | undefined>();
  // public readonly xRayRefine = input.required<XRayRefine | undefined>();
  // public readonly pdbRedoData = input.required<ProcessedQualityScores | undefined>();
  // public readonly rawDataPDB = input.required<PDBExperimentRawData[] | undefined>();
  // public readonly rawDataBMRB = input.required<BMRBExperimentRawData[] | undefined>();
  // public readonly rawDataIRRMC = input.required<IRRMCExperimentRawData | undefined>();
  // public readonly rawDataEMPIAR = input.required<EMPIARExperimentRawData[] | undefined>();
  // public readonly rawDataSBGrid = input.required<SBGRIDExperimentRawData | undefined>();
  public molstarViewerEl = input.required<HTMLElement>(); // Molstar global instance div
  public molstarParent = input.required<HTMLElement>(); // Parent to send back the molstar global instance

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly entryTitle = computed(() => this.summaryData()?.entryTitle);
  public readonly sourceOrganisms = toSignal(this.globalStore.select(EntrySelectors.organismScientificNames));
  public readonly depositionDate = computed(() => this.summaryData()?.depositionDate);
  public readonly releaseDate = computed(() => this.summaryData()?.releaseDate);
  public readonly revisionDate = computed(() => this.summaryData()?.revisionDate);
  public readonly experimentalDetails = toSignal(this.globalStore.select(EntrySelectors.experimentalDetails));
  public readonly hasRna = toSignal(this.globalStore.select(EntrySelectors.hasRNA));
  public readonly keyValidationStats = toSignal(this.globalStore.select(EntrySelectors.validationKeyStats));
  public readonly xRayRefine = toSignal(this.globalStore.select(EntrySelectors.validationXRayRefine));
  public readonly pdbRedoData = toSignal(this.globalStore.select(EntrySelectors.pdbRedoQualityScores));
  public readonly rawDataPDB = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataPDB));
  public readonly rawDataBMRB = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataBMRB));
  public readonly rawDataSBGrid = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataSBGrid));
  public readonly rawDataIRRMC = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataIRRMC));
  public readonly rawDataEMPIAR = toSignal(this.globalStore.select(EntrySelectors.experimentRawDataEMPIAR));

  /**
   * Processing, table facades and Molstar tab manipulating class
   */

  // javascript functions exposed to template for parsing domains nested data
  public readonly objectKeys = Object.keys;
  public readonly objectValues = Object.values;

  // used in template
  public currentData = signal<ProcessedExperimentalDetails | undefined>(undefined);
  public processedData = signal<ProcessedExperimentalDetails[] | undefined>(undefined);
  public isHybrid = signal<boolean>(false);
  public noImg = false;

  // tooltip constants
  public valInfoTooltip = validationInfoTooltip;
  public sampleInfoTooltip = sampleInfoTooltip;
  public expInfoTooltip = expInfoTooltip;
  public expRawDataTooltip = expRawDataTooltip;
  public timelineTooltip = timelineTooltip;
  public pdbRedoTooltip = pdbRedoTooltip;
  // Molstar components rendering and state variables
  @ViewChild('molstarContainer') molstarContainer!: ElementRef;
  private isMolstarRetrieved = false;

  async ngOnInit() {
    // when initialized we process data from the endpoints into a unified object used for rendering
    // (processedExpValData)
    const processedExpValData = await this.dataFacade.processData(
      this.experimentalDetails()!,
      this.sourceOrganisms()!,
      this.hasRna()!,
      this.depositionDate()!,
      this.releaseDate()!,
      this.revisionDate()!,
      this.entryTitle()!,
      this.keyValidationStats()!,
      this.xRayRefine()!,
      this.pdbRedoData()!,
      this.rawDataPDB()!,
      this.rawDataBMRB()!,
      this.rawDataIRRMC()!,
      this.rawDataEMPIAR()!,
      this.rawDataSBGrid()!
    );

    console.log('Processed experimental details:', processedExpValData);

    // currently displayed method is the first from the list of processed objects
    this.processedData.set(processedExpValData);
    this.currentData.set(this.processedData()?.[0]);

    // if more than one object exists we set entry to be of hybrid experimental methods (this enables the top filters)
    if (this.experimentalDetails() ?? [].length > 1) {
      this.isHybrid.set(true);
    }
  }

  async ngAfterViewInit() {
    // before rendering molstar we get the singleton molstar tab instance from the template (this avoids memory leaks)
    await this.getMolstarViewerFromParent();
    // we render molstar with reloading config obj as true
    await this.molstarVisualisations.renderMolstarValidation(this.entryId() ?? '', this.molstarViewerEl(), true);
  }

  async getMolstarViewerFromParent() {
    if (this.isMolstarRetrieved === false) {
      // Move the molstar WebGL container into the child component
      this.renderer.appendChild(this.molstarContainer.nativeElement, this.molstarViewerEl());
      // Add a delay to ensure synchronicity
      this.isMolstarRetrieved = true;
    }
    await firstValueFrom(timer(50)); // 100ms delay, adjust as needed
  }

  async sendMolstarViewerToParent() {
    // Move the molstar WebGL container back to the parent component
    if (this.isMolstarRetrieved === true) {
      this.renderer.appendChild(this.molstarParent(), this.molstarViewerEl());
      this.isMolstarRetrieved = false;
      // Set first render for next view equal to true
      this.molstarVisualisations.isFirstViewRender = true;
    }
    // Add a delay to ensure synchronicity
    await firstValueFrom(timer(50)); // 100ms delay, adjust as needed
  }

  async ngOnDestroy() {
    // when dashboard is destroyed we send the molstar singleton instance back to global template
    await this.sendMolstarViewerToParent();
  }

  /**
   * when a filter is clicked we changed the rendered data
   */
  setData(data: ProcessedExperimentalDetails) {
    this.currentData.set(data);
  }
}
