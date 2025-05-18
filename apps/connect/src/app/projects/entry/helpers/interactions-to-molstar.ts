import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { INTX_NAME_COLORS } from '../entry-constant';
import { INTX_NAME_STANDARDIZER } from '../components/ligands-tab/interaction-type.component';
import { LigandsRowData } from '../components/shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { Interaction } from '../data-models/interaction.model';

export function interactionsToMolstar(
  ligand: LigandsRowData,
  ligandMolstarSelection: MolstarSelectionObj,
  interactions: Interaction[],
  chainToEntityId: { [key: string]: string }
) {
  const chainId = ligandMolstarSelection.authChainId;
  const residueId = ligandMolstarSelection.residues[0].authBegin;
  const resIns = ligandMolstarSelection.residues[0].authBeginIns;

  const residuesMolstarSelections: MolstarSelectionObj = { residues: [] };
  const interactionsMolstarSelections: any[] = [];

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
        auth_seq_id: parseInt(residueId),
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
    const residObj = {
      // auth_asym_id: int.end.chain_id,
      // auth_seq_id: int.end.author_residue_number,
      // auth_ins_code_id: this.normalizeInsertionCode(int.end.author_insertion_code),
      entityId: chainToEntityId[int.end.chain_id],
      authChainId: int.end.chain_id,
      authBegin: int.end.author_residue_number + '',
      authBeginIns: int.end.author_insertion_code,
      authEnd: int.end.author_residue_number + '',
      authEndIns: int.end.author_insertion_code,
    };
    if (residuesMolstarSelections.residues.indexOf(residObj) === -1) {
      residuesMolstarSelections.residues.push(residObj);
    }
  }

  return { residuesMolstarSelections, interactionsMolstarSelections };
}

function formatInteractionType(interactionType: string) {
  if (interactionType === 'mixed') return;
  const interactionTypeName = INTX_NAME_STANDARDIZER[interactionType as keyof typeof INTX_NAME_STANDARDIZER];
  return interactionTypeName;
}

function normalizeInsertionCode(insCode: string | undefined) {
  if (insCode?.trim()) return insCode;
  else return undefined;
}
