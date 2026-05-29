import { Molecule } from '../../data-models/molecule.model';
import { UniProtMapping, UniProtMappingObj } from '../../data-models/uniprot-mapping.model';
import { CarbohydrateMolecule } from '../../data-models/carbohydrate-polymer.model';
import { getEntityToStructAsymsMapOfAssembly } from './assembly-processing';
import { AssemblyData } from '../../data-models/assembly.model';
import { Filter, LabelUniProtMappingRows, UniProtMappingRows } from './models/other-models';
import { PolymerCoverageMolecule } from '../../data-models/polymer-coverage.model';
import { DEFAULT_SET_25 } from '@pdbe-lib/molstar-for-apps';
import { ProcessedMacromolecule } from './models/processed-entities.model';
import { QueryParamForHelpers } from '../../helpers/molstar-helpers';
import { getCleanMoleculeName } from '../../helpers/processed-data-to-controls';
import { sortByBooleanFlag } from './domain-processing';

export interface MacromoleculesDescriptions {
  macromoleculesDescription: string;
  entryContentsDescription: string[];
}
export function processMacromoleculesDescriptions(macromolecules: Molecule[]): MacromoleculesDescriptions {
  let moleculeTypeConditions = [
    {
      moleculeTypes: ['polypeptide(L)', 'polypeptide(D)'],
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
    {
      moleculeTypes: ['peptide nucleic acid'],
      moleculeDescriptionSuffix: 'peptide nucleic acid',
      entryContentsDescriptionSuffix: 'distinct peptide nucleic acid',
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

export function getUniProtMappingsForMacromolecule(macromolecule: Molecule, uniprotMappings: UniProtMapping, polymerCoverage?: PolymerCoverageMolecule[]) {
  if ((<any>polymerCoverage).empty === true) polymerCoverage = [];
  if ((<any>uniprotMappings).empty === true) uniprotMappings = {};

  let uniprotAccsForMacromolecule: string[] = [];
  const labelUniProtMappings: LabelUniProtMappingRows[] = [];
  const authUniProtMappings: UniProtMappingRows[] = [];

  // For this macromolecule entity
  const entityId = macromolecule.entity_id;
  const allowedAsyms = macromolecule.in_chains;
  const allowedStructAsyms = macromolecule.in_struct_asyms;

  // Find coverage object for this entity
  const entityCoverage = (polymerCoverage || []).find((pc) => pc.entity_id === entityId);

  // group by uniprotId + chainId before row creation
  const grouped: Record<string, { mappings: UniProtMappingObj[]; uniprotId: string; identity: number; coverage: number }> = {};

  Object.entries(uniprotMappings).forEach(([uniprotId, uniprot]) => {
    for (const mapping of uniprot.mappings) {
      if (mapping.entity_id !== entityId) return;
      // filter for preferredAssembly given that macromolecule already has filtered fields
      if (allowedAsyms.indexOf(mapping.chain_id) === -1) continue;
      if (allowedStructAsyms.indexOf(mapping.struct_asym_id) === -1) continue;

      const identity = mapping.identity;
      const coverage = mapping.coverage;
      const key = `${uniprotId}|${mapping.chain_id}|${identity}|${coverage}`;
      if (!grouped[key]) {
        grouped[key] = { mappings: [], uniprotId, identity, coverage };
      }
      grouped[key].mappings.push(mapping);
      uniprotAccsForMacromolecule.push(uniprotId);
    }
  });

  // process grouped sets (same uniprot, same chain, same identity, same coverage)
  Object.values(grouped).forEach(({ uniprotId, identity, coverage, mappings }) => {
    const chainId = mappings[0].chain_id;
    const structAsymId = mappings[0].struct_asym_id;

    const coverageStr = (coverage * 100).toFixed(1) + '%';
    const identityStr = (identity * 100).toFixed(1) + '%';

    // Collect all UniProt and label segments
    const uniprotSegments = mappings.map((m) => {
      if (m.unp_start === m.unp_end) return `${m.unp_start}`;
      else return `${m.unp_start} — ${m.unp_end}`;
    });
    const labelSegments = mappings.map((m) => {
      if (m.start.residue_number === m.end.residue_number) return `${m.start.residue_number}`;
      else return `${m.start.residue_number} — ${m.end.residue_number}`;
    });

    // Auth segments from mapping if possible, else fallback using polymerCoverage
    const authSegments: string[] = [];
    let hasNonObserved = false;
    for (const mapping of mappings) {
      const labelStart = mapping.start.residue_number;
      const labelEnd = mapping.end.residue_number;
      const chainCoverage = entityCoverage?.chains.find((c) => c.chain_id === chainId && c.struct_asym_id === structAsymId);

      // if mapping has author numbering, just take it
      let start = mapping.start?.author_residue_number != null ? `${mapping.start.author_residue_number}${mapping.start.author_insertion_code || ''}` : null;
      let end = mapping.end?.author_residue_number != null ? `${mapping.end.author_residue_number}${mapping.end.author_insertion_code || ''}` : null;

      // but if it does not ...
      if ((start === null || end === null) && chainCoverage) {
        hasNonObserved = true;
        // first sort out data from observed segments
        const sortedSegments = [...chainCoverage.observed].sort((a, b) => a.start.residue_number - b.start.residue_number);

        // if we are looking just for start auth
        if (start === null && end !== null) {
          // we take the first segment with bigger label start than mapping label start
          // e.g we have: [0, 4], [10, 38], [50, 70] (label segments)
          // and 5 as mapping label start, we should take 10
          const seg = sortedSegments.find((seg) => seg.start.residue_number >= labelStart);

          if (seg) {
            start = `${seg.start.author_residue_number}${seg.start.author_insertion_code || ''}`;
            if (start === end) authSegments.push(`${start}`);
            else authSegments.push(`${start} — ${end}`);
          }
        }
        // if we are looking just for end auth
        else if (end === null && start !== null) {
          // we take the first segment with smaller label end than mapping label emd
          // e.g we have: [0, 4], [10, 38], [50, 70] (label segments)
          // and 5 as mapping label end, we should take 4
          const seg = sortedSegments.find((seg) => seg.end.residue_number <= labelEnd);

          if (seg) {
            end = `${seg.end.author_residue_number}${seg.end.author_insertion_code || ''}`;
            if (start === end) authSegments.push(`${start}`);
            else authSegments.push(`${start} — ${end}`);
          }
        }
        // if we are looking for both
        else if (start === null && end == null) {
          // we take everything between label start and label end
          // e.g we have: [0, 4], [10, 38], [50, 70] (label segments)
          // and 5-81 as mapping label start and end, we should take [10, 38], [50, 70]
          const segmentsBetween = sortedSegments.filter(
            (seg) =>
              seg.end.residue_number >= labelStart && // segment overlaps or follows the label start
              seg.start.residue_number <= labelEnd // segment starts before the label end
          );

          for (const seg of segmentsBetween) {
            const segStart = `${seg.start.author_residue_number}${seg.start.author_insertion_code || ''}`;
            const segEnd = `${seg.end.author_residue_number}${seg.end.author_insertion_code || ''}`;
            if (segStart === segEnd) authSegments.push(`${segStart}`);
            else authSegments.push(`${segStart} — ${segEnd}`);
          }
        }
      } else if (start !== null && end !== null) {
        if (start === end) authSegments.push(`${start}`);
        else authSegments.push(`${start} — ${end}`);
      }
    }

    const labelOnlyRow: LabelUniProtMappingRows = {
      uniprotId,
      isCanonical: true,
      coverage: coverageStr,
      identity: identityStr,
      chainIds: [chainId],
      uniprotSegments,
      labelSegments,
    };

    const row: UniProtMappingRows = {
      uniprotId,
      isCanonical: true,
      coverage: coverageStr,
      identity: identityStr,
      chainIds: [chainId],
      uniprotSegments,
      authSegments,
      hasNonObserved,
      labelSegments,
    };

    // in rows from other uniprot ids + chains if same uniprot look for equal label segments
    const existingLabel = labelUniProtMappings.find(
      (r) =>
        r.uniprotId === labelOnlyRow.uniprotId &&
        r.coverage === labelOnlyRow.coverage &&
        r.identity === labelOnlyRow.identity &&
        r.labelSegments.length === labelOnlyRow.labelSegments.length &&
        r.labelSegments.every((v, i) => v === labelOnlyRow.labelSegments[i])
    );
    if (existingLabel) {
      if (!existingLabel.chainIds.includes(chainId)) {
        existingLabel.chainIds.push(chainId);
      }
      labelOnlyRow.uniprotSegments.forEach((seg) => {
        if (!existingLabel.uniprotSegments.includes(seg)) {
          existingLabel.uniprotSegments.push(seg);
        }
      });
    } else {
      labelUniProtMappings.push(labelOnlyRow);
    }

    // in rows from other uniprot ids + chains if same uniprot look for equal auth segments
    const existingAuth = authUniProtMappings.find(
      (r) =>
        r.uniprotId === row.uniprotId &&
        r.coverage === row.coverage &&
        r.identity === row.identity &&
        r.authSegments.length === row.authSegments.length &&
        r.authSegments.every((v, i) => v === row.authSegments[i])
    );
    if (existingAuth) {
      if (!existingAuth.chainIds.includes(chainId)) {
        existingAuth.chainIds.push(chainId);
      }
      row.uniprotSegments.forEach((seg) => {
        if (!existingAuth.uniprotSegments.includes(seg)) {
          existingAuth.uniprotSegments.push(seg);
        }
      });
      row.labelSegments.forEach((seg) => {
        if (!existingAuth.labelSegments.includes(seg)) {
          existingAuth.labelSegments.push(seg);
        }
      });
    } else {
      authUniProtMappings.push(row);
    }
  });

  uniprotAccsForMacromolecule = [...new Set(uniprotAccsForMacromolecule)];
  return { uniprotAccsForMacromolecule, labelUniProtMappings, authUniProtMappings };
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

export function mapPolymerCoverageByPreferredAssembly(polymerCoverage: PolymerCoverageMolecule[], preferredAssembly: AssemblyData) {
  if ((<any>polymerCoverage).empty === true) polymerCoverage = [];
  const assemblyEntitiesMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);

  return polymerCoverage.map((polymer) => {
    const allowedAsyms = assemblyEntitiesMap.get(polymer.entity_id);
    const in_chains_in_pref_assembly = polymer.chains.map((chain) => allowedAsyms !== undefined && allowedAsyms.includes(chain.struct_asym_id));
    return {
      ...polymer,
      in_chains_in_pref_assembly,
    };
  });
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

function getChainIdToStuctAsymMap(coverage: PolymerCoverageMolecule[]) {
  const map: { [chainId: string]: string } = {};
  for (const entity of coverage) {
    for (const chain of entity.chains) {
      map[chain.chain_id] = chain.struct_asym_id;
    }
  }
  return map;
}

export function mapMacromoleculesByPreferredAssembly(macromolecules: Molecule[], preferredAssembly: AssemblyData, coverage: PolymerCoverageMolecule[]): Molecule[] {
  const chainIdToStructAsymMap = getChainIdToStuctAsymMap(coverage);
  const preferredAssemblyEntitiesMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);
  return macromolecules.map<Molecule>((molecule) => {
    // Get list of struct_asyms of preferred assembly
    const allowedStructAsyms = new Set(preferredAssemblyEntitiesMap.get(molecule.entity_id));

    // Filter the in_struct_asyms and in_chains to only include those present in the preferred assembly entity
    const in_struct_asyms_in_pref_assembly: boolean[] = molecule.in_struct_asyms.map((labelAsymId) => allowedStructAsyms.has(labelAsymId));
    const in_chains_in_pref_assembly: boolean[] = molecule.in_chains.map((authAsymId) => allowedStructAsyms.has(chainIdToStructAsymMap[authAsymId]));
    // These two might have different order!

    return {
      ...molecule,
      in_struct_asyms_in_pref_assembly,
      in_chains_in_pref_assembly,
    };
  });
}

export function generateMolstarSelectionsForMacromolecule(macromolecule: Molecule, carbohydrate?: CarbohydrateMolecule, verbose = false) {
  const selectionNames: string[] = [];
  const selections: QueryParamForHelpers[][] = [];
  const selectionsInPrefAssembly: boolean[] = [];
  for (let chain_idx = 0; chain_idx < macromolecule.in_chains.length; chain_idx++) {
    const chainId = macromolecule.in_chains[chain_idx];

    // add flag for not in preferred assembly
    const isInPrefAssembly = macromolecule.in_chains_in_pref_assembly?.[chain_idx] ?? false;
    selectionsInPrefAssembly.push(isInPrefAssembly);

    const molstarSelection: QueryParamForHelpers[] = [];
    if (macromolecule.molecule_type.includes('carbohydrate') === false) {
      molstarSelection.push({
        label_entity_id: String(macromolecule.entity_id),
        auth_asym_id: chainId,
      });
      selectionNames.push(`Chain ${chainId}`);
    } else if (macromolecule.molecule_type.includes('carbohydrate') && carbohydrate) {
      const carbohydratesOfChain = carbohydrate.chains.filter((carbch) => carbch.chain_id === chainId);
      for (const carbChain of carbohydratesOfChain) {
        // const carbStructAsymId = carbChain.struct_asym_id;
        for (const carbResidue of carbChain.residues) {
          molstarSelection.push({
            label_entity_id: String(macromolecule.entity_id),
            auth_asym_id: chainId,
            auth_seq_id: carbResidue.author_residue_number,
            pdbx_PDB_ins_code: carbResidue.author_insertion_code || undefined,
            // struct_asym_id: carbStructAsymId,
            // residue_number: carbResidue.residue_number,
          });
        }
      }
    }
    selections.push(molstarSelection);
  }
  if (selections.length === 0 && verbose) {
    console.warn(`WARNING: No selections could be generated for macromolecule: ${getCleanMoleculeName(macromolecule)} (${macromolecule.entity_id})`);
  }
  return { selections, selectionNames, selectionsInPrefAssembly };
}

export interface MacromoleculeUICard {
  index: number;
  molType: string;
  entityId: number;
  moleculeName: string;
  chains: string[];
  inPrefAssembly: boolean;
}

export function generateMacromoleculesCards(macromolecules: Molecule[], carbohydrates?: CarbohydrateMolecule[]): MacromoleculeUICard[] {
  let macromoleculeCards: MacromoleculeUICard[] = [];
  let index = 0;
  for (const macromolecule of macromolecules) {
    let moleculeLength = macromolecule.length;
    let carbohydrate: CarbohydrateMolecule | undefined = undefined;

    if (macromolecule.molecule_type.includes('carbohydrate')) {
      carbohydrate = carbohydrates?.filter((carb) => carb.entity_id === macromolecule.entity_id)[0];
      if (carbohydrate) moleculeLength = carbohydrate?.chains[0].residues.length;
    }
    const selectionData = generateMolstarSelectionsForMacromolecule(macromolecule, carbohydrate);
    const inPrefAssembly = selectionData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly === true);

    macromoleculeCards.push({
      index,
      molType: macromolecule.molecule_type,
      entityId: macromolecule.entity_id,
      moleculeName: getCleanMoleculeName(macromolecule),
      chains: macromolecule.in_chains,
      inPrefAssembly,
    });
    index += 1;
  }

  macromoleculeCards.sort((a, b) => Number(!a.inPrefAssembly) - Number(!b.inPrefAssembly));
  macromoleculeCards = macromoleculeCards.map((card, i) => {
    return {
      ...card,
      index: i,
    };
  });
  return macromoleculeCards;
}

export function generateMacromoleculesTableFilters(macromolecules: Molecule[]): Filter[] {
  const newFilters: Filter[] = [];
  // create an all filter for all macromolecular types
  const allTypes = [
    'polypeptide(L)',
    'polypeptide(D)',
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
      moleculeTypes: ['polypeptide(L)', 'polypeptide(D)'],
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

export function generateSymmetryOperatorsDict(macromolecule: Molecule, preferredAssembly: AssemblyData) {
  const chainToSymmOp: { [key: string]: string[] } = {};
  const assemblyEntityOfMacromolSearch = preferredAssembly.entities.filter((ent) => ent.entity_id === macromolecule.entity_id);
  if (assemblyEntityOfMacromolSearch.length === 0) return chainToSymmOp;
  else if (assemblyEntityOfMacromolSearch.length > 1) console.warn('Warning: multiple assembly entities found for single macromolecule');
  const assemblyEntityOfMacromol = assemblyEntityOfMacromolSearch[0];
  // has any symmetry op = inverse of has no symmetry op
  const hasSymmetryOp = !assemblyEntityOfMacromol.in_chains.every((chainidWithOp) => chainidWithOp.includes('-') === false);
  if (hasSymmetryOp === false) return chainToSymmOp;

  for (let chainIdx = 0; chainIdx < macromolecule.in_chains.length; chainIdx++) {
    const chainId = macromolecule.in_chains[chainIdx];
    const structAsymId = macromolecule.in_struct_asyms[chainIdx];
    const assemblyStructAsymsWithOp = assemblyEntityOfMacromol.in_chains.filter((chainidWithOp) => chainidWithOp.split('-')[0] === structAsymId);

    const noStructAsymsWithOp = assemblyStructAsymsWithOp.length === 0;
    const onlyCurrentChainId = assemblyStructAsymsWithOp.length === 1 && assemblyStructAsymsWithOp[0] === structAsymId;
    const onlyCurrentChainWithOp =
      assemblyStructAsymsWithOp.length === 1 && assemblyStructAsymsWithOp[0] !== structAsymId && assemblyStructAsymsWithOp[0].includes('-');

    if (noStructAsymsWithOp || onlyCurrentChainId) {
      console.warn(`Warning: no chains with symmetry operator found for chain ${chainId}. Skipping...`);
      continue;
    }
    if (onlyCurrentChainWithOp) {
      const symmetryOperator = assemblyStructAsymsWithOp[0].split('-')[1];
      chainToSymmOp[chainId] = [`ASM-${symmetryOperator}`];
      continue;
    }

    const operatorsList = ['All'];
    for (const assemblyStructAsymWithOp of assemblyStructAsymsWithOp) {
      const symmetryOperator = assemblyStructAsymWithOp === structAsymId ? '1' : assemblyStructAsymWithOp.split('-')[1];

      operatorsList.push(`ASM-${symmetryOperator}`);
    }
    chainToSymmOp[chainId] = operatorsList;
  }
  return chainToSymmOp;
}

export function generateProcessedMacromolecules(macromolecules: Molecule[], preferredAssembly: AssemblyData, carbohydrates?: CarbohydrateMolecule[]) {
  if ((<any>carbohydrates).empty === true) carbohydrates = [];
  const processedMacromolecules: ProcessedMacromolecule[] = [];
  for (const molecule of macromolecules) {
    let moleculeLength = molecule.length ?? 0;
    let carbohydrate: CarbohydrateMolecule | undefined = undefined;

    if (molecule.molecule_type.includes('carbohydrate')) {
      carbohydrate = carbohydrates?.filter((carb) => carb.entity_id === molecule.entity_id)[0];
      if (carbohydrate) moleculeLength = carbohydrate?.chains[0].residues.length;
    }

    const sourceOrganisms = molecule.source ? molecule.source.map((eachSource) => eachSource.organism_scientific_name) : [];

    const geneNames = molecule.gene_name ? molecule.gene_name : [];

    const selectionData = generateMolstarSelectionsForMacromolecule(molecule, carbohydrate);

    const colorEntityIdx = molecule.entity_id - 1;
    const chainSymmOperators = generateSymmetryOperatorsDict(molecule, preferredAssembly);

    const { selections, selectionNames, selectionsInPrefAssembly } = sortByBooleanFlag(
      {
        selections: selectionData.selections,
        selectionNames: selectionData.selectionNames,
        selectionsInPrefAssembly: selectionData.selectionsInPrefAssembly,
      },
      'selectionsInPrefAssembly'
    );

    console.log('generateProcessedMacromolecules', molecule);
    console.log('generateProcessedMacromolecules', selectionData.selections, selectionData.selectionNames, selectionData.selectionsInPrefAssembly);
    console.log('generateProcessedMacromolecules SORTED:', selections, selectionNames, selectionsInPrefAssembly);

    processedMacromolecules.push({
      name: {
        molecule: getCleanMoleculeName(molecule),
        chains: molecule.in_chains.map((eachChain) => `Chain ${eachChain}`),
      },
      length: moleculeLength,
      organisms: sourceOrganisms,
      genes: geneNames,
      chainSymmOperators,
      additionalData: {
        molecule: molecule,
        selections,
        selectionNames,
        selectionsInPrefAssembly,
      },
      molstarColorHex: DEFAULT_SET_25[colorEntityIdx % DEFAULT_SET_25.length],
    });
  }
  processedMacromolecules.sort((a, b) => {
    const inPrefAssemblyA = a.additionalData.selectionsInPrefAssembly.every((val) => val === true);
    const inPrefAssemblyB = b.additionalData.selectionsInPrefAssembly.every((val) => val === true);
    return Number(!inPrefAssemblyA) - Number(!inPrefAssemblyB);
  });

  return processedMacromolecules;
}
