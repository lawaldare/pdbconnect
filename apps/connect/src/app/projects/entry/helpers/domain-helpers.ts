import { DomainsBoundaries } from '../components/shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { DomainMapping } from '../data-models/domains.model';
import { MolstarResidueInfo, MolstarSelectionObj } from './molstar/molstar-helpers';

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
export function formatSegments(mappings: DomainMapping[], molstarResidueInfo: MolstarResidueInfo[]) {
  // lists to be returned are initially empty
  const segments: string[] = [];
  const segmentsResidNumber: string[] = [];
  const molstarSelection: MolstarSelectionObj = {
    residues: [],
  };
  const segmentsBoundaries: DomainsBoundaries[] = [];

  // segments are sorted by chain
  const mappingsByChain = mappings.sort();
  let prevChain = 'undef';
  for (const mapping of mappingsByChain) {
    // we filter the molstar instance observed residues so they are from the same entity and chain of a mapping
    const residueListingChain = molstarResidueInfo.filter((residInfo) => {
      return (
        residInfo.label_entity_id &&
        residInfo.auth_asym_id &&
        residInfo.label_seq_id &&
        residInfo.auth_seq_id &&
        residInfo.label_entity_id === mapping.entity_id + '' &&
        residInfo.auth_asym_id === mapping.chain_id
      );
    });

    // we sort the molstar instance observed residues from the same entity and chain of a mapping so they are ordered from start to end
    const residuesOfChain = residueListingChain.sort((a, b) => a.label_seq_id! - b.label_seq_id!);

    const chainId = mapping.chain_id !== prevChain ? `${mapping.chain_id}:` : ' ';

    // we set the first residue to be equal to mapping start or the first observed residue above that
    let firstRes = {
      residue_number: mapping.start.residue_number,
      author_residue_number: mapping.start.author_residue_number + '',
      author_insertion_code: mapping.start.author_insertion_code,
    };
    if (mapping.start.author_residue_number === null) {
      const residuesOfChainAboveStart = residuesOfChain.filter((resid) => resid.label_seq_id! >= mapping.start.residue_number);
      // if no observed start residue can be found, we skip the mapping
      if (residuesOfChainAboveStart.length === 0) continue;
      firstRes = {
        residue_number: residuesOfChainAboveStart[0].label_seq_id!,
        author_residue_number: residuesOfChainAboveStart[0].auth_seq_id + '',
        author_insertion_code: residuesOfChainAboveStart[0].pdbx_PDB_ins_code || '',
      };
    }

    // we set the last residue to be equal to mapping end or the first observed residue before that
    let lastRes = {
      residue_number: mapping.end.residue_number,
      author_residue_number: mapping.end.author_residue_number + '',
      author_insertion_code: mapping.end.author_insertion_code,
    };
    if (mapping.end.author_residue_number === null) {
      const residuesOfChainBelowEnd = residuesOfChain.filter((resid) => resid.label_seq_id! <= mapping.end.residue_number);
      // if no observed end residue can be found, we skip the mapping
      if (residuesOfChainBelowEnd.length === 0) continue;
      lastRes = {
        residue_number: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].label_seq_id!,
        author_residue_number: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].auth_seq_id + '',
        author_insertion_code: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].pdbx_PDB_ins_code || '',
      };
    }

    // first and last residues are used to create important objects pushed to results
    molstarSelection.residues.push({
      entityId: mapping.entity_id + '',
      authChainId: mapping.chain_id,
      authBegin: firstRes.author_residue_number,
      authBeginIns: firstRes.author_insertion_code,
      authEnd: lastRes.author_residue_number,
      authEndIns: lastRes.author_insertion_code,
    });
    segments.push(`${chainId} ${firstRes.author_residue_number}${firstRes.author_insertion_code} - ${lastRes.author_residue_number}${lastRes.author_insertion_code}`);
    segmentsResidNumber.push(`${chainId} ${firstRes.residue_number} - ${lastRes.residue_number}`);
    segmentsBoundaries.push({
      chain: mapping.chain_id,
      entity: mapping.entity_id,
      start: firstRes.residue_number,
      end: lastRes.residue_number,
    });
    prevChain = mapping.chain_id;
  }

  // finally we return the results
  return {
    molstarSelection: molstarSelection,
    segmentsBoundaries: segmentsBoundaries,
    segments: segments,
    segmentsResidNumber: segmentsResidNumber,
  };
}
