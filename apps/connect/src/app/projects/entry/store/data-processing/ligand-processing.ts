/**
 * TODO
 * 1. Add ligand helpers
 * 2. split summary tab into left and right panels
 * 3. Move generateTableData to helpers
 */

import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { AssemblyData } from '../../data-models/assembly.model';
import { LigandMonomer } from '../../data-models/ligand-monomers.model';
import { ModifiedResidue } from '../../data-models/modified-residues.model';
import { Molecule } from '../../data-models/molecule.model';
import { getEntityToStructAsymsMapOfAssembly } from './assembly-processing';
import { COLORBREWER_SET2_COLORS, ELEMENT_COLORS_HEX } from '@pdbe-lib/molstar-for-apps';
import { BANG_WONG_COLORBLIND_SCALE } from '../../entry-constant';
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

export function filterModificationsByPreferredAssembly(modifications: ModifiedResidue[], preferredAssembly: AssemblyData): ModifiedResidue[] {
  if ((<any>modifications).empty === true) modifications = [];
  const entityMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);

  return modifications.filter((mod) => {
    return entityMap.has(mod.entity_id) && entityMap.get(mod.entity_id)!.includes(mod.struct_asym_id);
  });
}

export function filterLigandMonomersByPreferredAssembly(ligandMonomers: LigandMonomer[], preferredAssembly: AssemblyData): LigandMonomer[] {
  if ((<any>ligandMonomers).empty === true) ligandMonomers = [];
  const entityMap = getEntityToStructAsymsMapOfAssembly(preferredAssembly);

  return ligandMonomers.filter((monomer) => {
    return entityMap.has(monomer.entity_id) && entityMap.get(monomer.entity_id)!.includes(monomer.struct_asym_id);
  });
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
      ligand.in_chains.indexOf(ligandMonomer.chain_id) > -1 &&
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
    const countInPrefAssembly = ligand.number_of_copies;

    const ligandMonomersForThisLigand = filterLigandMonomersForMolecule(ligand, ligandMonomers);
    // const ligandMonomersForThisLigand = ligandMonomers
    //   .filter((ligandMonomer) => ligandMonomer.chem_comp_id === chemCompId);

    const annotationTypes = ligandMonomersForThisLigand
      .map((ligandMonomer) => ligandMonomer.annotations)
      .flat()
      .map((annotation) => annotation.type)
      .filter((v, i, arr) => arr.indexOf(v) === i);

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

  const modificationIds = modifications.map((mod) => mod.chem_comp_id).filter((mod, idx, array) => array.indexOf(mod) === idx);
  for (let modIdx = 0; modIdx < modificationIds.length; modIdx++) {
    const chemCompId = modificationIds[modIdx];
    const modificationsOfId = modifications.filter((mod) => mod.chem_comp_id === chemCompId);
    const countInPrefAssembly = modificationsOfId.length;
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
  return ligandOrModCards;
}

export function generateLigandsAndModsTableFilters(ligands: Molecule[], modifications: ModifiedResidue[]): Filter[] {
  if ((<any>ligands).empty === true) ligands = [];
  if ((<any>modifications).empty === true) modifications = [];
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
    const uniqueLigandAnnotationTypes = ligandMonomersForThisLigand
      .map((ligandMonomer) => {
        return ligandMonomer.annotations.map((annotation) => annotation.type);
      })
      .flat()
      .filter((v, i, arr) => arr.indexOf(v) === i);

    const annotationsOfLigand = uniqueLigandAnnotationTypes.length > 0 ? uniqueLigandAnnotationTypes : [];

    processedLigands.push({
      type: 'ligand',
      id: ligand.chem_comp_ids[0],
      codeAndName: {
        count: ligandMonomersForThisLigand.length,
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
  return processedLigands;
}

export function generateProcessedModifications(modifications: ModifiedResidue[]) {
  if ((<any>modifications).empty === true) modifications = [];
  const processedModifications: ProcessedLigandOrMod[] = [];
  const modificationIds = modifications.map((mod) => mod.chem_comp_id).filter((mod, idx, array) => array.indexOf(mod) === idx);
  for (let modIdx = 0; modIdx < modificationIds.length; modIdx++) {
    const modId = modificationIds[modIdx];
    const modificationsOfId = modifications.filter((mod) => mod.chem_comp_id === modId);
    const moleculesOfId = modificationsOfId.map((mod) => mod.description).filter((molName, idx, array) => array.indexOf(molName) === idx);

    const modificationMolstarData = generateMolstarSelectionsForModification(modificationsOfId);

    const modColor = BANG_WONG_COLORBLIND_SCALE[modIdx % BANG_WONG_COLORBLIND_SCALE.length];
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
  return processedModifications;
}
