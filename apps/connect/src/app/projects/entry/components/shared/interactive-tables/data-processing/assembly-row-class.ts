import { AssemblyData, AssemblyEntity } from '../../../../data-models/assembly.model';
import { ComplexDetails } from '../../../../data-models/complex-details.model';
import { PisaAssembly } from '../../../../data-models/pisa-assembly.model';
import { MULTIMER_MAPPING, MULTIMER_MAPPING_KEYS } from '../../../../helpers/assembly-helpers';
import { AssembliesRowData, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';
import { signal, WritableSignal } from '@angular/core';

const ALLOWEDTYPES = ['polypeptide(L)', 'polypeptide(R)', 'polyribonucleotide', 'polydeoxyribonucleotide', 'polydeoxyribonucleotide/polyribonucleotide hybrid'];

export class AssemblyDataToTable extends DataToTable {
  // Assembly specific data
  complexDetails: ComplexDetails[];
  assemblyData: AssemblyData[];
  pisaAssemblyData: PisaAssembly[];

  // Implementation of Abstract attributes from abstract-base-row-class
  molstarHardResetOnSelect = true;
  protvistaForSelection = false;
  topolViewerForSelection = false;
  ligandEnvViewerForSelection = false;
  displayFilters = true;

  // tableRows is an abstract signal that contains data for each table row
  tableRows: WritableSignal<TableRow[]> = signal([]);
  // tableFilters is an abstract signal that contains data for each table filter
  tableFilters: WritableSignal<TableFilter[]> = signal([]);

  // when instantiating, set the necessary assembly specific data
  constructor(complexDetails: ComplexDetails[], assemblyData: AssemblyData[], pisaAssemblyData: PisaAssembly[]) {
    super();
    this.complexDetails = complexDetails;
    this.assemblyData = assemblyData;
    this.pisaAssemblyData = pisaAssemblyData;
  }

  // parse the necessary assembly specific data into data for each table row
  // good pdb examples for assemblies: 1e94 (three assemblies); 3irj (no assemblies)
  generateTableData(): TableRow[] {
    let rows: TableRow[] = [];

    if (this.tableRows().length === 0) {
      const assembliesRows: AssembliesRowData[] = [];

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

      // we then parse each assembly data from the api endpoint
      for (const assemblyDatum of this.assemblyData) {
        // first we link assembly data to complexDetails data by assembly_id
        const complexDetail = this.complexDetails.filter((eachComplexDetail) => {
          const complexAssemblyIds = eachComplexDetail.assemblies.map((assemblyInfo) => assemblyInfo.assembly_id + '');
          return complexAssemblyIds.indexOf(assemblyDatum.assembly_id) > -1;
        })[0];
        // ... we do the same for pisa assembly data
        const pisaAssemblyDatum = this.pisaAssemblyData.filter((pisaAssembly) => pisaAssembly.assembly_id === assemblyDatum.assembly_id)[0];

        // ... we then generate some necessary row data by processing fields of the above
        const preferredWord = assemblyDatum.assembly_id === `${preferredAssembly}` ? ' (preferred)' : '';
        let moleculeNames = assemblyDatum.entities.filter((mol) => ALLOWEDTYPES.indexOf(mol.molecule_type) > -1).map((assembly) => assembly.molecule_name[0]);
        if (moleculeNames.length > 5) {
          moleculeNames = [`${moleculeNames.length} molecules`];
        }
        const complexId = complexDetail.pdb_complex_id ? complexDetail.pdb_complex_id : '';
        const complexName = complexDetail.name ? complexDetail.name : '';
        const mericity = this.calculateMericity(assemblyDatum.entities);

        // ... and finally push all necessary data for rendering a row
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

            //?TODO?: Add Molstar Selection here?
            selections: [],
          },
        });
      }
      rows.push(...assembliesRows);
      // finally set table rows signal
      this.tableRows.set(rows);
    } else {
      rows = [...this.tableRows()];
    }
    return rows;
  }

  // function migrated from elephant cage for generating a word according to "assembly stoichometry"
  // obs: this means number of different unique macromolecules in a assembly
  calculateMericity(participants: AssemblyEntity[]) {
    // 1 - for a given assembly, we filter assembly participants by molecular type
    participants = participants.filter((mol) => {
      return ALLOWEDTYPES.indexOf(mol.molecule_type) > -1;
    });

    // 2 - we count how many different unique participants using their entity_id ...
    const participantTypes: string[] = [];
    // ... and how many participants in total
    let mericityTotal = 0;
    for (const participant of participants) {
      if (participantTypes.indexOf(participant.entity_id + '') === -1) {
        participantTypes.push(participant.entity_id + '');
        mericityTotal += participant.number_of_copies;
      }
    }

    // 3 - number of unique participants define a homo or hetero assembly
    let compositionPrefix = 'homo ';
    if (participantTypes.length > 1) {
      compositionPrefix = 'hetero ';
    }

    // 4 - number of total participants define the suffix of the assembly according to MULTIMER_MAPPING
    let compositionSuffix = `${mericityTotal}-mer`;
    if (mericityTotal <= 20) {
      compositionSuffix = MULTIMER_MAPPING[mericityTotal as MULTIMER_MAPPING_KEYS];
    }

    // 5 - finally homo monomer (1 unique entity) is actually called monomeric
    let composition = `${compositionPrefix}${compositionSuffix}`;
    if (composition === 'homo monomer') {
      composition = 'monomeric';
    }
    return composition;
  }

  // parse the necessary assembly specific data into data filters
  generateTableFilters(): TableFilter[] {
    let newFilters: TableFilter[] = [];
    if (this.tableFilters().length === 0) {
      const mericityCounts: { [key: string]: number } = {};

      // for each assembly, calculate it's mericity...
      for (const assemblyDatum of this.assemblyData) {
        const mericity = this.calculateMericity(assemblyDatum.entities);

        // ... and count how many instances of that mericity appear
        mericityCounts[mericity] = mericityCounts[mericity] || 0;
        mericityCounts[mericity] += 1;
      }

      // create an 'All' filter for all mericities
      newFilters.push({
        types: Object.keys(mericityCounts),
        description: `All`,
      });
      for (const [mericity, mericityCount] of Object.entries(mericityCounts)) {
        newFilters.push({
          types: [mericity],
          description: `${mericityCount} ${mericity}`,
        });
      }

      // if filters contain only a single assembly mericity type and the 'All' filter...
      if (newFilters.length === 2) {
        //... remove the all filter
        newFilters.shift();
      }

      // finally set filters signal
      this.tableFilters.set(newFilters);
    } else {
      newFilters = [...this.tableFilters()];
    }
    return newFilters;
  }
}
