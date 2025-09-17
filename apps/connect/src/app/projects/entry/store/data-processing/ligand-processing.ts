/**
 * TODO
 * 1. Add ligand helpers
 * 2. split summary tab into left and right panels
 * 3. Move generateTableData to helpers
 */

import type { QueryParam } from 'pdbe-molstar/lib/helpers';
import { AssemblyData } from '../../data-models/assembly.model';
import { LigandMonomer } from '../../data-models/ligand-monomers.model';
import { ModifiedResidue } from '../../data-models/modified-residues.model';
import { Molecule } from '../../data-models/molecule.model';
import { getEntityToStructAsymsMapOfAssembly } from './assembly-processing';
import { COLORBREWER_SET2_COLORS, ELEMENT_COLORS_HEX } from '@pdbe-lib/molstar-for-apps';
import { BANG_WONG_COLORBLIND_SCALE } from '../../entry-constant';
import { Filter } from './models/other-models';
import { BoundMolecule } from '../../data-models/bound-molecule.model';

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

export function filterModificationsByPreferredAssembly(modifications: ModifiedResidue[], preferredAssembly: AssemblyData): ModifiedResidue[] {
  if ((<any>modifications).empty === true) modifications = [];
  const entityMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);

  return modifications.filter((mod) => {
    return entityMap.has(mod.entity_id) && entityMap.get(mod.entity_id)!.includes(mod.struct_asym_id);
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
  const selections: QueryParam[][] = ligandMonomersForLigand.map((ligandMonomer) => {
    selectionNames.push(`Chain: ${ligandMonomer.chain_id} - Res: ${ligandMonomer.author_residue_number}${ligandMonomer.author_insertion_code}`);
    return [
      {
        entity_id: ligand.entity_id + '',
        auth_asym_id: ligandMonomer.chain_id,
        auth_residue_number: ligandMonomer.author_residue_number,
        auth_ins_code_id: ligandMonomer.author_insertion_code ? ligandMonomer.author_insertion_code : undefined,
      },
    ];
  });

  if (ligandMonomersForLigand.length === 0 && verbose) {
    console.warn(`WARNING: No selections could be generated for ligand: ${ligand.chem_comp_ids[0]}  (${ligand.entity_id})`);
  }
  return { selections, selectionNames };
}

export function generateMolstarSelectionsForModification(modificationResidues: ModifiedResidue[]) {
  const selectionNames: string[] = [];
  const selections: QueryParam[][] = [];
  for (const mod of modificationResidues) {
    const newMolstarSelection: QueryParam[] = [
      {
        entity_id: mod.entity_id + '',
        auth_asym_id: mod.chain_id,
        auth_residue_number: mod.author_residue_number,
        auth_ins_code_id: mod.author_insertion_code ? mod.author_insertion_code : undefined,
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
  countInPrefAssembly: number;
  isModified: boolean;
  annotationTypes: string[];
}

export function generateLigandsCards(ligands: Molecule[], ligandMonomers: LigandMonomer[], modifications: ModifiedResidue[]): LigandOrModUICard[] {
  if ((<any>ligands).empty === true) ligands = [];
  if ((<any>ligandMonomers).empty === true) ligandMonomers = [];
  if ((<any>modifications).empty === true) modifications = [];
  const ligandOrModCards: LigandOrModUICard[] = [];
  let index = 0;

  for (const ligand of ligands) {
    const chemCompId = ligand.chem_comp_ids[0];

    const ligandMonomersForThisLigand = filterLigandMonomersForMolecule(ligand, ligandMonomers);
    // const ligandMonomersForThisLigand = ligandMonomers
    //   .filter((ligandMonomer) => ligandMonomer.chem_comp_id === chemCompId);

    const countInPrefAssembly = ligandMonomersForThisLigand.length;

    const annotationTypes = ligandMonomersForThisLigand
      .map((ligandMonomer) => ligandMonomer.annotations)
      .flat()
      .map((annotation) => annotation.type)
      .filter((v, i, arr) => arr.indexOf(v) === i);

    if (countInPrefAssembly > 0) {
      ligandOrModCards.push({
        index,
        molType: 'ligand',
        chemCompId,
        countInPrefAssembly,
        isModified: false,
        annotationTypes,
      });
      index += 1;
    }
  }

  const modificationIds = modifications.map((mod) => mod.chem_comp_id).filter((mod, idx, array) => array.indexOf(mod) === idx);
  for (let modIdx = 0; modIdx < modificationIds.length; modIdx++) {
    const chemCompId = modificationIds[modIdx];
    const modificationsOfId = modifications.filter((mod) => mod.chem_comp_id === chemCompId);
    const countInPrefAssembly = modificationsOfId.length;
    if (countInPrefAssembly > 0) {
      ligandOrModCards.push({
        index,
        molType: 'modification',
        chemCompId,
        countInPrefAssembly,
        isModified: true,
        annotationTypes: [],
      });
      index += 1;
    }
  }
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

export interface ProcessedLigandOrMod {
  type: string;
  id: string;
  codeAndName: {
    name: string;
    count: number;
  };
  annotations: string[];
  additionalData: {
    source: Molecule | ModifiedResidue[];
    selections: QueryParam[][];
    selectionNames: string[];
  };
  molstarColorHex?: string;
}

export function generateProcessedLigands(ligands: Molecule[], ligandMonomers: LigandMonomer[], verbose = false) {
  if ((<any>ligands).empty === true) ligands = [];
  if ((<any>ligandMonomers).empty === true) ligandMonomers = [];
  const processedLigands: ProcessedLigandOrMod[] = [];
  for (const ligand of ligands) {
    const randomDescription = 'Unannotated';

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
    const countInPrefAssembly = ligandMonomersForThisLigand.length;
    const uniqueLigandAnnotationTypes = ligandMonomersForThisLigand
      .map((ligandMonomer) => {
        return ligandMonomer.annotations.map((annotation) => annotation.type);
      })
      .flat()
      .filter((v, i, arr) => arr.indexOf(v) === i);

    const annotationsOfLigand = uniqueLigandAnnotationTypes.length > 0 ? uniqueLigandAnnotationTypes : [];

    if (countInPrefAssembly > 0) {
      processedLigands.push({
        type: 'ligand',
        id: ligand.chem_comp_ids[0],
        codeAndName: {
          count: countInPrefAssembly,
          name: ligand.molecule_name[0],
        },
        annotations: annotationsOfLigand,
        additionalData: {
          source: ligand,
          selections: ligandMolstarData.selections,
          selectionNames: ligandMolstarData.selectionNames,
        },
        molstarColorHex: ligandColor,
      });
    }
  }
  return processedLigands;
}

export function generateProcessedModifications(modifications: ModifiedResidue[]) {
  if ((<any>modifications).empty === true) modifications = [];
  const processedModifications: ProcessedLigandOrMod[] = [];
  const modificationIds = modifications.map((mod) => mod.chem_comp_id).filter((mod, idx, array) => array.indexOf(mod) === idx);
  for (let modIdx = 0; modIdx < modificationIds.length; modIdx++) {
    const modId = modificationIds[modIdx];
    const modificationsOfId = modifications.filter((mod) => mod.chem_comp_id === modId);
    const countInPrefAssembly = modificationsOfId.length;

    const moleculesOfId = modificationsOfId.map((mod) => mod.description).filter((molName, idx, array) => array.indexOf(molName) === idx);
    const modificationMolstarData = generateMolstarSelectionsForModification(modificationsOfId);

    const modColor = BANG_WONG_COLORBLIND_SCALE[modIdx % BANG_WONG_COLORBLIND_SCALE.length];
    if (countInPrefAssembly > 0) {
      processedModifications.push({
        type: 'modification',
        id: modId,
        codeAndName: {
          count: modificationsOfId.length,
          name: modificationsOfId[0].chem_comp_name,
        },
        annotations: [],
        additionalData: {
          source: modificationsOfId,
          selections: modificationMolstarData.selections,
          selectionNames: modificationMolstarData.selectionNames,
        },
        molstarColorHex: modColor,
      });
    }
  }
  return processedModifications;
}
