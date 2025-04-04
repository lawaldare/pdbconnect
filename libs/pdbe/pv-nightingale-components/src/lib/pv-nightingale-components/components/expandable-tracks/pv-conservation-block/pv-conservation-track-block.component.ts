import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, Input, input, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioButton } from '@angular/material/radio';
import { MaterialModule } from '@pdbc/core';
import { PvFixedHighlightService } from '../../../services/pv-fixed-highlight.service';

import '@nightingale-elements/nightingale-new-core-adam';
import '@pdbe-nightingale-conservation';
import '@nightingale-elements/nightingale-linegraph-track';
import { APIConservationData } from '../../../models/pv-api-conservation-track-data.model';
import { processEntityConservationDataFromAPI, processEntityConservationLineChartDataFromAPI } from './pv-conservation-api-processing';

/**
 * Observation: styles need to be global for this component because of Nightingale constraints
 * (unless we use ng-deep somehow)
 */
@Component({
  selector: 'lib-conservation-track-block',
  standalone: true,
  imports: [CommonModule, MatRadioButton, MaterialModule],
  templateUrl: './pv-conservation-track-block.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConservationTrackBlockComponent {
  @Input({ required: true }) originalConservationData!: WritableSignal<APIConservationData | undefined>;
  @Input({ required: true }) sequenceLength!: number;
  @Input({ required: true }) selectionHighlight!: string;
  @Input({ required: true }) helpLogoSrc = '/assets/images/help_outline_24px.svg';
  @Input() isEntryData = false;

  /**
   * Computed angular signal for conservationData
   * Updated when originalConservationData Input signal is true
   *
   * For isEntryData there is a function (processEntityConservationDataFromAPI) to
   * convert API data to Nightingale compatible data
   *
   */
  readonly conservationData = computed(() => {
    if (!this.originalConservationData()) return [];
    if (this.isEntryData) return processEntityConservationDataFromAPI(this.originalConservationData()!);
    return [];
  });

  /**
   * Computed angular signal for conservationCountData
   * Updated when originalConservationData Input signal is true
   *
   * For isEntryData there is a function (processEntityConservationLineChartDataFromAPI) to
   * convert API data to Nightingale compatible data
   *
   */
  readonly conservationCountData = computed(() => {
    if (!this.originalConservationData()) return [];
    if (this.isEntryData) return processEntityConservationLineChartDataFromAPI(this.originalConservationData()!);
    return [];
  });

  public aaProbsTooltip = 'The amino acid probabilities are calculated using HMM profiles based on multiple sequence alignments. Click to see more details...';

  // Keep it collapsed until user clicks
  public isExpanded = signal<boolean>(false);

  public conservationSorting = signal<'default' | 'probability'>('default');

  private highlightService = inject(PvFixedHighlightService);

  /**
   * When a track is expanded switch the template expansion signal
   * and trigger fixed highlight
   */
  toggleExpanded() {
    this.isExpanded.set(!this.isExpanded());
    this.highlightService.triggerDynamicFixedHighlight();
  }

  /**
   * Materials Radio button event handler for switching between conservation sorting
   * @param type 'default' | 'probability'
   */
  changeConservationSorting(type: 'default' | 'probability') {
    this.conservationSorting.set(type);
  }
}
