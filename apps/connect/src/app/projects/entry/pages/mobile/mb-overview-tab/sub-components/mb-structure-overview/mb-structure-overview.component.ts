import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntrySelectors } from '../../../../../store/entry.selectors';
import { generateMacromoleculesTableFilters } from '../../../../../store/data-processing/macromolecule-processing';
import { Filter } from '../../../../../store/data-processing/models/other-models';
import { generateLigandsAndModsTableFilters } from '../../../../../store/data-processing/ligand-processing';
import { Molecule } from '../../../../../data-models/molecule.model';
import { ModifiedResidue } from '../../../../../data-models/modified-residues.model';
import { EntryActions } from '../../../../../store/entry.actions';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { UtilService } from '@pdbc/core';

@Component({
  selector: 'pdbc-mb-structure-overview',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './mb-structure-overview.component.html',
  styleUrl: './mb-structure-overview.component.scss',
})
export class MbStructureOverviewComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly util = inject(UtilService);

  public readonly organismScientificNames = toSignal(this.globalStore.select(EntrySelectors.organismScientificNames)); // molecules
  public readonly processedMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules)); // all processedMacro
  public readonly processedLigands = toSignal(this.globalStore.select(EntrySelectors.processedLigands)); // all processedLigands
  public readonly resolutionValues = toSignal(this.globalStore.select(EntrySelectors.resolutionValues)); // experiment
  public readonly experimentalMethod = toSignal(this.globalStore.select(EntrySelectors.experimentalMethod)); // experiment

  public readonly overviewDataLoaded = computed(() => {
    const loadedLigands = this.processedLigands() !== undefined;
    const loadedMacromolecules = this.processedMacromolecules() !== undefined;
    const isLoaded = loadedLigands && loadedMacromolecules;
    return isLoaded;
  });

  public readonly miniFilters = computed(() => {
    const loadedLigands = this.processedLigands() !== undefined;
    const loadedMacromolecules = this.processedMacromolecules() !== undefined;
    const isLoaded = loadedLigands && loadedMacromolecules;

    if (!isLoaded) return [];
    const filters: Filter[] = [];

    const macromolecules = this.processedMacromolecules();
    if (macromolecules) {
      const macromoleculesMols = macromolecules.map((mm) => mm.additionalData.molecule);
      filters.push(...generateMacromoleculesTableFilters(macromoleculesMols).filter((f) => !f.description.includes('All')));
    }

    const ligandsAndMods = this.processedLigands();
    if (ligandsAndMods !== undefined) {
      const ligands = ligandsAndMods.filter((lm) => lm.type === 'ligand').map((ligand) => ligand.additionalData.source);

      const modifications = ligandsAndMods.filter((lm) => lm.type === 'modification').map((modification) => modification.additionalData.source);

      const modificationsFlat = (<ModifiedResidue[][]>modifications).flat();

      filters.push(...generateLigandsAndModsTableFilters(<Molecule[]>ligands, modificationsFlat).filter((f) => !f.description.includes('All')));
    }
    return filters;
  });

  ngOnInit(): void {
    this.globalStore.dispatch(EntryActions.getAssemblies());
    this.globalStore.dispatch(EntryActions.getEntryMolecules());
    this.globalStore.dispatch(EntryActions.getEntryLigandMonomers());
    this.globalStore.dispatch(EntryActions.getProcessedLigands());
    this.globalStore.dispatch(EntryActions.getCarbohydrates());
    this.globalStore.dispatch(EntryActions.getModifications());
    this.globalStore.dispatch(EntryActions.getProcessedMacromolecules());
    this.globalStore.dispatch(EntryActions.getExperiment());
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }
}
