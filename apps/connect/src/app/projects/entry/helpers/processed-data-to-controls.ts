import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { DomainsRowData, LigandsRowData, MacromoleculesRowData } from '../data-classes/data-models-and-definitions/row-and-table.model';

export function getDomainChainDropdownOptions(datum: DomainsRowData) {
  const dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};
  for (const selection of datum.additionalData.selections) {
    for (const residue of selection.residues) {
      const chainKey = `Chain ${residue.authChainId!}`;
      const allChainsInObj = Object.keys(dropdownOptionsToMolstar);
      if (allChainsInObj.indexOf(chainKey) > -1) {
        dropdownOptionsToMolstar[chainKey].residues.push({ ...residue });
      } else {
        dropdownOptionsToMolstar[chainKey] = { residues: [{ ...residue }] };
      }
    }
  }
  return dropdownOptionsToMolstar;
}

export function getMacromoleculeChainDropdownOptions(datum: MacromoleculesRowData) {
  const dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};
  for (const selection of datum.additionalData.selections) {
    dropdownOptionsToMolstar[`Chain ${selection.authChainId!}`] = selection;
  }
  return dropdownOptionsToMolstar;
}

function convertLigandDatumToString(id: string, selectedLigandInstance: MolstarSelectionObj) {
  return `${id} ${selectedLigandInstance.residues[0].authBegin}${selectedLigandInstance.residues[0].authBeginIns} in chain ${selectedLigandInstance.authChainId}`;
}

export function getLigandsDropdownOptions(datum: LigandsRowData) {
  const dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};
  for (const selection of datum.additionalData.selections) {
    const name = convertLigandDatumToString(datum.id, selection);
    dropdownOptionsToMolstar[name] = selection;
  }
  return dropdownOptionsToMolstar;
}

export function getDomainChainsAsString(datum: DomainsRowData) {
  let uniqueChains: string[] = [];
  for (const selection of datum.additionalData.selections) {
    const uniqueChainsInSelection = selection.residues.map((sel) => sel.authChainId!).filter((ch, idx, chains) => chains.indexOf(ch) === idx);
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
