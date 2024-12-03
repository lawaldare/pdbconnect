import { AssembliesRowData, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';
import { ComplexDetails } from '../../../data-models/complex-details.model';
import { AssemblyData, AssemblyEntity } from '../../../data-models/assembly.model';
import { PisaAssembly } from '../../../data-models/pisa-assembly.model';
import { MULTIMER_MAPPING, MULTIMER_MAPPING_KEYS } from '../../../helpers/assembly-helpers';
import { signal, WritableSignal } from '@angular/core';

const ALLOWEDTYPES = ['polypeptide(L)', 'polypeptide(R)', 'polyribonucleotide', 'polydeoxyribonucleotide', 'polydeoxyribonucleotide/polyribonucleotide hybrid'];

export class AssemblyDataToTable extends DataToTable {
  molstarHardResetOnSelect = true;
  protvistaForSelection = false;
  topolViewerForSelection = false;
  ligandEnvViewerForSelection = false;
  displayFilters = false;
  tableRows: WritableSignal<TableRow[]> = signal([]);
  tableFilters: WritableSignal<TableFilter[]> = signal([]);

  generateTableData(pageInformation: any): TableRow[] {
    const complexDetails: ComplexDetails[] = pageInformation.complexDetails;
    const assemblyData: AssemblyData[] = pageInformation.assembliesData.assemblies;
    const pisaAssemblyData: PisaAssembly[] = pageInformation.assembliesData.pisaAssemblies;

    let rows: TableRow[] = [];

    if (this.tableRows().length === 0) {
      const assembliesRows: AssembliesRowData[] = [];
      let preferredAssembly = -1;
      for (const complexDetail of complexDetails) {
        for (const assemblyInfo of complexDetail.assemblies) {
          if (assemblyInfo.preferred_assembly) {
            preferredAssembly = assemblyInfo.assembly_id;
            break;
          }
        }
        if (preferredAssembly > -1) break;
      }

      for (const assemblyDatum of assemblyData) {
        const complexDetail = complexDetails.filter((eachComplexDetail) => {
          const complexAssemblyIds = eachComplexDetail.assemblies.map((assemblyInfo) => assemblyInfo.assembly_id + '');
          return complexAssemblyIds.indexOf(assemblyDatum.assembly_id) > -1;
        })[0];
        const pisaAssemblyDatum = pisaAssemblyData.filter((pisaAssembly) => pisaAssembly.assembly_id === assemblyDatum.assembly_id)[0];
        const preferredWord = assemblyDatum.assembly_id === `${preferredAssembly}` ? ' (preferred)' : '';
        let moleculeNames = assemblyDatum.entities.filter((mol) => ALLOWEDTYPES.indexOf(mol.molecule_type) > -1).map((assembly) => assembly.molecule_name[0]);

        if (moleculeNames.length > 5) {
          moleculeNames = [`${moleculeNames.length} molecules`];
        }
        const complexId = complexDetail.pdb_complex_id ? complexDetail.pdb_complex_id : '';
        const complexName = complexDetail.name ? complexDetail.name : '';
        const mericity = this.calculateMericity(assemblyDatum.entities);

        assembliesRows.push({
          assemblyId: assemblyDatum.assembly_id,
          assemblyName: `Assembly ${assemblyDatum.assembly_id}${preferredWord}`,
          moleculeNames: moleculeNames,
          complexId: complexId,
          complexName: complexName,
          multimericStates: mericity,
          additionalData: {
            accessibleSurfaceArea: `${pisaAssemblyDatum.assembly.accessible_surface_area} Å`,
            buriedSurfaceArea: `${pisaAssemblyDatum.assembly.buried_surface_area} Å`,
            dissociationArea: `${pisaAssemblyDatum.assembly.dissociation_area} Å`,
            dissociationEnergy: `${pisaAssemblyDatum.assembly.dissociation_energy} kcal/mol`,
            dissociationEntropy: `${pisaAssemblyDatum.assembly.entropy} kcal/mol`,
            symmetryNumber: `${pisaAssemblyDatum.assembly.symmetry_number}`,

            //TODO: Add Molstar Selection here
            selections: [],
          },
        });
      }
      rows.push(...assembliesRows);
      this.tableRows.set(rows);
    } else {
      rows = [...this.tableRows()];
    }
    return rows;
  }

  calculateMericity(participants: AssemblyEntity[]) {
    participants = participants.filter((mol) => {
      return ALLOWEDTYPES.indexOf(mol.molecule_type) > -1;
    });
    const participantTypes: string[] = [];
    let mericityTotal = 0;
    for (const participant of participants) {
      if (participantTypes.indexOf(participant.entity_id + '') === -1) {
        participantTypes.push(participant.entity_id + '');
        mericityTotal += participant.number_of_copies;
      }
    }

    let compositionPrefix = 'homo ';
    if (participantTypes.length > 1) {
      compositionPrefix = 'hetero ';
    }
    let compositionSuffix = `${mericityTotal}-mer`;
    if (mericityTotal <= 20) {
      compositionSuffix = MULTIMER_MAPPING[mericityTotal as MULTIMER_MAPPING_KEYS];
    }
    let composition = `${compositionPrefix}${compositionSuffix}`;
    if (composition === 'homo monomer') {
      composition = 'monomeric';
    }
    return composition;
  }

  generateTableFilters(pageInformation: any): TableFilter[] {
    this.tableFilters.set([]);
    return [];
  }
}
