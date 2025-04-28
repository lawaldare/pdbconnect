import { signal, WritableSignal } from '@angular/core';
import { LigandsRowData, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';
import { ModifiedResidue } from '../../../../data-models/modified-residues.model';
import { Molecule } from '../../../../data-models/molecule.model';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { LigandMonomer } from '../../../../data-models/ligand-monomers.model';
import { ComplexDetails } from '../../../../data-models/complex-details.model';
import { AssemblyData } from '../../../../data-models/assembly.model';

export class LigandDataToTable extends DataToTable {
  // Ligand specific data
  ligands: Molecule[] = [];
  modifications: ModifiedResidue[] = [];
  ligandMonomers: LigandMonomer[] = [];
  complexDetails: ComplexDetails[];
  assemblyData: AssemblyData[];

  molstarHardResetOnSelect = false;
  protvistaForSelection = false;
  topolViewerForSelection = false;
  ligandEnvViewerForSelection = true;
  displayFilters = true;
  tableRows: WritableSignal<TableRow[]> = signal([]);
  tableFilters: WritableSignal<TableFilter[]> = signal([]);

  constructor(
    ligands: Molecule[],
    modifications: ModifiedResidue[],
    ligandMonomers: LigandMonomer[],
    complexDetails: ComplexDetails[],
    assemblyData: AssemblyData[]
  ) {
    super();
    this.complexDetails = complexDetails;
    this.assemblyData = assemblyData;
    const preferredAssembly = this.getPreferredAssembly();
    if (preferredAssembly) {
      this.ligands = this.filterLigandsByAssembly(ligands, preferredAssembly);
      this.modifications = this.filterModificationsByAssembly(modifications, preferredAssembly);
      this.ligandMonomers = this.filterLigandMonomersByAssembly(ligandMonomers, preferredAssembly);
    }
  }

  getPreferredAssembly() {
    // we first check and get the preferred assembly if it exists
    let preferredAssembly = -1;
    for (const complexDetail of this.complexDetails) {
      for (const assemblyInfo of complexDetail.assemblies) {
        if (assemblyInfo.preferred_assembly) {
          preferredAssembly = assemblyInfo.assembly_id;
          break;
        }
      }
      if (preferredAssembly > -1) break;
    }
    if (preferredAssembly === -1) preferredAssembly = 1;

    const assembly = this.assemblyData.filter((assembly) => parseInt(assembly.assembly_id) === preferredAssembly)[0];
    return assembly;
  }

  private filterLigandsByAssembly(ligands: Molecule[], assembly: AssemblyData): Molecule[] {
    const entityMap = new Map(assembly.entities.map((e) => [e.entity_id, e.in_chains]));

    return ligands
      .filter((lig) => entityMap.has(lig.entity_id))
      .map((lig) => {
        const allowedAsyms = entityMap.get(lig.entity_id)!;

        const filteredInStructAsyms: string[] = [];
        const filteredInChains: string[] = [];

        lig.in_struct_asyms.forEach((asymId, idx) => {
          if (allowedAsyms.includes(asymId)) {
            filteredInStructAsyms.push(asymId);
            filteredInChains.push(lig.in_chains[idx]);
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

  private filterModificationsByAssembly(modifications: ModifiedResidue[], assembly: AssemblyData): ModifiedResidue[] {
    const entityMap = new Map(assembly.entities.map((e) => [e.entity_id, e.in_chains]));

    return modifications.filter((mod) => {
      return entityMap.has(mod.entity_id) && entityMap.get(mod.entity_id)!.includes(mod.struct_asym_id);
    });
  }

  private filterLigandMonomersByAssembly(ligandMonomers: LigandMonomer[], assembly: AssemblyData): LigandMonomer[] {
    const entityMap = new Map(assembly.entities.map((e) => [e.entity_id, e.in_chains]));

    return ligandMonomers.filter((monomer) => {
      return entityMap.has(monomer.entity_id) && entityMap.get(monomer.entity_id)!.includes(monomer.struct_asym_id);
    });
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
