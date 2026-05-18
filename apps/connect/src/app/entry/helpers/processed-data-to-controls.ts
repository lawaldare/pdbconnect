import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { ModifiedResidue } from '../data-models/modified-residues.model';
import { Molecule } from '../data-models/molecule.model';
import { DEFAULT_DOMAIN_HIGHLIGHT_COLOR } from '../entry-constant';
import { ProcessedLigandOrMod } from '../store/data-processing/ligand-processing';
import { SequenceDetail } from '../store/data-processing/models/other-models';
import { ProcessedDomain, ProcessedMacromolecule } from '../store/data-processing/models/processed-entities.model';
import { DropdownOptionWithData } from './misc';
import { QueryParamForHelpers } from './molstar-helpers';

type DropdownDetail =
  | { kind: 'macromolecule'; item: undefined }
  | { kind: 'ligand'; item: undefined }
  | { kind: 'domain'; item: undefined }
  | { kind: 'modification'; item: ModifiedResidue };

export interface CommonDropdownOptionData {
  authAsymId: string;
  molstarSelection: QueryParamForHelpers[];
  inPrefAssembly: boolean;
  symmOperators: string[];
  detail: DropdownDetail;
}

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
        : `Chain ${segment.auth_asym_id!} <img src="assets/icons/warning-icon.svg" style="margin-left: 4px; width: 16px; height: 16px;" />`;
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
export function makeDomainChainDropdownOptions(domain: ProcessedDomain | undefined) {
  if (!domain) return [];
  const options = getDomainChainDropdownOptions(domain);
  return Object.keys(options).map((name, idx): DropdownOptionWithData<CommonDropdownOptionData> => {
    const authAsymId = domain.additionalData.selections[idx][0].auth_asym_id;
    if (authAsymId === undefined) throw new Error('authAsymId is undefined');
    return {
      name: name,
      url: `domain-${idx + 1}`,
      downloadable: false,
      data: {
        authAsymId,
        molstarSelection: options[name],
        inPrefAssembly: domain.additionalData.selectionsInPrefAssembly[idx],
        symmOperators: domain.symmOpListForSegments[idx],
        detail: { kind: 'domain', item: undefined },
      },
    };
  });
}

function getMacromoleculeChainDropdownOptions(datum: ProcessedMacromolecule) {
  const dropdownOptionsToMolstar: { [key: string]: QueryParamForHelpers[] } = {};
  const selections = datum.additionalData.selections;
  const selectionsInPrefAssembly = datum.additionalData.selectionsInPrefAssembly;
  for (let selectionIdx = 0; selectionIdx < selections.length; selectionIdx++) {
    const selection = selections[selectionIdx];
    const inPrefAssembly = selectionsInPrefAssembly[selectionIdx];
    const selectionKey = inPrefAssembly
      ? `Chain ${selection[0].auth_asym_id!}`
      : `Chain ${selection[0].auth_asym_id!} <img src="assets/icons/warning-icon.svg" style="margin-left: 4px; width: 16px; height: 16px;" />`;
    dropdownOptionsToMolstar[selectionKey] = selection;
  }
  return dropdownOptionsToMolstar;
}

export function makeMacromoleculeChainDropdownOptions(macromolecule: ProcessedMacromolecule | undefined) {
  if (!macromolecule) return [];
  const options = getMacromoleculeChainDropdownOptions(macromolecule);
  return Object.keys(options).map((name, idx): DropdownOptionWithData<CommonDropdownOptionData> => {
    const authAsymId = macromolecule.additionalData.selections[idx][0].auth_asym_id;
    if (authAsymId === undefined) throw new Error('authAsymId is undefined');
    return {
      name: name,
      url: `macro-${idx + 1}`,
      downloadable: false,
      data: {
        authAsymId,
        molstarSelection: options[name],
        inPrefAssembly: macromolecule.additionalData.selectionsInPrefAssembly[idx],
        symmOperators: macromolecule.chainSymmOperators[authAsymId] ?? [],
        detail: { kind: 'macromolecule', item: undefined },
      },
    };
  });
}

export function getMacromoleculeSequenceDetails(entryId: string, datum: ProcessedMacromolecule, chainId: string) {
  const entity = datum.additionalData.molecule;
  const seq = entity.sequence ?? '';
  return {
    title: `>FASTA pdb|${entryId}|${getCleanMoleculeName(entity)}; Chain ${chainId}`,
    fullSequence: seq,
  };
}

export function getDomainSequenceDetail(entryId: string, macromolecule: Molecule, domain: ProcessedDomain, chainId: string): SequenceDetail | undefined {
  const boundariesForDomain = domain.additionalData.boundaries;
  const boundariesForChainId = boundariesForDomain.filter((boundary) => boundary.chain === chainId);
  if (boundariesForChainId.length === 0) return undefined;
  const segmentsStringsForDomains = domain.additionalData.segmentsResidNumbers;
  const segmentsStringsForChainId = segmentsStringsForDomains.filter((segment) => segment[0] === chainId);

  const segmentsForDomains = domain.segments;
  const segmentsForChainId = segmentsForDomains.filter((_segment, i) => boundariesForDomain[i].chain === chainId);
  const segmentsForOtherChains = segmentsForDomains.filter((_segment, i) => boundariesForDomain[i].chain !== chainId);

  const domainDescription = `${domain.resource} domain: ${domain.domain}; Segments: ${segmentsStringsForChainId.join(', ')} (Auth: ${segmentsForChainId.join(', ')})`;
  const otherChains = segmentsForOtherChains.length > 0 ? `; Other auth segments: ${segmentsForOtherChains.join(', ')})` : '';

  const sequenceDetail: SequenceDetail = {
    title: `>FASTA pdb|${entryId}|${getCleanMoleculeName(macromolecule)}; Chain ${chainId}; ${domainDescription}${otherChains}`,
    fullSequence: macromolecule.sequence ?? '',
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
      color: DEFAULT_DOMAIN_HIGHLIGHT_COLOR,
      sequence: boundarySubstring,
    });

    currentCharIndex = boundary.end; // Update currentIndex to end of boundary
  });
  if (currentCharIndex < sequenceDetail.fullSequence.length) {
    sequenceDetail.segments.push({
      sequence: sequenceDetail.fullSequence.substring(currentCharIndex),
    });
  }
  return sequenceDetail;
}

function convertLigandDatumToString(id: string, selectedLigandInstance: QueryParamForHelpers[], inPrefAssembly: boolean) {
  const resNum = selectedLigandInstance[0].auth_seq_id;
  const insCode = selectedLigandInstance[0].pdbx_PDB_ins_code || '';
  const chainId = selectedLigandInstance[0].auth_asym_id;
  const ligandString = inPrefAssembly
    ? `${id} ${resNum}${insCode} in chain ${chainId}`
    : `${id} ${resNum}${insCode} in chain ${chainId} <img src="assets/icons/warning-icon.svg" style="margin-left: 4px; width: 16px; height: 16px;" />`;
  return ligandString;
}

function getLigandsDropdownOptions(datum: ProcessedLigandOrMod) {
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

export function makeLigandsDropdownOptions(ligand: ProcessedLigandOrMod | undefined) {
  if (!ligand) return [];
  const options = getLigandsDropdownOptions(ligand);
  return Object.keys(options).map((name, idx): DropdownOptionWithData<CommonDropdownOptionData> => {
    const molstarSelection = options[name];
    const authAsymId = molstarSelection[0].auth_asym_id;
    if (authAsymId === undefined) throw new Error('authAsymId is undefined');
    return {
      name: name,
      url: `lig-${idx + 1}`,
      downloadable: false,
      data: {
        authAsymId,
        molstarSelection,
        inPrefAssembly: ligand.additionalData.selectionsInPrefAssembly[idx],
        symmOperators: ligand.symmOpListForEachLigOrMod[idx],
        detail: ligand.type === 'modification' ? { kind: 'modification', item: ligand.additionalData.source[idx] } : { kind: 'ligand', item: undefined },
      },
    };
  });
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

export function makeSymmetryDropdownOptions(symmOperators: string[] | undefined) {
  if (!symmOperators) return [];
  return symmOperators.map(
    (op): DropdownOptionWithData<{ instanceId: string | undefined }> => ({
      name: op,
      url: `symop-${op}`,
      downloadable: false,
      data: { instanceId: op !== 'All' ? op : undefined },
    })
  );
}
