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
    const hasMacromoleculesData = Object.keys(this.signals.tabTableData()).indexOf('Macromolecules') > -1;
    if (!hasMacromoleculesData) return [];
    return this.signals.getTabData('Macromolecules').tableRows() as MacromoleculesRowData[];
  });

  public processedLigands = computed(() => {
    const hasLigandsData = Object.keys(this.signals.tabTableData()).indexOf('Ligands') > -1;
    if (!hasLigandsData) return [];
    const data = this.signals.getTabData('Ligands').tableRows() as LigandsRowData[];
    return data.filter((datum) => datum.type === 'ligand');
  });
  public processedModifications = computed(() => {
    const hasLigandsData = Object.keys(this.signals.tabTableData()).indexOf('Ligands') > -1;
    if (!hasLigandsData) return [];
    const data = this.signals.getTabData('Ligands').tableRows() as LigandsRowData[];
    return data.filter((datum) => datum.type === 'modification');
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
    const hasDomainsData = Object.keys(this.signals.tabTableData()).indexOf('Domains') > -1;
    if (!hasDomainsData) return [];
    return this.signals.getTabData('Domains').tableRows() as DomainsRowData[];
  });

  public processedDomains = computed(() => {
    const hasMacromoleculesData = Object.keys(this.signals.tabTableData()).indexOf('Macromolecules') > -1;
    const hasDomainsData = Object.keys(this.signals.tabTableData()).indexOf('Domains') > -1;
    if (!hasMacromoleculesData && !hasDomainsData) return [];

    const macromoleculesData = this.signals.getTabData('Macromolecules').tableRows() as MacromoleculesRowData[];
    const domainsData = this.signals.getTabData('Domains').tableRows() as DomainsRowData[];

    const nestedMap = new Map<number, { macromolecule: MacromoleculesRowData; domains: DomainsRowData[] }>();

    for (const domain of domainsData) {
      const macromolecule = getMacromoleculeOfDomain(domain, macromoleculesData);
      const entityId = macromolecule.additionalData.molecule.entity_id;

      if (!nestedMap.has(entityId)) {
        nestedMap.set(entityId, { macromolecule, domains: [] });
      }
      nestedMap.get(entityId)!.domains.push(domain);
    }

    return Array.from(nestedMap.values());
  });

  constructor() {
    effect(() => {
      const hasDomainsData = Object.keys(this.signals.tabTableData()).indexOf('Domains') > -1;
      if (hasDomainsData) {
        const domainsData = this.signals.getTabData('Domains').tableRows() as DomainsRowData[];
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

  public preferredAssemblyData = computed(() => {
    const summaryData = this.summaryData();
    const complexDetails = this.complexDetails();
    if (summaryData && complexDetails) {
      let preferredAssemblyId = undefined;

      const hasAssemblies = Object.keys(summaryData).indexOf('assemblies') > -1;
      if (!hasAssemblies) return undefined;

      for (const complexDetail of complexDetails) {
        for (const assemblyInfo of complexDetail.assemblies) {
          if (assemblyInfo.preferred_assembly) {
            preferredAssemblyId = assemblyInfo.assembly_id;

            const summaryAssembly =
              summaryData.assemblies.filter((summaryAssembly) => {
                return summaryAssembly.assembly_id === assemblyInfo.assembly_id + '';
              })[0] || undefined;

            let composition = undefined;
            if (summaryAssembly) {
              composition = summaryAssembly.form + ' ' + summaryAssembly.name;
              composition = summaryAssembly.name === 'monomer' ? 'monomeric' : composition;
            }

            return {
              name: complexDetail.name,
              preferred: preferredAssemblyId,
              composition: composition,
              complexId: complexDetail.pdb_complex_id,
            };
            break;
          }
        }
        if (preferredAssemblyId) break;
      }
    }
    return undefined;
  });
}
