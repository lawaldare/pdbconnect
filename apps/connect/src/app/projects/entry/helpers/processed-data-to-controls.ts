import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../data-classes/data-models-and-definitions/row-and-table.model';
import { SequenceDetail } from '../data-classes/data-models-and-definitions/other-models';

export function getDomainChainDropdownOptions(datum: DomainsRowData) {
  const dropdownOptionsToMolstar: { [key: string]: QueryParam[] } = {};
  for (const selection of datum.additionalData.selections) {
    for (const segment of selection) {
      const chainKey = `Chain ${segment.auth_asym_id!}`;
      const allChainsInObj = Object.keys(dropdownOptionsToMolstar);
      if (allChainsInObj.indexOf(chainKey) > -1) {
        dropdownOptionsToMolstar[chainKey].push({ ...segment });
      } else {
        dropdownOptionsToMolstar[chainKey] = [{ ...segment }];
      }
    }
  }
  return dropdownOptionsToMolstar;
}

export function getMacromoleculeChainDropdownOptions(datum: MacromoleculesRowData) {
  const dropdownOptionsToMolstar: { [key: string]: QueryParam[] } = {};
  for (const selection of datum.additionalData.selections) {
    dropdownOptionsToMolstar[`Chain ${selection[0].auth_asym_id!}`] = selection;
  }
  return dropdownOptionsToMolstar;
}

export function getMacromoleculeSequenceDetails(entryId: string, datum: MacromoleculesRowData, chainId: string) {
  const entity = datum.additionalData.molecule;
  const seq = entity.sequence;
  const sequenceDetails: SequenceDetail[] = [];
  if (seq) {
    sequenceDetails.push({
      title: `>FASTA pdb|${entryId}|${entity.molecule_name[0]}; Chain ${chainId}`,
      fullSequence: seq,
      segments: [{ sequence: seq }],
    });
  }
  return sequenceDetails;
}

function convertLigandDatumToString(id: string, selectedLigandInstance: QueryParam[]) {
  const resNum = selectedLigandInstance[0].auth_residue_number;
  const insCode = selectedLigandInstance[0].auth_ins_code_id || '';
  const chainId = selectedLigandInstance[0].auth_asym_id;
  return `${id} ${resNum}${insCode} in chain ${chainId}`;
}

export function getLigandsDropdownOptions(datum: LigandsRowData) {
  const dropdownOptionsToMolstar: { [key: string]: QueryParam[] } = {};
  for (const selection of datum.additionalData.selections) {
    const name = convertLigandDatumToString(datum.id, selection);
    dropdownOptionsToMolstar[name] = selection;
  }
  return dropdownOptionsToMolstar;
}

export function getDomainChainsAsString(datum: DomainsRowData) {
  let uniqueChains: string[] = [];
  for (const selection of datum.additionalData.selections) {
    const uniqueChainsInSelection = selection.map((sel) => sel.auth_asym_id!).filter((ch, idx, chains) => chains.indexOf(ch) === idx);
    uniqueChains.push(...uniqueChainsInSelection);
  }
  uniqueChains = uniqueChains.filter((e, i, self) => i === self.indexOf(e));

  const hasPlural = uniqueChains.length > 1 ? 's' : '';
  return `Chain${hasPlural} ${uniqueChains.join(', ')}`;
}

export function getMacromoleculeOfDomain(datum: DomainsRowData, macromolecules: MacromoleculesRowData[]) {
  const macromoleculeName = datum.moleculeNames[0];
  const macromolecule = macromolecules.filter((mol) => mol.name.molecule === macromoleculeName)[0]; // should always be true, let it fail
  return macromolecule;
}
