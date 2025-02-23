/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AfterViewInit, Component, DestroyRef, ElementRef, HostListener, inject, input, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationDataProcessingFacade } from './validation-data.facade';
import { ValidationTablesFacade } from './validation-tables.facade';
import { AgGridAngular } from 'ag-grid-angular';

import { ProcessedExperimentalDetails } from './data-models-and-definitions/processed-experimental-details.model';
import { expInfoTooltip, expRawDataTooltip, pdbRedoTooltip, sampleInfoTooltip, timelineTooltip, validationInfoTooltip } from '../../entry-constant';
import { MaterialModule, UtilService } from '@pdbc/core';
import { filter, firstValueFrom, map } from 'rxjs';
import { MolstarVisualisationsForTabs } from '../../helpers/molstar/molstar-visualisations-for-detail-tabs';
import { StrucQualityGradientsComponent } from '../shared/struc-quality-gradients/struc-quality-gradients.component';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../store/entry.selectors';
import { MolstarConfigObject } from '../../helpers/molstar/molstar-base-class';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

interface ValueLabel {
  value: string;
  label: string;
}

declare let PDBeMolstarPlugin: any;

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
  selector: 'pdbc-experiments-validation',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MaterialModule, ReactiveFormsModule, StrucQualityGradientsComponent],
  templateUrl: './experiments-validation.component.html',
  styleUrl: './experiments-validation.component.scss',
})
export class ExperimentsValidationComponent implements OnInit, AfterViewInit {
  public readonly renderer = inject(Renderer2);
  public readonly elementRef = inject(ElementRef);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly dataFacade = inject(ValidationDataProcessingFacade);
  public readonly tableFacade = inject(ValidationTablesFacade);
  public readonly molstarVisualisations = inject(MolstarVisualisationsForTabs);
  public readonly util = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';

  public molstarViewerEl = input.required<HTMLElement>(); // Molstar global instance div
  public molstarParent = input.required<HTMLElement>(); // Parent to send back the molstar global instance

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly sourceOrganisms = toSignal(this.globalStore.select(EntrySelectors.organismScientificNames));
  public readonly pdbRedoData = toSignal(this.globalStore.select(EntrySelectors.pdbRedoQualityScores));

  /**
   * Processing, table facades and Molstar tab manipulating class
   */

  // javascript functions exposed to template for parsing domains nested data
  // public readonly objectKeys = Object.keys;
  // public readonly objectValues = Object.values;

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
  // private molstarViewInstance: any;
  // private isMolstarRetrieved = false;

  public readonly isSticky = signal<boolean>(false);
  public readonly validationTypes = [
    {
      label: 'Issue count',
      value: 'issue_count',
    },
    {
      label: 'Specific issue',
      value: 'specific_issue',
    },
  ];

  public readonly specificIssueKinds = [
    {
      label: 'Clashes',
      value: 'clashes',
    },
    {
      label: 'Sidechain Outliers',
      value: 'sidechain_outliers',
    },
    {
      label: 'Ramachandran Plots',
      value: 'ramachandran_plots',
    },
    {
      label: 'Rotamer Outliers',
      value: 'rotamer_outliers',
    },
    {
      label: 'Cβ Deviations',
      value: 'cbeta_deviations',
    },
    {
      label: 'Rama-Z',
      value: 'rama_z',
    },
  ];

  public selectedValidationType = signal<ValueLabel>(this.validationTypes[0]);
  public selectedSpecificIssueKind = new FormControl(this.specificIssueKinds[0].value, { nonNullable: true });

  ngOnInit() {
    this.globalStore
      .select(EntrySelectors.experimentalDetails)
      .pipe(
        filter(Boolean),
        map((experimentalDetails) => {
          const processedExpValData = this.dataFacade.processData();

          this.processedData.set(processedExpValData);
          this.currentData.set(this.processedData()?.[0]);

          if (experimentalDetails.length > 1) {
            this.isHybrid.set(true);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    // Check if we've scrolled past the top of the aside
    if (scrollPosition >= 394) {
      this.isSticky.set(true);
    } else {
      this.isSticky.set(false);
    }
  }

  public selectValidationType(option: ValueLabel) {
    this.selectedValidationType.set(option);
  }

  public selectSpecificIssueKind(event: MatSelectChange) {
    this.selectedSpecificIssueKind.setValue(event.value);
    console.log(this.selectedSpecificIssueKind.value);
  }

  async ngAfterViewInit() {
    // await this.getMolstarViewerFromParent();
    // await this.molstarVisualisations.renderMolstarValidation(this.entryId() ?? '', this.molstarViewerEl(), true);

    const molstarViewInstance = new PDBeMolstarPlugin();
    const container = this.molstarContainer.nativeElement;

    const molstarConfigObject: MolstarConfigObject = {
      moleculeId: this.entryId() ?? '',
      loadMaps: false,
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: true,
      granularity: 'residue',
      validationAnnotation: true,
    };

    molstarViewInstance.render(container, molstarConfigObject);
    await firstValueFrom(molstarViewInstance.events.loadComplete);
    const galleryManager = await PDBeMolstarPlugin.extensions.StateGallery.StateGalleryManager.create(molstarViewInstance.plugin, this.entryId() ?? '');
    let validationImg: string | undefined;
    const imageList = galleryManager.images;
    for (const img of imageList) {
      if (img.filename.includes('_validation')) {
        validationImg = img.filename;
      }
    }
    if (validationImg) await galleryManager.load(validationImg);
  }

  // async getMolstarViewerFromParent() {
  //   if (this.isMolstarRetrieved === false) {
  //     // Move the molstar WebGL container into the child component
  //     this.renderer.appendChild(this.molstarContainer.nativeElement, this.molstarViewerEl());
  //     // Add a delay to ensure synchronicity
  //     this.isMolstarRetrieved = true;
  //   }
  //   await firstValueFrom(timer(50)); // 100ms delay, adjust as needed
  // }

  // async sendMolstarViewerToParent() {
  //   // Move the molstar WebGL container back to the parent component
  //   if (this.isMolstarRetrieved === true) {
  //     this.renderer.appendChild(this.molstarParent(), this.molstarViewerEl());
  //     this.isMolstarRetrieved = false;
  //     // Set first render for next view equal to true
  //     this.molstarVisualisations.isFirstViewRender = true;
  //   }
  //   // Add a delay to ensure synchronicity
  //   await firstValueFrom(timer(50)); // 100ms delay, adjust as needed
  // }

  /**
   * when a filter is clicked we changed the rendered data
   */
  setData(data: ProcessedExperimentalDetails) {
    this.currentData.set(data);
  }
}
