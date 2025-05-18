/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computed, DestroyRef, inject, Injectable, Injector, signal } from '@angular/core';
import { DataToTable } from '../../components/shared/interactive-tables/data-processing/abstract-base-row-class';
import { AssemblyDataToTable } from '../../components/shared/interactive-tables/data-processing/assembly-row-class';
import { DomainDataToTable } from '../../components/shared/interactive-tables/data-processing/domain-row-class';
import { LigandDataToTable } from '../../components/shared/interactive-tables/data-processing/ligand-row-class';
import { MacromoleculeDataToTable } from '../../components/shared/interactive-tables/data-processing/macromolecule-row';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { TableNames } from './main.component';
import { TabNames } from '../../helpers/tab-names.enum';
import { EntryActions } from '../../store/entry.actions';
import { catchError, combineLatest, of, retry, startWith, tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ComplexDetails } from '../../data-models/complex-details.model';
import { ProcessedSummary } from '../../data-models/summary.model';
import { ResidueWiseOutliersMolecule } from '../../data-models/residuewise-outliers.model';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { FlatOutlierResidue } from '../../components/model-quality-tab/validation-data.facade';
import { MolstarStateService } from '../../services/molstar-state.service';
import { Molecule } from '../../data-models/molecule.model';

export type OutliersByModelId = Record<
  string,
  {
    uniqueOutlierTypes: Set<string>;
    molstarSelectionsByOutlierType: Record<string, MolstarSelectionObj>;
    residuesWith1Outlier: MolstarSelectionObj;
    residuesWith2Outliers: MolstarSelectionObj;
    residuesWith3OrMoreOutliers: MolstarSelectionObj;
  }
>;

@Injectable({
  providedIn: 'root',
})
export class MainDataProcessingFacade {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly molstarState = inject(MolstarStateService);
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly destroyRef = inject(DestroyRef);

  public tabDataLoaded = signal<boolean>(false);
  public tableData = signal<DataToTable>({} as DataToTable);
  private tabName = signal<TableNames>('' as TableNames);

  public readonly routeTabs = [
    { label: 'Summary', id: 'summary' },
    { label: 'Model quality', id: 'model-quality' },
    { label: 'Assemblies', id: 'assemblies' },
    { label: 'Macromolecules', id: 'macromolecules' },
    { label: 'Ligands and Environments', id: 'ligands' },
    { label: 'Domains', id: 'domains' },
    { label: 'Citations', id: 'citations' },
  ];

  public isNotUndefined(data: any[]) {
    for (const datum of data) {
      if (datum === undefined) return false;
    }
    return true;
  }

  public setTabName(tabName: TableNames) {
    this.tabName.set(tabName);
  }

  public getTableName(tabName: string) {
    return tabName as TableNames;
  }

  public processInteractiveTablesData() {
    const createSelectorStream = <T>(selector: any, defaultValue: T) =>
      this.globalStore.select(selector).pipe(
        startWith(defaultValue),
        catchError(() => of(defaultValue))
      );

    combineLatest({
      complexDetails: createSelectorStream(EntrySelectors.complexDetails, []),
      assemblyData: createSelectorStream(EntrySelectors.assemblies, []),
      pisaAssemblyData: createSelectorStream(EntrySelectors.pisaAssemblies, []),
      pfamMappings: createSelectorStream(EntrySelectors.pfamMapping, null),
      cathMappings: createSelectorStream(EntrySelectors.cathMapping, null),
      scopMappings: createSelectorStream(EntrySelectors.scop175Mapping, null),
      ligands: createSelectorStream(EntrySelectors.boundLigands, []),
      modifications: createSelectorStream(EntrySelectors.modifications, []),
      carbohydrates: createSelectorStream(EntrySelectors.carbohydrates, []),
      uniprotMapping: createSelectorStream(EntrySelectors.uniprotMapping, null),
      bestStrMapUniProtId: createSelectorStream(EntrySelectors.bestStructuresMappingsByUniProtIds, []),
      macromolecules: createSelectorStream(EntrySelectors.macroMolecules, []),
      ligandMonomers: createSelectorStream(EntrySelectors.ligandMonomers, []),
      polymerCoverage: createSelectorStream(EntrySelectors.polymerCoverage, []),
      residueOutliers: createSelectorStream(EntrySelectors.residueWiseOutliers, []),
      summaryData: createSelectorStream(EntrySelectors.summaryData, undefined),
    })
      .pipe(
        retry({ count: 3, delay: 1000 }),
        tap((data) => this.processTableData(data)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private processTableData(data: any) {
    for (const tabName of [TabNames.Assemblies, TabNames.Domains, TabNames.Ligands, TabNames.Macromolecules]) {
      let tempTableData: DataToTable;

      if (
        tabName === TabNames.Assemblies &&
        this.isNotUndefined([data.summaryData, data.complexDetails, data.assemblyData, data.pisaAssemblyData]) &&
        Object.keys(data.summaryData).length > 0
      ) {
        tempTableData = new AssemblyDataToTable(data.summaryData, data.complexDetails, data.assemblyData, data.pisaAssemblyData);
      } else if (
        tabName === TabNames.Domains &&
        this.isNotUndefined([
          data.pfamMappings,
          data.cathMappings,
          data.scopMappings,
          data.macromolecules,
          data.polymerCoverage,
          data.summaryData,
          data.assemblyData,
        ]) &&
        Object.keys(data.summaryData).length > 0
      ) {
        tempTableData = new DomainDataToTable(
          data.pfamMappings!,
          data.cathMappings!,
          data.scopMappings!,
          data.macromolecules,
          data.polymerCoverage,
          data.summaryData,
          data.assemblyData
        );
      } else if (
        tabName === TabNames.Ligands &&
        this.isNotUndefined([data.ligands, data.modifications, data.ligandMonomers, data.summaryData, data.assemblyData]) &&
        Object.keys(data.summaryData).length > 0
      ) {
        tempTableData = new LigandDataToTable(data.ligands, data.modifications, data.ligandMonomers, data.summaryData, data.assemblyData);
      } else if (
        tabName === TabNames.Macromolecules &&
        this.isNotUndefined([
          data.carbohydrates,
          data.uniprotMapping,
          data.bestStrMapUniProtId,
          data.macromolecules,
          data.polymerCoverage,
          data.summaryData,
          data.assemblyData,
        ]) &&
        Object.keys(data.summaryData).length > 0
      ) {
        tempTableData = new MacromoleculeDataToTable(
          data.carbohydrates,
          data.uniprotMapping!,
          data.bestStrMapUniProtId!,
          data.macromolecules,
          data.polymerCoverage,
          data.summaryData,
          data.assemblyData
        );
      } else {
        continue;
      }

      tempTableData.generateTableData();
      tempTableData.generateTableFilters();
      this.compCommunication.setTabData(tabName, tempTableData);
    }

    this.compCommunication.isTabDataGenerated.set(true);
    this.tabDataLoaded.set(true);
    this.tableData.set(this.compCommunication.getTabData(this.tabName()));

    let preferredAssemblyData = undefined;
    if (this.isNotUndefined([data.complexDetails, data.summaryData])) {
      preferredAssemblyData = this.processPreferredAssemblyData(data.summaryData, data.complexDetails);
    }
    this.compCommunication.preferredAssemblyData.set(preferredAssemblyData);

    let descriptions = undefined;
    let chainToEntityId: { [key: string]: string } = {};
    if (this.isNotUndefined([data.macromolecules])) {
      descriptions = this.processDescriptions(data.macromolecules);
      chainToEntityId = this.mapChainToEntityId(data.macromolecules);
    }
    this.compCommunication.descriptions.set(descriptions);
    this.compCommunication.chainToEntityId.set(chainToEntityId);

    let outliersByModelId: OutliersByModelId = {};
    if (this.isNotUndefined([data.residueOutliers])) {
      outliersByModelId = this.processResidueOutliersData(data.residueOutliers);
    }
    this.molstarState.outliersByModelId.set(outliersByModelId);
  }

  public processPreferredAssemblyData(summaryData: ProcessedSummary, complexDetails: ComplexDetails[]) {
    let preferredAssemblyData = undefined;
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

          preferredAssemblyData = {
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
    return preferredAssemblyData;
  }

  public processDescriptions(macromolecules: Molecule[]) {
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
      const macromoleculesForCondition = (macromolecules ?? []).filter((mol) => condition.moleculeTypes.indexOf(mol.molecule_type) > -1);
      return macromoleculesForCondition.length > 0;
    });

    let totalMolecules = 0;
    let macromoleculesDescription = '';
    const entryContentsDescription: string[] = [];

    // for each macromolecule type (protein, dna, rna, dna/rna hybrid, carbohydrate)
    for (let i = 0; i < moleculeTypeConditions.length; i++) {
      const moleculeTypeCondition = moleculeTypeConditions[i];
      // filter the complete macromolecule list by the type
      const filteredMacromolecules = (macromolecules ?? []).filter((mol) => moleculeTypeCondition.moleculeTypes.indexOf(mol.molecule_type) > -1);

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
  }

  public mapChainToEntityId(macromolecules: Molecule[]) {
    const chainToEntityId: { [key: string]: string } = {};
    for (const macromolecule of macromolecules) {
      const entityId = macromolecule.entity_id + '';
      for (const chain of macromolecule.in_chains) {
        if (chainToEntityId[chain] && chainToEntityId[chain] !== entityId) {
          const conflictEntityId = chainToEntityId[chain];
          console.warn(`Error: chain: ${chain} has multiple entity ids (${conflictEntityId}, ${entityId})!`);
        }
        chainToEntityId[chain] = entityId;
      }
    }
    return chainToEntityId;
  }

  public processResidueOutliersData(outliers: ResidueWiseOutliersMolecule[]) {
    const resultByModelId: OutliersByModelId = {};

    for (const molecule of outliers) {
      for (const chain of molecule.chains) {
        for (const model of chain.models) {
          const modelId = model.model_id;

          // Ensure model entry exists in result
          if (!resultByModelId[modelId]) {
            resultByModelId[modelId] = {
              uniqueOutlierTypes: new Set<string>(),
              molstarSelectionsByOutlierType: {},
              residuesWith1Outlier: null!,
              residuesWith2Outliers: null!,
              residuesWith3OrMoreOutliers: null!,
            };
          }

          const flattenedResidues: FlatOutlierResidue[] = [];

          for (const residue of model.residues) {
            // Collect unique outlier types
            residue.outlier_types.forEach((type) => resultByModelId[modelId].uniqueOutlierTypes.add(type));

            // Flatten residue
            flattenedResidues.push({
              ...residue,
              entity_id: molecule.entity_id,
              chain_id: chain.chain_id,
              struct_asym_id: chain.struct_asym_id,
            });
          }

          // For each outlier type, get residues containing that type
          const residuesByOutlierType: Record<string, FlatOutlierResidue[]> = {};
          resultByModelId[modelId].uniqueOutlierTypes.forEach((type) => {
            residuesByOutlierType[type] = flattenedResidues.filter((residue) => residue.outlier_types.includes(type));
            resultByModelId[modelId].molstarSelectionsByOutlierType[type] = this.flatOutliersToMolstarSelections(residuesByOutlierType[type]);
          });

          // Group residues based on number of outlier_types
          const residuesWith1Outlier = flattenedResidues.filter((r) => r.outlier_types.length === 1);
          const residuesWith2Outliers = flattenedResidues.filter((r) => r.outlier_types.length === 2);
          const residuesWith3OrMoreOutliers = flattenedResidues.filter((r) => r.outlier_types.length >= 3);

          resultByModelId[modelId].residuesWith1Outlier = this.flatOutliersToMolstarSelections(residuesWith1Outlier);
          resultByModelId[modelId].residuesWith2Outliers = this.flatOutliersToMolstarSelections(residuesWith2Outliers);
          resultByModelId[modelId].residuesWith3OrMoreOutliers = this.flatOutliersToMolstarSelections(residuesWith3OrMoreOutliers);
        }
      }
    }

    return resultByModelId;
  }

  private flatOutliersToMolstarSelections(flattenedResidues: FlatOutlierResidue[]) {
    const molstarSelectionObj: MolstarSelectionObj = {
      residues: flattenedResidues.map((eachRes) => {
        return {
          entityId: eachRes.entity_id + '',
          authChainId: eachRes.chain_id,
          authBegin: eachRes.author_residue_number + '',
          authBeginIns: eachRes.author_insertion_code || '',
          authEnd: eachRes.author_residue_number + '',
          authEndIns: eachRes.author_insertion_code || '',
        };
      }),
    };
    return molstarSelectionObj;
  }

  public processFilesData(data: any) {
    const order = ['Archive mmCIF file', 'Updated mmCIF file', 'PDB file', 'Compatible PDB file bundle (tar.gz)', 'FASTA (Entry)', 'Full report (PDF)'];

    let downloads: any[] = [];
    let views: any[] = [];

    Object.keys(data).forEach((key) => {
      if (data[key].downloads) {
        downloads = downloads.concat(data[key].downloads);
      }
      if (data[key].views) {
        views = views.concat(data[key].views);
      }
    });

    downloads.sort((a, b) => {
      const indexA = order.indexOf(a.label);
      const indexB = order.indexOf(b.label);

      if (indexA === -1 && indexB === -1) {
        return 0;
      } else if (indexA === -1) {
        return 1;
      } else if (indexB === -1) {
        return -1;
      } else {
        return indexA - indexB;
      }
    });

    views.sort((a, b) => {
      const indexA = order.indexOf(a.label);
      const indexB = order.indexOf(b.label);

      if (indexA === -1 && indexB === -1) {
        return 0;
      } else if (indexA === -1) {
        return 1;
      } else if (indexB === -1) {
        return -1;
      } else {
        return indexA - indexB;
      }
    });

    const downloadsUpdated = downloads.map((d) => {
      return {
        name: d.label,
        url: d.url,
        downloadable: true,
      };
    });

    const viewsUpdated = views.map((d) => {
      return {
        name: d.label,
        url: d.url,
        downloadable: false,
      };
    });

    return { downloads: downloadsUpdated, views: viewsUpdated };
  }

  public getPageData(): void {
    this.globalStore.dispatch(EntryActions.getSummaryData());
    this.globalStore.dispatch(EntryActions.getEntryMolecules());
    this.globalStore.dispatch(EntryActions.getExperiment());
    this.globalStore.dispatch(EntryActions.getUniprotMapping());
    this.globalStore.dispatch(EntryActions.getInterproMapping());
    this.globalStore.dispatch(EntryActions.getPfamMapping());
    this.globalStore.dispatch(EntryActions.getDownloadOptions());
    this.globalStore.dispatch(EntryActions.getSummaryQualityScores());
    this.globalStore.dispatch(EntryActions.getCathMapping());
    this.globalStore.dispatch(EntryActions.getScop175Mapping());
    this.globalStore.dispatch(EntryActions.getModifications());
    this.globalStore.dispatch(EntryActions.getValidationKeyStats());
    this.globalStore.dispatch(EntryActions.getValidationXrayRefine());
    this.globalStore.dispatch(EntryActions.getPrimaryPublication());
    this.globalStore.dispatch(EntryActions.getArticleCitingPDBEntry());
    this.globalStore.dispatch(EntryActions.getPreferredAssembly());
    this.globalStore.dispatch(EntryActions.getAssemblies());
    this.globalStore.dispatch(EntryActions.getCarbohydrates());
    this.globalStore.dispatch(EntryActions.getExperimentBMRBRawData());
    this.globalStore.dispatch(EntryActions.getPDBRedoQualityScores());
    this.globalStore.dispatch(EntryActions.getExperimentSBGridRawData());
    this.globalStore.dispatch(EntryActions.getExperimentIRRMCRawData());
    this.globalStore.dispatch(EntryActions.getExperimentEMPIARRawData());
    this.globalStore.dispatch(EntryActions.getExperimentPDBRawData());
    this.globalStore.dispatch(EntryActions.getUniprotMapping());
    this.globalStore.dispatch(EntryActions.getIsoformsMapping());
    this.globalStore.dispatch(EntryActions.getGOMapping());
    this.globalStore.dispatch(EntryActions.getECMapping());
    this.globalStore.dispatch(EntryActions.getSymmetry());
    this.globalStore.dispatch(EntryActions.getEntryLigandMonomers());
    this.globalStore.dispatch(EntryActions.getEntryPolymerCoverage());
    this.globalStore.dispatch(EntryActions.getEntryResidueWiseOutliers());
    this.globalStore.dispatch(EntryActions.getModelQualityXray());
  }
}
