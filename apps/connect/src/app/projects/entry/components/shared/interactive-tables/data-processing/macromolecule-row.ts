import { signal, WritableSignal } from '@angular/core';
import { MacromoleculesResidueRanges, MacromoleculesRowData, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';
import { CarbohydrateMolecule, CarbohydrateResidue } from '../../../../data-models/carbohydrate-polymer.model';
import { Molecule } from '../../../../data-models/molecule.model';
import { UniProtMapping } from '../../../../data-models/uniprot-mapping.model';
import { DEFAULT_SET_25, MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { PolymerCoverageMolecule } from '../../../../data-models/polymer-coverage.model';
import { AssemblyData, AssemblyEntity } from '../../../../data-models/assembly.model';
import { ProcessedSummary } from '../../../../data-models/summary.model';

interface MacromoleculesChainBoundaries {
  [key: number]: {
    [key: string]: {
      start_author_residue_number: string;
      end_author_residue_number: string;
      start_author_insertion_code: string;
      end_author_insertion_code: string;
    };
  };
}

interface EntityUniProtMapping {
  [key: number]: {
    [key: string]: {
      start: string;
      end: string;
      unpStart: string;
      unpEnd: string;
      coverage: number;
      accession: string;
      chainId: string;
    }[];
  };
}

export class MacromoleculeDataToTable extends DataToTable {
  // Macromolecule specific data
  macromolecules: Molecule[] = [];
  carbohydrates: CarbohydrateMolecule[];
  uniprotMapping: UniProtMapping;
  polymerCoverage: PolymerCoverageMolecule[] = [];
  summaryData: ProcessedSummary;
  assemblyData: AssemblyData[];

  molstarHardResetOnSelect = false;
  protvistaForSelection = true;
  topolViewerForSelection = true;
  ligandEnvViewerForSelection = false;
  displayFilters = true;
  tableRows: WritableSignal<TableRow[]> = signal([]);
  tableFilters: WritableSignal<TableFilter[]> = signal([]);

  constructor(
    carbohydrates: CarbohydrateMolecule[],
    uniprotMapping: UniProtMapping,
    macromolecules: Molecule[],
    polymerCoverage: PolymerCoverageMolecule[],
    summaryData: ProcessedSummary,
    assemblyData: AssemblyData[]
  ) {
    super();
    this.carbohydrates = carbohydrates;
    this.uniprotMapping = uniprotMapping;
    // this.polymerCoverage = polymerCoverage;
    this.summaryData = summaryData;
    this.assemblyData = assemblyData;
    const preferredAssembly = this.getPreferredAssembly();
    if (preferredAssembly) {
      this.macromolecules = this.filterByPreferredAssembly(macromolecules, preferredAssembly);
      this.polymerCoverage = this.filterPolymerCoverageByAssembly(polymerCoverage, preferredAssembly);
    }
  }

  getPreferredAssembly() {
    // we first check and get the preferred assembly if it exists
    let preferredAssemblyId = -1;
    const preferredAssemblyData = this.summaryData.assemblies.filter((summaryAssembly) => summaryAssembly.preferred === true);
    if (preferredAssemblyData.length > 0) {
      preferredAssemblyId = parseInt(preferredAssemblyData[0].assembly_id);
    }
    if (preferredAssemblyId === -1) preferredAssemblyId = 1;

    const assembly = this.assemblyData.filter((assembly) => parseInt(assembly.assembly_id) === preferredAssemblyId)[0];
    return assembly;
  }

  private getNormalizedEntityMap(assembly: AssemblyData): Map<number, string[]> {
    const map = new Map<number, string[]>();

    for (const entity of assembly.entities) {
      const normalizedChains = entity.in_chains.map((chain) => chain.split('-')[0]);
      map.set(entity.entity_id, normalizedChains);
    }

    return map;
  }

  private filterByPreferredAssembly(macromolecules: Molecule[], assembly: AssemblyData): Molecule[] {
    // Create a quick lookup map for assembly entities by entity_id
    const assemblyEntitiesMap = this.getNormalizedEntityMap(assembly);

    // Filter macromolecules based on entity_id presence in assembly
    return (
      macromolecules
        .filter((molecule) => assemblyEntitiesMap.has(molecule.entity_id))
        .map((molecule) => {
          const allowedAsyms = assemblyEntitiesMap.get(molecule.entity_id)!;

          // Filter the in_chains to only include those present in the assembly entity
          const filteredInStructAsyms: string[] = [];
          const filteredInChains: string[] = [];

          molecule.in_struct_asyms.forEach((asymId, idx) => {
            if (allowedAsyms.includes(asymId)) {
              filteredInStructAsyms.push(asymId);
              filteredInChains.push(molecule.in_chains[idx]); // Keep corresponding chain
            }
          });

          return {
            ...molecule,
            in_struct_asyms: filteredInStructAsyms,
            in_chains: filteredInChains,
          };
        })
        // Optionally, remove molecules where no chains remain after filtering
        .filter((molecule) => molecule.in_struct_asyms.length > 0)
    );
  }

  private filterPolymerCoverageByAssembly(polymerCoverage: PolymerCoverageMolecule[], assembly: AssemblyData): PolymerCoverageMolecule[] {
    const assemblyEntitiesMap = this.getNormalizedEntityMap(assembly);

    return polymerCoverage
      .filter((polymer) => assemblyEntitiesMap.has(polymer.entity_id))
      .map((polymer) => {
        const allowedAsyms = assemblyEntitiesMap.get(polymer.entity_id)!;
        const filteredChains = polymer.chains.filter((chain) => allowedAsyms.includes(chain.struct_asym_id));
        return {
          ...polymer,
          chains: filteredChains,
        };
      })
      .filter((polymer) => polymer.chains.length > 0);
  }

  generateTableData(): TableRow[] {
    const startEndByEntityByChain: MacromoleculesChainBoundaries = this.getStartEndForChainIdsFromCoverage(this.macromolecules, this.polymerCoverage);
    const mappingsByEntityByAccession: EntityUniProtMapping = this.generateUniprotMappings(this.uniprotMapping, startEndByEntityByChain);

    let rows: TableRow[] = [];
    if (this.tableRows().length === 0) {
      const macromoleculeRows: MacromoleculesRowData[] = [];
      for (const molecule of this.macromolecules) {
        // if molecule is a protein, we try to retrieve uniprot mappings
        const residueRanges = molecule.molecule_type.includes('polypeptide')
          ? this.getUniProtResidueRanges(molecule.entity_id, molecule.in_chains, mappingsByEntityByAccession)
          : [];
        let moleculeLength = molecule.length;
        let carbohydrate: CarbohydrateMolecule | undefined = undefined;
        if (molecule.molecule_type.includes('carbohydrate')) {
          carbohydrate = this.carbohydrates?.filter((carb) => carb.entity_id === molecule.entity_id)[0];
          moleculeLength = carbohydrate?.chains[0].residues.length;
        }

        const sourceOrganisms = molecule.source ? molecule.source.map((eachSource) => eachSource.organism_scientific_name) : [];

        const geneNames = molecule.gene_name ? molecule.gene_name : [];

        const selectionData = this.generateMolstarSelectionsMacromolecules(molecule, carbohydrate);

        const selectionNames = selectionData.selectionNames;
        const molstarSelections: MolstarSelectionObj[] = selectionData.selections;

        const colorEntityIdx = molecule.entity_id - 1;

        macromoleculeRows.push({
          name: {
            molecule: molecule.molecule_name[0],
            chains: molecule.in_chains.map((eachChain) => `Chain ${eachChain}`),
          },
          length: moleculeLength,
          residues: residueRanges,
          organisms: sourceOrganisms,
          genes: geneNames,
          additionalData: {
            molecule: molecule,
            selections: molstarSelections,
            selectionNames: selectionNames,
            uniprotAccessions: residueRanges.map((eachRange) => eachRange.uniprot),
          },
          molstarColorHex: DEFAULT_SET_25[colorEntityIdx % DEFAULT_SET_25.length],
        });
      }
      rows.push(...macromoleculeRows);
      this.tableRows.set(rows);
    } else {
      rows = [...this.tableRows()];
    }

    return rows;
  }

  private getStartEndForChainIdsFromCoverage(macromolecules: Molecule[], polymerCoverage: PolymerCoverageMolecule[]) {
    // Map macromolecules by entity_id for quick lookup
    const macromoleculesByEntityId = Object.fromEntries(macromolecules.map((mol) => [mol.entity_id, mol]));

    const entitiesForMacromolecules = new Set(Object.keys(macromoleculesByEntityId));

    // filter polymercoverage by entity id
    const filteredPolymerCoverage = polymerCoverage.filter((polmol) => entitiesForMacromolecules.has(polmol.entity_id + ''));

    const startEndByEntityByChain: MacromoleculesChainBoundaries = {};

    for (const molecule of filteredPolymerCoverage) {
      const entityId = molecule.entity_id;
      startEndByEntityByChain[entityId] = {};

      for (const chain of molecule.chains) {
        const chainId = chain.chain_id;

        if (!chain.observed.length) continue;

        // Assuming observed segments are ordered, take first and last segments
        const firstSegment = chain.observed[0];
        const lastSegment = chain.observed[chain.observed.length - 1];

        startEndByEntityByChain[entityId][chainId] = {
          start_author_residue_number: firstSegment.start.author_residue_number.toString(),
          end_author_residue_number: lastSegment.end.author_residue_number.toString(),
          start_author_insertion_code: firstSegment.start.author_insertion_code || '',
          end_author_insertion_code: lastSegment.end.author_insertion_code || '',
        };
      }
    }

    return startEndByEntityByChain;
  }

  private generateUniprotMappings(uniprotMapping: UniProtMapping, startEndByEntityByChain: MacromoleculesChainBoundaries) {
    const mappingsByEntityByAccession: EntityUniProtMapping = {};
    if (this.isNotEmptyObject(uniprotMapping)) {
      for (const [uniprotAcc, mapping] of Object.entries(uniprotMapping)) {
        for (const mappingObj of mapping.mappings) {
          mappingsByEntityByAccession[mappingObj.entity_id] = mappingsByEntityByAccession[mappingObj.entity_id] ?? {};
          mappingsByEntityByAccession[mappingObj.entity_id][uniprotAcc] = mappingsByEntityByAccession[mappingObj.entity_id][uniprotAcc] ?? [];

          const isAuthorStartValid = mappingObj.start.author_residue_number !== null;

          const startAuthorResidueNumber = isAuthorStartValid
            ? mappingObj.start.author_residue_number
            : startEndByEntityByChain?.[mappingObj.entity_id]?.[mappingObj.chain_id]?.['start_author_residue_number'];

          const startAuthorInsertionCode = isAuthorStartValid
            ? mappingObj.start.author_insertion_code
            : startEndByEntityByChain?.[mappingObj.entity_id]?.[mappingObj.chain_id]?.['start_author_insertion_code'];

          const isAuthorEndValid = mappingObj.end.author_residue_number !== null;

          const endAuthorResidueNumber = isAuthorEndValid
            ? mappingObj.end.author_residue_number
            : startEndByEntityByChain?.[mappingObj.entity_id]?.[mappingObj.chain_id]?.['end_author_residue_number'];

          const endAuthorInsertionCode = isAuthorEndValid
            ? mappingObj.end.author_insertion_code
            : startEndByEntityByChain?.[mappingObj.entity_id]?.[mappingObj.chain_id]?.['end_author_insertion_code'];

          mappingsByEntityByAccession[mappingObj.entity_id][uniprotAcc].push({
            start: `${startAuthorResidueNumber}${startAuthorInsertionCode}`,
            end: `${endAuthorResidueNumber}${endAuthorInsertionCode}`,
            unpStart: `${mappingObj.unp_start}`,
            unpEnd: `${mappingObj.unp_end}`,
            coverage: mappingObj.coverage,
            accession: uniprotAcc,
            chainId: mappingObj.chain_id,
          });
        }
      }
    }
    return mappingsByEntityByAccession;
  }

  private getUniProtResidueRanges(entityId: number, chains: string[], mappingsByEntityByAccession: EntityUniProtMapping) {
    const residueRanges: MacromoleculesResidueRanges[] = [];
    if (entityId in mappingsByEntityByAccession === false) {
      return residueRanges;
    }
    const mappingsByAccession = mappingsByEntityByAccession[entityId];
    for (const [uniprotAcc, datum] of Object.entries(mappingsByAccession)) {
      const filteredDatum = datum.filter((val) => chains.indexOf(val.chainId) > -1);
      const datumStrings = filteredDatum.map((val) => `${val.unpStart}-${val.unpEnd}`);
      // TODO: We might need to add chain information when allChainsEqualMappings is false
      const allChainsEqualMappings = datumStrings.every((val) => val === datumStrings[0]);
      // const allEqual = true;
      if (allChainsEqualMappings) {
        residueRanges.push({
          range: datumStrings[0],
          coverage: Math.round(filteredDatum[0].coverage * 100) + '%',
          uniprot: uniprotAcc,
        });
      } else {
        for (const datum of filteredDatum) {
          residueRanges.push({
            range: `${datum.unpStart}-${datum.unpEnd}`,
            coverage: Math.round(datum.coverage * 100) + '%',
            uniprot: uniprotAcc,
            chainId: datum.chainId,
          });
        }
      }
    }
    return residueRanges;
  }

  private generateMolstarSelectionsMacromolecules(molecule: Molecule, carbohydrate?: CarbohydrateMolecule) {
    const selectionNames: string[] = [];
    const selections = molecule.in_chains.map((ch) => {
      const molstarSelection: MolstarSelectionObj = {
        entityId: molecule.entity_id + '',
        authChainId: ch,
        residues: [],
      };
      if (molecule.molecule_type.includes('carbohydrate') && carbohydrate) {
        const carbohydratesOfChain = carbohydrate.chains.filter((carbch) => carbch.chain_id === ch);
        const carbohydrateResidues: CarbohydrateResidue[] = [];
        for (const carbch of carbohydratesOfChain) {
          carbohydrateResidues.push(...carbch.residues);
        }
        carbohydratesOfChain.map((carbch) => carbch.residues);
        molstarSelection['residues'] = carbohydrateResidues.map((carbResidue) => {
          const resNum = carbResidue.author_residue_number;
          const resIns = carbResidue.author_insertion_code;
          selectionNames.push(`Chain ${ch} } - Res: ${resNum}${resIns}`);
          return {
            authBegin: resNum + '',
            authBeginIns: resIns,
            authEnd: resNum + '',
            authEndIns: resIns,
          };
        });
      } else selectionNames.push(`Chain ${ch}`);
      return molstarSelection;
    });
    if (selections.length === 0) {
      console.warn(`WARNING: No selections could be generated for macromolecule: ${molecule.molecule_name[0]} (${molecule.entity_id})`);
    }
    return { selections, selectionNames };
  }

  public generateTableFilters(): TableFilter[] {
    let newFilters: TableFilter[] = [];
    if (this.tableFilters().length === 0) {
      // create an all filter for all macromolecular types
      const allTypes = [
        'polypeptide(L)',
        'polypeptide(R)',
        'polydeoxyribonucleotide',
        'polyribonucleotide',
        'polydeoxyribonucleotide/polyribonucleotide hybrid',
        'carbohydrate polymer',
      ];
      const plural = this.macromolecules.length > 1 ? 's' : '';
      newFilters.push({
        types: allTypes,
        description: `All (${this.macromolecules.length} macromolecule${plural})`,
      });

      // link set of molecule types to their descriptions
      const moleculeTypeConditions = [
        {
          moleculeTypes: ['polypeptide(L)', 'polypeptide(R)'],
          filterDescriptionSuffix: 'distinct protein',
        },
        {
          moleculeTypes: ['polydeoxyribonucleotide', 'polyribonucleotide', 'polydeoxyribonucleotide/polyribonucleotide hybrid'],
          filterDescriptionSuffix: 'DNA/RNA',
        },
        {
          moleculeTypes: ['carbohydrate polymer'],
          filterDescriptionSuffix: 'carbohydrate',
        },
      ];
      // for each set of molecule types ...
      for (const moleculeTypeCondition of moleculeTypeConditions) {
        // ... filter the complete macromolecule list by this set of types
        const filteredMacromolecules = this.macromolecules.filter((mol) => moleculeTypeCondition.moleculeTypes.indexOf(mol.molecule_type) > -1);
        // ... and create a filter based on these set of types and a dynamically generated description
        const plural = filteredMacromolecules.length > 1 ? 's' : '';
        if (filteredMacromolecules.length > 0) {
          newFilters.push({
            types: moleculeTypeCondition.moleculeTypes,
            description: `${filteredMacromolecules.length} ${moleculeTypeCondition.filterDescriptionSuffix}${plural}`,
          });
        }
      }
      // if filters contain only a single macromolecule type and the 'All' filter...
      if (newFilters.length === 2) {
        //... remove the all filter
        newFilters.shift();
      }
      // set filters signal
      this.tableFilters.set(newFilters);
    } else {
      newFilters = [...this.tableFilters()];
    }
    return newFilters;
  }

  private isNotEmptyObject(obj: any): boolean {
    return obj && Object.keys(obj).length > 0;
  }
}
