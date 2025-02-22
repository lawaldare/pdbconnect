import { signal, WritableSignal } from '@angular/core';
import { MacromoleculesResidueRanges, MacromoleculesRowData, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';
import { CarbohydrateMolecule, CarbohydrateResidue } from '../../../../data-models/carbohydrate-polymer.model';
import { Molecule } from '../../../../data-models/molecule.model';
import { BestStructureMapping } from '../../../../data-models/uniport-best-structures.model';
import { UniProtMapping } from '../../../../data-models/uniprot-mapping.model';
import { MolstarResidueInfo, MolstarSelectionObj } from '../../../../helpers/molstar/molstar-helpers';

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
  macromolecules: Molecule[];
  carbohydrates: CarbohydrateMolecule[];
  uniprotMapping: UniProtMapping;
  bestStructuresMappingsByUniProtId: { [key: string]: BestStructureMapping[] };
  molstarResidueInfo: MolstarResidueInfo[];

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
    bestStructuresMappingsByUniProtId: { [key: string]: BestStructureMapping[] },
    macromolecules: Molecule[],
    molstarResidueInfo: MolstarResidueInfo[]
  ) {
    super();
    this.carbohydrates = carbohydrates;
    this.uniprotMapping = uniprotMapping;
    this.bestStructuresMappingsByUniProtId = bestStructuresMappingsByUniProtId;
    this.macromolecules = macromolecules;
    this.molstarResidueInfo = molstarResidueInfo;
  }

  generateTableData(): TableRow[] {
    const startEndByEntityByChain: MacromoleculesChainBoundaries = this.getStartEndForChainIds(this.macromolecules, this.molstarResidueInfo);
    const mappingsByEntityByAccession: EntityUniProtMapping = this.generateUniprotMappings(
      this.uniprotMapping,
      this.bestStructuresMappingsByUniProtId,
      startEndByEntityByChain
    );

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

        const molstarSelections: MolstarSelectionObj[] = this.generateMolstarSelectionsMacromolecules(molecule, carbohydrate);

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
            uniprotAccessions: residueRanges.map((eachRange) => eachRange.uniprot),
          },
        });
      }
      rows.push(...macromoleculeRows);
      this.tableRows.set(rows);
    } else {
      rows = [...this.tableRows()];
    }

    return rows;
  }

  private getStartEndForChainIds(macromolecules: Molecule[], molstarResidueInfo: MolstarResidueInfo[]) {
    const startEndByEntityByChain: MacromoleculesChainBoundaries = {};

    // Map macromolecules by entity_id for quick lookup
    const macromoleculesByEntityId = Object.fromEntries(macromolecules.map((mol) => [mol.entity_id, mol]));

    const entitiesForMacromolecules = new Set(Object.keys(macromoleculesByEntityId));

    // Filter and group residues by entity_id and chain_id
    const residsMacroByEntityIdAndChainId = molstarResidueInfo
      .filter((resid) => resid.label_entity_id && resid.label_seq_id && entitiesForMacromolecules.has(resid.label_entity_id))
      .reduce(
        (acc, resid) => {
          const { label_entity_id, auth_asym_id } = resid;
          if (!label_entity_id || !auth_asym_id) return acc;

          acc[label_entity_id] = acc[label_entity_id] || {};
          acc[label_entity_id][auth_asym_id] = acc[label_entity_id][auth_asym_id] || [];
          acc[label_entity_id][auth_asym_id].push(resid);

          return acc;
        },
        {} as { [entityId: string]: { [chainId: string]: MolstarResidueInfo[] } }
      );

    // Transform grouped residues into start/end data
    Object.entries(residsMacroByEntityIdAndChainId).forEach(([entityId, chains]) => {
      startEndByEntityByChain[+entityId] = {};

      Object.entries(chains).forEach(([chainId, residues]) => {
        const sortedResidues = residues.sort((a, b) => a.label_seq_id! - b.label_seq_id!);

        const firstResidNum = sortedResidues[0].auth_seq_id + '';
        const lastResidNum = sortedResidues[sortedResidues.length - 1].auth_seq_id + '';
        const firstResidIns = sortedResidues[0].pdbx_PDB_ins_code || '';
        const lastResidIns = sortedResidues[sortedResidues.length - 1].pdbx_PDB_ins_code || '';

        startEndByEntityByChain[+entityId][chainId] = {
          start_author_residue_number: firstResidNum,
          end_author_residue_number: lastResidNum,
          start_author_insertion_code: firstResidIns,
          end_author_insertion_code: lastResidIns,
        };
      });
    });
    return startEndByEntityByChain;
  }

  private generateUniprotMappings(
    uniprotMapping: UniProtMapping,
    bestStructuresMappingsByUniProtIds: { [key: string]: BestStructureMapping[] },
    startEndByEntityByChain: MacromoleculesChainBoundaries
  ) {
    const mappingsByEntityByAccession: EntityUniProtMapping = {};
    if (this.isNotEmptyObject(uniprotMapping)) {
      for (const [uniprotAcc, mapping] of Object.entries(uniprotMapping)) {
        for (const mappingObj of mapping.mappings) {
          const bestStructureForChain = this.isNotEmptyObject(bestStructuresMappingsByUniProtIds)
            ? bestStructuresMappingsByUniProtIds[uniprotAcc].filter((bestStructureData) => bestStructureData.chain_id === mappingObj.chain_id)[0]
            : { coverage: 0 };
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
            coverage: bestStructureForChain.coverage,
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
      const datumStrings = filteredDatum.map((val) => `${val.start} to ${val.end}`);
      // TODO: We might need to add chain information when allChainsEqualMappings is false
      const allChainsEqualMappings = datumStrings.every((val) => val === datumStrings[0]);
      // const allEqual = true;
      if (allChainsEqualMappings) {
        residueRanges.push({
          range: datumStrings[0],
          coverage: (filteredDatum[0].coverage * 100).toFixed(1) + '%',
          uniprot: uniprotAcc,
        });
      } else {
        for (const datum of filteredDatum) {
          residueRanges.push({
            range: `${datum.start} to ${datum.end}`,
            coverage: (datum.coverage * 100).toFixed(1) + '%',
            uniprot: uniprotAcc,
            chainId: datum.chainId,
          });
        }
      }
    }
    return residueRanges;
  }

  private generateMolstarSelectionsMacromolecules(molecule: Molecule, carbohydrate?: CarbohydrateMolecule) {
    return molecule.in_chains.map((ch) => {
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
          return {
            authBegin: carbResidue.author_residue_number + '',
            authBeginIns: carbResidue.author_insertion_code,
            authEnd: carbResidue.author_residue_number + '',
            authEndIns: carbResidue.author_insertion_code,
          };
        });
      }
      return molstarSelection;
    });
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
