import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ValidationSliderService } from './validation-slider.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-validation-slider',
  templateUrl: './validation-slider.component.html',
  styleUrls: ['./validation-slider.component.css'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationSliderComponent implements OnInit, OnDestroy {
  @Input() pdbId!: string;
  @Input() sliderDivision = 5;
  @Input() sliderData!: any[];
  errorMessage = '';
  loading = true;
  serviceHook: any;

  constructor(private validationSliderService: ValidationSliderService) {}

  ngOnInit() {
    //Get Data from PDBe Validation API if PDB ID is provided
    if (this.pdbId && this.pdbId != '') {
      if (this.pdbId.length != 4) {
        this.errorMessage = 'Error: Please enter valid PDB ID!';
        return;
      } else {
        this.serviceHook = this.validationSliderService.getValidationData(this.pdbId).subscribe((apiResult) => {
          if (typeof apiResult != 'undefined') {
            this.apiResponseHandler(apiResult);
          } else {
            this.errorMessage = 'Error: Data not available!';
          }
          this.loading = false;
        });
      }
    } else if (this.sliderData.length == 0) {
      this.errorMessage = 'Error: Please enter valid PDB ID or slider-data!';
    } else {
      this.loading = false;
    }
  }

  getSliderPosition(positionVal: number) {
    const divisions = this.sliderDivision;
    const positionPointerWidth = 100 / divisions;

    const spacingFromLeft = Math.floor(positionVal / positionPointerWidth) * positionPointerWidth;
    const marginLeft = spacingFromLeft == 0 ? 0 : spacingFromLeft >= 100 ? 100 - positionPointerWidth : spacingFromLeft - 0.5;

    return {
      width: positionPointerWidth + 2 + '%',
      left: marginLeft + '%',
    };
  }

  apiResponseHandler(apiData: { [x: string]: any }) {
    const pdbeValidationData = apiData[this.pdbId];

    const validationData = [
      { label: 'Model geometry', value: null, message: '' },
      { label: 'Fit model/data', value: null, message: '' },
    ];

    if (typeof pdbeValidationData.geometry_quality != 'undefined' && pdbeValidationData.geometry_quality != null) {
      validationData[0].value = pdbeValidationData.geometry_quality;
    } else {
      validationData[0].message =
        pdbeValidationData.experiment_data_available && pdbeValidationData.experiment_data_available == true ? 'Data not analysed' : 'Data not deposited';
    }

    if (typeof pdbeValidationData.data_quality != 'undefined' && pdbeValidationData.data_quality != null) {
      validationData[1].value = pdbeValidationData.data_quality;
    } else {
      validationData[1].message =
        pdbeValidationData.experiment_data_available && pdbeValidationData.experiment_data_available == true ? 'Data not analysed' : 'Data not deposited';
    }

    this.sliderData = validationData;

    this.loading = false;
  }

  ngOnDestroy() {
    if (this.serviceHook) this.serviceHook.unsubscribe();
  }
}
