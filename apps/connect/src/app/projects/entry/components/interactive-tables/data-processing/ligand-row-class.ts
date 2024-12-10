import { Injectable, signal, WritableSignal } from '@angular/core';
import { ModifiedResidue } from '../../../data-models/modified-residues.model';
import { Molecule } from '../../../data-models/molecule.model';
import { LigandsRowData, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';
import { ResidueListing } from '../../../data-models/residue-listing.model';
import { MolstarResidueInfo, MolstarSelectionObj } from '../../../helpers/molstar-helpers';

export class LigandDataToTable extends DataToTable {
  // Ligand specific data
  ligands: Molecule[];
  modifications: ModifiedResidue[];
  // residueListing: ResidueListing;
  molstarResidueInfo: MolstarResidueInfo[];

  molstarHardResetOnSelect = false;
  protvistaForSelection = false;
  topolViewerForSelection = false;
  ligandEnvViewerForSelection = true;
  displayFilters = true;
  tableRows: WritableSignal<TableRow[]> = signal([]);
  tableFilters: WritableSignal<TableFilter[]> = signal([]);

  // constructor(ligands: Molecule[], modifications: ModifiedResidue[], residueListing: ResidueListing) {
  constructor(ligands: Molecule[], modifications: ModifiedResidue[], molstarResidueInfo: MolstarResidueInfo[]) {
    super();
    this.ligands = ligands;
    this.modifications = modifications;
    // this.residueListing = residueListing;
    this.molstarResidueInfo = molstarResidueInfo;
  }

  generateTableData(): TableRow[] {
    let rows: TableRow[] = [];
    if (this.tableRows().length === 0) {
      const ligandsTableRows: LigandsRowData[] = [];
      for (const mol of this.ligands) {
        const randomDescription = 'Unannotated';
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
            // selections: this.generateMolstarSelectionsLigands(mol, this.residueListing),
            selections: this.generateMolstarSelectionsLigands(mol, this.molstarResidueInfo),
          },
        });
      }
      rows.push(...ligandsTableRows);

      const modificationsTableRows: LigandsRowData[] = [];
      const modificationIds = this.modifications.map((mod) => mod.chem_comp_id).filter((mod, idx, array) => array.indexOf(mod) === idx);
      for (const modId of modificationIds) {
        const modificationsOfId = this.modifications.filter((mod) => mod.chem_comp_id === modId);
        const moleculesOfId = modificationsOfId.map((mod) => mod.description).filter((molName, idx, array) => array.indexOf(molName) === idx);

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
            selections: this.generateMolstarSelectionsModifications(this.modifications),
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

  // used here to generate molstar selections. can be replaced by https://www.ebi.ac.uk/pdbe/api/pdb/entry/ligand_monomers/1trn
  // generateMolstarSelectionsLigands(ligandEntity: Molecule, residueListing: ResidueListing) {
  generateMolstarSelectionsLigands(ligandEntity: Molecule, molstarResidueInfo: MolstarResidueInfo[]) {
    // const residueListingEntity = residueListing['molecules'].filter((entity) => entity.entity_id === ligandEntity.entity_id)[0];

    // const chains = residueListingEntity['chains'].filter((chain) => {
    //   return ligandEntity.in_chains.indexOf(chain.chain_id) > -1 && ligandEntity.in_struct_asyms.indexOf(chain.struct_asym_id) > -1;
    // });

    // const selections: MolstarSelectionObj[] = [];
    // for (const chain of chains) {
    //   const newMolstarSelection: MolstarSelectionObj = {
    //     entityId: ligandEntity.entity_id + '',
    //     authChainId: chain.chain_id,
    //     residues: [],
    //   };

    //   for (const resid of chain['residues']) {
    //     newMolstarSelection['residues'] = [
    //       {
    //         authBegin: resid.author_residue_number + '',
    //         authBeginIns: resid.author_insertion_code + '',
    //         authEnd: resid.author_residue_number + '',
    //         authEndIns: resid.author_insertion_code + '',
    //       },
    //     ];

    //     selections.push(newMolstarSelection);
    //   }
    // }
    const ligandResidueInfo = molstarResidueInfo.filter((residInfo) => {
      return (
        residInfo.label_entity_id &&
        residInfo.auth_asym_id &&
        residInfo.label_asym_id &&
        residInfo.label_entity_id === ligandEntity.entity_id + '' &&
        ligandEntity.in_chains.indexOf(residInfo.auth_asym_id) > -1 &&
        ligandEntity.in_struct_asyms.indexOf(residInfo.label_asym_id) > -1
      );
    });
    const selections: MolstarSelectionObj[] = ligandResidueInfo.map((ligResidInfo) => {
      return {
        entityId: ligandEntity.entity_id + '',
        authChainId: ligResidInfo.auth_asym_id!,
        residues: [
          {
            authBegin: ligResidInfo.auth_seq_id! + '',
            authBeginIns: ligResidInfo.pdbx_PDB_ins_code || '',
            authEnd: ligResidInfo.auth_seq_id! + '',
            authEndIns: ligResidInfo.pdbx_PDB_ins_code || '',
          },
        ],
      };
    });
    return selections;
  }

  generateMolstarSelectionsModifications(modifications: ModifiedResidue[]) {
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
    }
    return selections;
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
      this.tableFilters.set(newFilters);
    } else {
      newFilters = [...this.tableFilters()];
    }
    return newFilters;
  }
}
