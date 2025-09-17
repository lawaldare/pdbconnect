import { INTX_NAME_COLORS } from '../entry-constant';
import { INTX_NAME_STANDARDIZER } from '../components/ligands-tab/interaction-type.component';
import { Interaction } from '../data-models/interaction.model';
import type { QueryParam } from 'pdbe-molstar/lib/helpers';
import { ProcessedLigandOrMod } from '../store/data-processing/ligand-processing';

export function interactionsToMolstar(
  ligand: ProcessedLigandOrMod,
  ligandMolstarSelection: QueryParam[],
  interactions: Interaction[]
  // chainToEntityId: { [key: string]: string }
) {
  const chainId = ligandMolstarSelection[0].auth_asym_id!;
  const residueId = ligandMolstarSelection[0].auth_residue_number!;
  const resIns = ligandMolstarSelection[0].auth_ins_code_id;

  const residuesMolstarSelections: QueryParam[] = [];
  const interactionsMolstarSelections: QueryParam[] = [];

  for (const int of interactions) {
    const dist = int.distance;
    const details = int.interaction_details;
    const tooltipHeader =
      details.length === 1
        ? `<strong>${formatInteractionType(details[0])} interaction (${dist} Å)</strong>`
        : `<strong>Mixed interaction (${dist} Å)</strong><br>${details.map(formatInteractionType).join(', ')}`;
    const tooltipPartner1 = `<strong>${ligand.id} ${residueId}${resIns?.trim() ?? ''}</strong> | ${int.ligand_atoms.join(', ')}`;
    const tooltipPartner2 = `<strong>${int.end.chem_comp_id} ${int.end.author_residue_number}${
      int.end.author_insertion_code?.trim() ?? ''
    }</strong> | ${int.end.atom_names.join(', ')}`;
    const tooltip = `${tooltipHeader}<br>${tooltipPartner1} - ${tooltipPartner2}`;
    const color = details.length === 1 ? INTX_NAME_COLORS[details[0]] : INTX_NAME_COLORS['mixed'];

    interactionsMolstarSelections.push({
      start: {
        auth_asym_id: chainId,
        auth_seq_id: residueId,
        auth_ins_code_id: normalizeInsertionCode(resIns),
        atoms: int.ligand_atoms,
      },
      end: {
        auth_asym_id: int.end.chain_id,
        auth_seq_id: int.end.author_residue_number,
        auth_ins_code_id: normalizeInsertionCode(int.end.author_insertion_code),
        atoms: int.end.atom_names,
      },
      color,
      tooltip,
    });
    const residObj: QueryParam = {
      // entity_id: chainToEntityId[int.end.chain_id],
      auth_asym_id: int.end.chain_id,
      auth_residue_number: int.end.author_residue_number,
      auth_ins_code_id: normalizeInsertionCode(int.end.author_insertion_code),
    };

    const sameResidues = residuesMolstarSelections.filter((sel) => {
      return (
        // sel.entity_id === residObj.entity_id &&
        sel.auth_asym_id === residObj.auth_asym_id && sel.auth_residue_number === residObj.auth_residue_number && sel.auth_ins_code_id === residObj.auth_ins_code_id
      );
    });
    if (sameResidues.length === 0) {
      residuesMolstarSelections.push(residObj);
    }
  }

  return { residuesMolstarSelections, interactionsMolstarSelections };
}

function formatInteractionType(interactionType: string) {
  if (interactionType === 'mixed') return;
  const interactionTypeName = INTX_NAME_STANDARDIZER[interactionType as keyof typeof INTX_NAME_STANDARDIZER];
  return interactionTypeName;
}

export function normalizeInsertionCode(insCode: string | undefined) {
  if (insCode?.trim()) return insCode;
  else return undefined;
}
