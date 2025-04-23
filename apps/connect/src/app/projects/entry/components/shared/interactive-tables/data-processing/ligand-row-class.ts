import { signal, WritableSignal } from '@angular/core';
import { LigandsRowData, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';
import { ModifiedResidue } from '../../../../data-models/modified-residues.model';
import { Molecule } from '../../../../data-models/molecule.model';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { LigandMonomer } from '../../../../data-models/ligand-monomers.model';

export class LigandDataToTable extends DataToTable {
  // Ligand specific data
  ligands: Molecule[];
  modifications: ModifiedResidue[];
  ligandMonomers: LigandMonomer[];

  molstarHardResetOnSelect = false;
  protvistaForSelection = false;
  topolViewerForSelection = false;
  ligandEnvViewerForSelection = true;
  displayFilters = true;
  tableRows: WritableSignal<TableRow[]> = signal([]);
  tableFilters: WritableSignal<TableFilter[]> = signal([]);

  constructor(ligands: Molecule[], modifications: ModifiedResidue[], ligandMonomers: LigandMonomer[]) {
    super();
    this.ligands = ligands;
    this.modifications = modifications;
    this.ligandMonomers = ligandMonomers;
  }

  generateTableData(): TableRow[] {
    let rows: TableRow[] = [];
    if (this.tableRows().length === 0) {
      const ligandsTableRows: LigandsRowData[] = [];
      for (const mol of this.ligands) {
        const randomDescription = 'Unannotated';
        const ligandMolstarData = this.generateMolstarSelectionsLigands(mol, this.ligandMonomers);
        ligandsTableRows.push({
          type: 'ligand',
          id: mol.chem_comp_ids[0],
          codeAndName: {
            count: mol.number_of_copies,
            name: mol.molecule_name[0],
          },
          annotation: {
            description: randomDescription,
            isChip: true,
          },
          additionalData: {
            source: mol,
            selections: ligandMolstarData.selections,
            selectionNames: ligandMolstarData.selectionNames,
          },
        });
      }
      rows.push(...ligandsTableRows);

      const modificationsTableRows: LigandsRowData[] = [];
      const modificationIds = this.modifications.map((mod) => mod.chem_comp_id).filter((mod, idx, array) => array.indexOf(mod) === idx);
      for (const modId of modificationIds) {
        const modificationsOfId = this.modifications.filter((mod) => mod.chem_comp_id === modId);
        const moleculesOfId = modificationsOfId.map((mod) => mod.description).filter((molName, idx, array) => array.indexOf(molName) === idx);

        const modificationMolstarData = this.generateMolstarSelectionsModifications(modificationsOfId);

        modificationsTableRows.push({
          type: 'modification',
          id: modId,
          codeAndName: {
            count: modificationsOfId.length,
            name: modificationsOfId[0].chem_comp_name,
          },
          annotation: {
            // description: `In molecules: ${moleculesOfId.join(', ')}`,
            description: `Modification`,
            isChip: true,
          },
          additionalData: {
            source: modificationsOfId,
            selections: modificationMolstarData.selections,
            selectionNames: modificationMolstarData.selectionNames,
          },
        });
      }
      rows.push(...modificationsTableRows);
      this.tableRows.set(rows);
    } else {
      rows = [...this.tableRows()];
    }

    return rows;
  }

  generateMolstarSelectionsLigands(ligandEntity: Molecule, ligandMonomers: LigandMonomer[]) {
    // const ligandResidueInfo = molstarResidueInfo.filter((residInfo) => {
    //   return (
    //     residInfo.label_entity_id &&
    //     residInfo.auth_asym_id &&
    //     residInfo.label_asym_id &&
    //     residInfo.label_entity_id === ligandEntity.entity_id + '' &&
    //     ligandEntity.in_chains.indexOf(residInfo.auth_asym_id) > -1 &&
    //     ligandEntity.in_struct_asyms.indexOf(residInfo.label_asym_id) > -1
    //   );
    // });

    const filteredLigandMonomers = ligandMonomers.filter((ligandMonomer) => {
      return (
        ligandMonomer.entity_id &&
        ligandMonomer.chain_id &&
        ligandMonomer.struct_asym_id &&
        ligandMonomer.entity_id === ligandEntity.entity_id &&
        ligandEntity.in_chains.indexOf(ligandMonomer.chain_id) > -1 &&
        ligandEntity.in_struct_asyms.indexOf(ligandMonomer.struct_asym_id) > -1
      );
    });

    // const selectionNames: string[] = [];
    // const selections: MolstarSelectionObj[] = ligandResidueInfo.map((ligResidInfo) => {
    //   const resIns = ligResidInfo.pdbx_PDB_ins_code || '';
    //   selectionNames.push(`Chain: ${ligResidInfo.auth_asym_id!} - Res: ${ligResidInfo.auth_seq_id!}${resIns}`);
    //   return {
    //     entityId: ligandEntity.entity_id + '',
    //     authChainId: ligResidInfo.auth_asym_id!,
    //     residues: [
    //       {
    //         authBegin: ligResidInfo.auth_seq_id! + '',
    //         authBeginIns: ligResidInfo.pdbx_PDB_ins_code || '',
    //         authEnd: ligResidInfo.auth_seq_id! + '',
    //         authEndIns: ligResidInfo.pdbx_PDB_ins_code || '',
    //       },
    //     ],
    //   };
    // });

    const selectionNames: string[] = [];
    const selections: MolstarSelectionObj[] = filteredLigandMonomers.map((ligandMonomer) => {
      selectionNames.push(`Chain: ${ligandMonomer.chain_id} - Res: ${ligandMonomer.author_residue_number}${ligandMonomer.author_insertion_code}`);
      return {
        entityId: ligandEntity.entity_id + '',
        authChainId: ligandMonomer.chain_id,
        residues: [
          {
            authBegin: ligandMonomer.author_residue_number + '',
            authBeginIns: ligandMonomer.author_insertion_code,
            authEnd: ligandMonomer.author_residue_number + '',
            authEndIns: ligandMonomer.author_insertion_code,
          },
        ],
      };
    });
    return { selections, selectionNames };
  }

  generateMolstarSelectionsModifications(modifications: ModifiedResidue[]) {
    const selectionNames: string[] = [];
    const selections: MolstarSelectionObj[] = [];
    for (const mod of modifications) {
      const newMolstarSelection: MolstarSelectionObj = {
        entityId: mod.entity_id + '',
        authChainId: mod.chain_id,
        residues: [
          {
            authBegin: mod.author_residue_number + '',
            authBeginIns: mod.author_insertion_code,
            authEnd: mod.author_residue_number + '',
            authEndIns: mod.author_insertion_code,
          },
        ],
      };
      selections.push(newMolstarSelection);
      selectionNames.push(`Chain ${mod.chain_id} -  Res: ${mod.author_residue_number}${mod.author_insertion_code}`);
    }
    return { selections, selectionNames };
  }

  generateTableFilters(): TableFilter[] {
    let newFilters: TableFilter[] = [];
    if (this.tableFilters().length === 0) {
      newFilters.push({
        // ${modificationIds.length + ligands.length}
        description: `All`,
        types: ['ligand', 'modification'],
      });
      if (this.ligands.length > 0) {
        const word = this.ligands.length > 1 ? 'ligands' : 'ligand';
        newFilters.push({
          description: `${this.ligands.length} bound ${word}`,
          types: ['ligand'],
        });
      }

      const modificationIds = this.modifications.map((mod) => mod.chem_comp_id).filter((mod, idx, array) => array.indexOf(mod) === idx);

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
      this.tableFilters.set(newFilters);
    } else {
      newFilters = [...this.tableFilters()];
    }
    return newFilters;
  }
}
