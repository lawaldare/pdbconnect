import { signal, WritableSignal } from '@angular/core';
import { DomainsBoundaries, DomainsRowData, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';
import { PfamMappings, CathMappings, ScopMappings, DomainMapping } from '../../data-models/domains.model';
import { Molecule } from '../../data-models/molecule.model';
import { formatSegments, formatSegmentsWithCoverage } from '../../helpers/domain-helpers';
import { ObservedSegments, PolymerCoverageMolecule } from '../../data-models/polymer-coverage.model';
import { AssemblyData, AssemblyEntity } from '../../data-models/assembly.model';
import { ProcessedSummary } from '../../data-models/summary.model';
import { FILTERED_KELLY22_COLORBLIND_SCALE } from '../../entry-constant';

export class DomainDataToTable extends DataToTable {
  // Domain specific data
  pfamMappings: PfamMappings;
  cathMappings: CathMappings;
  scopMappings: ScopMappings;
  macromolecules: Molecule[] = [];
  polymerCoverage: PolymerCoverageMolecule[] = [];
  summaryData: ProcessedSummary;
  assemblyData: AssemblyData[];

  // Implementation of Abstract attributes from abstract-base-row-class
  molstarHardResetOnSelect = false;
  protvistaForSelection = true;
  topolViewerForSelection = false;
  ligandEnvViewerForSelection = false;
  displayFilters = true;

  // tableRows is an abstract signal that contains data for each table row
  tableRows: WritableSignal<TableRow[]> = signal([]);
  // tableFilters is an abstract signal that contains data for each table filter
  tableFilters: WritableSignal<TableFilter[]> = signal([]);

  // when instantiating, set the necessary domain specific data
  constructor(
    pfamMappings: PfamMappings,
    cathMappings: CathMappings,
    scopMappings: ScopMappings,
    macromolecules: Molecule[],
    polymerCoverage: PolymerCoverageMolecule[],
    summaryData: ProcessedSummary,
    assemblyData: AssemblyData[]
  ) {
    super();
    this.pfamMappings = pfamMappings;
    this.cathMappings = cathMappings;
    this.scopMappings = scopMappings;
    this.summaryData = summaryData;
    this.assemblyData = assemblyData;
    const preferredAssembly = this.getPreferredAssembly();
    if (preferredAssembly) {
      this.macromolecules = this.filterByPreferredAssembly(macromolecules, preferredAssembly);
      this.polymerCoverage = this.filterPolymerCoverageByAssembly(polymerCoverage, preferredAssembly);
    }
  }

  getPreferredAssembly() {
    // we first check and get the preferred assembly if it exists
    let preferredAssemblyId = -1;
    const preferredAssemblyData = this.summaryData.assemblies.filter((summaryAssembly) => summaryAssembly.preferred === true);
    if (preferredAssemblyData.length > 0) {
      preferredAssemblyId = parseInt(preferredAssemblyData[0].assembly_id);
    }
    if (preferredAssemblyId === -1) preferredAssemblyId = 1;

    const assembly = this.assemblyData.filter((assembly) => parseInt(assembly.assembly_id) === preferredAssemblyId)[0];
    return assembly;
  }

  private getNormalizedEntityMap(assembly: AssemblyData): Map<number, string[]> {
    const map = new Map<number, string[]>();

    for (const entity of assembly.entities) {
      const normalizedChains = entity.in_chains.map((chain) => chain.split('-')[0]);
      map.set(entity.entity_id, normalizedChains);
    }

    return map;
  }

  filterByPreferredAssembly(macromolecules: Molecule[], assembly: AssemblyData): Molecule[] {
    // Create a quick lookup map for assembly entities by entity_id
    const assemblyEntitiesMap = this.getNormalizedEntityMap(assembly);

    // Filter macromolecules based on entity_id presence in assembly
    return (
      macromolecules
        .filter((molecule) => assemblyEntitiesMap.has(molecule.entity_id))
        .map((molecule) => {
          const allowedAsyms = assemblyEntitiesMap.get(molecule.entity_id)!;

          // Filter the in_chains to only include those present in the assembly entity
          const filteredInStructAsyms: string[] = [];
          const filteredInChains: string[] = [];

          molecule.in_struct_asyms.forEach((asymId, idx) => {
            if (allowedAsyms.includes(asymId)) {
              filteredInStructAsyms.push(asymId);
              filteredInChains.push(molecule.in_chains[idx]); // Keep corresponding chain
            }
          });

          return {
            ...molecule,
            in_struct_asyms: filteredInStructAsyms,
            in_chains: filteredInChains,
          };
        })
        // Optionally, remove molecules where no chains remain after filtering
        .filter((molecule) => molecule.in_struct_asyms.length > 0)
    );
  }

  filterPolymerCoverageByAssembly(polymerCoverage: PolymerCoverageMolecule[], assembly: AssemblyData): PolymerCoverageMolecule[] {
    const assemblyEntitiesMap = this.getNormalizedEntityMap(assembly);

    return polymerCoverage
      .filter((polymer) => assemblyEntitiesMap.has(polymer.entity_id))
      .map((polymer) => {
        const allowedAsyms = assemblyEntitiesMap.get(polymer.entity_id)!;
        const filteredChains = polymer.chains.filter((chain) => allowedAsyms.includes(chain.struct_asym_id));
        return {
          ...polymer,
          chains: filteredChains,
        };
      })
      .filter((polymer) => polymer.chains.length > 0);
  }

  // parse the necessary domain specific data into data for each table row
  // good pdb examples for domains: 1trn (CATH, SCOP, Pfam); 3irj (no domains); 7v08 (only Pfam); 5irx (four domains, same accession)
  generateTableData(): TableRow[] {
    let rows: TableRow[] = [];
    let domainsTableRows: DomainsRowData[] = [];
    if (this.tableRows().length === 0) {
      // first we parse domains from CATH resource
      for (const [resourceAcc, data] of Object.entries(this.cathMappings)) {
        // domain names in CATH are unique 'domain' fields inside mappings
        const domainDesc = data.homology;
        const domainNames = data.mappings.map((mapping) => mapping.domain!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);

        // for each unique cath domain ...
        for (const domainName of domainNames) {
          // ... we filter all domain segments that map to this domain name
          const mappings = data.mappings.filter((mapping) => mapping.domain! === domainName);

          // we get some data needed to be rendered in the table
          const entityIds = mappings.map((mapping) => mapping.entity_id).filter((entityId, idx, ids) => ids.indexOf(entityId) === idx);
          const moleculeNames = this.macromolecules.filter((mol) => entityIds.indexOf(mol.entity_id) > -1).map((mol) => mol.molecule_name[0]);

          // ... and use the formatSegments function to get:
          // 1 - molstarSelections to each cath domain (molstarSelection)
          // 2 - segment data (chain, starting and ending residues) for each cath domain (segmentsBoundaries)
          // const segmentData = formatSegments(mappings, this.molstarResidueInfo);
          const segmentData = formatSegmentsWithCoverage(mappings, this.polymerCoverage);

          // ... formatSegments also uses molstarResidueInfo (residue data parsed from Molstar)
          // to filter domains, only keeping domains which are actually exist in the structure
          if (segmentData.segments.length === 0) continue;

          const segmentsAsText = segmentData.segments
            .map((seg, i) => {
              const isFirstSeg = i === 0;
              const hasChainId = seg[0] !== ' ';
              if (hasChainId && isFirstSeg) return `Chain ${seg}`;
              else if (hasChainId && isFirstSeg === false) return `\nChain ${seg}`;
              else return seg.replace('  ', ' ');
            })
            .join(',');

          domainsTableRows.push({
            // domainName: `${domainDesc} (${resourceAcc})`,
            accessionName: domainDesc,
            resource: 'CATH',
            domain: domainName,
            moleculeNames: moleculeNames,
            segments: segmentData.segments,
            segmentsAsText: segmentsAsText,
            additionalData: {
              accession: resourceAcc,
              selections: [segmentData.molstarSelection],
              selectionNames: [`Segments of domain`],
              boundaries: segmentData.segmentsBoundaries,
              segmentsResidNumbers: segmentData.segmentsResidNumber,
            },
          });
        }
      }

      // parse SCOP 1.75 domains
      for (const [resourceAcc, data] of Object.entries(this.scopMappings)) {
        // domain names in SCOP 1.75 are unique 'scop_id' fields inside mappings
        const domainDesc = data.description;
        const domainNames = data.mappings.map((mapping) => mapping.scop_id!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);

        // for each unique SCOP 1.75 domain ...
        for (const domainName of domainNames) {
          // ... we filter all domain segments that map to this domain name
          const mappings = data.mappings.filter((mapping) => mapping.scop_id! === domainName);

          // we get some data needed to be rendered in the table
          const entityIds = mappings.map((mapping) => mapping.entity_id).filter((entityId, idx, ids) => ids.indexOf(entityId) === idx);
          const moleculeNames = this.macromolecules.filter((mol) => entityIds.indexOf(mol.entity_id) > -1).map((mol) => mol.molecule_name[0]);

          // ... and use the formatSegments function to get:
          // 1 - molstarSelections to each SCOP 1.75 domain (molstarSelection)
          // 2 - segment data (chain, starting and ending residues) for each SCOP 1.75 domain (segmentsBoundaries)
          // const segmentData = formatSegments(mappings, this.molstarResidueInfo);
          const segmentData = formatSegmentsWithCoverage(mappings, this.polymerCoverage);

          // ... formatSegments also uses molstarResidueInfo (residue data parsed from Molstar)
          // to filter domains, only keeping domains which are actually exist in the structure
          if (segmentData.segments.length === 0) continue;

          const segmentsAsText = segmentData.segments
            .map((seg, i) => {
              const isFirstSeg = i === 0;
              const hasChainId = seg[0] !== ' ';
              if (hasChainId && isFirstSeg) return `Chain ${seg}`;
              else if (hasChainId && isFirstSeg === false) return `\nChain ${seg}`;
              else return seg.replace('  ', ' ');
            })
            .join(',');

          domainsTableRows.push({
            // domainName: `${domainDesc} (${resourceAcc})`,
            accessionName: domainDesc,
            resource: 'SCOP',
            domain: domainName,
            moleculeNames: moleculeNames,
            segments: segmentData.segments,
            segmentsAsText: segmentsAsText,
            additionalData: {
              accession: resourceAcc,
              selections: [segmentData.molstarSelection],
              selectionNames: [`Segments of domain`],
              boundaries: segmentData.segmentsBoundaries,
              segmentsResidNumbers: segmentData.segmentsResidNumber,
            },
          });
        }
      }

      // parse Pfam domains json structure
      for (const [resourceAcc, data] of Object.entries(this.pfamMappings)) {
        const domainDesc = data.description;

        // Pfam domain data is structured a bit differently than others
        // Here each mapping corresponds to one domain definition
        for (let i = 0; i < data.mappings.length; i++) {
          const mapping = data.mappings[i];
          const domain = `${resourceAcc}-${i + 1}`;

          // we get some data needed to be rendered in the table
          const moleculeNames = this.macromolecules.filter((mol) => mapping.entity_id === mol.entity_id).map((mol) => mol.molecule_name[0]);

          // ... and use the formatSegments function to get:
          // 1 - molstarSelections to each Pfam domain (molstarSelection)
          // 2 - segment data (chain, starting and ending residues) for each Pfam domain (segmentsBoundaries)
          // const segmentData = formatSegments([mapping], this.molstarResidueInfo);
          const segmentData = formatSegmentsWithCoverage([mapping], this.polymerCoverage);

          // ... formatSegments also uses molstarResidueInfo (residue data parsed from Molstar)
          // to filter domains, only keeping domains which are actually exist in the structure
          if (segmentData.segments.length === 0) continue;

          const segmentsAsText = segmentData.segments
            .map((seg, i) => {
              const isFirstSeg = i === 0;
              const hasChainId = seg[0] !== ' ';
              if (hasChainId && isFirstSeg) return `Chain ${seg}`;
              else if (hasChainId && isFirstSeg === false) return `\nChain ${seg}`;
              else return seg.replace('  ', ' ');
            })
            .join(',');

          domainsTableRows.push({
            // domainName: `${domainDesc} (${resourceAcc})`,
            accessionName: domainDesc,
            resource: 'Pfam',
            domain: domain,
            moleculeNames: moleculeNames,
            segments: segmentData.segments,
            segmentsAsText: segmentsAsText,
            additionalData: {
              accession: resourceAcc,
              selections: [segmentData.molstarSelection],
              selectionNames: [`Segments of domain`],
              boundaries: segmentData.segmentsBoundaries,
              segmentsResidNumbers: segmentData.segmentsResidNumber,
            },
          });
        }
      }

      // add colors by domain accession
      const uniqueAccessions = [...new Set(domainsTableRows.map((domain) => domain.accessionName))];
      domainsTableRows = domainsTableRows.map((domain) => {
        const domainColorIdx = uniqueAccessions.indexOf(domain.accessionName);
        domain.molstarColorHex = FILTERED_KELLY22_COLORBLIND_SCALE[domainColorIdx % FILTERED_KELLY22_COLORBLIND_SCALE.length];
        return domain;
      });

      rows.push(...domainsTableRows);
      this.tableRows.set(rows);
    } else {
      rows = [...this.tableRows()];
    }
    return rows;
  }

  // parse the necessary domain specific data into data filters
  // domains can be filtered by their resource type (CATH, SCOP, Pfam)
  generateTableFilters(): TableFilter[] {
    let newFilters: TableFilter[] = [];
    if (this.tableFilters().length === 0) {
      // first for cath we count the number of unique domain accessions that exist
      let cathDomainCount = 0;
      for (const [_resourceAcc, data] of Object.entries(this.cathMappings)) {
        const domainIds: string[] = [];
        for (const mapping of data.mappings) {
          // ... for this we have to check whether the API residues exist in Molstar (this.molstarResidueInfo)
          // const filteredCathMapping = this.filterMappingObserved([mapping], this.molstarResidueInfo);
          const filteredCathMapping = this.filterMappingObservedWithCoverage([mapping], this.polymerCoverage);
          if (filteredCathMapping.length === 0) continue;

          if (domainIds.indexOf(mapping.domain!) === -1) {
            domainIds.push(mapping.domain!);
          }
        }
        cathDomainCount += domainIds.length;
      }

      let scopDomainCount = 0;
      // for SCOP 1.75 we also count the number of unique domain accessions that exist
      for (const [_resourceAcc, data] of Object.entries(this.scopMappings)) {
        const domainIds: string[] = [];
        for (const mapping of data.mappings) {
          // ... for this we have to check whether the API residues exist in Molstar (this.molstarResidueInfo)
          // const filteredScopMapping = this.filterMappingObserved([mapping], this.molstarResidueInfo);
          const filteredScopMapping = this.filterMappingObservedWithCoverage([mapping], this.polymerCoverage);
          if (filteredScopMapping.length === 0) continue;

          if (domainIds.indexOf(mapping.scop_id!) === -1) {
            domainIds.push(mapping.scop_id!);
          }
        }
        scopDomainCount += domainIds.length;
      }

      let pfamDomainCount = 0;
      // for Pfam we also count the number of unique domain accessions that exist
      for (const [_resourceAcc, data] of Object.entries(this.pfamMappings)) {
        // ... for this we have to check whether the API residues exist in Molstar (this.molstarResidueInfo)
        // const filteredPfamMappings = this.filterMappingObserved(data.mappings, this.molstarResidueInfo);
        const filteredPfamMappings = this.filterMappingObservedWithCoverage(data.mappings, this.polymerCoverage);
        pfamDomainCount += filteredPfamMappings.length;
      }

      // we create an All filter that contains all domains for all resources
      newFilters.push({
        types: ['CATH', 'SCOP', 'Pfam'],
        description: `All (${pfamDomainCount + cathDomainCount + scopDomainCount} domains)`,
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
      // finally set filters signal
      this.tableFilters.set(newFilters);
    } else {
      newFilters = [...this.tableFilters()];
    }
    return newFilters;
  }

  // helper function for filtering a list of domain mappings according to whether they have at least one
  // residue observed (existing) in Molstar
  // filterMappingObserved(domainMappings: DomainMapping[], molstarResidueInfo: MolstarResidueInfo[]) {
  //   const observedMappings: MolstarResidueInfo[][] = [];
  //   for (const mapping of domainMappings) {
  //     // ... this is done by checking equivalence with molstarResidueInfo for:
  //     //  entity_id (label_entity_id in Molstar), chain_id (auth_asym_id in Molstar)
  //     //  and residue_number (label_seq_id in Molstar)
  //     const residueListingChain = molstarResidueInfo.filter((residInfo) => {
  //       return (
  //         residInfo.label_entity_id &&
  //         residInfo.auth_asym_id &&
  //         residInfo.label_seq_id &&
  //         residInfo.auth_seq_id &&
  //         residInfo.label_entity_id === mapping.entity_id + '' &&
  //         residInfo.auth_asym_id === mapping.chain_id
  //       );
  //     });
  //     const residuesOfChain = residueListingChain.sort((a, b) => a.label_seq_id! - b.label_seq_id!);
  //     const residuesOfMappingObserved = residuesOfChain.filter((resid) => {
  //       return resid.label_seq_id! <= mapping.end.residue_number && resid.label_seq_id! >= mapping.start.residue_number;
  //     });
  //     if (residuesOfMappingObserved.length > 0) {
  //       observedMappings.push(residuesOfMappingObserved);
  //     }
  //   }
  //   return observedMappings;
  // }

  filterMappingObservedWithCoverage(domainMappings: DomainMapping[], polymerCoverage: PolymerCoverageMolecule[]): number[] {
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
}
