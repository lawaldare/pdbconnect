import { MolstarSelectionObj, MolstarSelectionObjResid } from '@pdbe-lib/molstar-for-apps';
import { INTX_NAME_COLORS } from '../entry-constant';
import { INTX_NAME_STANDARDIZER } from '../components/ligands-tab/interaction-type.component';
import { LigandsRowData } from '../data-classes/data-models-and-definitions/row-and-table.model';
import { Interaction } from '../data-models/interaction.model';
import { QueryParam } from 'pdbe-molstar/lib/helpers';

export function interactionsToMolstar(
  ligand: LigandsRowData,
  ligandMolstarSelection: MolstarSelectionObj,
  interactions: Interaction[],
  chainToEntityId: { [key: string]: string }
) {
  const chainId = ligandMolstarSelection.authChainId;
  const residueId = ligandMolstarSelection.residues[0].authBegin;
  const resIns = ligandMolstarSelection.residues[0].authBeginIns;

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
    const residObj: QueryParam = {
      // auth_asym_id: int.end.chain_id,
      // auth_seq_id: int.end.author_residue_number,
      // auth_ins_code_id: this.normalizeInsertionCode(int.end.author_insertion_code),

      // entityId: chainToEntityId[int.end.chain_id],
      entity_id: chainToEntityId[int.end.chain_id],
      // authChainId: int.end.chain_id,
      auth_asym_id: int.end.chain_id,
      // authBegin: int.end.author_residue_number + '',
      auth_residue_number: int.end.author_residue_number,
      // authBeginIns: normalizeInsertionCode(int.end.author_insertion_code) + '' || '',
      auth_ins_code_id: normalizeInsertionCode(int.end.author_insertion_code),
      // authEnd: int.end.author_residue_number + '',
      // authEndIns: normalizeInsertionCode(int.end.author_insertion_code) + '' || '',
    };

    const sameResidues = residuesMolstarSelections.filter((sel) => {
      // return (
      //   sel.residues[0].entityId === residObj.entityId &&
      //   sel.residues[0].authChainId === residObj.authChainId &&
      //   sel.residues[0].authBegin === residObj.authBegin &&
      //   sel.residues[0].authBeginIns === residObj.authBeginIns
      // );
      return (
        sel.entity_id === residObj.entity_id &&
        sel.auth_asym_id === residObj.auth_asym_id &&
        sel.auth_residue_number === residObj.auth_residue_number &&
        sel.auth_ins_code_id === residObj.auth_ins_code_id
      );
    });
    if (sameResidues.length === 0) {
      // residuesMolstarSelections.push({
      //   residues: [residObj],
      // });
      residuesMolstarSelections.push(residObj);
    }

    // if (residuesMolstarSelections.residues.indexOf(residObj) === -1) {
    //   residuesMolstarSelections.residues.push(residObj);
    // }
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
