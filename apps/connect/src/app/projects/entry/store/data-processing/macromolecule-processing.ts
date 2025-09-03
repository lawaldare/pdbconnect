import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { Molecule } from '../../data-models/molecule.model';
import { UniProtMapping, UniProtMappingObj } from '../../data-models/uniprot-mapping.model';
import { CarbohydrateMolecule } from '../../data-models/carbohydrate-polymer.model';
import { getEntityToStructAsymsMapOfAssembly } from './assembly-processing';
import { AssemblyData } from '../../data-models/assembly.model';
import { Filter, MappedResidue } from './models/other-models';
import { PolymerCoverageMolecule } from '../../data-models/polymer-coverage.model';
import { DEFAULT_SET_25 } from '@pdbe-lib/molstar-for-apps';
import { ProcessedMacromolecule } from './models/processed-entities.model';

export interface MacromoleculesDescriptions {
  macromoleculesDescription: string;
  entryContentsDescription: string[];
}
export function processMacromoleculesDescriptions(macromolecules: Molecule[]): MacromoleculesDescriptions {
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

export function mapMacromoleculesChainsToEntityId(macromolecules: Molecule[], verbose = false) {
  const chainToEntityId: { [key: string]: string } = {};
  for (const macromolecule of macromolecules) {
    const entityId = macromolecule.entity_id + '';
    for (const chain of macromolecule.in_chains) {
      if (chainToEntityId[chain] && chainToEntityId[chain] !== entityId) {
        const conflictEntityId = chainToEntityId[chain];
        if (verbose) console.warn(`Error: chain: ${chain} has multiple entity ids (${conflictEntityId}, ${entityId})!`);
      }
      chainToEntityId[chain] = entityId;
    }
  }
  return chainToEntityId;
}

export function getUniProtsDataForMacromolecule(macromolecule: Molecule, uniprotMappings: UniProtMapping, polymerCoverage?: PolymerCoverageMolecule[]) {
  if ((<any>polymerCoverage).empty === true) polymerCoverage = [];
  if ((<any>uniprotMappings).empty === true) uniprotMappings = {};
  let uniprotAccsForMacromolecule: string[] = [];
  const uniprotRangesByChainId: { [key: string]: MappedResidue[] } = {};
  for (const [uniprotAcc, uniprotDetails] of Object.entries(uniprotMappings)) {
    for (const mapping of uniprotDetails.mappings) {
      const entityId = mapping.entity_id;
      const chainId = mapping.chain_id;

      const validResidues = findAuthorNumber(mapping, uniprotDetails.mappings);
      const authorStartResidue = validResidues.validStartAuthNum || patchAuthorNumberPolCov('first', entityId, chainId, polymerCoverage);

      const authorStartInsCode = mapping.start.author_insertion_code;
      const authorStartRange = `${authorStartResidue}${authorStartInsCode}`;

      const authorEndResidue = validResidues.validEndAuthNum || patchAuthorNumberPolCov('last', entityId, chainId, polymerCoverage);

      const authorEndInsCode = mapping.end.author_insertion_code;
      const authorEndRange = `${authorEndResidue}${authorEndInsCode}`;

      if (entityId != macromolecule.entity_id) continue;
      if (!macromolecule.in_chains.includes(chainId)) continue;

      uniprotAccsForMacromolecule.push(uniprotAcc);
      const chainIdKeys = [...Object.keys(uniprotRangesByChainId)];
      if (!chainIdKeys.includes(chainId)) {
        uniprotRangesByChainId[chainId] = [];
      }
      const allUniProts = uniprotRangesByChainId[chainId].map((mapped) => mapped.uniprot);
      let idxOfUniProt = allUniProts.indexOf(uniprotAcc);
      if (idxOfUniProt === -1) {
        uniprotRangesByChainId[chainId].push({
          range: [],
          coverage: Math.round(mapping.coverage * 100) + '%',
          chainId: chainId,
          uniprot: uniprotAcc,
          open: false,
        });
        idxOfUniProt = uniprotRangesByChainId[chainId].length - 1;
      }
      uniprotRangesByChainId[chainId][idxOfUniProt]['range'].push(`${authorStartRange} — ${authorEndRange}`);
    }
  }
  uniprotAccsForMacromolecule = [...new Set(uniprotAccsForMacromolecule)];
  return {
    uniprotAccsForMacromolecule,
    uniprotRangesByChainId,
  };
}

export function findAuthorNumber(mapping: UniProtMappingObj, mappings: UniProtMappingObj[]) {
  let validStartAuthNum: number | null = mapping.start.author_residue_number;
  let validEndAuthNum: number | null = mapping.end.author_residue_number;
  if (validStartAuthNum === null) {
    const validStartMappings = mappings.filter((eachMapping) => {
      return (
        eachMapping.entity_id === mapping.entity_id &&
        eachMapping.start.residue_number === mapping.start.residue_number &&
        eachMapping.start.author_residue_number !== null
      );
    });
    if (validStartMappings.length > 0) {
      validStartAuthNum = validStartMappings[0].start.author_residue_number;
    }
  }
  if (validEndAuthNum === null) {
    const validEndMappings = mappings.filter((eachMapping) => {
      return (
        eachMapping.entity_id === mapping.entity_id && eachMapping.end.residue_number === mapping.end.residue_number && eachMapping.end.author_residue_number !== null
      );
    });
    if (validEndMappings.length > 0) {
      validEndAuthNum = validEndMappings[0].end.author_residue_number;
    }
  }
  return { validStartAuthNum, validEndAuthNum };
}

export function patchAuthorNumberPolCov(patchType: 'first' | 'last', entityId: number, chainId: string, polymerCoverage?: PolymerCoverageMolecule[]) {
  if (!polymerCoverage) return null;
  if ((<any>polymerCoverage).empty === true) polymerCoverage = [];

  const polymerCoverageForEntity = polymerCoverage.filter((polmol) => polmol.entity_id == entityId);
  if (polymerCoverageForEntity.length === 0) return null;

  const polymerCoverageForChainId = polymerCoverageForEntity[0].chains
    .filter((polChain) => polChain.observed.length > 0)
    .filter((polChain) => polChain.chain_id === chainId);
  if (polymerCoverageForChainId.length === 0) return null;

  const observedSegments = polymerCoverageForChainId[0].observed;
  const firstSegment = observedSegments[0];
  const lastSegment = observedSegments[observedSegments.length - 1];

  const start_author_residue_number = firstSegment.start.author_residue_number.toString();
  const end_author_residue_number = lastSegment.end.author_residue_number.toString();
  const start_author_insertion_code = firstSegment.start.author_insertion_code || '';
  const end_author_insertion_code = lastSegment.end.author_insertion_code || '';

  if (patchType === 'first') return `${start_author_residue_number}${start_author_insertion_code}`;
  else return `${end_author_residue_number}${end_author_insertion_code}`;
}

export function filterPolymerCoverageByPreferredAssembly(polymerCoverage: PolymerCoverageMolecule[], preferredAssembly: AssemblyData) {
  if ((<any>polymerCoverage).empty === true) polymerCoverage = [];
  const assemblyEntitiesMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);

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

export function filterMacromoleculesByPreferredAssembly(macromolecules: Molecule[], preferredAssembly: AssemblyData): Molecule[] {
  // Create a quick lookup map for assembly entities by entity_id
  const preferredAssemblyEntitiesMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);

  return (
    macromolecules
      // Filter macromolecules based on entity_id presence in assembly
      .filter((molecule) => preferredAssemblyEntitiesMap.has(molecule.entity_id))
      .map((molecule) => {
        // Get list of struct_asyms of preferred assembly
        const allowedAsyms = preferredAssemblyEntitiesMap.get(molecule.entity_id)!;

        // Filter the in_struct_asyms and in_chains to only
        // include those present in the preferred assembly entity
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
      // Remove molecules where no chains remain after filtering
      .filter((molecule) => molecule.in_struct_asyms.length > 0)
  );
}

export function generateMolstarSelectionsForMacromolecule(macromolecule: Molecule, carbohydrate?: CarbohydrateMolecule, verbose = false) {
  const selectionNames: string[] = [];
  const selections: QueryParam[][] = [];
  for (const chainId of macromolecule.in_chains) {
    const molstarSelection: QueryParam[] = [];
    if (macromolecule.molecule_type.includes('carbohydrate') === false) {
      molstarSelection.push({
        entity_id: macromolecule.entity_id + '',
        auth_asym_id: chainId,
      });
      selectionNames.push(`Chain ${chainId}`);
    } else if (macromolecule.molecule_type.includes('carbohydrate') && carbohydrate) {
      const carbohydratesOfChain = carbohydrate.chains.filter((carbch) => carbch.chain_id === chainId);
      for (const carbChain of carbohydratesOfChain) {
        for (const carbResidue of carbChain.residues) {
          molstarSelection.push({
            entity_id: macromolecule.entity_id + '',
            auth_asym_id: chainId,
            auth_residue_number: carbResidue.author_residue_number,
            auth_ins_code_id: carbResidue.author_insertion_code || undefined,
            residue_number: carbResidue.residue_number,
          });
        }
      }
    }
    selections.push(molstarSelection);
  }
  if (selections.length === 0 && verbose) {
    console.warn(`WARNING: No selections could be generated for macromolecule: ${macromolecule.molecule_name[0]} (${macromolecule.entity_id})`);
  }
  return { selections, selectionNames };
}

export interface MacromoleculeUICard {
  index: number;
  molType: string;
  entityId: number;
  moleculeName: string;
  chains: string[];
}

export function generateMacromoleculesCards(macromolecules: Molecule[]): MacromoleculeUICard[] {
  const macromoleculeCards: MacromoleculeUICard[] = [];
  let index = 0;
  for (const macromolecule of macromolecules) {
    macromoleculeCards.push({
      index,
      molType: macromolecule.molecule_type,
      entityId: macromolecule.entity_id,
      moleculeName: macromolecule.molecule_name[0],
      chains: macromolecule.in_chains,
    });
    index += 1;
  }
  return macromoleculeCards;
}

export function generateMacromoleculesTableFilters(macromolecules: Molecule[]): Filter[] {
  const newFilters: Filter[] = [];
  // create an all filter for all macromolecular types
  const allTypes = [
    'polypeptide(L)',
    'polypeptide(R)',
    'polydeoxyribonucleotide',
    'polyribonucleotide',
    'polydeoxyribonucleotide/polyribonucleotide hybrid',
    'carbohydrate polymer',
  ];
  const plural = macromolecules.length > 1 ? 's' : '';
  newFilters.push({
    types: allTypes,
    // description: `All (${macromolecules.length} macromolecule${plural})`,
    description: `All`,
  });

  // link set of molecule types to their descriptions
  const moleculeTypeConditions = [
    {
      moleculeTypes: ['polypeptide(L)', 'polypeptide(R)'],
      filterDescriptionSuffix: 'distinct protein',
    },
    {
      moleculeTypes: ['polydeoxyribonucleotide', 'polyribonucleotide', 'polydeoxyribonucleotide/polyribonucleotide hybrid'],
      filterDescriptionSuffix: 'DNA or RNA',
    },
    {
      moleculeTypes: ['carbohydrate polymer'],
      filterDescriptionSuffix: 'carbohydrate',
    },
  ];
  // for each set of molecule types ...
  for (const moleculeTypeCondition of moleculeTypeConditions) {
    // ... filter the complete macromolecule list by this set of types
    const filteredMacromolecules = macromolecules.filter((mol) => moleculeTypeCondition.moleculeTypes.indexOf(mol.molecule_type) > -1);
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
  return newFilters;
}

export function generateProcessedMacromolecules(macromolecules: Molecule[], carbohydrates?: CarbohydrateMolecule[]) {
  if ((<any>carbohydrates).empty === true) carbohydrates = [];
  const processedMacromolecules: ProcessedMacromolecule[] = [];
  for (const molecule of macromolecules) {
    let moleculeLength = molecule.length;
    let carbohydrate: CarbohydrateMolecule | undefined = undefined;

    if (molecule.molecule_type.includes('carbohydrate')) {
      carbohydrate = carbohydrates?.filter((carb) => carb.entity_id === molecule.entity_id)[0];
      if (carbohydrate) moleculeLength = carbohydrate?.chains[0].residues.length;
    }

    const sourceOrganisms = molecule.source ? molecule.source.map((eachSource) => eachSource.organism_scientific_name) : [];

    const geneNames = molecule.gene_name ? molecule.gene_name : [];

    const selectionData = generateMolstarSelectionsForMacromolecule(molecule, carbohydrate);

    const selectionNames = selectionData.selectionNames;
    const molstarSelections: QueryParam[][] = selectionData.selections;

    const colorEntityIdx = molecule.entity_id - 1;

    processedMacromolecules.push({
      name: {
        molecule: molecule.molecule_name[0],
        chains: molecule.in_chains.map((eachChain) => `Chain ${eachChain}`),
      },
      length: moleculeLength,
      organisms: sourceOrganisms,
      genes: geneNames,
      additionalData: {
        molecule: molecule,
        selections: molstarSelections,
        selectionNames: selectionNames,
      },
      molstarColorHex: DEFAULT_SET_25[colorEntityIdx % DEFAULT_SET_25.length],
    });
  }

  return processedMacromolecules;
}
