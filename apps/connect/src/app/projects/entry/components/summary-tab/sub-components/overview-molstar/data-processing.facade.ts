/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { filter, map } from 'rxjs';
import { calculateAssemblyComposition } from '../../../../helpers/assembly-helpers';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../../store/entry.selectors';
import { EntryStoreState } from '../../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { NestedDomainsData, ParsedComplexDetails } from './data-processing.models';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../../../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { getMacromoleculeEntityId, getMacromoleculeOfDomain } from '../../../../helpers/processed-data-to-controls';

@Injectable({
  providedIn: 'root',
})
export class OverviewMolstarFacade {
  private readonly globalStore = inject(Store<EntryStoreState>);

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

  public processedMacromolecules: WritableSignal<MacromoleculesRowData[]> = signal([]);
  public setProcessedMacromolecules(data: MacromoleculesRowData[]) {
    this.processedMacromolecules.set(data);
  }

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

  public processedDomainsAsList: WritableSignal<DomainsRowData[]> = signal([]);
  public processedDomains: WritableSignal<NestedDomainsData> = signal([]);
  public setProcessedDomains(macromoleculesData: MacromoleculesRowData[], domainsData: DomainsRowData[]) {
    const nestedMap = new Map<number, { macromolecule: MacromoleculesRowData; domains: DomainsRowData[] }>();
    const uniqueAccessionsByResource: { [key: string]: string[] } = {};

    for (const domain of domainsData) {
      // Get macromolecule and entity id
      const macromolecule = getMacromoleculeOfDomain(domain, macromoleculesData);
      const entityId = getMacromoleculeEntityId(macromolecule);

      // Create nested domain object containing macromolecule
      if (!nestedMap.has(entityId)) {
        nestedMap.set(entityId, {
          macromolecule,
          domains: [],
        });
      }
      nestedMap.get(entityId)!.domains.push(domain);

      // Count total domains
      this.domainCount.set(this.domainCount() + 1);

      // Count domains by resource
      const domainResource = domain.resource;
      const domainCountByResource = this.domainCountByResource();
      this.domainCountByResource.set({
        ...domainCountByResource,
        [domainResource]: (domainCountByResource[domainResource] ?? 0) + 1,
      });

      // Track unique accessions using a Set
      const domainAccession = domain.additionalData.accession;
      if (!uniqueAccessionsByResource[domainResource]) {
        // uniqueAccessionsByResource.set(domainResource, new Set());
        uniqueAccessionsByResource[domainResource] = [];
      }

      // Count unique domains by resource
      const accessionSet = uniqueAccessionsByResource[domainResource];
      const hasAccession = accessionSet.indexOf(domainAccession) > -1;
      if (!hasAccession) {
        const uniqueDomainCountByResource = this.uniqueDomainCountByResource();
        this.uniqueDomainCountByResource.set({
          ...uniqueDomainCountByResource,
          [domainResource]: (uniqueDomainCountByResource[domainResource] ?? 0) + 1,
        });
        uniqueAccessionsByResource[domainResource].push(domainAccession);
      }
    }

    for (const resource of ['CATH', 'SCOP', 'Pfam']) {
      if (this.domainCountByResource()[resource] > 0) {
        this.currentDomainResource.set(resource);
        break;
      }
    }

    const nestedDomainsData: NestedDomainsData = Array.from(nestedMap.values());
    this.processedDomains.set(nestedDomainsData);
    this.processedDomainsAsList.set(domainsData);
  }

  public processedLigands: WritableSignal<LigandsRowData[]> = signal([]);
  public setProcessedLigands(data: LigandsRowData[]) {
    this.processedLigands.set(data.filter((datum) => datum.type === 'ligand'));
  }

  public processedModifications: WritableSignal<LigandsRowData[]> = signal([]);
  public setProcessedModifications(data: LigandsRowData[]) {
    this.processedModifications.set(data.filter((datum) => datum.type === 'modification'));
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
