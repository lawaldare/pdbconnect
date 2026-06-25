import type { ComponentExpressionT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';
import { standardizeInteractionType } from '../components/ligands-tab/interaction-type.component';
import { InteractionFromAPI } from '../data-models/interaction.model';
import { INTX_NAME_COLORS } from '../entry-constant';
import { SymmetryOperatorMapping } from './misc';

export interface MVSAtomInteraction {
  start: ComponentExpressionT[];
  end: ComponentExpressionT[];
  color?: string;
  tooltip?: string;
}

/** Create list of MVSAtomInteractions which can be passed to MolViewSpec provider.
 * Use `symmetryOperatorMapping` to map renamed chains from API response (e.g. A_2) to original chain ID and symmetry instance ID.
 * (If `symmetryOperatorMapping` is undefined, always use symmetry instance ID = undefined.) */
export function interactionsToMolstar(interactions: InteractionFromAPI, symmetryOperatorMapping: SymmetryOperatorMapping | undefined): MVSAtomInteraction[] {
  const [ligandAuthAsymId, ligandInstanceId] = SymmetryOperatorMapping.getChainIdAndInstanceIdFromRenamedChain(interactions.ligand.chain_id, symmetryOperatorMapping);
  const ligandCompId = interactions.ligand.chem_comp_id;
  const ligandAuthSeqId = interactions.ligand.author_residue_number;
  const ligandInsCode = normalizeInsertionCode(interactions.ligand.author_insertion_code);

  const mvsAtomInteractions: MVSAtomInteraction[] = [];

  for (const int of interactions.interactions) {
    const dist = int.distance.toFixed(2);
    const details = int.interaction_details;

    const [residueAuthAsymId, residueInstanceId] = SymmetryOperatorMapping.getChainIdAndInstanceIdFromRenamedChain(int.end.chain_id, symmetryOperatorMapping);
    const residueCompId = int.end.chem_comp_id;
    const residueAuthSeqId = int.end.author_residue_number;
    const residuesInsCode = normalizeInsertionCode(int.end.author_insertion_code);

    const tooltipHeader =
      details.length === 1
        ? `<strong>${standardizeInteractionType(details[0])} interaction (${dist} Å)</strong>`
        : `<strong>Mixed interaction (${dist} Å)</strong><br>${details.map(standardizeInteractionType).join(', ')}`;
    const tooltipPartner1 = `<strong>${ligandCompId} ${ligandAuthSeqId}${ligandInsCode ?? ''}</strong> | ${int.ligand_atoms.join(', ')}`;
    const tooltipPartner2 = `<strong>${residueCompId} ${residueAuthSeqId}${residuesInsCode ?? ''}</strong> | ${int.end.atom_names.join(', ')}`;
    const tooltip = `${tooltipHeader}<br>${tooltipPartner1} - ${tooltipPartner2}`;
    const color = details.length === 1 ? INTX_NAME_COLORS[details[0]] ?? INTX_NAME_COLORS['default'] : INTX_NAME_COLORS['mixed'];

    mvsAtomInteractions.push({
      start: int.ligand_atoms.map(
        (atom) =>
          ({
            auth_asym_id: ligandAuthAsymId,
            auth_seq_id: ligandAuthSeqId,
            pdbx_PDB_ins_code: ligandInsCode,
            auth_atom_id: atom,
            instance_id: ligandInstanceId,
          }) satisfies ComponentExpressionT
      ),
      end: int.end.atom_names.map(
        (atom) =>
          ({
            auth_asym_id: residueAuthAsymId,
            auth_seq_id: residueAuthSeqId,
            pdbx_PDB_ins_code: residuesInsCode,
            auth_atom_id: atom,
            instance_id: residueInstanceId,
          }) satisfies ComponentExpressionT
      ),
      color,
      tooltip,
    });
  }
  return mvsAtomInteractions;
}

export function normalizeInsertionCode(insCode: string | undefined) {
  if (insCode?.trim()) return insCode;
  else return undefined;
}
