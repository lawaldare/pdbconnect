import { AssemblyData } from '../../data-models/assembly.model';
import { LLMAnnotation } from '../../data-models/llm-model';
import { Molecule } from '../../data-models/molecule.model';
import { PolymerCoverageMolecule } from '../../data-models/polymer-coverage.model';
import { UniProtMapping } from '../../data-models/uniprot-mapping.model';
import { getUniProtMappingsForMacromolecule, mapMacromoleculesByPreferredAssembly, mapPolymerCoverageByPreferredAssembly } from './macromolecule-processing';

export function filterMacromoleculesForLLM(
  macromolecules: Molecule[],
  llmAnnotations: LLMAnnotation[],
  preferredAssembly: AssemblyData,
  uniprotMappings: UniProtMapping,
  polymerCoverage: PolymerCoverageMolecule[]
) {
  const primaryCitationYes = llmAnnotations.filter((a) => a.primaryCitation === 'Y');
  const llmUniProtIds = new Set(primaryCitationYes.map((a) => a.uniprotAccession));
  const llmChainIds = new Set(primaryCitationYes.map((a) => a.pdbChain));

  const macromoleculesWithPrefAssembly = mapMacromoleculesByPreferredAssembly(macromolecules, preferredAssembly, polymerCoverage);
  const polymerCoverageWithPrefAssembly = mapPolymerCoverageByPreferredAssembly(polymerCoverage, preferredAssembly);

  const filteredMacromolecules = macromoleculesWithPrefAssembly.filter((macromolecule) => {
    const uniprotData = getUniProtMappingsForMacromolecule(macromolecule, uniprotMappings, polymerCoverageWithPrefAssembly);
    const macromoleculeUniProts = uniprotData.uniprotAccsForMacromolecule;
    const hasUniProtInCommon = macromoleculeUniProts.some((unp) => llmUniProtIds.has(unp));
    const hasChainsInCommon = macromolecule.in_struct_asyms.some((ch) => llmChainIds.has(ch));
    return hasUniProtInCommon && hasChainsInCommon;
  });
  return filteredMacromolecules;
}
