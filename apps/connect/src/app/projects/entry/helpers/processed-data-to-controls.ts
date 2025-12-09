import { SequenceDetail } from '../store/data-processing/models/other-models';
import { ProcessedDomain, ProcessedMacromolecule } from '../store/data-processing/models/processed-entities.model';
import { Molecule } from '../data-models/molecule.model';
import { ProcessedLigandOrMod } from '../store/data-processing/ligand-processing';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { QueryParamForHelpers } from './molstar-helpers';

export function getCleanMoleculeName(molecule: Molecule) {
  if (molecule.molecule_name && molecule.molecule_name.length > 0) return molecule.molecule_name.join(', ');
  else if (molecule.synonym) return molecule.synonym;
  return 'Undefined';
}

export function getCleanSelectionName(options: DownloadOption[]) {
  return options[0].name.split('<img')[0];
}

export function getDomainChainDropdownOptions(datum: ProcessedDomain, allChains?: boolean) {
  const dropdownOptionsToMolstar: { [key: string]: QueryParamForHelpers[] } = {};
  const selections = datum.additionalData.selections;
  const selectionsInPrefAssembly = datum.additionalData.selectionsInPrefAssembly;
  if (allChains) dropdownOptionsToMolstar['All chains'] = [];
  for (let selectionIdx = 0; selectionIdx < selections.length; selectionIdx++) {
    const selection = selections[selectionIdx];
    const inPrefAssembly = selectionsInPrefAssembly[selectionIdx];
    for (const segment of selection) {
      if (allChains) dropdownOptionsToMolstar['All chains'].push({ ...segment });
      const selectionKey = inPrefAssembly
        ? `Chain ${segment.auth_asym_id!}`
        : `Chain ${segment.auth_asym_id!} <img src="assets/icons/warning_icon.webp" style="margin-left: 4px; width: 16px; height: 16px;" />`;
      const allChainsInObj = Object.keys(dropdownOptionsToMolstar);
      if (allChainsInObj.indexOf(selectionKey) > -1) {
        dropdownOptionsToMolstar[selectionKey].push({ ...segment });
      } else {
        dropdownOptionsToMolstar[selectionKey] = [{ ...segment }];
      }
    }
  }
  // Remove "All chains" if it is redundant
  if (allChains && Object.keys(dropdownOptionsToMolstar).length === 2) {
    delete dropdownOptionsToMolstar['All chains'];
  }
  return dropdownOptionsToMolstar;
}

export function getMacromoleculeChainDropdownOptions(datum: ProcessedMacromolecule) {
  const dropdownOptionsToMolstar: { [key: string]: QueryParamForHelpers[] } = {};
  const selections = datum.additionalData.selections;
  const selectionsInPrefAssembly = datum.additionalData.selectionsInPrefAssembly;
  for (let selectionIdx = 0; selectionIdx < selections.length; selectionIdx++) {
    const selection = selections[selectionIdx];
    const inPrefAssembly = selectionsInPrefAssembly[selectionIdx];
    const selectionKey = inPrefAssembly
      ? `Chain ${selection[0].auth_asym_id!}`
      : `Chain ${selection[0].auth_asym_id!} <img src="assets/icons/warning_icon.webp" style="margin-left: 4px; width: 16px; height: 16px;" />`;
    dropdownOptionsToMolstar[selectionKey] = selection;
  }
  return dropdownOptionsToMolstar;
}

export function getMacromoleculeSequenceDetails(entryId: string, datum: ProcessedMacromolecule, chainId: string) {
  const entity = datum.additionalData.molecule;
  const seq = entity.sequence;
  return {
    title: `>FASTA pdb|${entryId}|${getCleanMoleculeName(entity)}; Chain ${chainId}`,
    fullSequence: seq,
  };
}

export function getDomainSequenceDetails(entryId: string, macromoleculesOfDomain: Molecule[], datum: ProcessedDomain, chainId: string): SequenceDetail[] {
  const sequenceDetails: SequenceDetail[] = [];

  const macromoleculesOfDomainForChain = macromoleculesOfDomain.filter((mm) => mm.in_chains.indexOf(chainId) > -1);
  if (macromoleculesOfDomainForChain.length > 1) {
    const allEntityIds = macromoleculesOfDomainForChain.map((mm) => mm.entity_id).join("', '");
    console.warn(`Multiple entity_id's (${allEntityIds}) mapped to this ${datum.domain}`);
  }

  const macromolecule = macromoleculesOfDomainForChain[0];
  const moleculeName = getCleanMoleculeName(macromolecule);

  const boundariesForDomain = datum.additionalData.boundaries;
  const boundariesForChainId = boundariesForDomain.filter((boundary) => boundary.chain === chainId);
  if (boundariesForChainId.length === 0) return [];
  const segmentsStringsForDomains = datum.additionalData.segmentsResidNumbers;
  const segmentsStringsForChainId = segmentsStringsForDomains.filter((segment) => segment[0] === chainId);

  const segmentsForDomains = datum.segments;
  const segmentsForChainId = segmentsForDomains.filter((_segment, i) => boundariesForDomain[i].chain === chainId);
  const segmentsForOtherChains = segmentsForDomains.filter((_segment, i) => boundariesForDomain[i].chain !== chainId);

  const domainDescription = `${datum.resource} domain: ${datum.domain}; Segments: ${segmentsStringsForChainId.join(', ')} (Auth: ${segmentsForChainId.join(', ')})`;
  const otherChains = segmentsForOtherChains.length > 0 ? `; Other auth segments: ${segmentsForOtherChains.join(', ')})` : '';

  const sequenceDetail: SequenceDetail = {
    title: `>FASTA pdb|${entryId}|${moleculeName}; Chain ${chainId}; ${domainDescription}${otherChains}`,
    fullSequence: macromolecule.sequence,
    segments: [],
  };

  let currentCharIndex = 0;
  boundariesForChainId.forEach((boundary) => {
    // Add substring from current index up to start of boundary
    if (currentCharIndex < boundary.start) {
      const outOfBoundary = sequenceDetail.fullSequence.substring(currentCharIndex, boundary.start - 1);
      sequenceDetail.segments.push({
        sequence: outOfBoundary,
      });
    }

    // Add the substring within the boundary as a special case
    const boundarySubstring = sequenceDetail.fullSequence.substring(boundary.start - 1, boundary.end);
    sequenceDetail.segments.push({
      // color: '#9DFF94',
      color: '#D0DFBB',
      sequence: boundarySubstring,
    });

    currentCharIndex = boundary.end; // Update currentIndex to end of boundary
  });
  if (currentCharIndex < sequenceDetail.fullSequence.length) {
    sequenceDetail.segments.push({
      sequence: sequenceDetail.fullSequence.substring(currentCharIndex),
    });
  }
  sequenceDetails.push(sequenceDetail);
  return sequenceDetails;
}

function convertLigandDatumToString(id: string, selectedLigandInstance: QueryParamForHelpers[], inPrefAssembly: boolean) {
  const resNum = selectedLigandInstance[0].auth_residue_number;
  const insCode = selectedLigandInstance[0].auth_ins_code_id || '';
  const chainId = selectedLigandInstance[0].auth_asym_id;
  const ligandString = inPrefAssembly
    ? `${id} ${resNum}${insCode} in chain ${chainId}`
    : `${id} ${resNum}${insCode} in chain ${chainId} <img src="assets/icons/warning_icon.webp" style="margin-left: 4px; width: 16px; height: 16px;" />`;
  return ligandString;
}

export function getLigandsDropdownOptions(datum: ProcessedLigandOrMod) {
  const dropdownOptionsToMolstar: { [key: string]: QueryParamForHelpers[] } = {};
  const selections = datum.additionalData.selections;
  const selectionsInPrefAssembly = datum.additionalData.selectionsInPrefAssembly;
  for (let selectionIdx = 0; selectionIdx < selections.length; selectionIdx++) {
    const selection = selections[selectionIdx];
    const inPrefAssembly = selectionsInPrefAssembly[selectionIdx];
    const name = convertLigandDatumToString(datum.id, selection, inPrefAssembly);
    dropdownOptionsToMolstar[name] = selection;
  }
  return dropdownOptionsToMolstar;
}

export function getDomainChainsAsString(datum: ProcessedDomain) {
  let uniqueChains: string[] = [];
  for (const selection of datum.additionalData.selections) {
    const uniqueChainsInSelection = selection.map((sel) => sel.auth_asym_id!).filter((ch, idx, chains) => chains.indexOf(ch) === idx);
    uniqueChains.push(...uniqueChainsInSelection);
  }
  uniqueChains = uniqueChains.filter((e, i, self) => i === self.indexOf(e));

  const hasPlural = uniqueChains.length > 1 ? 's' : '';
  return `Chain${hasPlural} ${uniqueChains.join(', ')}`;
}

export function getMacromoleculeOfDomain(datum: ProcessedDomain, macromolecules: ProcessedMacromolecule[]) {
  const macromoleculeName = datum.moleculeNames[0];
  const macromolecule = macromolecules.filter((mol) => mol.name.molecule === macromoleculeName)[0]; // should always be true, let it fail
  return macromolecule;
}
