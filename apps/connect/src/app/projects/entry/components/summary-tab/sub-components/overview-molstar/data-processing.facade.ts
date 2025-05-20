/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../../store/entry.selectors';
import { EntryStoreState } from '../../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../../../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { getMacromoleculeOfDomain } from '../../../../helpers/processed-data-to-controls';
import { ComponentCommunicationService } from '../../../../services/component-comm.service';

@Injectable({
  providedIn: 'root',
})
export class OverviewMolstarFacade {
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly signals = inject(ComponentCommunicationService);
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly complexDetails = toSignal(this.globalStore.select(EntrySelectors.complexDetails));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));

  public relatedEntries: WritableSignal<string[]> = signal([]);

  public processedMacromolecules = computed(() => {
    const hasMacromoleculesData = this.signals.hasProcessedMacromolecules();
    if (!hasMacromoleculesData) return [];
    return this.signals.processedMacromolecules;
  });

  public processedLigands = computed(() => {
    const hasLigandsData = this.signals.hasProcessedLigands();
    if (!hasLigandsData) return [];
    return this.signals.processedLigands;
  });

  public processedModifications = computed(() => {
    const hasLigandsData = this.signals.hasProcessedLigands();
    if (!hasLigandsData) return [];
    return this.signals.processedModifications;
  });

  public currentDomainResource = signal<string>('CATH');
  public domainCount = signal<number>(0);
  public domainCountByResource: WritableSignal<{ [key: string]: number }> = signal({
    CATH: 0,
    Pfam: 0,
    SCOP: 0,
  });

  public uniqueDomainCountByResource: WritableSignal<{ [key: string]: number }> = signal({
    CATH: 0,
    Pfam: 0,
    SCOP: 0,
  });

  public processedDomainsAsList = computed(() => {
    const hasDomainsData = this.signals.hasProcessedDomains();
    if (!hasDomainsData) return [];
    return this.signals.processedDomainsAsList;
  });

  public processedDomains = computed(() => {
    const hasMacromoleculesData = this.signals.hasProcessedMacromolecules();
    const hasDomainsData = this.signals.hasProcessedDomains();
    if (!hasMacromoleculesData || !hasDomainsData) return [];
    return this.signals.processedDomains;
  });

  constructor() {
    effect(() => {
      const hasDomainsData = this.signals.hasProcessedDomains();
      if (hasDomainsData) {
        const domainsData = this.signals.processedDomainsAsList;
        const domainCount = domainsData.length;

        const countByResource: { [key: string]: number } = { CATH: 0, Pfam: 0, SCOP: 0 };
        const uniqueByResource: { [key: string]: number } = { CATH: 0, Pfam: 0, SCOP: 0 };
        const uniqueAccessions: { [key: string]: Set<string> } = { CATH: new Set(), Pfam: new Set(), SCOP: new Set() };

        for (const domain of domainsData) {
          countByResource[domain.resource]++;
          uniqueAccessions[domain.resource].add(domain.additionalData.accession);
        }

        for (const key of Object.keys(uniqueByResource)) {
          uniqueByResource[key] = uniqueAccessions[key].size;
        }

        this.domainCount.set(domainCount);
        this.domainCountByResource.set(countByResource);
        this.uniqueDomainCountByResource.set(uniqueByResource);

        const firstAvailable = ['CATH', 'SCOP', 'Pfam'].find((r) => countByResource[r] > 0);
        if (firstAvailable) this.currentDomainResource.set(firstAvailable);
      }
    });
  }

  public parseRelatedEntries(): void {
    this.globalStore
      .select(EntrySelectors.primaryPublication)
      .pipe(
        filter(Boolean),
        map((primaryPublication) => {
          if (primaryPublication) {
            let relatedEntries: string[] = [];
            if (primaryPublication && primaryPublication.associated_entries) {
              relatedEntries = primaryPublication.associated_entries.split(', ');
            }
            this.relatedEntries.set(relatedEntries);
          }
        })
      )
      .subscribe();
  }
}
