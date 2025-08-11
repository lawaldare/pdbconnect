import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../data-classes/data-models-and-definitions/row-and-table.model';

export function macromoleculeMolstarSelObjToQueryParam(
  macromolecule: MacromoleculesRowData,
  molstarSelections: MolstarSelectionObj[],
  toFocus: boolean,
  customColor?: string
): QueryParam[] {
  const selections: QueryParam[] = [];
  for (const molstarSelection of molstarSelections) {
    const entityId = molstarSelection.entityId;
    const chainId = molstarSelection.authChainId;
    const entityColor = customColor ? customColor : macromolecule.molstarColorHex;
    selections.push({
      entity_id: `${entityId}`,
      auth_asym_id: `${chainId}`,
      color: entityColor,
      focus: toFocus,
    });
  }
  return selections;
}

export function ligandMolstarSelObjToQueryParam(
  ligand: LigandsRowData,
  molstarSelections: MolstarSelectionObj[],
  toFocus: boolean,
  customColor?: string
): QueryParam[] {
  const selections: QueryParam[] = [];
  for (const molstarSelection of molstarSelections) {
    const entityId = molstarSelection.entityId;
    const chainId = molstarSelection.authChainId;
    const residueId = molstarSelection.residues[0].authBegin;

    const entityColor = customColor ? customColor : ligand.molstarColorHex;
    selections.push({
      entity_id: `${entityId}`,
      auth_asym_id: `${chainId}`,
      auth_residue_number: parseInt(residueId),
      color: entityColor,
      focus: toFocus,
    });
  }
  return selections;
}

export function domainMolstarSelObjToQueryParam(domain: DomainsRowData, toFocus: boolean, customColor?: string): QueryParam[] {
  const domainColor = customColor ? customColor : domain.molstarColorHex;
  return domain.additionalData.selections[0].residues.map((eachSelection) => {
    return {
      entity_id: `${eachSelection.entityId!}`,
      auth_asym_id: `${eachSelection.authChainId!}`,
      start_auth_residue_number: parseInt(eachSelection.authBegin),
      start_auth_ins_code_id: eachSelection.authBeginIns,
      end_auth_residue_number: parseInt(eachSelection.authEnd),
      end_auth_ins_code_id: eachSelection.authEndIns,
      color: domainColor,
      focus: toFocus,
    };
  });
}
