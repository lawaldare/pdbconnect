import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../../../store/entry-store.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../../../store/entry.selectors';
import { EntryActions } from '../../../../../store/entry.actions';
import { UtilService } from '@pdbc/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ApplicationAPIDispatcher } from '../../../../../services/application-api-dispacher.service';

@Component({
  selector: 'pdbc-mb-overview-macromolecules',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './mb-overview-macromolecules.component.html',
  styleUrl: './mb-overview-macromolecules.component.scss',
})
export class MbOverviewMacromoleculesComponent implements OnInit {
  public readonly util = inject(UtilService);
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  public readonly processedMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));

  public loadedMacromolecules = computed(() => this.processedMacromolecules() !== undefined);
  public readonly macromoleculeInitialCount = signal<number>(5);

  public readonly macromoleculeTableRows = computed(() => {
    const rows = this.processedMacromolecules();
    if (rows === undefined) return [];
    const mappedDatum = rows.map((mol, index) => {
      return {
        ...mol,
        index,
        organisms: [...new Set(mol['organisms'])],
      };
    });
    return mappedDatum;
  });

  public uniqueOrganismsWithStrains = computed(() => {
    const rows = this.processedMacromolecules();
    if (rows === undefined) return [];

    const uniqueOrganismsWithStrains = [];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const macromol = rows[rowIndex];
      const seen = new Set<string>();
      const organismsWithSources = (macromol.additionalData.molecule['source'] ?? [])
        .filter((s) => s.organism_scientific_name)
        .filter((s) => {
          const key = `${s.organism_scientific_name}|${s.strain ?? ''}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((s) => ({
          name: s.organism_scientific_name,
          strain: s.strain,
        }));
      uniqueOrganismsWithStrains.push(organismsWithSources);
    }
    return uniqueOrganismsWithStrains;
  });

  public toggleMacromoleculeList(): void {
    this.macromoleculeInitialCount.update((prev) => (prev === 5 ? this.macromoleculeTableRows().length : 5));
  }

  ngOnInit() {
    this.applicationApiDispatcher.dispatchForList([
      EntryActions.getAssemblies,
      EntryActions.getEntryMolecules,
      EntryActions.getCarbohydrates,
      EntryActions.getProcessedMacromolecules,
      EntryActions.getEntryPolymerCoverage,
    ]);
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }
}
