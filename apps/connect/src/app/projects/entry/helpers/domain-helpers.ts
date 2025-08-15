import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { DomainsBoundaries } from '../data-classes/data-models-and-definitions/row-and-table.model';
import { DomainMapping } from '../data-models/domains.model';
import { ObservedSegments, PolymerCoverageMolecule } from '../data-models/polymer-coverage.model';

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
  const molstarSelection: QueryParam[] = [];
  const segmentsBoundaries: DomainsBoundaries[] = [];

  // Map PolymerCoverage for quick lookup
  const coverageMap = new Map<string, ObservedSegments[]>();

  for (const molecule of polymerCoverage) {
    for (const chain of molecule.chains) {
      const key = `${molecule.entity_id}_${chain.chain_id}`;
      coverageMap.set(key, chain.observed);
    }
  }

  const mappingsByChain = mappings.sort();
  let prevChain = 'undef';

  for (const mapping of mappingsByChain) {
    const key = `${mapping.entity_id}_${mapping.chain_id}`;
    const observedSegments = coverageMap.get(key) || [];

    if (observedSegments.length === 0) continue;

    let firstRes = {
      residue_number: mapping.start.residue_number,
      // author_residue_number: mapping.start.author_residue_number?.toString() || '',
      author_residue_number: mapping.start.author_residue_number || undefined,
      // author_insertion_code: mapping.start.author_insertion_code || '',
      author_insertion_code: mapping.start.author_insertion_code || undefined,
    };

    if (mapping.start.author_residue_number === null) {
      // Find first observed residue >= start.residue_number
      const firstObserved = observedSegments.find((seg) => seg.start.residue_number >= mapping.start.residue_number);
      if (!firstObserved) continue;

      firstRes = {
        residue_number: firstObserved.start.residue_number,
        // author_residue_number: firstObserved.start.author_residue_number.toString(),
        author_residue_number: firstObserved.start.author_residue_number || undefined,
        // author_insertion_code: firstObserved.start.author_insertion_code || '',
        author_insertion_code: firstObserved.start.author_insertion_code || undefined,
      };
    }

    let lastRes = {
      residue_number: mapping.end.residue_number,
      // author_residue_number: mapping.end.author_residue_number?.toString() || '',
      author_residue_number: mapping.end.author_residue_number || undefined,
      // author_insertion_code: mapping.end.author_insertion_code || '',
      author_insertion_code: mapping.end.author_insertion_code || undefined,
    };

    if (mapping.end.author_residue_number === null) {
      // Find last observed residue <= end.residue_number
      const lastObserved = [...observedSegments].reverse().find((seg) => seg.end.residue_number <= mapping.end.residue_number);
      if (!lastObserved) continue;

      lastRes = {
        residue_number: lastObserved.end.residue_number,
        // author_residue_number: lastObserved.end.author_residue_number.toString(),
        author_residue_number: lastObserved.end.author_residue_number || undefined,
        // author_insertion_code: lastObserved.end.author_insertion_code || '',
        author_insertion_code: lastObserved.end.author_insertion_code || undefined,
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

    segments.push(
      `${chainIdPrefix} ${firstRes.author_residue_number}${firstRes.author_insertion_code || ''} - ${lastRes.author_residue_number}${
        lastRes.author_insertion_code || ''
      }`
    );
    segmentsResidNumber.push(`${chainIdPrefix} ${firstRes.residue_number} - ${lastRes.residue_number}`);
    segmentsBoundaries.push({
      chain: mapping.chain_id,
      entity: mapping.entity_id,
      start: firstRes.residue_number,
      end: lastRes.residue_number,
    });

    prevChain = mapping.chain_id;
  }

  return {
    molstarSelection,
    segmentsBoundaries,
    segments,
    segmentsResidNumber,
  };
}
