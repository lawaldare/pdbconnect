import { ColDef, ValueFormatterParams } from 'ag-grid-community'; // Column Definition Type Interface
import { TableHeaderWithTooltipComponent } from '../../shared/interactive-tables/sub-components/table-header-with-tooltip/table-header-with-tooltip.component';
import { depositionDateTooltip, expEmBufferTooltip, nmrContentsTooltip, nmrSampleTooltip, releaseDateTooltip, revisionDateTooltip } from '../../../entry-constant';
import { ExperimentRawRow, XRayStatsRow } from './table-rows.model';
import { ExperimentalInfoValueRendererComponent } from './experimental-info-value.component';

export const VALIDATION_COLUMN_DEFS: ColDef[] = [
  {
    headerName: 'Metric',
    field: 'metric',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Description',
    field: 'description',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
];

export const EXPERIMENTAL_INFO_COLUMN_DEFS: ColDef[] = [
  {
    headerName: 'Metric',
    field: 'label',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Value',
    field: 'value',
    cellRenderer: ExperimentalInfoValueRendererComponent,
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
];

export const XRAY_DATASET_REFINEMENT_COLUMN_DEFS: ColDef[] = [
  {
    headerName: 'Metric',
    field: 'metric',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Value',
    field: 'value',
    flex: 1.4444,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: (params: ValueFormatterParams<XRayStatsRow, string>) => {
      return fieldFormatterXRayRow(params.data!);
    },
  },
  {
    headerName: 'Source',
    field: 'source',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
];

/**
 * Function for adding necessary styles and extra templates for XRay related data columns
 * (Dataset and Refinements table)
 * @param rowData
 */
function fieldFormatterXRayRow(rowData: XRayStatsRow) {
  // For Dataset statistics
  if (rowData.metric === 'Cell dimensions') {
    return `
      <div>
          <div>
              <span><b>a:</b>${rowData.value[0]}</span>
              <span style="margin-left: 10px;"><b>b:</b>${rowData.value[1]}</span>
              <span style="margin-left: 10px;"><b>c:</b>${rowData.value[2]}</span>
              <br>
          </div>
          <div>
              <span><b>α:</b> ${rowData.value[3]}</span>
              <span style="margin-left: 10px;"><b>β:</b> ${rowData.value[4]}</span>
              <span style="margin-left: 10px;"><b>γ:</b> ${rowData.value[5]}</span>
          </div>
      </div>`;
  }
  if (rowData.metric === 'EDS resolution') {
    // 2.19Å - 10Å
    const newValue = `${rowData.value[0]}Å - ${rowData.value[1]}Å`;
    return `<span>${newValue}</span>`;
  }
  if (rowData.metric === 'Twinning statistics') {
    const newValue = `<|L|> = ${rowData.value[0]}, <|L<sup>2</sup>|> = ${rowData.value[1]}`;
    return `<span>${newValue}</span>`;
  }
  if (rowData.metric === 'Spacegroup') {
    let newValue = `<i>${rowData.value[0]}</i> `;
    for (let i = 1; i < rowData.value.length; i++) {
      const char = rowData.value[i];
      if (char.length === 1) newValue += `${char}`;
      else if (char.length > 0) {
        newValue += `${char[0]}<sub>${char.slice(1)}</sub>`;
      }
    }
    return `<span>${newValue}</span>`;
  }
  if (rowData.metric === 'Wilson B' || rowData.metric === 'Bulk solvent B') {
    const newValue = `${rowData.value[0]} Å<sup>2</sup>`;
    return `<span>${newValue}</span>`;
  }
  // For Refinement statistics
  if (rowData.metric === 'Bulk solvent k') {
    const newValue = `${rowData.value[0]} e<sup>-</sup>/Å<sup>3</sup>`;
    return `<span>${newValue}</span>`;
  }
  return `<span>${rowData.value.join(' ')}</span>`;
}

export const NMR_SAMPLE_COLUMN_DEFS: ColDef[] = [
  {
    headerName: 'Sample',
    field: 'sample',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
    headerComponent: TableHeaderWithTooltipComponent,
    headerComponentParams: {
      customHeader: 'Sample',
      customTooltip: nmrSampleTooltip,
    },
  },
  {
    headerName: 'Contents',
    field: 'contents',
    flex: 3.6207,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
    headerComponent: TableHeaderWithTooltipComponent,
    headerComponentParams: {
      customHeader: 'Contents',
      customTooltip: nmrContentsTooltip,
    },
  },
  {
    headerName: 'Recorded spectra',
    field: 'recordedSpectra',
    flex: 3.9195,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
];

export const EM_SPECIMEN_PREP_COLUMN_DEFS: ColDef[] = [
  {
    headerName: 'Buffer name',
    field: 'bufferName',
    flex: 2.4375,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
    headerComponent: TableHeaderWithTooltipComponent,
    headerComponentParams: {
      customHeader: 'Buffer name',
      customTooltip: expEmBufferTooltip,
    },
  },
  {
    headerName: 'pH',
    field: 'ph',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Details',
    field: 'details',
    flex: 2.4375,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
];

export const EM_VITRIFICATION_COLUMN_DEFS: ColDef[] = [
  {
    headerName: 'Cryogen',
    field: 'cryogen',
    flex: 1.05405405,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Temperature',
    field: 'temperature',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Instrument',
    field: 'instrument',
    flex: 1.05405405,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Humidity',
    field: 'humidity',
    flex: 1.05405405,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Details',
    field: 'details',
    flex: 2.0990991,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
];

export const EM_REFINEMENT_STATS_COLUMN_DEFS: ColDef[] = [
  {
    headerName: 'Structure solution method',
    field: 'solutionMethod',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Resolution',
    field: 'resolution',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
];

export const EXP_RAW_ACCESSIONS_COLUMN_DEFS: ColDef[] = [
  {
    headerValueGetter: (params: { context: { firstHeader: string } }) => {
      return params.context.firstHeader;
    },
    field: 'accession',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
    cellRenderer: (params: ValueFormatterParams<ExperimentRawRow, string>) => {
      // return fieldFormatterXRayRow(params.data!);
      let link = '';
      let linkName = '';
      if (params.data!.resource === 'BMRB') {
        link = `https://bmrb.io/data_library/summary/index.php?bmrbId=${params.data!.accession}`;
        linkName = `BMR${params.data!.accession}`;
      } else if (params.data!.resource === 'EMPIAR') {
        link = `https://www.ebi.ac.uk/empiar/${params.data!.accession}/`;
        linkName = `${params.data!.accession}`;
      } else if (params.data!.resource === 'SBGrid') {
        link = `https://data.sbgrid.org/dataset/${params.data!.accession}`;
        linkName = `${params.data!.resource} ${params.data!.accession}`;
      } else if (params.data!.resource === 'IRRMC') {
        link = `https://proteindiffraction.org/project/${params.data!.accession}/`;
        linkName = `${params.data!.resource} ${params.data!.accession}`;
      } else {
        link = params.data!.link!;
        linkName = `${params.data!.accession}`;
      }
      return `<a>${linkName}</a>`;
    },
  },
  {
    headerName: 'Datasets',
    field: 'datasets',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
  {
    headerName: 'Total size',
    field: 'totalSize',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
  },
];

export const TIMELINE_COLUMN_DEFS: ColDef[] = [
  {
    headerName: 'Deposition date',
    field: 'depositionDate',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
    headerComponent: TableHeaderWithTooltipComponent,
    headerComponentParams: {
      customHeader: 'Deposition date',
      customTooltip: depositionDateTooltip,
    },
  },
  {
    headerName: 'Release date',
    field: 'releaseDate',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
    headerComponent: TableHeaderWithTooltipComponent,
    headerComponentParams: {
      customHeader: 'Release date',
      customTooltip: releaseDateTooltip,
    },
  },
  {
    headerName: 'Revision date',
    field: 'revisionDate',
    flex: 1,
    wrapText: true,
    autoHeight: true,
    autoHeaderHeight: true,
    filter: false,
    resizable: false,
    headerComponent: TableHeaderWithTooltipComponent,
    headerComponentParams: {
      customHeader: 'Revision date',
      customTooltip: revisionDateTooltip,
    },
  },
];
