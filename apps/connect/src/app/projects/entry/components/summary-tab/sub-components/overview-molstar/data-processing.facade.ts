/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { filter, map } from 'rxjs';
import { calculateAssemblyComposition } from '../../../../helpers/assembly-helpers';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../../store/entry.selectors';
import { EntryStoreState } from '../../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { NestedDomainsData, ParsedComplexDetails } from './data-processing.models';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../../../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { getMacromoleculeEntityId, getMacromoleculeOfDomain } from '../../../../helpers/processed-data-to-controls';
import { ComponentCommunicationService } from '../../../../services/component-comm.service';

@Injectable({
  providedIn: 'root',
})
export class OverviewMolstarFacade {
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly signals = inject(ComponentCommunicationService);
  public readonly complexDetails = toSignal(this.globalStore.select(EntrySelectors.complexDetails));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));

  public relatedEntries: WritableSignal<string[]> = signal([]);

  public assemblyData: WritableSignal<ParsedComplexDetails> = signal({
    name: undefined,
    preferred: undefined,
    composition: undefined,
    complexId: undefined,
  });

  public macromoleculesDescription: WritableSignal<string> = signal('');
  public entryContentsDescription: WritableSignal<string[]> = signal([]);

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
      const entityId = getMacromoleculeEntityId(macromolecule);

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

  public readonly descriptions = computed(() => {
    let moleculeTypeConditions = [
      {
        moleculeTypes: ['polypeptide(L)', 'polypeptide(R)'],
        moleculeDescriptionSuffix: 'unique protein',
        entryContentsDescriptionSuffix: 'distinct polypeptide',
      },
      {
        moleculeTypes: ['polydeoxyribonucleotide'],
        moleculeDescriptionSuffix: 'DNA',
        entryContentsDescriptionSuffix: 'distinct DNA',
      },
      {
        moleculeTypes: ['polyribonucleotide'],
        moleculeDescriptionSuffix: 'RNA',
        entryContentsDescriptionSuffix: 'distinct RNA',
      },
      {
        moleculeTypes: ['polydeoxyribonucleotide/polyribonucleotide hybrid'],
        moleculeDescriptionSuffix: 'DNA/RNA hybrid',
        entryContentsDescriptionSuffix: 'distinct DNA/RNA hybrid',
      },
      {
        moleculeTypes: ['carbohydrate polymer'],
        moleculeDescriptionSuffix: 'carbohydrate',
        entryContentsDescriptionSuffix: 'distinct carbohydrate polymer',
      },
    ];

    moleculeTypeConditions = moleculeTypeConditions.filter((condition) => {
      const macromoleculesForCondition = (this.macromolecules() ?? []).filter((mol) => condition.moleculeTypes.indexOf(mol.molecule_type) > -1);
      return macromoleculesForCondition.length > 0;
    });

    let totalMolecules = 0;
    let macromoleculesDescription = '';
    const entryContentsDescription: string[] = [];

    // for each macromolecule type (protein, dna, rna, dna/rna hybrid, carbohydrate)
    for (let i = 0; i < moleculeTypeConditions.length; i++) {
      const moleculeTypeCondition = moleculeTypeConditions[i];
      // filter the complete macromolecule list by the type
      const filteredMacromolecules = (this.macromolecules() ?? []).filter((mol) => moleculeTypeCondition.moleculeTypes.indexOf(mol.molecule_type) > -1);

      // add comma if this is between second and penultimate item
      if (i > 0 && i < moleculeTypeConditions.length - 1) macromoleculesDescription += ', ';

      // add 'and' if more than one item and this is last item
      if (i > 0 && i === moleculeTypeConditions.length - 1) macromoleculesDescription += ' and ';

      macromoleculesDescription += `${filteredMacromolecules.length} ${moleculeTypeCondition.moleculeDescriptionSuffix}`;
      totalMolecules += filteredMacromolecules.length;

      const hasPlural = filteredMacromolecules.length > 1 ? 's' : '';
      entryContentsDescription.push(`${filteredMacromolecules.length} ${moleculeTypeCondition.entryContentsDescriptionSuffix} molecule${hasPlural}`);
    }
    macromoleculesDescription += totalMolecules > 1 ? ' molecules' : ' molecule';

    return { macromoleculesDescription, entryContentsDescription };
  });

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

  public parseComplexDetails(): void {
    const complexDetails = this.complexDetails() ?? [];
    if (complexDetails) {
      let preferredAssemblyId = undefined;
      for (const complexDetail of complexDetails) {
        for (const assemblyInfo of complexDetail.assemblies) {
          if (assemblyInfo.preferred_assembly) {
            preferredAssemblyId = assemblyInfo.assembly_id;
            const participants = complexDetail.participants;
            this.assemblyData.set({
              name: complexDetail.name,
              preferred: preferredAssemblyId,
              composition: calculateAssemblyComposition(participants),
              complexId: complexDetail.pdb_complex_id,
            });
            break;
          }
        }
        if (preferredAssemblyId) break;
      }
    }
  }
}
