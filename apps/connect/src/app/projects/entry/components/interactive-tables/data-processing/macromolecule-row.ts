import { signal, WritableSignal } from '@angular/core';
import { MacromoleculesResidueRanges, MacromoleculesRowData, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';
import { CarbohydrateMolecule, CarbohydrateResidue } from '../../../data-models/carbohydrate-polymer.model';
import { Molecule } from '../../../data-models/molecule.model';
import { ResidueListing } from '../../../data-models/residue-listing.model';
import { UniProtMapping } from '../../../data-models/uniprot-mapping.model';
import { BestStructureMapping } from '../../../data-models/uniprot-best-structures.model';
import { MolstarSelectionObj } from '../../../helpers/molstar-helpers';

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
  molstarHardResetOnSelect = false;
  protvistaForSelection = true;
  topolViewerForSelection = true;
  ligandEnvViewerForSelection = false;
  displayFilters = true;
  tableRows: WritableSignal<TableRow[]> = signal([]);
  tableFilters: WritableSignal<TableFilter[]> = signal([]);

  generateTableData(pageInformation: any): TableRow[] {
    const macromolecules: Molecule[] = pageInformation.molecules.macroMolecules;
    const carbohydrates: CarbohydrateMolecule[] = pageInformation.carbohydratesData;
    const residueListing: ResidueListing = pageInformation.residueListing;
    const uniprotMapping: UniProtMapping = pageInformation.uniprotData.uniprotMapping;
    const bestStructuresMappingsByUniProtId: { [key: string]: BestStructureMapping[] } = pageInformation.uniprotData.bestStructuresMappingsByUniProtIds;

    const startEndByEntityByChain: MacromoleculesChainBoundaries = this.getStartEndForChainIds(residueListing);
    const mappingsByEntityByAccession: EntityUniProtMapping = this.generateUniprotMappings(
      uniprotMapping,
      bestStructuresMappingsByUniProtId,
      startEndByEntityByChain
    );

    let rows: TableRow[] = [];
    if (this.tableRows().length === 0) {
      const macromoleculeRows: MacromoleculesRowData[] = [];
      for (const molecule of macromolecules) {
        // if molecule is a protein, we try to retrieve uniprot mappings
        const residueRanges = molecule.molecule_type.includes('polypeptide')
          ? this.getUniProtResidueRanges(molecule.entity_id, molecule.in_chains, mappingsByEntityByAccession)
          : [];

        let moleculeLength = molecule.length;
        let carbohydrate: CarbohydrateMolecule | undefined = undefined;
        if (molecule.molecule_type.includes('carbohydrate')) {
          carbohydrate = carbohydrates.filter((carb) => carb.entity_id === molecule.entity_id)[0];
          moleculeLength = carbohydrate.chains[0].residues.length;
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

  private getStartEndForChainIds(residueListing: ResidueListing) {
    const startEndByEntityByChain: MacromoleculesChainBoundaries = {};

    for (const entity of residueListing['molecules']) {
      for (const chain of entity.chains) {
        const sortedResidues = chain.residues.sort((a, b) => a.residue_number - b.residue_number);
        const firstResidNum = sortedResidues[0].author_residue_number;
        const lastResidNum = sortedResidues[sortedResidues.length - 1].author_residue_number;
        const firstResidIns = sortedResidues[0].author_insertion_code;
        const lastResidIns = sortedResidues[sortedResidues.length - 1].author_insertion_code;
        startEndByEntityByChain[entity.entity_id] = startEndByEntityByChain[entity.entity_id] || {};
        startEndByEntityByChain[entity.entity_id][chain.chain_id] = startEndByEntityByChain[entity.entity_id][chain.chain_id] || {
          start_author_residue_number: firstResidNum,
          end_author_residue_number: lastResidNum,
          start_author_insertion_code: firstResidIns,
          end_author_insertion_code: lastResidIns,
        };
      }
    }
    return startEndByEntityByChain;
  }

  private generateUniprotMappings(
    uniprotMapping: UniProtMapping,
    bestStructuresMappingsByUniProtIds: { [key: string]: BestStructureMapping[] },
    startEndByEntityByChain: MacromoleculesChainBoundaries
  ) {
    const mappingsByEntityByAccession: EntityUniProtMapping = {};
    if (uniprotMapping) {
      for (const [uniprotAcc, mapping] of Object.entries(uniprotMapping)) {
        for (const mappingObj of mapping.mappings) {
          const bestStructureForChain = bestStructuresMappingsByUniProtIds[uniprotAcc].filter(
            (bestStructureData) => bestStructureData.chain_id === mappingObj.chain_id
          )[0];
          mappingsByEntityByAccession[mappingObj.entity_id] = mappingsByEntityByAccession[mappingObj.entity_id] ?? {};
          mappingsByEntityByAccession[mappingObj.entity_id][uniprotAcc] = mappingsByEntityByAccession[mappingObj.entity_id][uniprotAcc] ?? [];

          const isAuthorStartValid = mappingObj.start.author_residue_number !== null;
          const startAuthorResidueNumber = isAuthorStartValid
            ? mappingObj.start.author_residue_number
            : startEndByEntityByChain[mappingObj.entity_id][mappingObj.chain_id]['start_author_residue_number'];
          const startAuthorInsertionCode = isAuthorStartValid
            ? mappingObj.start.author_insertion_code
            : startEndByEntityByChain[mappingObj.entity_id][mappingObj.chain_id]['start_author_insertion_code'];

          const isAuthorEndValid = mappingObj.end.author_residue_number !== null;
          const endAuthorResidueNumber = isAuthorEndValid
            ? mappingObj.end.author_residue_number
            : startEndByEntityByChain[mappingObj.entity_id][mappingObj.chain_id]['end_author_residue_number'];
          const endAuthorInsertionCode = isAuthorEndValid
            ? mappingObj.end.author_insertion_code
            : startEndByEntityByChain[mappingObj.entity_id][mappingObj.chain_id]['end_author_insertion_code'];

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

  public generateTableFilters(pageInformation: any): TableFilter[] {
    const macromolecules: Molecule[] = pageInformation.molecules.macroMolecules;

    let newFilters: TableFilter[] = [];
    if (this.tableFilters().length === 0) {
      const allTypes = [
        'polypeptide(L)',
        'polypeptide(R)',
        'polydeoxyribonucleotide',
        'polyribonucleotide',
        'polydeoxyribonucleotide/polyribonucleotide hybrid',
        'carbohydrate polymer',
      ];
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
      const plural = macromolecules.length > 1 ? 's' : '';

      newFilters.push({
        types: allTypes,
        description: `All (${macromolecules.length} macromolecule${plural})`,
      });

      for (const moleculeTypeCondition of moleculeTypeConditions) {
        // filter the complete macromolecule list by the type
        const filteredMacromolecules = macromolecules.filter((mol) => moleculeTypeCondition.moleculeTypes.indexOf(mol.molecule_type) > -1);
        const plural = filteredMacromolecules.length > 1 ? 's' : '';
        if (filteredMacromolecules.length > 0) {
          newFilters.push({
            types: moleculeTypeCondition.moleculeTypes,
            description: `${filteredMacromolecules.length} ${moleculeTypeCondition.filterDescriptionSuffix}${plural}`,
          });
        }
      }

      this.tableFilters.set(newFilters);
    } else {
      newFilters = [...this.tableFilters()];
    }

    return newFilters;
  }
}
