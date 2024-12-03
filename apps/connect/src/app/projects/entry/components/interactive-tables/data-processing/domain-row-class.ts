import { signal, WritableSignal } from '@angular/core';
import { CathMappings, DomainMapping, PfamMappings, ScopMappings } from '../../../data-models/domains.model';
import { Molecule } from '../../../data-models/molecule.model';
import { ResidueListing, ResidueOfListing } from '../../../data-models/residue-listing.model';
import { MolstarSelectionObj } from '../../../helpers/molstar-helpers';
import { DomainsBoundaries, TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { DataToTable } from './abstract-base-row-class';

export class DomainDataToTable extends DataToTable {
  molstarHardResetOnSelect = false;
  protvistaForSelection = true;
  topolViewerForSelection = false;
  ligandEnvViewerForSelection = false;
  displayFilters = true;
  tableRows: WritableSignal<TableRow[]> = signal([]);
  tableFilters: WritableSignal<TableFilter[]> = signal([]);

  generateTableData(pageInformation: any): TableRow[] {
    const macromolecules: Molecule[] = pageInformation.molecules.macroMolecules;
    const residueListing: ResidueListing = pageInformation.residueListing;
    const pfamMappings: PfamMappings = pageInformation.pfamMapping;
    const cathMappings: CathMappings = pageInformation.cathMapping;
    const scopMappings: ScopMappings = pageInformation.scopMapping;

    let rows: TableRow[] = [];
    if (this.tableRows().length === 0) {
      // parse Pfam domains json structure
      for (const [resourceAcc, data] of Object.entries(pfamMappings)) {
        const domainDesc = data.description;
        for (let i = 0; i < data.mappings.length; i++) {
          const mapping = data.mappings[i];
          const domain = `${resourceAcc}-${i + 1}`;
          const moleculeNames = macromolecules.filter((mol) => mapping.entity_id === mol.entity_id).map((mol) => mol.molecule_name[0]);

          const segmentData = this.formatSegments([mapping], residueListing);
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

      // parse CATH domains json structure
      for (const [resourceAcc, data] of Object.entries(cathMappings)) {
        // domain names in CATH are unique 'domain' fields inside mappings
        const domainDesc = data.homology;
        const domainNames = data.mappings.map((mapping) => mapping.domain!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);

        for (const domainName of domainNames) {
          const mappings = data.mappings.filter((mapping) => mapping.domain! === domainName);

          const entityIds = mappings.map((mapping) => mapping.entity_id).filter((entityId, idx, ids) => ids.indexOf(entityId) === idx);

          const moleculeNames = macromolecules.filter((mol) => entityIds.indexOf(mol.entity_id) > -1).map((mol) => mol.molecule_name[0]);

          const segmentData = this.formatSegments(mappings, residueListing);
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
      for (const [resourceAcc, data] of Object.entries(scopMappings)) {
        // domain names in SCOP are unique 'scop_id' fields inside mappings
        const domainDesc = data.description;
        const domainNames = data.mappings.map((mapping) => mapping.scop_id!).filter((domainName, idx, ids) => ids.indexOf(domainName) === idx);

        for (const domainName of domainNames) {
          const mappings = data.mappings.filter((mapping) => mapping.scop_id! === domainName);

          const entityIds = mappings.map((mapping) => mapping.entity_id).filter((entityId, idx, ids) => ids.indexOf(entityId) === idx);

          const moleculeNames = macromolecules.filter((mol) => entityIds.indexOf(mol.entity_id) > -1).map((mol) => mol.molecule_name[0]);

          const segmentData = this.formatSegments(mappings, residueListing);
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
      this.tableRows.set(rows);
    } else {
      rows = [...this.tableRows()];
    }
    return rows;
  }

  formatSegments(mappings: DomainMapping[], residueListing: ResidueListing) {
    const segments: string[] = [];
    const segmentsResidNumber: string[] = [];

    const molstarSelection: MolstarSelectionObj = {
      residues: [],
    };

    const segmentsBoundaries: DomainsBoundaries[] = [];

    const mappingsByChain = mappings.sort();
    let prevChain = 'undef';
    for (const mapping of mappingsByChain) {
      const residueListingEntity = residueListing['molecules'].filter((entity) => entity.entity_id === mapping.entity_id)[0];
      const residueListingChain = residueListingEntity['chains'].filter((chain) => chain.chain_id === mapping.chain_id)[0];
      const residuesOfChain = residueListingChain['residues'].sort((a, b) => a.residue_number - b.residue_number);

      const chainId = mapping.chain_id !== prevChain ? `${mapping.chain_id}:` : ' ';
      let firstRes = {
        residue_number: mapping.start.residue_number,
        author_residue_number: mapping.start.author_residue_number + '',
        author_insertion_code: mapping.start.author_insertion_code,
      };
      if (mapping.start.author_residue_number === null) {
        const residuesOfChainAboveStart = residuesOfChain.filter((resid) => resid.observed_ratio > 0 && resid.residue_number >= mapping.start.residue_number);
        if (residuesOfChainAboveStart.length === 0) continue;
        firstRes = {
          residue_number: residuesOfChainAboveStart[0].residue_number,
          author_residue_number: residuesOfChainAboveStart[0].author_residue_number + '',
          author_insertion_code: residuesOfChainAboveStart[0].author_insertion_code,
        };
      }
      let lastRes = {
        residue_number: mapping.end.residue_number,
        author_residue_number: mapping.end.author_residue_number + '',
        author_insertion_code: mapping.end.author_insertion_code,
      };
      if (mapping.end.author_residue_number === null) {
        const residuesOfChainBelowEnd = residuesOfChain.filter((resid) => resid.observed_ratio > 0 && resid.residue_number <= mapping.end.residue_number);
        if (residuesOfChainBelowEnd.length === 0) continue;
        lastRes = {
          residue_number: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].residue_number,
          author_residue_number: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].author_residue_number + '',
          author_insertion_code: residuesOfChainBelowEnd[residuesOfChainBelowEnd.length - 1].author_insertion_code,
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

  generateTableFilters(pageInformation: any): TableFilter[] {
    const pfamMappings: PfamMappings = pageInformation.pfamMapping;
    const residueListing: ResidueListing = pageInformation.residueListing as ResidueListing;
    const cathMappings: CathMappings = pageInformation.cathMapping;
    const scopMappings: ScopMappings = pageInformation.scopMapping;
    let newFilters: TableFilter[] = [];
    if (this.tableFilters().length === 0) {
      // TODO: Filter non observed mappings here
      let pfamDomainCount = 0;
      for (const [_resourceAcc, data] of Object.entries(pfamMappings)) {
        const filteredPfamMappings = this.filterMappingObserved(data.mappings, residueListing);
        pfamDomainCount += filteredPfamMappings.length;
      }

      let cathDomainCount = 0;
      for (const [_resourceAcc, data] of Object.entries(cathMappings)) {
        const domainIds: string[] = [];
        for (const mapping of data.mappings) {
          const filteredCathMapping = this.filterMappingObserved([mapping], residueListing);
          if (filteredCathMapping.length === 0) continue;
          if (domainIds.indexOf(mapping.domain!) === -1) {
            domainIds.push(mapping.domain!);
          }
        }
        cathDomainCount += domainIds.length;
      }

      let scopDomainCount = 0;
      for (const [_resourceAcc, data] of Object.entries(scopMappings)) {
        const domainIds: string[] = [];
        for (const mapping of data.mappings) {
          const filteredScopMapping = this.filterMappingObserved([mapping], residueListing);
          if (filteredScopMapping.length === 0) continue;
          if (domainIds.indexOf(mapping.scop_id!) === -1) {
            domainIds.push(mapping.scop_id!);
          }
        }
        scopDomainCount += domainIds.length;
      }

      newFilters.push({
        types: ['Pfam', 'CATH', 'SCOP'],
        description: `All (${pfamDomainCount + cathDomainCount + scopDomainCount} domains)`,
      });
      if (pfamDomainCount > 0) {
        newFilters.push({
          types: ['Pfam'],
          description: `${pfamDomainCount} Pfam`,
        });
      }
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
      this.tableFilters.set(newFilters);
    } else {
      newFilters = [...this.tableFilters()];
    }
    return newFilters;
  }

  filterMappingObserved(domainMappings: DomainMapping[], residueListing: ResidueListing) {
    const observedMappings: ResidueOfListing[][] = [];
    for (const mapping of domainMappings) {
      const residueListingEntity = residueListing['molecules'].filter((entity) => entity.entity_id === mapping.entity_id)[0];
      const residueListingChain = residueListingEntity['chains'].filter((chain) => chain.chain_id === mapping.chain_id)[0];
      const residuesOfChain = residueListingChain['residues'].sort((a, b) => a.residue_number - b.residue_number);
      const residuesOfMappingObserved = residuesOfChain.filter((resid) => {
        return resid.observed_ratio > 0 && resid.residue_number <= mapping.end.residue_number && resid.residue_number >= mapping.start.residue_number;
      });
      observedMappings.push(residuesOfMappingObserved);
    }
    return observedMappings;
  }
}
