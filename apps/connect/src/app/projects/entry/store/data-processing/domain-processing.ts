import { CathMappings, DomainMapping, PfamMappings, ScopMappings } from '../../data-models/domains.model';
import { ObservedSegments, PolymerCoverageMolecule } from '../../data-models/polymer-coverage.model';
import { Filter } from './models/other-models';
import { Molecule } from '../../data-models/molecule.model';
import { FILTERED_KELLY22_COLORBLIND_SCALE } from '../../entry-constant';
import { DomainsBoundaries, ProcessedDomain, ProcessedMacromolecule } from './models/processed-entities.model';
import { AssemblyData } from '../../data-models/assembly.model';
import { QueryParamForHelpers } from '../../helpers/molstar-helpers';
import { getCleanMoleculeName } from '../../helpers/processed-data-to-controls';

export function formatSegmentsAsText(segments: string[]) {
  const segmentsAsText = segments
    .map((seg, i) => {
      const isFirstSeg = i === 0;
      const hasChainId = seg[0] !== ' ';
      if (hasChainId && isFirstSeg) return `Chain ${seg}`;
      else if (hasChainId && isFirstSeg === false) return `\nChain ${seg}`;
      else return seg.replace('  ', ' ');
    })
    .join(',');
  return segmentsAsText;
}

function safeAuthRes(num?: number | null) {
  return num === undefined || num === null ? undefined : num;
}

function safeAuthStr(num?: string | null) {
  return num === undefined || num === null ? undefined : num;
}

export function sortByBooleanFlag<T extends Record<string, any[]>>(arrays: T, flagKey: keyof T): T {
  const keys = Object.keys(arrays) as (keyof T)[];
  const length = arrays[flagKey].length;

  type Row = { originalIndex: number } & { [P in keyof T]: T[P][number] };

  // Zip into objects
  const zipped: Row[] = Array.from({ length }, (_, i) => {
    const row: any = { originalIndex: i };
    keys.forEach((k) => {
      row[k] = arrays[k][i];
    });
    return row as Row;
  });

  // Stable sort: true first, preserving order
  zipped.sort((a, b) => {
    const flagA = a[flagKey] as boolean;
    const flagB = b[flagKey] as boolean;

    if (flagA === flagB) return a.originalIndex - b.originalIndex;
    return flagA ? -1 : 1;
  });

  // Unzip back
  const result = {} as T;
  keys.forEach((k) => {
    result[k] = zipped.map((z) => z[k]) as T[typeof k];
  });

  return result;
}

/**
 * This function gets domain mappings in a unified format
 * and processes them so only observed domain segments are taken into account
 * it then returns:
 * 1 - molstarSelection objects for easy manipulation of domains in Molstat
 * 2 - boundaries, segments and segmentsResidNumber objects  used for generating domain sequences
 * and linking domains from top tabs to bottom tabs
 *
 * NOTE:
 * An extra field added to Mappings endpoints could eliminate the need for this function
 *
 * @param mappings: initial domain mappings from API endpoints
 * @param molstarResidueInfo: list of residues observed in Molstar instance
 */
export function formatSegmentsWithCoverage(mappings: DomainMapping[], polymerCoverage: PolymerCoverageMolecule[]) {
  const segments: string[] = [];
  const segmentsResidNumber: string[] = [];
  const molstarSelection: QueryParamForHelpers[] = [];
  const segmentsBoundaries: DomainsBoundaries[] = [];
  const segmentsInPrefAssembly: boolean[] = [];
  const segmentsEntityIds: number[] = [];
  const segmentsStructAsymId: string[] = [];

  // Map PolymerCoverage for quick lookup
  const coverageMap = new Map<string, ObservedSegments[]>();
  const inPrefAssemblyMap = new Map<string, boolean>();

  for (const molecule of polymerCoverage) {
    for (let chainIdx = 0; chainIdx < molecule.chains.length; chainIdx++) {
      const chain = molecule.chains[chainIdx];
      const key = `${molecule.entity_id}_${chain.chain_id}`;
      coverageMap.set(key, chain.observed);
      const inPrefAssembly = molecule.in_chains_in_pref_assembly ? molecule.in_chains_in_pref_assembly[chainIdx] : false;
      inPrefAssemblyMap.set(key, inPrefAssembly);
    }
  }

  const mappingsByChain = mappings.sort();
  let prevChain = 'undef';

  for (const mapping of mappingsByChain) {
    const key = `${mapping.entity_id}_${mapping.chain_id}`;
    const observedSegments = coverageMap.get(key) || [];

    if (observedSegments.length === 0) continue;

    const isInPrefAssembly = inPrefAssemblyMap.get(key) || false;

    let firstRes = {
      residue_number: mapping.start.residue_number,
      // author_residue_number: mapping.start.author_residue_number?.toString() || '',
      author_residue_number: safeAuthRes(mapping.start.author_residue_number),
      // author_insertion_code: mapping.start.author_insertion_code || '',
      author_insertion_code: safeAuthStr(mapping.start.author_insertion_code),
    };

    if (mapping.start.author_residue_number === null) {
      // Find first observed residue >= start.residue_number
      const firstObserved = observedSegments.find((seg) => seg.start.residue_number >= mapping.start.residue_number);
      if (!firstObserved) continue;

      firstRes = {
        residue_number: firstObserved.start.residue_number,
        // author_residue_number: firstObserved.start.author_residue_number.toString(),
        author_residue_number: safeAuthRes(firstObserved.start.author_residue_number),
        // author_insertion_code: firstObserved.start.author_insertion_code || '',
        author_insertion_code: safeAuthStr(firstObserved.start.author_insertion_code),
      };
    }

    let lastRes = {
      residue_number: mapping.end.residue_number,
      // author_residue_number: mapping.end.author_residue_number?.toString() || '',
      author_residue_number: safeAuthRes(mapping.end.author_residue_number),
      // author_insertion_code: mapping.end.author_insertion_code || '',
      author_insertion_code: safeAuthStr(mapping.end.author_insertion_code),
    };

    if (mapping.end.author_residue_number === null) {
      // Find last observed residue <= end.residue_number
      const lastObserved = [...observedSegments].reverse().find((seg) => seg.end.residue_number <= mapping.end.residue_number);
      if (!lastObserved) continue;

      lastRes = {
        residue_number: lastObserved.end.residue_number,
        // author_residue_number: lastObserved.end.author_residue_number.toString(),
        author_residue_number: safeAuthRes(lastObserved.end.author_residue_number),
        // author_insertion_code: lastObserved.end.author_insertion_code || '',
        author_insertion_code: safeAuthStr(lastObserved.end.author_insertion_code),
      };
    }

    const chainIdPrefix = mapping.chain_id !== prevChain ? `${mapping.chain_id}:` : ' ';

    // molstarSelection.residues.push({
    molstarSelection.push({
      entity_id: mapping.entity_id.toString(),
      auth_asym_id: mapping.chain_id,
      start_residue_number: firstRes.residue_number,
      start_auth_residue_number: firstRes.author_residue_number,
      start_auth_ins_code_id: firstRes.author_insertion_code,
      end_residue_number: lastRes.residue_number,
      end_auth_residue_number: lastRes.author_residue_number,
      end_auth_ins_code_id: lastRes.author_insertion_code,
    });

    const firstResAuthStr = firstRes.author_residue_number === undefined ? '?' : String(firstRes.author_residue_number);
    const lastResAuthStr = lastRes.author_residue_number === undefined ? '?' : String(lastRes.author_residue_number);

    if (firstRes.author_residue_number === undefined) console.warn(`Warn: domain with undefined start auth numbering found`);
    if (lastRes.author_residue_number === undefined) console.warn(`Warn: domain with undefined end auth numbering found`);

    segmentsInPrefAssembly.push(isInPrefAssembly);
    segments.push(`${chainIdPrefix} ${firstResAuthStr}${firstRes.author_insertion_code || ''} - ${lastResAuthStr}${lastRes.author_insertion_code || ''}`);
    segmentsResidNumber.push(`${chainIdPrefix} ${firstRes.residue_number} - ${lastRes.residue_number}`);
    segmentsBoundaries.push({
      chain: mapping.chain_id,
      entity: mapping.entity_id,
      start: firstRes.residue_number,
      end: lastRes.residue_number,
    });
    segmentsEntityIds.push(mapping.entity_id);
    segmentsStructAsymId.push(mapping.struct_asym_id);

    prevChain = mapping.chain_id;
  }

  // sort by segmentsInPrefAssembly true
  const sorted = sortByBooleanFlag(
    {
      molstarSelection,
      segmentsBoundaries,
      segments,
      segmentsResidNumber,
      segmentsInPrefAssembly,
      segmentsEntityIds,
      segmentsStructAsymId,
    },
    'segmentsInPrefAssembly'
  );

  return sorted;
}

function filterMappingObservedWithCoverage(domainMappings: DomainMapping[], polymerCoverage: PolymerCoverageMolecule[]): number[] {
  const observedLengths: number[] = [];

  // Create lookup map for faster access
  const coverageMap = new Map<string, ObservedSegments[]>();

  for (const molecule of polymerCoverage) {
    for (const chain of molecule.chains) {
      const key = `${molecule.entity_id}_${chain.chain_id}`;
      coverageMap.set(key, chain.observed);
    }
  }

  for (const mapping of domainMappings) {
    const key = `${mapping.entity_id}_${mapping.chain_id}`;
    const observedSegments = coverageMap.get(key) || [];

    // Find observed segments that overlap with the domain mapping
    const overlappingSegments = observedSegments.filter((segment) => {
      const observedStart = segment.start.residue_number;
      const observedEnd = segment.end.residue_number;

      return mapping.start.residue_number <= observedEnd && mapping.end.residue_number >= observedStart;
    });

    if (overlappingSegments.length > 0) {
      // Calculate total observed length within the mapping range
      let totalObserved = 0;

      for (const segment of overlappingSegments) {
        // Clamp observed segment to domain mapping boundaries
        const clampedStart = Math.max(segment.start.residue_number, mapping.start.residue_number);
        const clampedEnd = Math.min(segment.end.residue_number, mapping.end.residue_number);

        totalObserved += clampedEnd - clampedStart + 1;
      }

      observedLengths.push(totalObserved);
    }
  }

  return observedLengths;
}

export interface DomainUICard {
  index: number;
  domainId: string;
  accessionName: string;
  inPrefAssembly: boolean;
  resource: string;
  accession: string;
  segmentsAsText: string;
}

export function generateDomainsCards(
  cathMappings: CathMappings,
  scopMappings: ScopMappings,
  pfamMappings: PfamMappings,
  polymerCoverage: PolymerCoverageMolecule[]
): DomainUICard[] {
  let index = 0;
  let domainCards: DomainUICard[] = [];
  if ((<any>pfamMappings).empty === true) pfamMappings = {};
  if ((<any>cathMappings).empty === true) cathMappings = {};
  if ((<any>scopMappings).empty === true) scopMappings = {};
  if ((<any>polymerCoverage).empty === true) polymerCoverage = [];
  // first we parse domains from CATH resource
  for (const [cathAccession, data] of Object.entries(cathMappings)) {
    // domain names in CATH are unique 'domain' fields inside mappings
    const accessionName = data.homology;

    const domainIds = data.mappings.map((mapping) => mapping.domain!).filter((domainId, idx, ids) => ids.indexOf(domainId) === idx);

    // for each unique cath domain ...
    for (const domainId of domainIds) {
      // ... we filter all domain segments that map to this domain name
      const mappings = data.mappings.filter((mapping) => mapping.domain! === domainId);

      // ... and use the formatSegments function to get:
      // 1 - molstarSelections to each cath domain (molstarSelection)
      // 2 - segment data (chain, label_seq_id start and end residues numbered by ) for each cath domain (segmentsBoundaries)
      // 3 - text formatted segment data (chain, auth_seq_id start and end residues) for each cath domain (segments)
      // 4 - text formatted segment data (chain, label_seq_id start and end residues) for each cath domain (segmentsResidNumber)
      // 5 - true or false list to whether domain segment is part of preferred assembly (segmentsInPrefAssembly)
      const segmentData = formatSegmentsWithCoverage(mappings, polymerCoverage);

      // ... if domain contains observed segments we format those as text
      if (segmentData.segments.length === 0) continue;
      const segmentsAsText = formatSegmentsAsText(segmentData.segments);

      // ... we also check whether all domain segments are in pref assembly for warning messages
      const inPrefAssembly = !segmentData.segmentsInPrefAssembly.some((v) => v === false);

      domainCards.push({
        index,
        domainId,
        accessionName,
        inPrefAssembly,
        resource: 'CATH',
        accession: cathAccession,
        segmentsAsText,
      });
      index += 1;
    }
  }

  // parse SCOP 1.75 domains
  for (const [scopAccession, data] of Object.entries(scopMappings)) {
    // domain names in SCOP 1.75 are unique 'scop_id' fields inside mappings
    const accessionName = data.description;
    const domainIds = data.mappings.map((mapping) => mapping.scop_id!).filter((domainId, idx, ids) => ids.indexOf(domainId) === idx);

    // for each unique SCOP 1.75 domain ...
    for (const domainId of domainIds) {
      // ... we filter all domain segments that map to this domain name
      const mappings = data.mappings.filter((mapping) => mapping.scop_id! === domainId);

      // ... and use the formatSegments function to get:
      // 1 - molstarSelections to each cath domain (molstarSelection)
      // 2 - segment data (chain, label_seq_id start and end residues numbered by ) for each cath domain (segmentsBoundaries)
      // 3 - text formatted segment data (chain, auth_seq_id start and end residues) for each cath domain (segments)
      // 4 - text formatted segment data (chain, label_seq_id start and end residues) for each cath domain (segmentsResidNumber)
      // 5 - true or false list to whether domain segment is part of preferred assembly (segmentsInPrefAssembly)
      const segmentData = formatSegmentsWithCoverage(mappings, polymerCoverage);

      // ... if domain contains observed segments we format those as text
      if (segmentData.segments.length === 0) continue;

      const segmentsAsText = formatSegmentsAsText(segmentData.segments);

      // ... we also check whether all domain segments are in pref assembly for warning messages
      const inPrefAssembly = !segmentData.segmentsInPrefAssembly.some((v) => v === false);

      domainCards.push({
        index,
        domainId,
        accessionName,
        inPrefAssembly,
        resource: 'SCOP',
        accession: scopAccession,
        segmentsAsText,
      });
      index += 1;
    }
  }

  // parse Pfam domains json structure
  for (const [pfamAccession, data] of Object.entries(pfamMappings)) {
    const accessionName = data.description;

    // Pfam domain data is structured a bit differently than others
    // Here each mapping corresponds to one domain definition
    for (let i = 0; i < data.mappings.length; i++) {
      const mapping = data.mappings[i];
      const domainId = `${pfamAccession}-${i + 1}`;

      // ... and use the formatSegments function to get:
      // 1 - molstarSelections to each cath domain (molstarSelection)
      // 2 - segment data (chain, label_seq_id start and end residues numbered by ) for each cath domain (segmentsBoundaries)
      // 3 - text formatted segment data (chain, auth_seq_id start and end residues) for each cath domain (segments)
      // 4 - text formatted segment data (chain, label_seq_id start and end residues) for each cath domain (segmentsResidNumber)
      // 5 - true or false list to whether domain segment is part of preferred assembly (segmentsInPrefAssembly)
      const segmentData = formatSegmentsWithCoverage([mapping], polymerCoverage);

      // ... if domain contains observed segments we format those as text
      if (segmentData.segments.length === 0) continue;
      const segmentsAsText = formatSegmentsAsText(segmentData.segments);

      // ... we also check whether all domain segments are in pref assembly for warning messages
      const inPrefAssembly = !segmentData.segmentsInPrefAssembly.some((v) => v === false);

      domainCards.push({
        index,
        domainId,
        accessionName,
        inPrefAssembly,
        resource: 'Pfam',
        accession: pfamAccession,
        segmentsAsText,
      });
      index += 1;
    }
  }

  domainCards.sort((a, b) => Number(!a.inPrefAssembly) - Number(!b.inPrefAssembly));
  domainCards = domainCards.map((card, i) => {
    return {
      ...card,
      index: i,
    };
  });
  return domainCards;
}

export function generateDomainsTableFilters(
  cathMappings: CathMappings,
  scopMappings: ScopMappings,
  pfamMappings: PfamMappings,
  polymerCoverage: PolymerCoverageMolecule[]
): Filter[] {
  if ((<any>pfamMappings).empty === true) pfamMappings = {};
  if ((<any>cathMappings).empty === true) cathMappings = {};
  if ((<any>scopMappings).empty === true) scopMappings = {};
  if ((<any>polymerCoverage).empty === true) polymerCoverage = [];
  const newFilters: Filter[] = [];
  // first for cath we count the number of unique domain accessions that exist
  let cathDomainCount = 0;
  for (const [_resourceAcc, data] of Object.entries(cathMappings)) {
    const domainIds: string[] = [];
    for (const mapping of data.mappings) {
      // ... for this we have to check whether the API residues exist in Molstar (this.molstarResidueInfo)
      // const filteredCathMapping = this.filterMappingObserved([mapping], this.molstarResidueInfo);
      const filteredCathMapping = filterMappingObservedWithCoverage([mapping], polymerCoverage);
      if (filteredCathMapping.length === 0) continue;

      if (domainIds.indexOf(mapping.domain!) === -1) {
        domainIds.push(mapping.domain!);
      }
    }
    cathDomainCount += domainIds.length;
  }

  let scopDomainCount = 0;
  // for SCOP 1.75 we also count the number of unique domain accessions that exist
  for (const [_resourceAcc, data] of Object.entries(scopMappings)) {
    const domainIds: string[] = [];
    for (const mapping of data.mappings) {
      // ... for this we have to check whether the API residues exist in Molstar (this.molstarResidueInfo)
      // const filteredScopMapping = this.filterMappingObserved([mapping], this.molstarResidueInfo);
      const filteredScopMapping = filterMappingObservedWithCoverage([mapping], polymerCoverage);
      if (filteredScopMapping.length === 0) continue;

      if (domainIds.indexOf(mapping.scop_id!) === -1) {
        domainIds.push(mapping.scop_id!);
      }
    }
    scopDomainCount += domainIds.length;
  }

  let pfamDomainCount = 0;
  // for Pfam we also count the number of unique domain accessions that exist
  for (const [_resourceAcc, data] of Object.entries(pfamMappings)) {
    // ... for this we have to check whether the API residues exist in Molstar (this.molstarResidueInfo)
    // const filteredPfamMappings = this.filterMappingObserved(data.mappings, this.molstarResidueInfo);
    const filteredPfamMappings = filterMappingObservedWithCoverage(data.mappings, polymerCoverage);
    pfamDomainCount += filteredPfamMappings.length;
  }

  // we create an All filter that contains all domains for all resources
  newFilters.push({
    types: ['CATH', 'SCOP', 'Pfam'],
    // description: `All (${pfamDomainCount + cathDomainCount + scopDomainCount} domains)`,
    description: `All`,
  });
  // ... and add specific resource filter if they have at least one existing domain
  if (cathDomainCount > 0) {
    newFilters.push({
      types: ['CATH'],
      description: `${cathDomainCount} CATH`,
    });
  }
  if (scopDomainCount > 0) {
    newFilters.push({
      types: ['SCOP'],
      description: `${scopDomainCount} SCOP 1.75`,
    });
  }
  if (pfamDomainCount > 0) {
    newFilters.push({
      types: ['Pfam'],
      description: `${pfamDomainCount} Pfam`,
    });
  }
  // if filters contain only a single macromolecule type and the 'All' filter...
  if (newFilters.length === 2) {
    //... remove the all filter
    newFilters.shift();
  }
  return newFilters;
}

export function generateSymmetryOperatorsDictForDomain(segmentsEntityIds: number[], segmentsStructAsymIds: string[], preferredAssembly: AssemblyData) {
  const segmentsSymmOperators: string[][] = [];
  for (let iSeg = 0; iSeg < segmentsEntityIds.length; iSeg++) {
    const segmentEntityId = segmentsEntityIds[iSeg];
    const segmentStructAsymId = segmentsStructAsymIds[iSeg];
    const currentSegmentSymmOperators: string[] = [];
    const assemblyEntityOfMacromolSearch = preferredAssembly.entities.filter((ent) => ent.entity_id === segmentEntityId);
    if (assemblyEntityOfMacromolSearch.length === 0) {
      segmentsSymmOperators.push([]);
      continue;
    } else if (assemblyEntityOfMacromolSearch.length > 1) console.warn('Warning: multiple assembly entities found for single macromolecule');
    const assemblyEntityOfMacromol = assemblyEntityOfMacromolSearch[0];

    const hasSymmetryOp = !assemblyEntityOfMacromol.in_chains.every((chainidWithOp) => chainidWithOp.includes('-') === false);
    if (hasSymmetryOp === false) {
      segmentsSymmOperators.push([]);
      continue;
    }

    const prefAssemblyStructAsymsForSegment = assemblyEntityOfMacromol.in_chains.filter(
      (structAsymIdWithOp) => structAsymIdWithOp.split('-')[0] === segmentStructAsymId
    );

    const noStructAsymsWithOp = prefAssemblyStructAsymsForSegment.length === 0;
    const onlyCurrentChainId = prefAssemblyStructAsymsForSegment.length === 1 && prefAssemblyStructAsymsForSegment[0] === segmentStructAsymId;
    const onlyCurrentChainWithOp = prefAssemblyStructAsymsForSegment.length === 1 && prefAssemblyStructAsymsForSegment[0] !== segmentStructAsymId;

    if (noStructAsymsWithOp || onlyCurrentChainId) {
      segmentsSymmOperators.push([]);
      continue;
    }
    if (onlyCurrentChainWithOp) {
      const symmetryOperator = prefAssemblyStructAsymsForSegment[0].split('-')[1];
      segmentsSymmOperators.push([`ASM-${symmetryOperator}`]);
      continue;
    }
    // All for default selection
    currentSegmentSymmOperators.push('All');

    // add each operator to list
    for (const structAsymIdWithOp of prefAssemblyStructAsymsForSegment) {
      const symmetryOperator = structAsymIdWithOp === segmentStructAsymId ? '1' : structAsymIdWithOp.split('-')[1];
      currentSegmentSymmOperators.push(`ASM-${symmetryOperator}`);
    }
    segmentsSymmOperators.push(currentSegmentSymmOperators);
  }
  return segmentsSymmOperators;
}

export function generateProcessedDomains(
  cathMappings: CathMappings,
  scopMappings: ScopMappings,
  pfamMappings: PfamMappings,
  polymerCoverage: PolymerCoverageMolecule[],
  macromolecules: Molecule[],
  preferredAssembly: AssemblyData
) {
  if ((<any>pfamMappings).empty === true) pfamMappings = {};
  if ((<any>cathMappings).empty === true) cathMappings = {};
  if ((<any>scopMappings).empty === true) scopMappings = {};
  if ((<any>polymerCoverage).empty === true) polymerCoverage = [];
  let listProcessedDomains: ProcessedDomain[] = [];
  // first we parse domains from CATH resource
  for (const [resourceAcc, data] of Object.entries(cathMappings)) {
    // domain names in CATH are unique 'domain' fields inside mappings
    const domainDesc = data.homology;
    const domainNames = data.mappings.map((mapping) => mapping.domain!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);

    // for each unique cath domain ...
    for (const domainName of domainNames) {
      // ... we filter all domain segments that map to this domain name
      const mappings = data.mappings.filter((mapping) => mapping.domain! === domainName);

      // we get some data needed to be rendered in the table
      const entityIds = mappings.map((mapping) => mapping.entity_id).filter((entityId, idx, ids) => ids.indexOf(entityId) === idx);
      const moleculeNames = macromolecules.filter((mol) => entityIds.indexOf(mol.entity_id) > -1).map((mol) => getCleanMoleculeName(mol));

      // ... and use the formatSegments function to get:
      // 1 - molstarSelections to each cath domain (molstarSelection)
      // 2 - segment data (chain, label_seq_id start and end residues numbered by ) for each cath domain (segmentsBoundaries)
      // 3 - text formatted segment data (chain, auth_seq_id start and end residues) for each cath domain (segments)
      // 4 - text formatted segment data (chain, label_seq_id start and end residues) for each cath domain (segmentsResidNumber)
      // 5 - true or false list to whether domain segment is part of preferred assembly (segmentsInPrefAssembly)
      const segmentData = formatSegmentsWithCoverage(mappings, polymerCoverage);

      // ... if domain contains observed segments we format those as text
      if (segmentData.segments.length === 0) continue;
      const segmentsAsText = formatSegmentsAsText(segmentData.segments);

      // get list
      const segmentsEntityIds = segmentData.segmentsEntityIds;
      const segmentsStructAsymId = segmentData.segmentsStructAsymId;
      const symmOpListForSegments = generateSymmetryOperatorsDictForDomain(segmentsEntityIds, segmentsStructAsymId, preferredAssembly);

      // ... we also check whether all domain segments are in pref assembly for warning messages
      const allSegmentsInPrefAssembly = !segmentData.segmentsInPrefAssembly.some((v) => v === false);

      listProcessedDomains.push({
        // domainName: `${domainDesc} (${resourceAcc})`,
        accessionName: domainDesc,
        resource: 'CATH',
        domain: domainName,
        moleculeNames,
        segments: segmentData.segments,
        segmentsAsText,
        allSegmentsInPrefAssembly,
        symmOpListForSegments,
        additionalData: {
          accession: resourceAcc,
          selections: [segmentData.molstarSelection],
          selectionNames: [`Segments of domain`],
          boundaries: segmentData.segmentsBoundaries,
          segmentsResidNumbers: segmentData.segmentsResidNumber,
          selectionsInPrefAssembly: segmentData.segmentsInPrefAssembly,
        },
      });
    }
  }

  // parse SCOP 1.75 domains
  for (const [resourceAcc, data] of Object.entries(scopMappings)) {
    // domain names in SCOP 1.75 are unique 'scop_id' fields inside mappings
    const domainDesc = data.description;
    const domainNames = data.mappings.map((mapping) => mapping.scop_id!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);

    // for each unique SCOP 1.75 domain ...
    for (const domainName of domainNames) {
      // ... we filter all domain segments that map to this domain name
      const mappings = data.mappings.filter((mapping) => mapping.scop_id! === domainName);

      // we get some data needed to be rendered in the table
      const entityIds = mappings.map((mapping) => mapping.entity_id).filter((entityId, idx, ids) => ids.indexOf(entityId) === idx);
      const moleculeNames = macromolecules.filter((mol) => entityIds.indexOf(mol.entity_id) > -1).map((mol) => getCleanMoleculeName(mol));

      // ... and use the formatSegments function to get:
      // 1 - molstarSelections to each cath domain (molstarSelection)
      // 2 - segment data (chain, label_seq_id start and end residues numbered by ) for each cath domain (segmentsBoundaries)
      // 3 - text formatted segment data (chain, auth_seq_id start and end residues) for each cath domain (segments)
      // 4 - text formatted segment data (chain, label_seq_id start and end residues) for each cath domain (segmentsResidNumber)
      // 5 - true or false list to whether domain segment is part of preferred assembly (segmentsInPrefAssembly)
      const segmentData = formatSegmentsWithCoverage(mappings, polymerCoverage);

      // ... if domain contains observed segments we format those as text
      if (segmentData.segments.length === 0) continue;
      const segmentsAsText = formatSegmentsAsText(segmentData.segments);

      const segmentsEntityIds = segmentData.segmentsEntityIds;
      const segmentsStructAsymId = segmentData.segmentsStructAsymId;
      const symmOpListForSegments = generateSymmetryOperatorsDictForDomain(segmentsEntityIds, segmentsStructAsymId, preferredAssembly);

      // ... we also check whether all domain segments are in pref assembly for warning messages
      const allSegmentsInPrefAssembly = !segmentData.segmentsInPrefAssembly.some((v) => v === false);

      listProcessedDomains.push({
        // domainName: `${domainDesc} (${resourceAcc})`,
        accessionName: domainDesc,
        resource: 'SCOP',
        domain: domainName,
        moleculeNames,
        segments: segmentData.segments,
        segmentsAsText,
        allSegmentsInPrefAssembly,
        symmOpListForSegments,
        additionalData: {
          accession: resourceAcc,
          selections: [segmentData.molstarSelection],
          selectionNames: [`Segments of domain`],
          boundaries: segmentData.segmentsBoundaries,
          segmentsResidNumbers: segmentData.segmentsResidNumber,
          selectionsInPrefAssembly: segmentData.segmentsInPrefAssembly,
        },
      });
    }
  }

  // parse Pfam domains json structure
  for (const [resourceAcc, data] of Object.entries(pfamMappings)) {
    const domainDesc = data.description;

    // Pfam domain data is structured a bit differently than others
    // Here each mapping corresponds to one domain definition
    for (let i = 0; i < data.mappings.length; i++) {
      const mapping = data.mappings[i];
      const domain = `${resourceAcc}-${i + 1}`;

      // we get some data needed to be rendered in the table
      const moleculeNames = macromolecules.filter((mol) => mapping.entity_id === mol.entity_id).map((mol) => getCleanMoleculeName(mol));

      // ... and use the formatSegments function to get:
      // 1 - molstarSelections to each cath domain (molstarSelection)
      // 2 - segment data (chain, label_seq_id start and end residues numbered by ) for each cath domain (segmentsBoundaries)
      // 3 - text formatted segment data (chain, auth_seq_id start and end residues) for each cath domain (segments)
      // 4 - text formatted segment data (chain, label_seq_id start and end residues) for each cath domain (segmentsResidNumber)
      // 5 - true or false list to whether domain segment is part of preferred assembly (segmentsInPrefAssembly)
      const segmentData = formatSegmentsWithCoverage([mapping], polymerCoverage);

      // ... if domain contains observed segments we format those as text
      if (segmentData.segments.length === 0) continue;
      const segmentsAsText = formatSegmentsAsText(segmentData.segments);

      const segmentsEntityIds = segmentData.segmentsEntityIds;
      const segmentsStructAsymId = segmentData.segmentsStructAsymId;
      const symmOpListForSegments = generateSymmetryOperatorsDictForDomain(segmentsEntityIds, segmentsStructAsymId, preferredAssembly);

      // ... we also check whether all domain segments are in pref assembly for warning messages
      const allSegmentsInPrefAssembly = !segmentData.segmentsInPrefAssembly.some((v) => v === false);

      listProcessedDomains.push({
        // domainName: `${domainDesc} (${resourceAcc})`,
        accessionName: domainDesc,
        resource: 'Pfam',
        domain: domain,
        moleculeNames: moleculeNames,
        segments: segmentData.segments,
        segmentsAsText,
        allSegmentsInPrefAssembly,
        symmOpListForSegments,
        additionalData: {
          accession: resourceAcc,
          selections: [segmentData.molstarSelection],
          selectionNames: [`Segments of domain`],
          boundaries: segmentData.segmentsBoundaries,
          segmentsResidNumbers: segmentData.segmentsResidNumber,
          selectionsInPrefAssembly: segmentData.segmentsInPrefAssembly,
        },
      });
    }
  }

  // add colors by domain accession
  const uniqueAccessions = [...new Set(listProcessedDomains.map((domain) => domain.accessionName))];
  listProcessedDomains = listProcessedDomains.map((domain) => {
    const domainColorIdx = uniqueAccessions.indexOf(domain.accessionName);
    domain.molstarColorHex = FILTERED_KELLY22_COLORBLIND_SCALE[domainColorIdx % FILTERED_KELLY22_COLORBLIND_SCALE.length];
    return domain;
  });

  listProcessedDomains.sort((a, b) => Number(!a.allSegmentsInPrefAssembly) - Number(!b.allSegmentsInPrefAssembly));
  return listProcessedDomains;
}

export type DomainsWithMacromolecules = { macromolecule: ProcessedMacromolecule; domains: ProcessedDomain[] }[];

export function processDomainsWithMacromolecules(macromoleculesData: ProcessedMacromolecule[], domainsData: ProcessedDomain[]): DomainsWithMacromolecules {
  const nestedMap = new Map<number, { macromolecule: ProcessedMacromolecule; domains: ProcessedDomain[] }>();

  for (const macromolecule of macromoleculesData) {
    const entityId = macromolecule.additionalData.molecule.entity_id;

    const domainsOfMacromolecule = domainsData.filter((eachDomain) => eachDomain.moleculeNames[0] === macromolecule.name.molecule);

    if (!nestedMap.has(entityId)) {
      nestedMap.set(entityId, { macromolecule, domains: [] });
    }

    for (const domainOfMacromolecule of domainsOfMacromolecule) {
      const currentDomainNames = nestedMap.get(entityId)!.domains.map((eachDomain) => eachDomain.domain);
      const domainNotInMap = currentDomainNames.indexOf(domainOfMacromolecule.domain) === -1;
      if (domainNotInMap) nestedMap.get(entityId)!.domains.push(domainOfMacromolecule);
    }
  }
  return Array.from(nestedMap.values());
}
