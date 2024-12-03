import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnyExperimentDetail, ExperimentDetail } from '../../data-models/experimental-details.model';
import { KeyValidationStats, ValidationStat } from '../../data-models/key-validation-stats.model';
import { XRayRefine } from '../../data-models/x-ray-refine.model';
import { ValidationDataFacade } from './validation-data.facade';
import { ValidationTablesFacade } from './validation-tables.facade';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'pdbc-experiments-validation-tab',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './experiments-validation-tab.component.html',
  styleUrl: './experiments-validation-tab.component.scss',
})
export class ExperimentsValidationTabComponent implements OnInit {
  // Hybrid methods examples:
  //https://www.ebi.ac.uk/pdbe/entry/pdb/1ur6/experiment
  //https://www.ebi.ac.uk/pdbe/entry/pdb/6yeg/experiment
  //https://www.ebi.ac.uk/pdbe/entry/pdb/8sch/experiment
  //https://www.ebi.ac.uk/pdbe/entry/pdb/8ong/experiment
  //https://www.ebi.ac.uk/pdbe/entry/pdb/6gua/experiment

  public readonly entryId = input.required<string>();
  public readonly depositionDate = input.required<string>();
  public readonly releaseDate = input.required<string>();
  public readonly revisionDate = input.required<string>();
  public readonly experimentalDetails = input.required<ExperimentDetail[]>();
  public readonly keyValidationStats = input.required<KeyValidationStats>();
  public readonly dataFacade = inject(ValidationDataFacade);
  public readonly tableFacade = inject(ValidationTablesFacade);

  public validationKeys?: Array<keyof KeyValidationStats>;

  public readonly xRayRefine = input.required<XRayRefine>();

  public hasExperimentalInfo = ['X-ray diffraction', 'Solution NMR', 'Electron Microscopy'];

  public xRayDatasetTableRows?: string[];
  public xRayRefinementTableRows?: string[];
  public nmrSamplesSpectraTableRows?: string[];

  public noImg = false;

  setInfoRowWidth(experimentalMethod: string) {
    // const hasNmrMethod = this.experimentalDetails().some(obj =>
    //   obj.experimental_method && obj.experimental_method.toLowerCase().includes('nmr')
    // );
    // const hasEmMethod = this.experimentalDetails().some(obj =>
    //   obj.experimental_method && obj.experimental_method.toLowerCase().includes('electron microscopy')
    // );
    if (experimentalMethod.toLowerCase().includes('nmr')) {
      return '308px';
    }
    if (experimentalMethod.toLowerCase().includes('electron microscopy')) {
      return '178px';
    } else {
      return '160px';
    }
  }

  ngOnInit(): void {
    this.validationKeys = this.dataFacade.processValidationKeys(this.keyValidationStats());
    this.dataFacade.processExperimentalDetails(this.experimentalDetails(), this.xRayRefine());

    // for (let i = 0; i < this.experimentalDetails().length; i++) {
    //   const experimentalDetail = this.experimentalDetails()[i];
    //   if (experimentalDetail.experimental_method === "X-ray diffraction")   {
    //     this.dataFacade.generateXRayTablesData(experimentalDetail, this.xRayRefine());
    //   }
    //   else if (experimentalDetail.experimental_method === "Solution NMR")   {
    //     this.dataFacade.generateNMRTablesData(experimentalDetail);
    //   }
    // }
  }
}
