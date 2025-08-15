import { signal, WritableSignal } from '@angular/core';
import { LigandsRowData, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';
import { ModifiedResidue } from '../../data-models/modified-residues.model';
import { Molecule } from '../../data-models/molecule.model';
import { COLORBREWER_SET2_COLORS, ELEMENT_COLORS_HEX } from '@pdbe-lib/molstar-for-apps';
import { LigandMonomer } from '../../data-models/ligand-monomers.model';
import { AssemblyData } from '../../data-models/assembly.model';
import { ProcessedSummary } from '../../data-models/summary.model';
import { BANG_WONG_COLORBLIND_SCALE } from '../../entry-constant';
import { QueryParam } from 'pdbe-molstar/lib/helpers';

export class LigandDataToTable extends DataToTable {
  // Ligand specific data
  ligands: Molecule[] = [];
  modifications: ModifiedResidue[] = [];
  ligandMonomers: LigandMonomer[] = [];
  summaryData: ProcessedSummary;
  assemblyData: AssemblyData[];

  molstarHardResetOnSelect = false;
  protvistaForSelection = false;
  topolViewerForSelection = false;
  ligandEnvViewerForSelection = true;
  displayFilters = true;
  tableRows: WritableSignal<TableRow[]> = signal([]);
  tableFilters: WritableSignal<TableFilter[]> = signal([]);

  constructor(ligands: Molecule[], modifications: ModifiedResidue[], ligandMonomers: LigandMonomer[], summaryData: ProcessedSummary, assemblyData: AssemblyData[]) {
    super();
    this.summaryData = summaryData;
    this.assemblyData = assemblyData;
    const preferredAssembly = this.getPreferredAssembly();
    if (preferredAssembly) {
      this.ligands = this.filterLigandsByAssembly(ligands, preferredAssembly);
      this.modifications = this.filterModificationsByAssembly(modifications, preferredAssembly);
      this.ligandMonomers = this.filterLigandMonomersByAssembly(ligandMonomers, preferredAssembly);
    }
  }

  private getPreferredAssembly() {
    // we first check and get the preferred assembly if it exists
    let preferredAssemblyId = -1;
    const preferredAssemblyData = this.summaryData.assemblies.filter((summaryAssembly) => summaryAssembly.preferred === true);
    if (preferredAssemblyData.length > 0) {
      preferredAssemblyId = parseInt(preferredAssemblyData[0].assembly_id);
    }
    if (preferredAssemblyId === -1) preferredAssemblyId = 1;

    const assembly = this.assemblyData.filter((assembly) => parseInt(assembly.assembly_id) === preferredAssemblyId)[0];
    return assembly;
  }

  private getNormalizedEntityMap(assembly: AssemblyData): Map<number, string[]> {
    const map = new Map<number, string[]>();

    for (const entity of assembly.entities) {
      const normalizedChains = entity.in_chains.map((chain) => chain.split('-')[0]);
      map.set(entity.entity_id, normalizedChains);
    }

    return map;
  }

  private filterLigandsByAssembly(ligands: Molecule[], assembly: AssemblyData): Molecule[] {
    const entityMap = this.getNormalizedEntityMap(assembly);

    return ligands
      .filter((lig) => entityMap.has(lig.entity_id))
      .map((lig) => {
        const allowedAsyms = entityMap.get(lig.entity_id)!;

        const filteredInStructAsyms: string[] = [];
        // const filteredInChains: string[] = [];

        lig.in_struct_asyms.forEach((asymId, idx) => {
          if (allowedAsyms.includes(asymId)) {
            filteredInStructAsyms.push(asymId);
            // filteredInChains.push(lig.in_chains[idx]);
          }
        });

        return {
          ...lig,
          in_struct_asyms: filteredInStructAsyms,
          // in_chains: filteredInChains,
        };
      })
      .filter((lig) => lig.in_struct_asyms.length > 0);
  }

  private filterModificationsByAssembly(modifications: ModifiedResidue[], assembly: AssemblyData): ModifiedResidue[] {
    const entityMap = this.getNormalizedEntityMap(assembly);

    return modifications.filter((mod) => {
      return entityMap.has(mod.entity_id) && entityMap.get(mod.entity_id)!.includes(mod.struct_asym_id);
    });
  }

  private filterLigandMonomersByAssembly(ligandMonomers: LigandMonomer[], assembly: AssemblyData): LigandMonomer[] {
    const entityMap = this.getNormalizedEntityMap(assembly);

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
        if (ligandMolstarData.selections.length === 0) {
          console.warn(`skipping ${mol.chem_comp_ids[0]} due to missing molstar selections`);
        }

        const colorEntityIdx = mol.entity_id - 1;
        let ligandColor = COLORBREWER_SET2_COLORS[colorEntityIdx % COLORBREWER_SET2_COLORS.length];
        const elementKeys = Object.keys(ELEMENT_COLORS_HEX);
        if (elementKeys.indexOf(mol.chem_comp_ids[0]) > -1) {
          ligandColor = ELEMENT_COLORS_HEX[mol.chem_comp_ids[0]];
        }

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
          molstarColorHex: ligandColor,
        });
      }
      rows.push(...ligandsTableRows);

      const modificationsTableRows: LigandsRowData[] = [];
      const modificationIds = this.modifications.map((mod) => mod.chem_comp_id).filter((mod, idx, array) => array.indexOf(mod) === idx);
      for (let modIdx = 0; modIdx < modificationIds.length; modIdx++) {
        const modId = modificationIds[modIdx];
        const modificationsOfId = this.modifications.filter((mod) => mod.chem_comp_id === modId);
        const moleculesOfId = modificationsOfId.map((mod) => mod.description).filter((molName, idx, array) => array.indexOf(molName) === idx);

        const modificationMolstarData = this.generateMolstarSelectionsModifications(modificationsOfId);

        const modColor = BANG_WONG_COLORBLIND_SCALE[modIdx % BANG_WONG_COLORBLIND_SCALE.length];
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
          molstarColorHex: modColor,
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

    const selectionNames: string[] = [];
    const selections: QueryParam[][] = filteredLigandMonomers.map((ligandMonomer) => {
      selectionNames.push(`Chain: ${ligandMonomer.chain_id} - Res: ${ligandMonomer.author_residue_number}${ligandMonomer.author_insertion_code}`);
      return [
        {
          entity_id: ligandEntity.entity_id + '',
          auth_asym_id: ligandMonomer.chain_id,
          auth_residue_number: ligandMonomer.author_residue_number,
          auth_ins_code_id: ligandMonomer.author_insertion_code ? ligandMonomer.author_insertion_code : undefined,
        },
      ];
    });

    if (filteredLigandMonomers.length === 0) {
      console.warn(`WARNING: No selections could be generated for ligand: ${ligandEntity.chem_comp_ids[0]}  (${ligandEntity.entity_id})`);
    }
    return { selections, selectionNames };
  }

  generateMolstarSelectionsModifications(modifications: ModifiedResidue[]) {
    const selectionNames: string[] = [];
    const selections: QueryParam[][] = [];
    for (const mod of modifications) {
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
