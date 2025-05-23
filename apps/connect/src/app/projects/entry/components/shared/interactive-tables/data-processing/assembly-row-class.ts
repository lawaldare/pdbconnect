import { AssemblyData } from '../../../../data-models/assembly.model';
import { ComplexDetails } from '../../../../data-models/complex-details.model';
import { PisaAssembly } from '../../../../data-models/pisa-assembly.model';
import { ProcessedSummary } from '../../../../data-models/summary.model';
import { AssembliesRowData, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';
import { signal, WritableSignal } from '@angular/core';

const ALLOWEDTYPES = ['polypeptide(L)', 'polypeptide(R)', 'polyribonucleotide', 'polydeoxyribonucleotide', 'polydeoxyribonucleotide/polyribonucleotide hybrid'];

export class AssemblyDataToTable extends DataToTable {
  // Assembly specific data
  summaryData: ProcessedSummary;
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
  constructor(summaryData: ProcessedSummary, complexDetails: ComplexDetails[], assemblyData: AssemblyData[], pisaAssemblyData: PisaAssembly[]) {
    super();
    this.summaryData = summaryData;
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
      let preferredAssemblyId = -1;
      const preferredAssemblyData = this.summaryData.assemblies.filter((summaryAssembly) => summaryAssembly.preferred === true);
      if (preferredAssemblyData.length > 0) {
        preferredAssemblyId = parseInt(preferredAssemblyData[0].assembly_id);
      }
      if (preferredAssemblyId === -1) preferredAssemblyId = 1;

      // we then parse each assembly data from the api endpoint
      for (const assemblyDatum of this.assemblyData) {
        // first we link assembly data to complexDetails data by assembly_id
        let complexDetail = this.complexDetails.filter((eachComplexDetail) => {
          const complexAssemblyIds = eachComplexDetail.assemblies.map((assemblyInfo) => assemblyInfo.assembly_id + '');
          return complexAssemblyIds.indexOf(assemblyDatum.assembly_id) > -1;
        })[0];
        if (complexDetail === undefined) {
          console.warn('WARNING: Assembly complex detail data is undefined, skipping...');
          complexDetail = {
            name: '',
            pdb_complex_id: '',
            complex_portal_id: null,
            participants: [],
            assemblies: [
              {
                assembly_id: 1,
                preferred_assembly: true,
              },
            ],
            subcomplexes: [],
            supercomplexes: [],
          };
        }

        // ... we do the same for summary assembly data
        const summaryAssemblyDatum = this.summaryData.assemblies.filter((summaryAssembly) => summaryAssembly.assembly_id === assemblyDatum.assembly_id)[0];

        // ... we do the same for pisa assembly data
        const pisaAssemblyDatum = this.pisaAssemblyData.filter((pisaAssembly) => pisaAssembly.assembly_id === assemblyDatum.assembly_id)[0];

        // ... we then generate some necessary row data by processing fields of the above
        const preferredWord = assemblyDatum.assembly_id === `${preferredAssemblyId}` ? ' (preferred)' : '';
        let moleculeNames = assemblyDatum.entities.filter((mol) => ALLOWEDTYPES.indexOf(mol.molecule_type) > -1).map((assembly) => assembly.molecule_name[0]);
        if (moleculeNames.length > 5) {
          moleculeNames = [`${moleculeNames.length} molecules`];
        }
        const complexId = complexDetail.pdb_complex_id ? complexDetail.pdb_complex_id : '';
        const complexName = complexDetail.name ? complexDetail.name : '';
        let mericity = `${summaryAssemblyDatum.form} ${summaryAssemblyDatum.name}`;
        mericity = mericity.replace('homo monomer', 'monomer');

        // ... and finally push all necessary data for rendering a row
        assembliesRows.push({
          assemblyId: assemblyDatum.assembly_id,
          assemblyName: `Assembly ${assemblyDatum.assembly_id}${preferredWord}`,
          moleculeNames: moleculeNames,
          complexId: complexId,
          complexName: complexName,
          multimericStates: mericity,
          additionalData: {
            accessibleSurfaceArea: `${pisaAssemblyDatum?.assembly?.accessible_surface_area} Å`,
            buriedSurfaceArea: `${pisaAssemblyDatum?.assembly?.buried_surface_area} Å`,
            dissociationArea: `${pisaAssemblyDatum?.assembly?.dissociation_area} Å`,
            dissociationEnergy: `${pisaAssemblyDatum?.assembly?.dissociation_energy} kcal/mol`,
            dissociationEntropy: `${pisaAssemblyDatum?.assembly?.entropy} kcal/mol`,
            symmetryNumber: `${pisaAssemblyDatum?.assembly?.symmetry_number}`,
            interfaceCount: `${pisaAssemblyDatum?.assembly?.interface_count}`,

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

  // parse the necessary assembly specific data into data filters
  generateTableFilters(): TableFilter[] {
    let newFilters: TableFilter[] = [];
    if (this.tableFilters().length === 0) {
      const mericityCounts: { [key: string]: number } = {};

      // for each assembly, calculate it's mericity...
      for (const assemblyDatum of this.assemblyData) {
        const summaryAssemblyDatum = this.summaryData.assemblies.filter((summaryAssembly) => summaryAssembly.assembly_id === assemblyDatum.assembly_id)[0];
        let mericity = `${summaryAssemblyDatum.form} ${summaryAssemblyDatum.name}`;
        mericity = mericity.replace('homo monomer', 'monomer');

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
