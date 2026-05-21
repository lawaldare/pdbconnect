import type { ComponentExpressionT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';
import type { QueryParam } from 'pdbe-molstar/lib/helpers';
import { standardizeInteractionType } from '../components/ligands-tab/interaction-type.component';
import { Interaction } from '../data-models/interaction.model';
import { INTX_NAME_COLORS } from '../entry-constant';
import { ProcessedLigandOrMod } from '../store/data-processing/ligand-processing';
import { unique } from './mvs-views/helpers';

export interface MVSAtomInteraction {
  start: ComponentExpressionT[];
  end: ComponentExpressionT[];
  color?: string;
  tooltip?: string;
}

export function interactionsToMolstar(
  ligand: ProcessedLigandOrMod,
  ligandMolstarSelection: QueryParam[],
  interactions: Interaction[],
  instance_id: string | undefined
) {
  const chainId = ligandMolstarSelection[0].auth_asym_id;
  const residueId = ligandMolstarSelection[0].auth_seq_id;
  const resIns = ligandMolstarSelection[0].pdbx_PDB_ins_code;

  const residuesMolstarSelections: ComponentExpressionT[] = [];
  const interactionsMolstarSelections: MVSAtomInteraction[] = [];
  const residToInstanceId: { [key: string]: string | undefined } = {};

  for (const int of interactions) {
    const dist = int.distance.toFixed(2);
    const details = int.interaction_details;
    const tooltipHeader =
      details.length === 1
        ? `<strong>${standardizeInteractionType(details[0])} interaction (${dist} Å)</strong>`
        : `<strong>Mixed interaction (${dist} Å)</strong><br>${details.map(standardizeInteractionType).join(', ')}`;
    const tooltipPartner1 = `<strong>${ligand.id} ${residueId}${resIns?.trim() ?? ''}</strong> | ${int.ligand_atoms.join(', ')}`;
    const tooltipPartner2 = `<strong>${int.end.chem_comp_id} ${int.end.author_residue_number}${
      int.end.author_insertion_code?.trim() ?? ''
    }</strong> | ${int.end.atom_names.join(', ')}`;
    const tooltip = `${tooltipHeader}<br>${tooltipPartner1} - ${tooltipPartner2}`;
    const color = details.length === 1 ? INTX_NAME_COLORS[details[0]] ?? INTX_NAME_COLORS['default'] : INTX_NAME_COLORS['mixed'];

    const atomAsymId = instance_id ? instance_id : undefined;
    const residueChain = int.end.chain_id.split('_')[0];
    let residueSymOp = int.end.chain_id.includes('_') ? 'ASM-' + int.end.chain_id.split('_')[1] : undefined;
    if (instance_id && residueSymOp === undefined) residueSymOp = 'ASM-1';

    const residueNum = int.end.author_residue_number;
    const residueIns = normalizeInsertionCode(int.end.author_insertion_code);

    interactionsMolstarSelections.push({
      start: int.ligand_atoms.map(
        (atom) =>
          ({
            auth_asym_id: chainId,
            auth_seq_id: residueId,
            pdbx_PDB_ins_code: normalizeInsertionCode(resIns),
            auth_atom_id: atom,
            instance_id: atomAsymId,
          }) satisfies ComponentExpressionT
      ),
      end: int.end.atom_names.map(
        (atom) =>
          ({
            auth_asym_id: residueChain,
            auth_seq_id: residueNum,
            pdbx_PDB_ins_code: residueIns,
            auth_atom_id: atom,
            instance_id: residueSymOp,
          }) satisfies ComponentExpressionT
      ),
      color,
      tooltip,
    });
    residuesMolstarSelections.push({
      auth_asym_id: residueChain,
      auth_seq_id: residueNum,
      pdbx_PDB_ins_code: residueIns,
      instance_id: residueSymOp,
    });
    residToInstanceId[`${residueChain}|${residueNum}|${residueIns}`] = residueSymOp;
  }
  return {
    residuesMolstarSelections: unique(residuesMolstarSelections, JSON.stringify),
    interactionsMolstarSelections,
    residToInstanceId,
  };
}

export function normalizeInsertionCode(insCode: string | undefined) {
  if (insCode?.trim()) return insCode;
  else return undefined;
}
