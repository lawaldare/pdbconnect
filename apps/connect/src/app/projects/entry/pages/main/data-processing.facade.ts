/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computed, DestroyRef, inject, Injectable, Injector, Renderer2, RendererFactory2, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
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
import {
  AssembliesRowData,
  DomainsRowData,
  LigandsRowData,
  MacromoleculesRowData,
} from '../../components/shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { getMacromoleculeOfDomain } from '../../helpers/processed-data-to-controls';
import { environment } from '../../../../../environments/environment';
import { ENTRY_PAGES_LINKS, labelGroups } from '../../entry-constant';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';

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
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly renderer: Renderer2;

  constructor() {
    const rendererFactory = inject(RendererFactory2);
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public tabDataLoaded = computed(() => {
    return (
      this.compCommunication.hasProcessedAssemblies() &&
      this.compCommunication.hasProcessedLigands() &&
      this.compCommunication.hasProcessedDomains() &&
      this.compCommunication.hasProcessedMacromolecules()
    );
  });
  public tableData = signal<DataToTable>({} as DataToTable);
  private tabName = signal<TableNames>('' as TableNames);
  private isTitleAndMetaProcessed = false;

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

  public isNotEmptyObj(datum: any) {
    if (datum.empty) return false;
    return true;
  }

  public anyIsEmptyObj(data: any[]) {
    for (const datum of data) {
      if (datum === undefined) return false;
      if (datum.empty) return true;
    }
    return false;
  }

  public setTabName(tabName: TableNames) {
    this.tabName.set(tabName);
  }

  public getTableName(tabName: string) {
    return tabName as TableNames;
  }

  public processInteractiveTablesData(entryId: string) {
    const createSelectorStream = <T>(selector: any, defaultValue: T) =>
      this.globalStore.select(selector).pipe(
        startWith(defaultValue),
        catchError(() => of(defaultValue))
      );

    combineLatest({
      complexDetails: createSelectorStream(EntrySelectors.complexDetails, undefined),
      assemblyData: createSelectorStream(EntrySelectors.assemblies, undefined),
      pisaAssemblyData: createSelectorStream(EntrySelectors.pisaAssemblies, undefined),
      pfamMappings: createSelectorStream(EntrySelectors.pfamMapping, null),
      cathMappings: createSelectorStream(EntrySelectors.cathMapping, null),
      scopMappings: createSelectorStream(EntrySelectors.scop175Mapping, null),
      ligands: createSelectorStream(EntrySelectors.boundLigands, []),
      modifications: createSelectorStream(EntrySelectors.modifications, []),
      carbohydrates: createSelectorStream(EntrySelectors.carbohydrates, []),
      uniprotMapping: createSelectorStream(EntrySelectors.uniprotMapping, null),
      macromolecules: createSelectorStream(EntrySelectors.macroMolecules, []),
      ligandMonomers: createSelectorStream(EntrySelectors.ligandMonomers, []),
      polymerCoverage: createSelectorStream(EntrySelectors.polymerCoverage, []),
      residueOutliers: createSelectorStream(EntrySelectors.residueWiseOutliers, []),
      summaryData: createSelectorStream(EntrySelectors.summaryData, undefined),
    })
      .pipe(
        retry({ count: 3, delay: 1000 }),
        tap((data) => {
          if (!this.compCommunication.hasProcessedAssemblies()) {
            this.processAssembliesData(data);
          }
          if (!this.compCommunication.hasPreProcessedDomains()) {
            this.processDomainsData(data);
          }
          if (!this.compCommunication.hasProcessedLigands()) {
            this.processLigandsData(data);
          }
          if (!this.compCommunication.hasProcessedMacromolecules()) {
            this.processMacromoleculesData(data);
          }
          this.processTableData(entryId, data);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private setDynamicHeadTags(entryId: string, data: any) {
    const hasDataArrived = this.isNotUndefined([data.summaryData]);

    if (hasDataArrived && Object.keys(data.summaryData).length > 0) {
      const summaryData = data.summaryData as ProcessedSummary;
      const titleAndDescription = `PDB ${entryId}: ${summaryData.entryTitle} | Protein Data Bank in Europe - PDBe`;
      this.titleService.setTitle(titleAndDescription);
      this.metaService.addTag({ name: 'description', content: titleAndDescription });
      this.metaService.addTag({ name: 'author', content: 'Protein Data Bank in Europe - PDBe' });
      this.metaService.addTag({ name: 'email', content: 'pdbegroup@gmail.com' });
      this.metaService.addTag({ name: 'Distribution', content: 'Global' });
      this.metaService.addTag({ name: 'Rating', content: 'General' });

      this.metaService.addTag({ property: 'og:title', content: `PDB: ${entryId} | Protein Data Bank in Europe - PDBe` });
      this.metaService.addTag({ property: 'og:description', content: `Entry title: "${summaryData.entryTitle}"` });
      this.metaService.addTag({ property: 'og:url', content: `${environment.pdbeBaseUrl}/entry/pdb/1trn` });
      this.metaService.addTag({ property: 'og:image', content: `https://www.ebi.ac.uk/pdbe/static/entry/${entryId}_deposited_chain_front_image-800x800.png` });
      this.metaService.addTag({ property: 'og:image:alt', content: `PDBe ${entryId} Structure` });
      this.metaService.addTag({ property: 'og:type', content: 'website' });
      this.metaService.addTag({ property: 'og:locale', content: 'en_GB' });
      this.metaService.addTag({ property: 'og:site_name', content: 'PDBe Entry Pages' });

      this.metaService.addTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.metaService.addTag({ name: 'twitter:title', content: titleAndDescription });
      this.metaService.addTag({ name: 'twitter:description', content: titleAndDescription });
      this.metaService.addTag({ name: 'twitter:url', content: `${environment.pdbeBaseUrl}/entry/pdb/1trn` });
      this.metaService.addTag({ name: 'twitter:image', content: `https://www.ebi.ac.uk/pdbe/static/entry/${entryId}_deposited_chain_front_image-800x800.png` });
      this.metaService.addTag({ name: 'twitter:image:alt', content: `PDBe ${entryId} Structure` });
      this.metaService.addTag({ name: 'twitter:site', content: `PDBeurope` });

      for (const linkObj of ENTRY_PAGES_LINKS) {
        const linkEl = this.renderer.createElement('link');
        this.renderer.setAttribute(linkEl, 'rel', linkObj.rel);
        this.renderer.setAttribute(linkEl, 'type', linkObj.type);
        this.renderer.setAttribute(linkEl, 'href', linkObj.href);
        if (linkObj.sizes) this.renderer.setAttribute(linkEl, 'sizes', linkObj.sizes!);
        if (linkObj.title) this.renderer.setAttribute(linkEl, 'title', linkObj.title!);
        this.renderer.appendChild(document.head, linkEl);
      }

      this.isTitleAndMetaProcessed = true;
    }
  }

  private processAssembliesData(data: any) {
    const tabName = TabNames.Assemblies;
    const hasDataArrived = this.isNotUndefined([data.summaryData, data.complexDetails, data.assemblyData, data.pisaAssemblyData]);
    if (
      hasDataArrived &&
      Object.keys(data.summaryData).length > 0 &&
      data.complexDetails.length > 0 &&
      data.assemblyData.length > 0 &&
      data.pisaAssemblyData.length > 0
    ) {
      const tempTableData = new AssemblyDataToTable(data.summaryData, data.complexDetails, data.assemblyData, data.pisaAssemblyData);
      tempTableData.generateTableData();
      tempTableData.generateTableFilters();
      this.compCommunication.setTabData(tabName, tempTableData);

      const rows = tempTableData.tableRows() as AssembliesRowData[];
      this.compCommunication.processedAssemblies = rows;

      this.compCommunication.hasProcessedAssemblies.set(true);
    } else if (hasDataArrived) {
      this.compCommunication.hasProcessedAssemblies.set(true);
    }
  }

  private processDomainsData(data: any) {
    const tabName = TabNames.Domains;
    const hasDataArrived = this.isNotUndefined([
      data.pfamMappings,
      data.cathMappings,
      data.scopMappings,
      data.macromolecules,
      data.polymerCoverage,
      data.summaryData,
      data.assemblyData,
    ]);

    if (
      hasDataArrived &&
      Object.keys(data.summaryData).length > 0 &&
      data.assemblyData.length > 0 &&
      data.macromolecules.length > 0 &&
      data.polymerCoverage.length > 0 &&
      ((Object.keys(data.pfamMappings).length > 0 && this.isNotEmptyObj(data.pfamMappings)) ||
        (Object.keys(data.cathMappings).length > 0 && this.isNotEmptyObj(data.cathMappings)) ||
        (Object.keys(data.scopMappings).length > 0 && this.isNotEmptyObj(data.scopMappings)))
    ) {
      if (<any>data.pfamMappings.empty === true) data.pfamMappings = {};
      if (<any>data.cathMappings.empty === true) data.cathMappings = {};
      if (<any>data.scopMappings.empty === true) data.scopMappings = {};
      const tempTableData = new DomainDataToTable(
        data.pfamMappings!,
        data.cathMappings!,
        data.scopMappings!,
        data.macromolecules,
        data.polymerCoverage,
        data.summaryData,
        data.assemblyData
      );
      tempTableData.generateTableData();
      tempTableData.generateTableFilters();
      this.compCommunication.setTabData(tabName, tempTableData);
      const rows = tempTableData.tableRows() as DomainsRowData[];
      this.compCommunication.processedDomainsAsList = rows;
      this.compCommunication.hasPreProcessedDomains.set(true);
      if (this.compCommunication.hasProcessedMacromolecules()) {
        this.processDomainsWithMacromolecules(this.compCommunication.processedMacromolecules, this.compCommunication.processedDomainsAsList);
      }
    } else if (hasDataArrived) {
      this.compCommunication.hasProcessedDomains.set(true);
      this.compCommunication.hasPreProcessedDomains.set(true);
    }
  }

  private processDomainsWithMacromolecules(macromoleculesData: MacromoleculesRowData[], domainsData: DomainsRowData[]) {
    const nestedMap = new Map<number, { macromolecule: MacromoleculesRowData; domains: DomainsRowData[] }>();

    for (const domain of domainsData) {
      const macromolecule = getMacromoleculeOfDomain(domain, macromoleculesData);
      const entityId = macromolecule?.additionalData?.molecule.entity_id;

      if (!nestedMap.has(entityId)) {
        nestedMap.set(entityId, { macromolecule, domains: [] });
      }
      nestedMap.get(entityId)!.domains.push(domain);
    }

    this.compCommunication.processedDomains = Array.from(nestedMap.values());
    this.compCommunication.hasProcessedDomains.set(true);
  }

  private processLigandsData(data: any) {
    const tabName = TabNames.Ligands;
    const hasDataArrived = this.isNotUndefined([data.ligands, data.modifications, data.ligandMonomers, data.summaryData, data.assemblyData]);
    if (
      hasDataArrived &&
      Object.keys(data.summaryData).length > 0 &&
      data.assemblyData.length > 0 &&
      (data.modifications.length > 0 || (data.ligands.length > 0 && data.ligandMonomers.length > 0))
    ) {
      if (<any>data.ligands.empty === true) data.ligands = [];
      if (<any>data.ligandMonomers.empty === true) data.ligandMonomers = [];
      if (<any>data.modifications.empty === true) data.modifications = [];

      const tempTableData = new LigandDataToTable(data.ligands, data.modifications, data.ligandMonomers, data.summaryData, data.assemblyData);

      tempTableData.generateTableData();
      tempTableData.generateTableFilters();
      this.compCommunication.setTabData(tabName, tempTableData);

      const rows = tempTableData.tableRows() as LigandsRowData[];
      this.compCommunication.processedLigandsAndModifications = rows;
      this.compCommunication.processedLigands = rows.filter((row) => row.type === 'ligand');
      this.compCommunication.processedModifications = rows.filter((row) => row.type === 'modification');

      this.compCommunication.hasProcessedLigands.set(true);
    } else if (hasDataArrived) {
      this.compCommunication.hasProcessedLigands.set(true);
    }
  }

  private processMacromoleculesData(data: any) {
    const tabName = TabNames.Macromolecules;
    const hasDataArrived = this.isNotUndefined([
      data.uniprotMapping,
      data.carbohydrates,
      data.macromolecules,
      data.polymerCoverage,
      data.summaryData,
      data.assemblyData,
    ]);
    if (hasDataArrived && Object.keys(data.summaryData).length > 0 && data.macromolecules.length > 0 && data.assemblyData.length > 0) {
      if (<any>data.carbohydrates.empty === true) data.carbohydrates = [];
      if (<any>data.polymerCoverage.empty === true) data.polymerCoverage = [];
      if (<any>data.uniprotMapping.empty === true) data.uniprotMapping = {};

      const tempTableData = new MacromoleculeDataToTable(
        data.carbohydrates,
        data.uniprotMapping,
        data.macromolecules,
        data.polymerCoverage,
        data.summaryData,
        data.assemblyData
      );

      tempTableData.generateTableData();
      tempTableData.generateTableFilters();
      this.compCommunication.setTabData(tabName, tempTableData);

      const rows = tempTableData.tableRows() as MacromoleculesRowData[];
      this.compCommunication.processedMacromolecules = rows;

      this.compCommunication.hasProcessedMacromolecules.set(true);
      if (this.compCommunication.hasPreProcessedDomains()) {
        this.processDomainsWithMacromolecules(this.compCommunication.processedMacromolecules, this.compCommunication.processedDomainsAsList);
      }
    } else if (hasDataArrived) {
      this.compCommunication.hasProcessedMacromolecules.set(true);
    }
  }

  private processTableData(entryId: string, data: any) {
    let preferredAssemblyData = undefined;
    if (this.isNotUndefined([data.complexDetails, data.summaryData]) && Object.keys(data.summaryData).length > 0 && data.complexDetails.length > 0) {
      preferredAssemblyData = this.processPreferredAssemblyData(data.summaryData, data.complexDetails);
    } else if (this.anyIsEmptyObj([data.complexDetails, data.summaryData])) {
      preferredAssemblyData = {
        name: 'Undefined',
        preferred: 1,
        composition: undefined,
        complexId: undefined,
      };
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

    if (this.isTitleAndMetaProcessed === false) {
      this.setDynamicHeadTags(entryId, data);
    }
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

    const mappedDownloadsUpdated = this.groupFilesByLabels(labelGroups, downloadsUpdated);

    const viewsUpdated = views.map((d) => {
      return {
        name: d.label,
        url: d.url,
        downloadable: false,
      };
    });

    const mappedViewsUpdated = this.groupFilesByLabels(labelGroups, viewsUpdated);

    return { downloads: mappedDownloadsUpdated, views: mappedViewsUpdated };
  }

  private groupFilesByLabels(labelGroups: Record<string, string[]>, flatList: DownloadOption[]): any[] {
    const fileMap = new Map(flatList.map((file) => [file.name, file]));

    const groupedArray = [];

    for (const [groupName, names] of Object.entries(labelGroups)) {
      const matchedFiles = names.map((name) => fileMap.get(name)).filter((file) => file && file.url);

      if (matchedFiles.length > 0) {
        groupedArray.push({ group: groupName, items: matchedFiles });
      }
    }

    return groupedArray;
  }

  public getPageData(): void {
    this.globalStore.dispatch(EntryActions.getSummaryData());
    this.globalStore.dispatch(EntryActions.getEntryMolecules());
    this.globalStore.dispatch(EntryActions.getExperiment());
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
