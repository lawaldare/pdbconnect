import { signal, WritableSignal } from '@angular/core';
import { CathMappings, DomainMapping, PfamMappings, ScopMappings } from '../../../data-models/domains.model';
import { Molecule } from '../../../data-models/molecule.model';
import { MolstarResidueInfo, MolstarSelectionObj } from '../../../helpers/molstar/molstar-helpers';
import { DomainsBoundaries, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';

export class DomainDataToTable extends DataToTable {
  // Domain specific data
  pfamMappings: PfamMappings;
  cathMappings: CathMappings;
  scopMappings: ScopMappings;
  macromolecules: Molecule[];
  molstarResidueInfo: MolstarResidueInfo[];

  molstarHardResetOnSelect = false;
  protvistaForSelection = true;
  topolViewerForSelection = false;
  ligandEnvViewerForSelection = false;
  displayFilters = true;
  tableRows: WritableSignal<TableRow[]> = signal([]);
  tableFilters: WritableSignal<TableFilter[]> = signal([]);

  constructor(
    pfamMappings: PfamMappings,
    cathMappings: CathMappings,
    scopMappings: ScopMappings,
    macromolecules: Molecule[],
    molstarResidueInfo: MolstarResidueInfo[]
  ) {
    super();
    this.pfamMappings = pfamMappings;
    this.cathMappings = cathMappings;
    this.scopMappings = scopMappings;
    this.macromolecules = macromolecules;
    this.molstarResidueInfo = molstarResidueInfo;
  }

  generateTableData(): TableRow[] {
    let rows: TableRow[] = [];
    if (this.tableRows().length === 0) {
      // parse CATH domains json structure
      for (const [resourceAcc, data] of Object.entries(this.cathMappings)) {
        // domain names in CATH are unique 'domain' fields inside mappings
        const domainDesc = data.homology;
        const domainNames = data.mappings.map((mapping) => mapping.domain!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);

        for (const domainName of domainNames) {
          const mappings = data.mappings.filter((mapping) => mapping.domain! === domainName);

          const entityIds = mappings.map((mapping) => mapping.entity_id).filter((entityId, idx, ids) => ids.indexOf(entityId) === idx);

          const moleculeNames = this.macromolecules.filter((mol) => entityIds.indexOf(mol.entity_id) > -1).map((mol) => mol.molecule_name[0]);

          const segmentData = this.formatSegments(mappings, this.molstarResidueInfo);

          if (segmentData.segments.length === 0) continue;

          rows.push({
            domainName: `${domainDesc} (${resourceAcc})`,
            resource: 'CATH',
            domain: domainName,
            moleculeNames: moleculeNames,
            segments: segmentData.segments,
            additionalData: {
              accession: resourceAcc,
              selections: [segmentData.molstarSelection],
              boundaries: segmentData.segmentsBoundaries,
              segmentsResidNumbers: segmentData.segmentsResidNumber,
            },
          });
        }
      }

      // parse SCOP domains json structure
      for (const [resourceAcc, data] of Object.entries(this.scopMappings)) {
        // domain names in SCOP are unique 'scop_id' fields inside mappings
        const domainDesc = data.description;
        const domainNames = data.mappings.map((mapping) => mapping.scop_id!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);

        for (const domainName of domainNames) {
          const mappings = data.mappings.filter((mapping) => mapping.scop_id! === domainName);

          const entityIds = mappings.map((mapping) => mapping.entity_id).filter((entityId, idx, ids) => ids.indexOf(entityId) === idx);

          const moleculeNames = this.macromolecules.filter((mol) => entityIds.indexOf(mol.entity_id) > -1).map((mol) => mol.molecule_name[0]);

          const segmentData = this.formatSegments(mappings, this.molstarResidueInfo);

          if (segmentData.segments.length === 0) continue;

          rows.push({
            domainName: `${domainDesc} (${resourceAcc})`,
            resource: 'SCOP',
            domain: domainName,
            moleculeNames: moleculeNames,
            segments: segmentData.segments,
            additionalData: {
              accession: resourceAcc,
              selections: [segmentData.molstarSelection],
              boundaries: segmentData.segmentsBoundaries,
              segmentsResidNumbers: segmentData.segmentsResidNumber,
            },
          });
        }
      }

      // parse Pfam domains json structure
      for (const [resourceAcc, data] of Object.entries(this.pfamMappings)) {
        const domainDesc = data.description;
        for (let i = 0; i < data.mappings.length; i++) {
          const mapping = data.mappings[i];
          const domain = `${resourceAcc}-${i + 1}`;
          const moleculeNames = this.macromolecules.filter((mol) => mapping.entity_id === mol.entity_id).map((mol) => mol.molecule_name[0]);

          const segmentData = this.formatSegments([mapping], this.molstarResidueInfo);

          if (segmentData.segments.length === 0) continue;

          rows.push({
            domainName: `${domainDesc} (${resourceAcc})`,
            resource: 'Pfam',
            domain: domain,
            moleculeNames: moleculeNames,
            segments: segmentData.segments,
            additionalData: {
              accession: resourceAcc,
              selections: [segmentData.molstarSelection],
              boundaries: segmentData.segmentsBoundaries,
              segmentsResidNumbers: segmentData.segmentsResidNumber,
            },
          });
        }
      }

      this.tableRows.set(rows);
    } else {
      rows = [...this.tableRows()];
    }
    return rows;
  }

  formatSegments(mappings: DomainMapping[], molstarResidueInfo: MolstarResidueInfo[]) {
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
      segments.push(
        `${chainId} ${firstRes.author_residue_number}${firstRes.author_insertion_code} - ${lastRes.author_residue_number}${lastRes.author_insertion_code}`
      );
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

  generateTableFilters(): TableFilter[] {
    let newFilters: TableFilter[] = [];
    if (this.tableFilters().length === 0) {
      let cathDomainCount = 0;
      for (const [_resourceAcc, data] of Object.entries(this.cathMappings)) {
        const domainIds: string[] = [];
        for (const mapping of data.mappings) {
          const filteredCathMapping = this.filterMappingObserved([mapping], this.molstarResidueInfo);
          if (filteredCathMapping.length === 0) continue;
          if (domainIds.indexOf(mapping.domain!) === -1) {
            domainIds.push(mapping.domain!);
          }
        }
        cathDomainCount += domainIds.length;
      }

      let scopDomainCount = 0;
      for (const [_resourceAcc, data] of Object.entries(this.scopMappings)) {
        const domainIds: string[] = [];
        for (const mapping of data.mappings) {
          const filteredScopMapping = this.filterMappingObserved([mapping], this.molstarResidueInfo);
          if (filteredScopMapping.length === 0) continue;
          if (domainIds.indexOf(mapping.scop_id!) === -1) {
            domainIds.push(mapping.scop_id!);
          }
        }
        scopDomainCount += domainIds.length;
      }

      let pfamDomainCount = 0;
      for (const [_resourceAcc, data] of Object.entries(this.pfamMappings)) {
        const filteredPfamMappings = this.filterMappingObserved(data.mappings, this.molstarResidueInfo);
        pfamDomainCount += filteredPfamMappings.length;
      }

      newFilters.push({
        types: ['CATH', 'SCOP', 'Pfam'],
        description: `All (${pfamDomainCount + cathDomainCount + scopDomainCount} domains)`,
      });
      if (cathDomainCount > 0) {
        newFilters.push({
          types: ['CATH'],
          description: `${cathDomainCount} CATH domains`,
        });
      }
      if (scopDomainCount > 0) {
        newFilters.push({
          types: ['SCOP'],
          description: `${scopDomainCount} SCOP 1.75 domains`,
        });
      }
      if (pfamDomainCount > 0) {
        newFilters.push({
          types: ['Pfam'],
          description: `${pfamDomainCount} Pfam domains`,
        });
      }
      if (newFilters.length === 2) {
        newFilters.shift();
      }
      this.tableFilters.set(newFilters);
    } else {
      newFilters = [...this.tableFilters()];
    }
    return newFilters;
  }

  filterMappingObserved(domainMappings: DomainMapping[], molstarResidueInfo: MolstarResidueInfo[]) {
    const observedMappings: MolstarResidueInfo[][] = [];
    for (const mapping of domainMappings) {
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
      const residuesOfMappingObserved = residuesOfChain.filter((resid) => {
        return resid.label_seq_id! <= mapping.end.residue_number && resid.label_seq_id! >= mapping.start.residue_number;
      });
      if (residuesOfMappingObserved.length > 0) {
        observedMappings.push(residuesOfMappingObserved);
      }
    }
    return observedMappings;
  }
}
