import { COLORBREWER_SET2_COLORS, ELEMENT_COLORS_HEX } from '@pdbe-lib/molstar-for-apps';
import { AssemblyData } from '../../data-models/assembly.model';
import { BoundMolecule } from '../../data-models/bound-molecule.model';
import { LigandMonomer } from '../../data-models/ligand-monomers.model';
import { ModifiedResidue } from '../../data-models/modified-residues.model';
import { Molecule } from '../../data-models/molecule.model';
import { BANG_WONG_COLORBLIND_SCALE } from '../../entry-constant';
import { getSymmetryInstancesFromRenamedChains } from '../../helpers/misc';
import { QueryParamForHelpers } from '../../helpers/molstar-helpers';
import { getEntityToStructAsymsMapOfAssembly } from './assembly-processing';
import { sortByBooleanFlag } from './domain-processing';
import { Filter } from './models/other-models';

export function filterLigandsByPreferredAssembly(ligands: Molecule[], preferredAssembly: AssemblyData): Molecule[] {
  const entityMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);
  if ((<any>ligands).empty === true) ligands = [];

  return ligands
    .filter((lig) => entityMap.has(lig.entity_id))
    .map((lig) => {
      const allowedAsyms = entityMap.get(lig.entity_id)!;

      const filteredInStructAsyms: string[] = [];
      const filteredInChains: string[] = [];

      lig.in_struct_asyms.forEach((asymId, idx) => {
        if (allowedAsyms.includes(asymId)) {
          filteredInStructAsyms.push(asymId);
          filteredInChains.push(lig.in_chains[idx]); // Keep corresponding chain
        }
      });

      return {
        ...lig,
        in_struct_asyms: filteredInStructAsyms,
        in_chains: filteredInChains,
      };
    })
    .filter((lig) => lig.in_struct_asyms.length > 0);
}

export function mapLigandsByPreferredAssembly(ligands: Molecule[], preferredAssembly: AssemblyData): Molecule[] {
  const entityMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);
  if ((<any>ligands).empty === true) ligands = [];

  const mappedLigands = ligands.map((lig) => {
    const prefAssemblyAsyms = entityMap.get(lig.entity_id);

    const in_struct_asyms_in_pref_assembly: boolean[] = [];
    const in_chains_in_pref_assembly: boolean[] = [];

    lig.in_struct_asyms.forEach((asymId, idx) => {
      if (prefAssemblyAsyms && prefAssemblyAsyms.includes(asymId)) {
        in_struct_asyms_in_pref_assembly.push(true);
        in_chains_in_pref_assembly.push(true);
      } else {
        in_struct_asyms_in_pref_assembly.push(false);
        in_chains_in_pref_assembly.push(false);
      }
    });

    return {
      ...lig,
      in_struct_asyms_in_pref_assembly,
      in_chains_in_pref_assembly,
    };
  });

  return mappedLigands;
}

export function filterModificationsByPreferredAssembly(modifications: ModifiedResidue[], preferredAssembly: AssemblyData): ModifiedResidue[] {
  if ((<any>modifications).empty === true) modifications = [];
  const entityMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);

  return modifications.filter((mod) => {
    return entityMap.has(mod.entity_id) && entityMap.get(mod.entity_id)!.includes(mod.struct_asym_id);
  });
}

export function mapModificationsByPreferredAssembly(modifications: ModifiedResidue[], preferredAssembly: AssemblyData): ModifiedResidue[] {
  if ((<any>modifications).empty === true) modifications = [];
  const entityMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);

  // return modifications.filter((mod) => {
  //   return entityMap.has(mod.entity_id) && entityMap.get(mod.entity_id)!.includes(mod.struct_asym_id);
  // });
  return modifications.map((mod) => {
    const isInPrefAssembly = entityMap.has(mod.entity_id) && entityMap.get(mod.entity_id)!.includes(mod.struct_asym_id);
    return {
      ...mod,
      in_pref_assembly: isInPrefAssembly,
    };
  });
}

type SymmetryLigandInfo = {
  chain_id: string;
  chem_comp_id: string;
  entity: number;
  author_residue_number: number;
  author_insertion_code: string;
};

// Composite key helper
function makeLigKey(chem_comp_id: string, entity: number, resnum: number, ins: string): string {
  return `${chem_comp_id}|${entity}|${resnum}|${ins}`;
}

/**
 * Build a nested map:
 * Map<baseChainId, Map<ligKey, SymmetryLigandInfo[]>>
 */
function buildSymmetryOpMap(boundMolecules: BoundMolecule[]): Map<string, Map<string, SymmetryLigandInfo[]>> {
  const symMap = new Map<string, Map<string, SymmetryLigandInfo[]>>();

  for (const bm of boundMolecules) {
    for (const lig of bm.composition.ligands) {
      if (!lig.chain_id.includes('_')) continue;

      const baseChain = lig.chain_id.split('_')[0];
      const key = makeLigKey(lig.chem_comp_id, lig.entity, lig.author_residue_number, lig.author_insertion_code.replace(' ', ''));

      if (!symMap.has(baseChain)) symMap.set(baseChain, new Map());
      const inner = symMap.get(baseChain)!;

      if (!inner.has(key)) inner.set(key, []);
      inner.get(key)!.push({
        chain_id: lig.chain_id,
        chem_comp_id: lig.chem_comp_id,
        entity: lig.entity,
        author_residue_number: lig.author_residue_number,
        author_insertion_code: lig.author_insertion_code,
      });
    }
  }
  return symMap;
}

export function filterLigandMonomersByPreferredAssembly(
  ligandMonomers: LigandMonomer[],
  boundMolecules: BoundMolecule[],
  preferredAssembly: AssemblyData
): LigandMonomer[] {
  if ((<any>ligandMonomers).empty === true) ligandMonomers = [];
  const entityMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);

  // Step 1: Filter by preferred assembly
  const ligandMonomersByPreferredAssembly = ligandMonomers.filter(
    (monomer) => entityMap.has(monomer.entity_id) && entityMap.get(monomer.entity_id)!.includes(monomer.struct_asym_id)
  );

  // Step 2: Build symmetry op map
  const symMap = buildSymmetryOpMap(boundMolecules);

  // Step 3: Expand ligandMonomersByPreferredAssembly using direct lookups
  const extraMonomers: LigandMonomer[] = [];

  for (const ligMonomer of ligandMonomersByPreferredAssembly) {
    const baseChain = ligMonomer.chain_id;
    if (!symMap.has(baseChain)) continue;

    const inner = symMap.get(baseChain)!;
    const key = makeLigKey(ligMonomer.chem_comp_id, ligMonomer.entity_id, ligMonomer.author_residue_number, ligMonomer.author_insertion_code);

    if (!inner.has(key)) continue;

    for (const mapped of inner.get(key)!) {
      extraMonomers.push({
        ...ligMonomer,
        chain_id: mapped.chain_id,
      });
    }
  }

  // Append all extra monomers in one go
  ligandMonomersByPreferredAssembly.push(...extraMonomers);

  return ligandMonomersByPreferredAssembly;
}

// export function mapLigandMonomersForPrefAssemblyAndSymOp(
export function mapLigandMonomersForPrefAssembly(ligandMonomers: LigandMonomer[], preferredAssembly: AssemblyData): LigandMonomer[] {
  if ((<any>ligandMonomers).empty === true) ligandMonomers = [];
  const entityMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);

  // Step 1: Filter by preferred assembly
  const ligandMonomersWithPreferredAssembly: LigandMonomer[] = ligandMonomers.map((ligandMonomer) => {
    const isInPrefAssembly = entityMap.has(ligandMonomer.entity_id) && entityMap.get(ligandMonomer.entity_id)!.includes(ligandMonomer.struct_asym_id);
    return {
      ...ligandMonomer,
      in_pref_assembly: isInPrefAssembly,
    };
  });

  return ligandMonomersWithPreferredAssembly;
}

export function filterLigandMonomersForMolecule(ligand: Molecule, ligandMonomers: LigandMonomer[]) {
  const chemCompId = ligand.chem_comp_ids[0];
  const filteredLigandMonomersForMol = ligandMonomers.filter((ligandMonomer) => {
    return (
      ligandMonomer.chem_comp_id === chemCompId &&
      ligandMonomer.entity_id &&
      ligandMonomer.chain_id &&
      ligandMonomer.struct_asym_id &&
      ligandMonomer.entity_id === ligand.entity_id &&
      ligand.in_struct_asyms.indexOf(ligandMonomer.struct_asym_id) > -1
    );
  });
  return filteredLigandMonomersForMol;
}

export function generateMolstarSelectionsForLigand(ligand: Molecule, ligandMonomers: LigandMonomer[], verbose = false) {
  const ligandMonomersForLigand = filterLigandMonomersForMolecule(ligand, ligandMonomers);

  const selectionNames: string[] = [];
  const selections: QueryParamForHelpers[][] = ligandMonomersForLigand.map((ligandMonomer) => {
    selectionNames.push(`Chain: ${ligandMonomer.chain_id} - Res: ${ligandMonomer.author_residue_number}${ligandMonomer.author_insertion_code}`);
    return [
      {
        label_entity_id: String(ligand.entity_id),
        auth_asym_id: ligandMonomer.chain_id,
        auth_seq_id: ligandMonomer.author_residue_number,
        pdbx_PDB_ins_code: ligandMonomer.author_insertion_code || undefined,
        label_asym_id: ligandMonomer.struct_asym_id,
      } satisfies QueryParamForHelpers,
    ];
  });

  if (ligandMonomersForLigand.length === 0 && verbose) {
    console.warn(`WARNING: No selections could be generated for ligand: ${ligand.chem_comp_ids[0]}  (${ligand.entity_id})`);
  }
  return { selections, selectionNames };
}

export function generateMolstarSelectionsForModification(modificationResidues: ModifiedResidue[]) {
  const selectionNames: string[] = [];
  const selections: QueryParamForHelpers[][] = [];
  for (const mod of modificationResidues) {
    const newMolstarSelection: QueryParamForHelpers[] = [
      {
        label_entity_id: String(mod.entity_id),
        auth_asym_id: mod.chain_id,
        auth_seq_id: mod.author_residue_number,
        pdbx_PDB_ins_code: mod.author_insertion_code || undefined,
      },
    ];
    selections.push(newMolstarSelection);
    selectionNames.push(`Chain ${mod.chain_id} -  Res: ${mod.author_residue_number}${mod.author_insertion_code}`);
  }
  return { selections, selectionNames };
}

export interface LigandOrModUICard {
  index: number;
  molType: string;
  chemCompId: string;
  entryInstancesCount: number;
  prefAssemblyCount: number;
  isModified: boolean;
  annotationTypes: string[];
  inPrefAssembly: boolean;
}

export function generateLigandsCards(
  ligands: Molecule[],
  ligandMonomers: LigandMonomer[],
  modifications: ModifiedResidue[],
  preferredAssembly: AssemblyData
): LigandOrModUICard[] {
  if ((<any>ligands).empty === true) ligands = [];
  if ((<any>ligandMonomers).empty === true) ligandMonomers = [];
  if ((<any>modifications).empty === true) modifications = [];
  const ligandOrModCards: LigandOrModUICard[] = [];
  let index = 0;

  for (const ligand of ligands) {
    const chemCompId = ligand.chem_comp_ids[0];

    const ligandMonomersForThisLigand = filterLigandMonomersForMolecule(ligand, ligandMonomers);
    // const entryInstancesCount = ligandMonomersForThisLigand.length;
    // const entryInstancesCount = getLigandCountInEntry(ligand.entity_id, ligandMonomersForThisLigand, preferredAssembly);
    const ligandInAssemblySearch = preferredAssembly.entities.filter((ent) => ent.entity_id === ligand.entity_id);
    if (ligandInAssemblySearch.length > 1) console.warn('Warning: multiple assembly entities found for single macromolecule');
    const prefAssemblyCount = ligandInAssemblySearch.length > 0 ? ligandInAssemblySearch[0].number_of_copies : 0;
    const entryInstancesCount = ligand.number_of_copies || 0;

    const inPrefAssembly = ligandMonomersForThisLigand.every((ligandMonomer) => ligandMonomer.in_pref_assembly === true);

    const annotationTypes = ligandMonomersForThisLigand
      .map((ligandMonomer) => ligandMonomer.annotations)
      .flat()
      .map((annotation) => annotation.type)
      .filter((v, i, arr) => arr.indexOf(v) === i);

    if (entryInstancesCount > 0) {
      ligandOrModCards.push({
        index,
        molType: 'ligand',
        chemCompId,
        entryInstancesCount,
        prefAssemblyCount,
        isModified: false,
        annotationTypes,
        inPrefAssembly,
      });
      index += 1;
    }
  }

  const modificationIds = modifications.map((mod) => mod.chem_comp_id).filter((mod, idx, array) => array.indexOf(mod) === idx);
  for (let modIdx = 0; modIdx < modificationIds.length; modIdx++) {
    const chemCompId = modificationIds[modIdx];
    const modificationsOfId = modifications.filter((mod) => mod.chem_comp_id === chemCompId);
    const entryInstancesCount = modificationsOfId.length;

    const inPrefAssembly = !modificationsOfId.some((mod) => mod.in_pref_assembly === false);
    const prefAssemblyCount = modificationsOfId.filter((mod) => mod.in_pref_assembly === true).length;

    if (entryInstancesCount > 0) {
      ligandOrModCards.push({
        index,
        molType: 'modification',
        chemCompId,
        entryInstancesCount,
        prefAssemblyCount,
        isModified: true,
        annotationTypes: [],
        inPrefAssembly,
      });
      index += 1;
    }
  }

  ligandOrModCards.sort((a, b) => Number(!a.inPrefAssembly) - Number(!b.inPrefAssembly));
  return ligandOrModCards;
}

export function generateLigandsAndModsTableFilters(ligands: Molecule[], ligandMonomersForPrefAssembly: LigandMonomer[], modifications: ModifiedResidue[]): Filter[] {
  if ((<any>ligands).empty === true) ligands = [];
  if ((<any>modifications).empty === true) modifications = [];

  ligands = ligands.filter((eachLigand) => {
    const ligandMonomersForThisLigand = filterLigandMonomersForMolecule(eachLigand, ligandMonomersForPrefAssembly);
    return ligandMonomersForThisLigand.length > 0;
  });

  const newFilters: Filter[] = [];
  newFilters.push({
    // ${modificationIds.length + ligands.length}
    description: `All`,
    types: ['ligand', 'modification'],
  });
  if (ligands.length > 0) {
    const word = ligands.length > 1 ? 'ligands' : 'ligand';
    newFilters.push({
      description: `${ligands.length} bound ${word}`,
      types: ['ligand'],
    });
  }

  const modificationIds = modifications.map((mod) => mod.chem_comp_id).filter((mod, idx, array) => array.indexOf(mod) === idx);

  if (modificationIds.length > 0) {
    const word = modificationIds.length > 1 ? 'residues' : 'residue';
    newFilters.push({
      description: `${modificationIds.length} modified ${word}`,
      types: ['modification'],
    });
  }
  if (newFilters.length === 2) {
    newFilters.shift();
  }
  return newFilters;
}

interface _ProcessedLigandOrMod<TType extends string, TSourceData> {
  type: TType;
  id: string;
  codeAndName: {
    name: string;
    entryInstancesCount: number;
    prefAssemblyCount: number;
  };
  annotations: string[];
  allInstancesInPrefAssembly: boolean;
  symmOpListForEachLigOrMod: string[][];
  additionalData: {
    source: TSourceData;
    selections: QueryParamForHelpers[][];
    selectionNames: string[];
    selectionsInPrefAssembly: boolean[];
  };
  molstarColorHex?: string;
}

export type ProcessedLigand = _ProcessedLigandOrMod<'ligand', Molecule>;
export type ProcessedModification = _ProcessedLigandOrMod<'modification', ModifiedResidue[]>;
export type ProcessedLigandOrMod = ProcessedLigand | ProcessedModification;

function generateSymmetryOperatorsListForLigandMonomer(entityId: number, ligandMonomer: LigandMonomer, preferredAssembly: AssemblyData): string[] {
  const ligandEntity = preferredAssembly.entities.find((ent) => ent.entity_id === entityId);
  if (!ligandEntity) {
    return [];
  }
  /** Struct asym IDs of the ligand chain, optionally renamed by appending symmetry instance ID, e.g. A, A-2, A-3, A-4) */
  const renamedChains = ligandEntity.in_chains.filter((renamedChain) => renamedChain.split('-')[0] === ligandMonomer.struct_asym_id);

  const hasSymmetryOps = renamedChains.some((renamedChain) => renamedChain.includes('-'));
  if (!hasSymmetryOps) {
    return [];
  }

  return getSymmetryInstancesFromRenamedChains(renamedChains);
}

export function generateSymmetryOperatorsListForLigand(entityId: number, ligandMonomersForEntity: LigandMonomer[], preferredAssembly: AssemblyData) {
  return ligandMonomersForEntity.map((monomer) => generateSymmetryOperatorsListForLigandMonomer(entityId, monomer, preferredAssembly));
}

export function generateProcessedLigands(ligands: Molecule[], ligandMonomers: LigandMonomer[], preferredAssembly: AssemblyData, verbose = false) {
  if ((<any>ligands).empty === true) ligands = [];
  if ((<any>ligandMonomers).empty === true) ligandMonomers = [];
  const processedLigands: ProcessedLigandOrMod[] = [];
  for (const ligand of ligands) {
    const ligandMolstarData = generateMolstarSelectionsForLigand(ligand, ligandMonomers);
    if (ligandMolstarData.selections.length === 0 && verbose) {
      console.warn(`skipping ${ligand.chem_comp_ids[0]} due to missing molstar selections`);
    }

    const colorEntityIdx = ligand.entity_id - 1;
    let ligandColor = COLORBREWER_SET2_COLORS[colorEntityIdx % COLORBREWER_SET2_COLORS.length];
    const elementKeys = Object.keys(ELEMENT_COLORS_HEX);
    if (elementKeys.indexOf(ligand.chem_comp_ids[0]) > -1) {
      ligandColor = ELEMENT_COLORS_HEX[ligand.chem_comp_ids[0]];
    }

    const ligandMonomersForThisLigand = filterLigandMonomersForMolecule(ligand, ligandMonomers);
    // const entryInstanceCount = ligandMonomersForThisLigand.length;
    // const entryInstancesCount = getLigandCountInEntry(ligand.entity_id, ligandMonomersForThisLigand, preferredAssembly);

    const ligandInAssemblySearch = preferredAssembly.entities.filter((ent) => ent.entity_id === ligand.entity_id);
    if (ligandInAssemblySearch.length > 1) console.warn('Warning: multiple assembly entities found for single macromolecule');
    const prefAssemblyCount = ligandInAssemblySearch.length > 0 ? ligandInAssemblySearch[0].number_of_copies : 0;
    const entryInstancesCount = ligand.number_of_copies || 0;

    const molstarSelectionsInPrefAssembly = ligandMonomersForThisLigand.map((ligandMonomer) => ligandMonomer.in_pref_assembly || false);
    const allInstancesInPrefAssembly = molstarSelectionsInPrefAssembly.every((inPrefAssembly) => inPrefAssembly === true);

    const uniqueLigandAnnotationTypes = ligandMonomersForThisLigand
      .map((ligandMonomer) => {
        return ligandMonomer.annotations.map((annotation) => annotation.type);
      })
      .flat()
      .filter((v, i, arr) => arr.indexOf(v) === i);
    const annotationsOfLigand = uniqueLigandAnnotationTypes.length > 0 ? uniqueLigandAnnotationTypes : [];

    const unsortedSymmOpListForEachLigOrMod = generateSymmetryOperatorsListForLigand(ligand.entity_id, ligandMonomersForThisLigand, preferredAssembly);
    const { selections, selectionNames, selectionsInPrefAssembly, symmOpListForEachLigOrMod } = sortByBooleanFlag(
      {
        selections: ligandMolstarData.selections,
        selectionNames: ligandMolstarData.selectionNames,
        selectionsInPrefAssembly: molstarSelectionsInPrefAssembly,
        symmOpListForEachLigOrMod: unsortedSymmOpListForEachLigOrMod,
      },
      'selectionsInPrefAssembly'
    );

    if (entryInstancesCount > 0) {
      processedLigands.push({
        type: 'ligand',
        id: ligand.chem_comp_ids[0],
        codeAndName: {
          entryInstancesCount,
          prefAssemblyCount,
          name: ligand.molecule_name[0],
        },
        annotations: annotationsOfLigand,
        symmOpListForEachLigOrMod,
        allInstancesInPrefAssembly,
        additionalData: {
          source: ligand,
          selections,
          selectionNames,
          selectionsInPrefAssembly,
        },
        molstarColorHex: ligandColor,
      });
    }
  }

  processedLigands.sort((a, b) => Number(!a.allInstancesInPrefAssembly) - Number(!b.allInstancesInPrefAssembly));
  return processedLigands;
}

export function generateSymmetryOperatorsListForModification(modifications: ModifiedResidue[], preferredAssembly: AssemblyData) {
  const modificationsSymmOperators: string[][] = [];
  for (const mod of modifications) {
    const entityId = mod.entity_id;
    const instanceStructAsym = mod.struct_asym_id;

    const currentModSymmOperators: string[] = [];
    const assemblyEntityOfModSearch = preferredAssembly.entities.filter((ent) => ent.entity_id === entityId);
    if (assemblyEntityOfModSearch.length === 0) {
      modificationsSymmOperators.push([]);
      continue;
    } else if (assemblyEntityOfModSearch.length > 1) console.warn('Warning: multiple assembly entities found for single macromolecule');
    const assemblyEntityOfMod = assemblyEntityOfModSearch[0];

    const hasSymmetryOp = !assemblyEntityOfMod.in_chains.every((chainidWithOp) => chainidWithOp.includes('-') === false);
    if (hasSymmetryOp === false) {
      modificationsSymmOperators.push([]);
      continue;
    }

    const prefAssemblyStructAsymsForMod = assemblyEntityOfMod.in_chains.filter((structAsymIdWithOp) => structAsymIdWithOp.split('-')[0] === instanceStructAsym);

    const noStructAsymsWithOp = prefAssemblyStructAsymsForMod.length === 0;
    const onlyCurrentChainId = prefAssemblyStructAsymsForMod.length === 1 && prefAssemblyStructAsymsForMod[0] === instanceStructAsym;
    const onlyCurrentChainWithOp = prefAssemblyStructAsymsForMod.length === 1 && prefAssemblyStructAsymsForMod[0] !== instanceStructAsym;

    if (noStructAsymsWithOp || onlyCurrentChainId) {
      modificationsSymmOperators.push([]);
      continue;
    }
    if (onlyCurrentChainWithOp) {
      const symmetryOperator = prefAssemblyStructAsymsForMod[0].split('-')[1];
      modificationsSymmOperators.push([`ASM-${symmetryOperator}`]);
      continue;
    }

    // add each operator to list
    for (const structAsymIdWithOp of prefAssemblyStructAsymsForMod) {
      const symmetryOperator = structAsymIdWithOp === instanceStructAsym ? '1' : structAsymIdWithOp.split('-')[1];
      currentModSymmOperators.push(`ASM-${symmetryOperator}`);
    }
    modificationsSymmOperators.push(currentModSymmOperators);
  }
  return modificationsSymmOperators;
}

export function generateProcessedModifications(modifications: ModifiedResidue[], preferredAssembly: AssemblyData) {
  if ((<any>modifications).empty === true) modifications = [];
  const processedModifications: ProcessedLigandOrMod[] = [];
  const modificationIds = modifications.map((mod) => mod.chem_comp_id).filter((mod, idx, array) => array.indexOf(mod) === idx);
  for (let modIdx = 0; modIdx < modificationIds.length; modIdx++) {
    const modId = modificationIds[modIdx];
    const modificationsOfId = modifications.filter((mod) => mod.chem_comp_id === modId);

    const entryInstancesCount = modificationsOfId.length;
    const inPrefAssembly = !modificationsOfId.some((mod) => mod.in_pref_assembly === false);
    const prefAssemblyCount = modificationsOfId.filter((mod) => mod.in_pref_assembly === true).length;

    const modificationMolstarData = generateMolstarSelectionsForModification(modificationsOfId);

    const molstarSelectionsInPrefAssembly = modificationsOfId.map((mod) => mod.in_pref_assembly || false);
    const allInstancesInPrefAssembly = molstarSelectionsInPrefAssembly.every((inPrefAssembly) => inPrefAssembly === true);

    const unSortedSymmOpListForEachLigOrMod = generateSymmetryOperatorsListForModification(modificationsOfId, preferredAssembly);
    const { selections, selectionNames, selectionsInPrefAssembly, symmOpListForEachLigOrMod, source } = sortByBooleanFlag(
      {
        selections: modificationMolstarData.selections,
        selectionNames: modificationMolstarData.selectionNames,
        selectionsInPrefAssembly: molstarSelectionsInPrefAssembly,
        symmOpListForEachLigOrMod: unSortedSymmOpListForEachLigOrMod,
        source: modificationsOfId,
      },
      'selectionsInPrefAssembly'
    );

    const modColor = BANG_WONG_COLORBLIND_SCALE[modIdx % BANG_WONG_COLORBLIND_SCALE.length];
    if (entryInstancesCount > 0) {
      processedModifications.push({
        type: 'modification',
        id: modId,
        codeAndName: {
          entryInstancesCount,
          prefAssemblyCount,
          name: source[0].chem_comp_name,
        },
        annotations: [],
        symmOpListForEachLigOrMod,
        allInstancesInPrefAssembly,
        additionalData: {
          source,
          selections,
          selectionNames,
          selectionsInPrefAssembly,
        },
        molstarColorHex: modColor,
      });
    }
  }

  processedModifications.sort((a, b) => Number(!a.allInstancesInPrefAssembly) - Number(!b.allInstancesInPrefAssembly));
  return processedModifications;
}
