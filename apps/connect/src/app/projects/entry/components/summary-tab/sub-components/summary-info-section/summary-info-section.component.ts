import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrucQualityGradientsComponent } from '../../../shared/struc-quality-gradients/struc-quality-gradients.component';
import { UtilService } from '@pdbc/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

import { EntryStoreState } from '../../../../store/entry-store.model';
import { EntrySelectors } from '../../../../store/entry.selectors';

import { assemblyCompositionTooltip, assemblyNameTooltip, baseUrl, complexIdTooltip, modelQualitySummaryTooltip } from '../../../../entry-constant';

@Component({
  selector: 'pdbc-summary-info-section',
  standalone: true,
  templateUrl: './summary-info-section.component.html',
  styleUrls: ['./summary-info-section.component.scss'],
  imports: [CommonModule, StrucQualityGradientsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryInfoSectionComponent {
  /** ----------------------------------------------
   ** STORE SIGNALS USED BY THE INFO SECTION
   ** ---------------------------------------------- */

  private readonly store = inject(Store<EntryStoreState>);
  public readonly util = inject(UtilService);

  public readonly summary = toSignal(this.store.select(EntrySelectors.summaryData));
  public readonly moleculeSources = toSignal(this.store.select(EntrySelectors.moleculeSources));
  public readonly organismScientificNamesWithStrains = computed(() => {
    const molSrcs = this.moleculeSources();
    if (!molSrcs || molSrcs.length === 0) return [];

    const seen = new Set<string>();
    const namesWithStrains = [];

    for (const molSrc of molSrcs) {
      if (!molSrc.organism_scientific_name) continue;

      const key = `${molSrc.organism_scientific_name}|${molSrc.strain ?? ''}`;
      if (seen.has(key)) continue;

      seen.add(key);
      namesWithStrains.push({
        name: molSrc.organism_scientific_name,
        strain: molSrc.strain,
      });
    }

    return namesWithStrains;
  });

  public readonly primaryPublication = toSignal(this.store.select(EntrySelectors.primaryPublication));

  public readonly qualityScores = toSignal(this.store.select(EntrySelectors.summaryQualityScores));

  /** ----------------------------------------------
   ** TOOLTIP CONSTANTS + BASE URL
   ** ---------------------------------------------- */
  public readonly modelQualitySummaryTooltip = modelQualitySummaryTooltip;
  public readonly baseUrl = baseUrl;
  public readonly assemblyNameTooltip = assemblyNameTooltip;
  public readonly complexIdTooltip = complexIdTooltip;
  public readonly assemblyCompositionTooltip = assemblyCompositionTooltip;

  /** ----------------------------------------------
   ** AUTHOR & ENTRIES LIST EXPAND/COLLAPSE LOGIC
   ** ---------------------------------------------- */
  public readonly initialEntryAuthorCount = signal(5);
  public readonly initialAuthorCount = signal(5);
  public readonly initialEntriesCount = signal(5);

  toggleEntryAuthorList() {
    const authors = this.summary()?.entryAuthorsList ?? [];
    this.initialEntryAuthorCount.update((prev) => (prev === 5 ? authors.length : 5));
  }

  toggleAuthorList() {
    const authors = this.primaryPublication()?.author_list ?? [];
    this.initialAuthorCount.update((prev) => (prev === 5 ? authors.length : 5));
  }

  toggleEntriesList() {
    const entries = this.primaryPublication()?.associated_entries ?? '';
    const array = this.splitStringByCommas(entries);
    this.initialEntriesCount.update((prev) => (prev === 5 ? array.length : 5));
  }

  /** ----------------------------------------------
   ** HELPERS USED IN THE TEMPLATE
   ** ---------------------------------------------- */

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }

  public generateEntryAuthorSearchUrl(term: string): string {
    term = term.toLowerCase().replace(/[.,]/g, '');
    return this.util.generateQueryURL(term, 'q_entry_authors');
  }

  public generateAuthorSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'all_authors');
  }

  public splitStringByCommas(str: string): string[] {
    return str.split(',').map((e) => e.trim());
  }
}
