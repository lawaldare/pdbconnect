import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Signal, WritableSignal, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';

import '@nightingale-elements/nightingale-variation';
import '@nightingale-elements/nightingale-linegraph-track';

import { APIVariant, APIVariationData } from '../../../models/pv-api-variation-track-data.model';
import { MaterialModule } from '@pdbc/core';
import { filterEntityVariationData, processEntityVariationDataFromAPI, processEntityVariationLineChartDataFromAPI } from './pv-variation-api-processing';

const PDBE_VARIATION_CONSEQUENCE_FILTERS = [
  {
    keyword: 'likely_disease',
    displayName: 'Likely disease',
  },
  {
    keyword: 'predicted',
    displayName: 'Predicted deleterious or benign',
  },
  {
    keyword: 'likely_benign',
    displayName: 'Likely benign',
  },
  {
    keyword: 'uncertain',
    displayName: 'Uncertain',
  },
];

const PDBE_VARIATION_PROVENANCE_FILTERS = [
  {
    keyword: 'UniProt',
    displayName: 'UniProt reviewed',
  },
  {
    keyword: 'ClinVar',
    displayName: 'ClinVar reviewed',
  },
  {
    // keyword: 'LSS',
    keyword: 'large_scale_studies',
    displayName: 'Large scale studies',
  },
  {
    keyword: 'foldx',
    displayName: 'Foldx analysis',
  },
  {
    keyword: 'missense3d',
    displayName: 'Missense 3D',
  },
  {
    keyword: 'PDB',
    displayName: 'Observed in PDB',
  },
  {
    keyword: 'SKEMPI',
    displayName: 'SKEMPI',
  },
  {
    keyword: 'fireprotdb',
    displayName: 'FireProtDB',
  },
  {
    keyword: 'frustratometer',
    displayName: 'Frustatometer',
  },
  {
    keyword: 'nextprot',
    displayName: 'neXtProt',
  },
];

/**
 * Observation: styles need to be global for this component because of Nightingale constraints
 * (unless we use ng-deep somehow)
 */
@Component({
  selector: 'lib-variation-track-block',
  standalone: true,
  imports: [CommonModule, MatCheckbox, MaterialModule],
  templateUrl: './pv-variation-track-block.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VariationTrackBlockComponent {
  @Input({ required: true }) originalVariationData!: WritableSignal<APIVariationData | undefined>;
  @Input({ required: true }) sequenceLength!: number;
  @Input({ required: true }) selectionHighlight!: string;
  private readonly _chainId = signal<string | undefined>(undefined);

  @Input()
  set chainId(value: string | undefined) {
    this._chainId.set(value);
  }
  get chainId(): string | undefined {
    return this._chainId();
  }
  @Input() isEntryData = false;

  // Local internal state
  public isExpanded = signal<boolean>(false);

  consequenceFilters = PDBE_VARIATION_CONSEQUENCE_FILTERS;
  provenanceFilters = PDBE_VARIATION_PROVENANCE_FILTERS;

  private currentKeywordFilters = signal<string[]>([]);

  constructor() {
    effect(() => {
      const currentChain = this._chainId();
      console.log('currentChain', currentChain);
      if (this._chainId()) {
        console.log('🔁 chainId changed to:', currentChain);
      }
    });
  }
  /**
   * Computed angular signal for variationData
   * Updated when originalVariationData Input signal is true
   *
   * Filters variation data for PDBe Entries with unique variant accessions
   */
  readonly uniqueApiVariationData = computed(() => {
    const data = this.originalVariationData();
    const currentChain = this._chainId();
    if (!data || !this.isEntryData) return data;
    console.log('[uniqueApiVariationData] triggered', { data, currentChain });
    return filterEntityVariationData(data, currentChain);
  });

  /**
   * Computed angular signal for variationData
   * Updated when originalVariationData Input signal is true
   * and on currentKeywordFilters changes
   *
   * For isEntryData there is a function (processEntityVariationDataFromAPI) to
   * convert API data to Nightingale compatible data
   *
   */
  readonly variationData = computed(() => {
    const data = this.uniqueApiVariationData();
    const filters = this.currentKeywordFilters();
    if (!data || !this.isEntryData) return [];
    console.log('[variationData] triggered', { data, filters });
    return processEntityVariationDataFromAPI(data, filters);
  });

  /**
   * Computed angular signal for variationCountData
   * Updated when originalVariationData Input signal is true
   * and on currentKeywordFilters changes
   *
   * For isEntryData there is a function (processEntityVariationLineChartDataFromAPI) to
   * convert API data to Nightingale compatible data
   *
   */
  readonly variationCountData = computed(() => {
    const data = this.uniqueApiVariationData();
    const filters = this.currentKeywordFilters();
    if (!data || !this.isEntryData) return [];
    return processEntityVariationLineChartDataFromAPI(data, filters);
  });

  /**
   * Verifies whether a given filter inside consequenceFilters and provenanceFilters lists
   * is active (checked) or not according to active keywords
   * @param filterName
   * @returns true or false
   */
  isNotFiltered(filterName: string) {
    return this.currentKeywordFilters().indexOf(filterName) === -1;
  }

  /**
   * Verifies whether a given filter inside consequenceFilters and provenanceFilters lists
   * is enabled or not according to its presence in API data keywords
   * @param filterName
   * @returns
   */
  hasAnyVariantsForFilter(filterName: string): boolean {
    const data = this.uniqueApiVariationData();
    if (!data) return false;
    return !data.variants.some((v: APIVariant) => v.keywords?.includes(filterName));
  }

  /**
   * Updates currentKeywordFilters when a given filter inside consequenceFilters and provenanceFilters lists
   * is changed (checked or unchecked)
   * This triggers variationData and variationCountData computed signals updates (see above)
   * @param filterName
   */
  changeVariantFiltering(filterName: string) {
    const filters = [...this.currentKeywordFilters()];
    const index = filters.indexOf(filterName);

    if (index === -1) filters.push(filterName);
    else filters.splice(index, 1);

    this.currentKeywordFilters.set([...new Set(filters)]);
  }

  /**
   * When a track is expanded switch the template expansion signal
   */
  toggleExpansion() {
    this.isExpanded.set(!this.isExpanded());
  }
}
