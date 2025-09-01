/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computed, DestroyRef, inject, Injectable, Renderer2, RendererFactory2, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DataToTable } from '../../data-classes/data-processing/abstract-base-row-class';
import { AssemblyDataToTable } from '../../data-classes/data-processing/assembly-row-class';
import { DomainDataToTable } from '../../data-classes/data-processing/domain-row-class';
import { LigandDataToTable } from '../../data-classes/data-processing/ligand-row-class';
import { MacromoleculeDataToTable } from '../../data-classes/data-processing/macromolecule-row';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { TabNames } from '../../helpers/tab-names.enum';
import { EntryActions } from '../../store/entry.actions';
import { catchError, combineLatest, of, retry, startWith, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ComplexDetails } from '../../data-models/complex-details.model';
import { ProcessedSummary } from '../../data-models/summary.model';
import { ResidueWiseOutliersMolecule } from '../../data-models/residuewise-outliers.model';
import { Molecule } from '../../data-models/molecule.model';
import { AssembliesRowData, DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../../data-classes/data-models-and-definitions/row-and-table.model';
import { environment } from '../../../../../environments/environment';
import { ENTRY_PAGES_LINKS, labelGroups } from '../../entry-constant';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { FlatOutlierResidue, OutliersByModelId, TableNames } from '../../data-classes/data-models-and-definitions/other-models';
import { QueryParam } from 'pdbe-molstar/lib/helpers';

@Injectable({
  providedIn: 'root',
})
export class MainDataProcessingFacade {
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly renderer: Renderer2;

  constructor() {
    const rendererFactory = inject(RendererFactory2);
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public readonly llmAnnotations = this.globalStore.select(EntrySelectors.llmAnnotations);

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
    { label: 'Text Annotation (LLM)', id: 'llm' },
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
      ligands: createSelectorStream(EntrySelectors.boundLigands, undefined),
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

      const rows = tempTableData.tableRows() as AssembliesRowData[];
      this.compCommunication.assembliesTableData = tempTableData;
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
      const rows = tempTableData.tableRows() as DomainsRowData[];

      this.compCommunication.domainsTableData = tempTableData;
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

    for (const macromolecule of macromoleculesData) {
      const entityId = macromolecule.additionalData.molecule.entity_id;

      const domainsOfMacromolecule = domainsData.filter((eachDomain) => eachDomain.moleculeNames[0] === macromolecule.name.molecule);

      if (!nestedMap.has(entityId)) {
        nestedMap.set(entityId, { macromolecule, domains: [] });
      }

      for (const domainOfMacromolecule of domainsOfMacromolecule) {
        const currentDomainNames = nestedMap.get(entityId)!.domains.map((eachDomain) => eachDomain.domain);
        const domainNotInMap = currentDomainNames.indexOf(domainOfMacromolecule.domain) === -1;
        if (domainNotInMap) nestedMap.get(entityId)!.domains.push(domainOfMacromolecule);
      }
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

      const rows = tempTableData.tableRows() as LigandsRowData[];
      this.compCommunication.ligandsTableData = tempTableData;
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

      const rows = tempTableData.tableRows() as MacromoleculesRowData[];
      this.compCommunication.macromoleculesTableData = tempTableData;
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
    this.compCommunication.outliersByModelId.set(outliersByModelId);

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
              residuesWith1Outlier: [],
              residuesWith2Outliers: [],
              residuesWith3OrMoreOutliers: [],
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
            if (!resultByModelId[modelId].molstarSelectionsByOutlierType[type]) {
              resultByModelId[modelId].molstarSelectionsByOutlierType[type] = [];
            }
            resultByModelId[modelId].molstarSelectionsByOutlierType[type].push(...this.flatOutliersToMolstarSelections(residuesByOutlierType[type]));
            // this.flatOutliersToMolstarSelections(residuesByOutlierType[type]);
          });

          // Group residues based on number of outlier_types
          const residuesWith1Outlier = flattenedResidues.filter((r) => r.outlier_types.length === 1);
          const residuesWith2Outliers = flattenedResidues.filter((r) => r.outlier_types.length === 2);
          const residuesWith3OrMoreOutliers = flattenedResidues.filter((r) => r.outlier_types.length >= 3);

          resultByModelId[modelId].residuesWith1Outlier.push(...this.flatOutliersToMolstarSelections(residuesWith1Outlier));
          resultByModelId[modelId].residuesWith2Outliers.push(...this.flatOutliersToMolstarSelections(residuesWith2Outliers));
          resultByModelId[modelId].residuesWith3OrMoreOutliers.push(...this.flatOutliersToMolstarSelections(residuesWith3OrMoreOutliers));
        }
      }
    }
    return resultByModelId;
  }

  private flatOutliersToMolstarSelections(flattenedResidues: FlatOutlierResidue[]) {
    const molstarSelectionObj: QueryParam[] = flattenedResidues.map((eachRes) => {
      return {
        entity_id: eachRes.entity_id + '',
        auth_asym_id: eachRes.chain_id,
        auth_residue_number: eachRes.author_residue_number,
        auth_ins_code_id: eachRes.author_insertion_code || undefined,
      };
    });
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

  private groupFilesByLabels(labelGroups: Record<string, (string | RegExp)[]>, files: DownloadOption[]) {
    const result: { group: string; items: DownloadOption[] }[] = [];

    for (const [group, patterns] of Object.entries(labelGroups)) {
      const groupItems = files.filter((file) => patterns.some((pattern) => (pattern instanceof RegExp ? pattern.test(file.name) : file.name === pattern)));

      if (groupItems.length > 0) {
        result.push({ group, items: groupItems });
      }
    }

    return result;
  }

  public getPageData(): void {
    /* used in:
     *  - entry-page-header
     *  - domains-tab
     *  - ligands-tab
     *  - llm-tab
     *  - macromolecules-tab
     *  - mq-tab
     *  - summary-tab
     *  - mb-citation
     *  - mb-model-quality
     *  - mb-overview
     *  - entry.bioschemas
     * processed in:
     * - assemblies
     * - domains
     * - ligands
     * - macromolecules
     * - preferred assembly
     * */
    this.globalStore.dispatch(EntryActions.getSummaryData());
    this.globalStore.dispatch(EntryActions.getEntryMolecules()); // processed into macromolecules and ligands, used in domains-tab, model-quality, summary-tab, mb-overview
    this.globalStore.dispatch(EntryActions.getPfamMapping()); // processed into domains
    this.globalStore.dispatch(EntryActions.getCathMapping()); // processed into domains
    this.globalStore.dispatch(EntryActions.getScop175Mapping()); // processed into domains
    this.globalStore.dispatch(EntryActions.getModifications()); // processed into ligands, modifications
    this.globalStore.dispatch(EntryActions.getPrimaryPublication()); // used in citations-tab, llm-tab, summary-tab, mb-citation-tab, mb-overview-tab, entry.bioschemas
    this.globalStore.dispatch(EntryActions.getPreferredAssembly()); // processed into assemblies and used in processedAssemblies data for summary
    this.globalStore.dispatch(EntryActions.getAssemblies()); // processed into domains, ligand, macromolecules, assemblies tied
    this.globalStore.dispatch(EntryActions.getCarbohydrates()); // processed into macromolecules
    this.globalStore.dispatch(EntryActions.getUniprotMapping()); // processed into macromolecules
    this.globalStore.dispatch(EntryActions.getEntryLigandMonomers()); // processed into ligands, LigandsTabService
    this.globalStore.dispatch(EntryActions.getEntryPolymerCoverage()); // processed into macromolecules and domains
    this.globalStore.dispatch(EntryActions.getLLMAnnotations()); // used in llm-tab, here, interactive-tables
  }
}
