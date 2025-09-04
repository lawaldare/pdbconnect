import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../../../store/entry-store.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../../../store/entry.selectors';
import { EntryActions } from '../../../../../store/entry.actions';
import { UtilService } from '@pdbc/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

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

  public readonly processedMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));
  // public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  // public readonly uniprotMappings = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));
  // public readonly polymerCoverage = toSignal(this.globalStore.select(EntrySelectors.polymerCoverage));

  public loadedMacromolecules = computed(() => this.processedMacromolecules() !== undefined);
  public readonly macromoleculeInitialCount = signal<number>(5);

  public readonly macromoleculeTableRows = computed(() => {
    const rows = this.processedMacromolecules();
    // const uniprotMappings = this.uniprotMappings();
    // const polymerCoverage = this.polymerCoverage();
    if (rows === undefined) return [];
    // if (uniprotMappings === undefined) return [];
    // if (polymerCoverage === undefined) return [];
    const mappedDatum = rows.map((mol, index) => {
      //   const mappedUnps = getUniProtsDataForMacromolecule(mol.additionalData.molecule, uniprotMappings, polymerCoverage);
      //   const mappedResiduesAllChains = Object.values(mappedUnps.uniprotRangesByChainId);
      //   const mappedResidues = mappedResiduesAllChains.length > 0 ? mappedResiduesAllChains[0] : [];
      return {
        ...mol,
        index,
        //     mappedResidues,
        organisms: [...new Set(mol['organisms'])],
      };
    });
    return mappedDatum;
  });

  // public bestResidues = computed(() => {
  //   const isoformsMappingKeys = Object.keys(this.isoformsMapping() ?? {});
  //   const filteredIsoformsMapping: any[] = [];

  //   isoformsMappingKeys.forEach((uniprot: string) => {
  //     if (uniprot.indexOf('-') !== -1) {
  //       filteredIsoformsMapping.push({ ...this.isoformsMapping()?.[uniprot], uniprot });
  //     }
  //   });

  //   return filteredIsoformsMapping;
  // });

  public toggleMacromoleculeList(): void {
    this.macromoleculeInitialCount.update((prev) => (prev === 5 ? this.macromoleculeTableRows().length : 5));
  }

  ngOnInit() {
    this.globalStore.dispatch(EntryActions.getAssemblies());
    this.globalStore.dispatch(EntryActions.getEntryMolecules());
    this.globalStore.dispatch(EntryActions.getCarbohydrates());
    this.globalStore.dispatch(EntryActions.getProcessedMacromolecules());
    // this.globalStore.dispatch(EntryActions.getIsoformsMapping()); // used in llm, macro, mb-overview, mb-macro
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }
}
