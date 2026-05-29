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
  const primaryCitationYes = llmAnnotations.filter((a: any) => a.primaryCitation === 'Y');
  const llmUniProtIds = new Set(primaryCitationYes?.map((a: any) => a.uniprotAccession));
  const chainIds = new Set(primaryCitationYes?.map((a: any) => a.pdbChain));

  const macromoleculesWithPrefAssembly = mapMacromoleculesByPreferredAssembly(macromolecules, preferredAssembly, polymerCoverage);
  const polymerCoverageWithPrefAssembly = mapPolymerCoverageByPreferredAssembly(polymerCoverage, preferredAssembly);

  const filteredMacromolecules = macromoleculesWithPrefAssembly.filter((macromolecule) => {
    const uniprotData = getUniProtMappingsForMacromolecule(macromolecule, uniprotMappings, polymerCoverageWithPrefAssembly);
    const macromoleculeUniProts = uniprotData.uniprotAccsForMacromolecule;
    const hasUniProtInCommon = macromoleculeUniProts.some((unp) => llmUniProtIds.has(unp));
    const hasChainsInCommon = macromolecule.in_struct_asyms.some((ch) => chainIds.has(ch));
    return hasUniProtInCommon && hasChainsInCommon;
  });
  return filteredMacromolecules;
}
