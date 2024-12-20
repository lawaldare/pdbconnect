import { DomainsBoundaries } from '../components/interactive-tables/data-models-and-definitions/row-and-table.model';
import { DomainMapping } from '../data-models/domains.model';
import { MolstarResidueInfo, MolstarSelectionObj } from './molstar/molstar-helpers';

export function formatSegments(mappings: DomainMapping[], molstarResidueInfo: MolstarResidueInfo[]) {
  const segments: string[] = [];
  const segmentsResidNumber: string[] = [];

  const molstarSelection: MolstarSelectionObj = {
    residues: [],
  };

  const segmentsBoundaries: DomainsBoundaries[] = [];
  const mappingsByChain = mappings.sort();
  let prevChain = 'undef';
  for (const mapping of mappingsByChain) {
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
    const residuesOfChain = residueListingChain.sort((a, b) => a.label_seq_id! - b.label_seq_id!);

    const chainId = mapping.chain_id !== prevChain ? `${mapping.chain_id}:` : ' ';
    let firstRes = {
      residue_number: mapping.start.residue_number,
      author_residue_number: mapping.start.author_residue_number + '',
      author_insertion_code: mapping.start.author_insertion_code,
    };
    if (mapping.start.author_residue_number === null) {
      // const residuesOfChainAboveStart = residuesOfChain.filter((resid) => resid.observed_ratio > 0 && resid.residue_number >= mapping.start.residue_number);
      const residuesOfChainAboveStart = residuesOfChain.filter((resid) => resid.label_seq_id! >= mapping.start.residue_number);
      if (residuesOfChainAboveStart.length === 0) continue;
      firstRes = {
        // residue_number: residuesOfChainAboveStart[0].residue_number,
        // author_residue_number: residuesOfChainAboveStart[0].author_residue_number + '',
        // author_insertion_code: residuesOfChainAboveStart[0].author_insertion_code,
        residue_number: residuesOfChainAboveStart[0].label_seq_id!,
        author_residue_number: residuesOfChainAboveStart[0].auth_seq_id + '',
        author_insertion_code: residuesOfChainAboveStart[0].pdbx_PDB_ins_code || '',
      };
    }
    let lastRes = {
      residue_number: mapping.end.residue_number,
      author_residue_number: mapping.end.author_residue_number + '',
      author_insertion_code: mapping.end.author_insertion_code,
    };
    if (mapping.end.author_residue_number === null) {
      // const residuesOfChainBelowEnd = residuesOfChain.filter((resid) => resid.observed_ratio > 0 && resid.residue_number <= mapping.end.residue_number);
      const residuesOfChainBelowEnd = residuesOfChain.filter((resid) => resid.label_seq_id! <= mapping.end.residue_number);
      if (residuesOfChainBelowEnd.length === 0) continue;
      lastRes = {
        // residue_number: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].residue_number,
        // author_residue_number: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].author_residue_number + '',
        // author_insertion_code: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].author_insertion_code,
        residue_number: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].label_seq_id!,
        author_residue_number: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].auth_seq_id + '',
        author_insertion_code: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].pdbx_PDB_ins_code || '',
      };
    }
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
  return {
    molstarSelection: molstarSelection,
    segmentsBoundaries: segmentsBoundaries,
    segments: segments,
    segmentsResidNumber: segmentsResidNumber,
  };
}
