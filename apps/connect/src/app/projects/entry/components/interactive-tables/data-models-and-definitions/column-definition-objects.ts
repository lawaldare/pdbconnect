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
import { TableHeaderWithTooltipComponent } from '../sub-components/table-header-with-tooltip/table-header-with-tooltip.component';
import { assemblyCompositionTooltip, complexIdTooltip, ligandChipColors, ligandChipTooltips } from '../../../entry-constant';
import { TableLigandsAnnotationChipComponent } from '../sub-components/table-ligands-annotation-chip/table-ligands-annotation-chip.component';

/**
 * Assemblies table column rendering definitions
 */

export const ASSEMBLIES_COL_DEFS: ColDef[] = [
  {
    headerName: 'Assembly and macromolecule name',
    field: 'assemblyName',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: (params: ValueFormatterParams<AssembliesRowData, string>) => {
      return `<div>
        <b class="tbl-col-1-assembly" >${params.data!.assemblyName}</b><br/>
        <span>${params.data!.complexName}</span>
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
      if (params.data!.complexId.length > 0) {
        return `<a>${params.data!.complexId} <i class="icon icon-common icon-search icon-search-small-blue"></i></a>`;
      }
      return '';
    },
    headerComponent: TableHeaderWithTooltipComponent,
    headerComponentParams: {
      customHeader: 'PDBe Complex ID',
      customTooltip: complexIdTooltip,
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
    headerComponent: TableHeaderWithTooltipComponent,
    headerComponentParams: {
      customHeader: 'Multimeric states',
      customTooltip: assemblyCompositionTooltip,
    },
  },
];

/**
 * Macromolecules table column rendering definitions
 */

export const MACROMOLECULES_COL_DEFS: ColDef[] = [
  {
    headerName: 'Molecule name and chain',
    field: 'name',
    // width: 158,
    flex: 1.57,
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
    flex: 0.6,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Residue range',
    field: 'residues',
    // width: 156,
    // flex: 1.56,
    flex: 1.3,
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
    headerName: 'Source organisms',
    field: 'organisms',
    // width: 130,
    // flex: 1.3,
    flex: 1.4,
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
    // flex: 1.1,
    flex: 1.4,
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
  // {
  //   headerName: 'More details',
  //   flex: 0.8,
  //   wrapText: true,
  //   autoHeight: true,
  //   filter: false,
  //   resizable: false,
  //   cellRenderer: () => {
  //     return `<button class="vf-table-button">View</button>`;
  //   },
  // },
];

/**
 * Ligands and Environments table column rendering definitions
 */

export const LIGANDS_COL_DEFS: ColDef[] = [
  {
    headerName: 'Image',
    field: 'id',
    // width: 107,
    // flex: 1,
    flex: 1.1,
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
    // flex: 2.66,
    flex: 2.72,
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
    // flex: 2.66,
    flex: 2.72,
    wrapText: true,
    autoHeight: true,
    cellRenderer: TableLigandsAnnotationChipComponent,
    cellRendererParams: (params: ValueFormatterParams<LigandsRowData, LigandsAnnotation>) => {
      return {
        chipTooltip: ligandChipTooltips[params.value!.description],
        chipText: params.value!.description,
        bgColor: ligandChipColors[params.value!.description],
      };
    },
  },
];

/**
 * Domains table column rendering definitions
 */

export const DOMAINS_COL_DEFS: ColDef[] = [
  {
    headerName: 'Accession',
    field: 'accessionName',
    // flex: 1.8,
    flex: 1.2,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: (params: ValueFormatterParams<DomainsRowData, string>) => {
      return `
      <div class="tbl-col-accession-name">
        <a>${params.data!.additionalData.accession}</a>
        <span>${params.data!.accessionName}</span>
      </div>`;
    },
  },
  {
    headerName: 'Molecule name',
    field: 'moleculeNames',
    // flex: 1.8,
    flex: 1.2,
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
    // flex: 1.5,
    flex: 1.2,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Segments',
    field: 'segments',
    // flex: 1.5,
    flex: 1.2,
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
    // flex: 1,
    flex: 1.2,
    wrapText: true,
    autoHeight: true,
    filter: false,
    resizable: false,
  },
];
