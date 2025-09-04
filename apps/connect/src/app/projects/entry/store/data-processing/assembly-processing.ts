import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { Filter, PreferredAssemblyData } from './models/other-models';
import { AssemblyData } from '../../data-models/assembly.model';
import { ComplexDetails } from '../../data-models/complex-details.model';
import { PisaAssembly } from '../../data-models/pisa-assembly.model';
import { ProcessedSummary } from '../../data-models/summary.model';

export function getPreferredAssemblyId(summaryData: ProcessedSummary) {
  // we first check and get the preferred assembly if it exists
  let preferredAssemblyId = -1;
  const preferredAssemblyData = summaryData.assemblies.filter((summaryAssembly) => summaryAssembly.preferred === true);
  if (preferredAssemblyData.length > 0) {
    preferredAssemblyId = parseInt(preferredAssemblyData[0].assembly_id);
  }
  if (preferredAssemblyId === -1) preferredAssemblyId = 1;
  return preferredAssemblyId;
}

export function getPreferredAssemblyDatum(summaryData: ProcessedSummary, assemblyData: AssemblyData[]) {
  if ((<any>assemblyData).empty === true) assemblyData = [];
  const preferredAssemblyId = getPreferredAssemblyId(summaryData);
  const assembly = assemblyData.filter((assembly) => parseInt(assembly.assembly_id) === preferredAssemblyId)[0];
  return assembly;
}

export function processPreferredAssemblyData(summaryData: ProcessedSummary, complexDetails: ComplexDetails[]): PreferredAssemblyData | undefined {
  if ((<any>complexDetails).empty === true) complexDetails = [];
  let preferredAssemblyData = undefined;
  let preferredAssemblyId = undefined;

  const hasAssemblies = Object.keys(summaryData).indexOf('assemblies') > -1;
  if (!hasAssemblies) return undefined;

  for (const complexDetail of complexDetails) {
    for (const assemblyInfo of complexDetail.assemblies) {
      if (assemblyInfo.preferred_assembly) {
        preferredAssemblyId = assemblyInfo.assembly_id;

        const summaryAssembly =
          summaryData.assemblies.filter((summaryAssembly) => {
            return summaryAssembly.assembly_id === assemblyInfo.assembly_id + '';
          })[0] || undefined;

        let composition = undefined;
        if (summaryAssembly) {
          composition = summaryAssembly.form + ' ' + summaryAssembly.name;
          composition = summaryAssembly.name === 'monomer' ? 'monomeric' : composition;
        }

        preferredAssemblyData = {
          name: complexDetail.name,
          preferred: preferredAssemblyId,
          composition: composition,
          complexId: complexDetail.pdb_complex_id,
        };
        break;
      }
    }
    if (preferredAssemblyId) break;
  }
  return preferredAssemblyData;
}

export function getEntityToStructAsymsMapOfAssembly(assembly: AssemblyData): Map<number, string[]> {
  const map = new Map<number, string[]>();

  for (const entity of assembly.entities) {
    const normalizedChains = entity.in_chains.map((chain) => chain.split('-')[0]);
    map.set(entity.entity_id, normalizedChains);
  }

  return map;
}

export function getComplexDetailByAssemblyId(assemblyDatum: AssemblyData, complexDetails: ComplexDetails[], verbose = false) {
  let complexDetail: ComplexDetails | undefined = undefined;
  if ((<any>complexDetails).empty === true) complexDetails = [];
  const complexDetailFiltered = complexDetails.filter((eachComplexDetail) => {
    const complexAssemblyIds = eachComplexDetail.assemblies.map((assemblyInfo) => assemblyInfo.assembly_id + '');
    return complexAssemblyIds.indexOf(assemblyDatum.assembly_id) > -1;
  });
  if (complexDetailFiltered.length > 0) complexDetail = complexDetailFiltered[0];
  if (complexDetail === undefined) {
    if (verbose) console.warn('WARNING: Assembly complex detail data is undefined, skipping...');
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
  return complexDetail;
}

export interface AssemblyUICard {
  index: number;
  assemblyId: string;
  assemblyName: string;
  complexName: string;
  multimericStates: string;
}

export function generateAssembliesCards(assemblyData: AssemblyData[], complexDetails: ComplexDetails[], summaryData: ProcessedSummary): AssemblyUICard[] {
  if ((<any>assemblyData).empty === true) assemblyData = [];
  if ((<any>complexDetails).empty === true) complexDetails = [];
  const assemblyCards: AssemblyUICard[] = [];
  const preferredAssemblyId = getPreferredAssemblyId(summaryData);
  let index = 0;

  for (const assemblyDatum of assemblyData) {
    const complexDetail = getComplexDetailByAssemblyId(assemblyDatum, complexDetails);
    const summaryAssemblyDatum = summaryData.assemblies.filter((summaryAssembly) => summaryAssembly.assembly_id === assemblyDatum.assembly_id)[0];

    const preferredWord = assemblyDatum.assembly_id === `${preferredAssemblyId}` ? ' (preferred)' : '';
    const complexName = complexDetail.name ? complexDetail.name : '';
    const form = summaryAssemblyDatum?.form;
    const name = summaryAssemblyDatum?.name;
    let mericity = form && name ? `${summaryAssemblyDatum.form} ${summaryAssemblyDatum.name}` : 'Not available';
    mericity = mericity.replace('homo monomer', 'monomer');

    assemblyCards.push({
      index,
      assemblyId: assemblyDatum.assembly_id,
      assemblyName: `Assembly ${assemblyDatum.assembly_id}${preferredWord}`,
      complexName: complexName,
      multimericStates: mericity,
    });
    index += 1;
  }
  return assemblyCards;
}

export function generateAssembliesTableFilters(summaryData: ProcessedSummary, assemblyData: AssemblyData[]): Filter[] {
  if ((<any>assemblyData).empty === true) assemblyData = [];
  const newFilters: Filter[] = [];
  const mericityCounts: { [key: string]: number } = {};

  // for each assembly, calculate it's mericity...
  for (const assemblyDatum of assemblyData) {
    const summaryAssemblyDatum = summaryData.assemblies.filter((summaryAssembly) => summaryAssembly.assembly_id === assemblyDatum.assembly_id)[0];

    const form = summaryAssemblyDatum?.form;
    const name = summaryAssemblyDatum?.name;
    let mericity = form && name ? `${summaryAssemblyDatum.form} ${summaryAssemblyDatum.name}` : 'Not available';
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
      description: `${mericity} (${mericityCount})`,
    });
  }

  // if filters contain only a single assembly mericity type and the 'All' filter...
  if (newFilters.length === 2) {
    //... remove the all filter
    newFilters.shift();
  }
  return newFilters;
}

export interface ProcessedAssembly {
  assemblyId: string;
  assemblyName: string;
  moleculeNames: string[];
  complexId?: string;
  complexName: string;
  multimericStates: string;
  additionalData: {
    accessibleSurfaceArea: string;
    buriedSurfaceArea: string;
    dissociationArea: string;
    dissociationEnergy: string;
    dissociationEntropy: string;
    symmetryNumber: string;
    interfaceCount: string;
  };
}

const ALLOWEDTYPES = ['polypeptide(L)', 'polypeptide(R)', 'polyribonucleotide', 'polydeoxyribonucleotide', 'polydeoxyribonucleotide/polyribonucleotide hybrid'];

function formatPisaValue(valueType: 'area' | 'energy' | 'other', value: string | number | undefined | null) {
  if (valueType === 'area') return value != null ? `${Math.round(value as number)} Å²` : 'Not available';
  else if (valueType === 'energy') return value != null ? `${value} kcal/mol` : 'Not available';
  else return value != null ? `${value}` : 'Not available';
}

export function generateProcessedAssemblies(
  assemblyData: AssemblyData[],
  complexDetails: ComplexDetails[],
  summaryData: ProcessedSummary,
  pisaAssemblyData: PisaAssembly[]
) {
  if ((<any>assemblyData).empty === true) return [];
  if ((<any>complexDetails).empty === true) complexDetails = [];
  if ((<any>pisaAssemblyData).empty === true) pisaAssemblyData = [];

  const listProcessedAssemblies: ProcessedAssembly[] = [];
  const preferredAssemblyId = getPreferredAssemblyId(summaryData);
  for (const assemblyDatum of assemblyData) {
    // first we link assembly data to complexDetails data by assembly_id
    const complexDetail = getComplexDetailByAssemblyId(assemblyDatum, complexDetails);

    // ... we do the same for summary assembly data
    const summaryAssemblyDatum = summaryData.assemblies.filter((summaryAssembly) => summaryAssembly.assembly_id === assemblyDatum.assembly_id)[0];

    // ... we do the same for pisa assembly data
    const pisaAssemblyDatum = pisaAssemblyData.filter((pisaAssembly) => pisaAssembly.assembly_id === assemblyDatum.assembly_id)[0];

    // ... we then generate some necessary row data by processing fields of the above
    const preferredWord = assemblyDatum.assembly_id === `${preferredAssemblyId}` ? ' (preferred)' : '';
    let moleculeNames = assemblyDatum.entities.filter((mol) => ALLOWEDTYPES.indexOf(mol.molecule_type) > -1).map((assembly) => assembly.molecule_name[0]);
    if (moleculeNames.length > 5) {
      moleculeNames = [`${moleculeNames.length} molecules`];
    }
    const hasComplexId = complexDetail?.pdb_complex_id && complexDetail?.pdb_complex_id.length > 0;
    const complexId = hasComplexId ? complexDetail?.pdb_complex_id : undefined;
    const complexName = complexDetail?.name ? complexDetail?.name : '';
    const form = summaryAssemblyDatum?.form;
    const name = summaryAssemblyDatum?.name;
    let mericity = form && name ? `${summaryAssemblyDatum.form} ${summaryAssemblyDatum.name}` : 'Not available';
    mericity = mericity.replace('homo monomer', 'monomer');

    // ... and finally push all necessary data for rendering a row
    listProcessedAssemblies.push({
      assemblyId: assemblyDatum.assembly_id,
      assemblyName: `Assembly ${assemblyDatum.assembly_id}${preferredWord}`,
      moleculeNames: moleculeNames,
      complexId: complexId,
      complexName: complexName,
      multimericStates: mericity,
      additionalData: {
        accessibleSurfaceArea: formatPisaValue('area', pisaAssemblyDatum?.assembly?.accessible_surface_area),
        buriedSurfaceArea: formatPisaValue('area', pisaAssemblyDatum?.assembly?.buried_surface_area),
        dissociationArea: formatPisaValue('area', pisaAssemblyDatum?.assembly?.dissociation_area),
        dissociationEnergy: formatPisaValue('energy', pisaAssemblyDatum?.assembly?.dissociation_energy),
        dissociationEntropy: formatPisaValue('energy', pisaAssemblyDatum?.assembly?.entropy),
        symmetryNumber: formatPisaValue('other', pisaAssemblyDatum?.assembly?.symmetry_number),
        interfaceCount: formatPisaValue('other', pisaAssemblyDatum?.assembly?.interface_count),
      },
    });
  }
  return listProcessedAssemblies;
}
