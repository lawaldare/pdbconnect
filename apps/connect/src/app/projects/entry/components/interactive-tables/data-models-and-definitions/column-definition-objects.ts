import { ColDef, ValueFormatterParams } from 'ag-grid-community'; // Column Definition Type Interface
import {
  AssembliesRowData,
  DomainsRowData,
  LigandsAnnotation,
  LigandsCodeAndName,
  LigandsRowData,
  MacromoleculesName,
  MacromoleculesResidueRanges,
  MacromoleculesRowData,
} from './row-and-table.model';
import { PDBE_KB_ICON_BASE64 } from './pdbe-kb-icon-base64';

/**
 * Assemblies table
 */

export const ASSEMBLIES_COL_DEFS: ColDef[] = [
  {
    headerName: 'Assembly name',
    field: 'assemblyName',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: (params: ValueFormatterParams<AssembliesRowData, string>) => {
      return `<div class="tbl-col-assembly-name">
        <b>${params.data!.assemblyName}</b><br/>
        ${params.data!.complexName}
      </div>`;
    },
  },
  {
    headerName: 'PDBe Complex ID',
    field: 'complexId',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: (params: ValueFormatterParams<AssembliesRowData, string>) => {
      // const iconStyle = `--icon-search-color: #193f90;
      // width: 12px;
      // height: 12px;
      // mask-size: auto 12px;
      // position: absolute;
      // z-index: -1;
      // top: 4px;`

      if (params.data!.complexId.length > 0) {
        return `<a>${params.data!.complexId} <i class="icon icon-common icon-search icon-search-small-blue"></i></a>`;
      }
      return '';
    },
  },
  {
    headerName: 'Multimeric states',
    field: 'multimericStates',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'More details',
    flex: 0.8,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: () => {
      return `<button class="vf-table-button">View</button>`;
    },
  },
];

/**
 * Macromolecules table
 */

export const MACROMOLECULES_COL_DEFS: ColDef[] = [
  {
    headerName: 'Molecule name',
    field: 'name',
    // width: 158,
    flex: 1.58,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    filterValueGetter: (params) => {
      return params.data.name.molecule + ' ' + params.data.name.chains.join(', ');
    },
    cellRenderer: (params: ValueFormatterParams<MacromoleculesRowData, MacromoleculesName>) => {
      return `<div>
        <span class="tbl-col-macromolecules-name">${params.value!.molecule}</span>
        <span>${params.value!.chains.join(', ')}</span>
      </div>`;
    },
  },
  {
    field: 'length',
    // width: 100,
    flex: 1,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Residue range',
    field: 'residues',
    // width: 156,
    flex: 1.56,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    filterValueGetter: (params) => {
      return params.data.residues
        .map((eachResid: MacromoleculesResidueRanges) => {
          return eachResid.range + ' Coverage:' + eachResid.coverage + ' ' + eachResid.uniprot;
        })
        .join(', ');
    },
    cellRenderer: (params: ValueFormatterParams<MacromoleculesRowData, MacromoleculesResidueRanges[]>) => {
      const pdbKBBase64 = PDBE_KB_ICON_BASE64;

      let rangeString = '';
      for (const range of params.value!) {
        rangeString += `<div>
          <div>${range.range}</div>
          <div>Coverage: ${range.coverage}</div>
          <div>
            <a>${range.uniprot} <img style="width: 16px;" src="${pdbKBBase64}"/></a>
          </div>
        </div>`;
      }
      return rangeString;
    },
  },
  {
    headerName: 'Source Organisms',
    field: 'organisms',
    // width: 130,
    flex: 1.3,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: (params: ValueFormatterParams<MacromoleculesRowData, string[]>) => {
      let rangeString = '';
      for (const organism of params.value!) {
        rangeString += `<div>
          <div class="tbl-col-macromolecules-organisms">
            <a style="display: block;">${organism}</a>
          </div>
        </div>`;
      }
      return rangeString;
    },
  },
  {
    headerName: 'Gene names',
    field: 'genes',
    // width: 110,
    flex: 1.1,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: (params: ValueFormatterParams<MacromoleculesRowData, string[]>) => {
      let rangeString = '';
      for (let i = 0; i < params.value!.length; i++) {
        const geneName = params.value![i];
        rangeString += `<a>${geneName}</a>`;
        if (i < params.value!.length - 1) rangeString += ', ';
      }
      return `<div>${rangeString}</div>`;
    },
  },
  {
    headerName: 'More details',
    flex: 0.8,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: () => {
      return `<button class="vf-table-button">View</button>`;
    },
  },
];

/**
 * Ligands and Environments table
 */

export const LIGANDS_COL_DEFS: ColDef[] = [
  {
    headerName: 'Image',
    field: 'id',
    width: 107,
    flex: 1,
    wrapText: true,
    autoHeight: true,
    filter: false,
    cellRenderer: (params: ValueFormatterParams<LigandsRowData, string>) => {
      return `<img class="tbl-col-ligands-img" src="https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${params.value!}_100.svg"></img>`;
    },
  },
  {
    headerName: 'Ligand code and name',
    field: 'codeAndName',
    // width: 285,
    flex: 2.66,
    cellRenderer: (params: ValueFormatterParams<LigandsRowData, LigandsCodeAndName>) => {
      const countDiv = `<div class="tbl-col-ligands-count">
        ${params.value!.count} x ${params.node!.data!.id}
      </div>`;

      const nameDiv = `<div class="tbl-col-ligands-name">
        ${params.value!.name}
      </div>`;

      return `<div>${countDiv}${nameDiv}</div>`;
    },
  },
  {
    headerName: 'Annotation',
    field: 'annotation',
    // width: 285,
    flex: 2.66,
    wrapText: true,
    autoHeight: true,
    cellRenderer: (params: ValueFormatterParams<LigandsRowData, LigandsAnnotation>) => {
      const CHIP_COLORS: {
        [key: string]: string;
      } = {
        Unannotated: '#E4E4E4',
        'Drug-like': '#D2DE56',
        'Cofactor-like': '#DBBFE3',
        'Reactant-like': '#FEE99A',
        Modification: '#FE9A9A',
      };
      let annotationClasses = 'tbl-col-ligands-annotation';
      let hasBackground = '';
      if (params.value!.isChip) {
        annotationClasses += ' tbl-col-ligands-chip';
        // chip color defined here
        hasBackground += `style="background: ${CHIP_COLORS[params.value!.description]};"`;
      }
      return `<div class="${annotationClasses}" ${hasBackground}>
        ${params.value!.description}
      </div>`;
    },
  },
  {
    headerName: 'More details',
    flex: 0.8,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: () => {
      return `<button class="vf-table-button">View</button>`;
    },
  },
];

/**
 * Domains table
 */

export const DOMAINS_COL_DEFS: ColDef[] = [
  {
    headerName: 'Accession',
    field: 'domainName',
    flex: 1.8,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Molecule name',
    field: 'moleculeNames',
    flex: 1.8,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: (params: ValueFormatterParams<DomainsRowData, string>) => {
      let htmlString = '';
      for (const molName of params.data!.moleculeNames) {
        htmlString += `${molName}<br/>`;
      }
      return htmlString;
    },
  },
  {
    headerName: 'Domain',
    field: 'domain',
    flex: 1.5,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Segments',
    field: 'segments',
    flex: 1.5,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: (params: ValueFormatterParams<DomainsRowData, string>) => {
      let htmlString = '';
      for (const segName of params.data!.segments) {
        htmlString += `${segName}<br/>`;
      }
      return htmlString;
    },
  },
  {
    headerName: 'Origin',
    field: 'resource',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'More details',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: () => {
      return `<button class="vf-table-button">View</button>`;
    },
  },
];
