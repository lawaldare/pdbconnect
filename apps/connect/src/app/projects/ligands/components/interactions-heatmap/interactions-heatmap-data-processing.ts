import { HotmapLigDatum, LigIntHeatmapData } from './data-models/lig-int-heatmap-data';
import { LigIntAPIKeys, LigIntCountsDictionary } from './data-models/lig-int-heatmap-data-api';
import { ViewerData } from './data-models/viewer-data';

export const INTX_NAME_STANDARDIZER = {
  clash: 'Covalent clashes',
  covalent: 'Covalent interactions',
  vdw_clash: 'Van der Waals clashes',
  vdw: 'Van der Waals interactions',
  hbond: 'Hydrogen bonds',
  xbond: 'Halogen bonds',
  ionic: 'Ionic interactions',
  metal_complex: 'Metal complex interactions',
  aromatic: 'Aromatic interactions',
  hydrophobic: 'Hydrophobic interactions',
  carbonyl: 'Carbonyl interactions',
  polar: 'Polar interactions',
  CARBONPI: 'Carbon-pi interactions',
  CATIONPI: 'Cation-pi interactions',
  DONORPI: 'Hydrogen bond donor-pi interactions',
  HALOGENPI: 'Halogen-pi interactions',
  METSULPHURPI: 'Methionine sulphur-pi interactions',
  plane_plane: 'Plane-Plane interactions',
  AMIDEAMIDE: 'Amide-Amide interactions',
  AMIDERING: 'Amide-Ring interactions',
};

export const aminoAcids: string[] = [
  'ALA',
  'CYS',
  'ASP',
  'GLU',
  'PHE',
  'GLY',
  'HIS',
  'ILE',
  'LYS',
  'LEU',
  'MET',
  'ASN',
  'PRO',
  'GLN',
  'ARG',
  'SER',
  'THR',
  'VAL',
  'TRP',
  'TYR',
];

export function processAPIData(
  atomList: string[],
  apiData: LigIntCountsDictionary
): {
  // filteredAtomNames: string[];
  totalInteractions: number;
  toFilter: {
    atomName: string;
    interactionType: string;
    aminoAcid: string;
    aminoAcidNumber: number;
  }[];
} {
  let totalInteractions = 0;

  const toFilterData: {
    atomName: string;
    interactionType: string;
    aminoAcid: string;
    aminoAcidNumber: number;
  }[] = [];

  const interactionsByAtomName: {
    [key: string]: number;
  } = {};

  // Init all aminoAcids for all atoms with 0 count
  for (const atomName of atomList) {
    interactionsByAtomName[atomName] = 0;
    for (const aminoAcid of aminoAcids) {
      toFilterData.push({
        atomName: atomName,
        interactionType: 'default',
        aminoAcid: aminoAcid,
        aminoAcidNumber: 0,
      });
    }
  }
  const interactionKeys = Object.keys(INTX_NAME_STANDARDIZER);
  // add actual interactions data to it
  for (const interactionKey of interactionKeys) {
    if (Object.prototype.hasOwnProperty.call(apiData, interactionKey)) {
      const interactionsList = apiData[<LigIntAPIKeys>interactionKey];
      for (const interaction of interactionsList!) {
        toFilterData.push({
          atomName: interaction.atom,
          interactionType: interactionKey,
          aminoAcid: interaction.residue,
          aminoAcidNumber: interaction.count,
        });
        totalInteractions += interaction.count;
        interactionsByAtomName[interaction.atom] += interaction.count;
      }
    }
  }

  // const filteredAtomNames = Object.entries(interactionsByAtomName)
  //   .filter(([atomName, atomCount]) => {
  //     const isNotHydrogen = atomName.charAt(0) !== 'H';
  //     const isHydrogenButCounts = atomName.charAt(0) === 'H' && atomCount > 0;
  //     return isNotHydrogen || isHydrogenButCounts;
  //   }).map(([atomName, atomCount]) => {
  //     return atomName;
  //   });

  return {
    // filteredAtomNames: filteredAtomNames,
    totalInteractions: totalInteractions,
    toFilter: toFilterData,
  };
}

export function filterData(viewerData: ViewerData) {
  const filtered = viewerData['toFilter'].filter((eachItem) => {
    if (eachItem['interactionType'] === 'default' || viewerData['filters'].length === 0) {
      return true;
    }
    return viewerData['filters'].indexOf(eachItem['interactionType']) > -1;
  });

  const perAtomSum: any = {};
  let newTotal = 0;
  const newCountDict = filtered.reduce((newDict: { [key: string]: any }, eachItem) => {
    if (!Object.prototype.hasOwnProperty.call(newDict, eachItem['atomName'])) {
      newDict[eachItem['atomName']] = {};
      perAtomSum[eachItem['atomName']] = 0;
    }
    if (!Object.prototype.hasOwnProperty.call(newDict[eachItem['atomName']], eachItem['aminoAcid'])) {
      newDict[eachItem['atomName']][eachItem['aminoAcid']] = 0;
    }
    newDict[eachItem['atomName']][eachItem['aminoAcid']] += eachItem['aminoAcidNumber'];
    perAtomSum[eachItem['atomName']] += eachItem['aminoAcidNumber'];
    newTotal += eachItem['aminoAcidNumber'];
    return newDict;
  }, {});
  viewerData['averages'] = viewerData['atomNames'].map((eachName, i) => {
    return {
      xValue: i + 1,
      yValue: 'ATM',
      score: perAtomSum[eachName] / newTotal,
      start: i + 1,
      atomName: eachName,
      freq: (perAtomSum[eachName] / newTotal).toFixed(2),
      perc: ((perAtomSum[eachName] / newTotal) * 100.0).toFixed(2),
    };
  });
  for (let i_heatmap = 0; i_heatmap < viewerData['heatmap'].length; i_heatmap++) {
    const element = viewerData['heatmap'][i_heatmap];
    let perAtomDivide = perAtomSum[element['atomName']];
    perAtomDivide = perAtomDivide ? perAtomDivide : 0;
    const toDivide = viewerData['freqType'] === 'Relative' ? perAtomDivide : newTotal;
    let newCount = 0;
    if (newCountDict[element['atomName']]) {
      newCount = newCountDict[element['atomName']][element['residue']!];
      newCount = newCount ? newCount : 0;
    }
    viewerData['heatmap'][i_heatmap]['score'] = newCount / Math.max(toDivide, 1);
    viewerData['heatmap'][i_heatmap]['freq'] = (newCount / Math.max(toDivide, 1)).toFixed(2);
    viewerData['heatmap'][i_heatmap]['perc'] = ((newCount / Math.max(toDivide, 1)) * 100.0).toFixed(2);

    viewerData['maxFreq'] = Math.max(...viewerData['averages'].map((v: HotmapLigDatum) => v['freq'] as number));
  }
  return viewerData;
}

export function filterRescaleData(viewerData: ViewerData, rescaleType: string): ViewerData {
  viewerData['freqType'] = rescaleType;
  viewerData = filterData(viewerData);
  viewerData['originalHeatmap'] = JSON.parse(JSON.stringify(viewerData['heatmap']));
  if (viewerData['sortType'] === 'AAProp') {
    viewerData = sortAAsByType(viewerData);
  } else {
    viewerData = sortAAsByIntFreq(viewerData);
  }
  return viewerData;
}

export function sortAAsByType(viewerData: ViewerData) {
  const results: string[] = [
    'HIS',
    'ARG',
    'LYS', // positive
    'GLU',
    'ASP', // negative
    'THR',
    'SER',
    'ASN',
    'GLN', // polar
    'LEU',
    'ALA',
    'ILE',
    'MET',
    'VAL', // hydrophobic
    'TYR',
    'PHE',
    'TRP', // aromatic
    'GLY', // glycine
    'CYS', // cysteine
    'PRO', // proline
  ];

  viewerData['sortType'] = 'AAProp';
  viewerData['yDomain'] = results;
  viewerData['heatmap'] = viewerData['originalHeatmap'].filter((eachDatum: HotmapLigDatum) => results.indexOf(eachDatum.residue!) > -1);
  return viewerData;
}

export function sortAAsByIntFreq(viewerData: ViewerData) {
  const freqDict: { [key: string]: number } = {};
  for (let j = 0; j < aminoAcids.length; j++) {
    const aminoAcid = aminoAcids[j];
    freqDict[aminoAcid] = 0.0;
  }
  for (let i = 0; i < viewerData['heatmap']!.length; i++) {
    const datum = viewerData['heatmap']![i];
    freqDict[datum['residue']!] += datum['score'];
  }
  const results = Object.entries(freqDict)
    .reduce((previous: Array<{ aa: string; avgScore: number }>, [k, v]) => {
      previous.push({ aa: k, avgScore: v });
      return previous;
    }, [])
    .sort((a, b) => {
      return b.avgScore - a.avgScore;
    })
    .map((eachObj) => eachObj.aa);

  viewerData['sortType'] = 'IntFreq';
  viewerData['yDomain'] = results;
  viewerData['heatmap'] = viewerData['originalHeatmap'].filter((eachDatum: HotmapLigDatum) => results.indexOf(eachDatum.residue!) > -1);
  return viewerData;
}

export function processInitialData(resultIntDataAcc: LigIntCountsDictionary, atomNamesList: string[]) {
  const processedData: any = [];
  const dataKeyToIdx: { [key: string]: number } = {};

  let k = 0;
  const xDomain = [];
  for (let i = 0; i < atomNamesList.length; i++) {
    const atomName = atomNamesList[i];
    const atomNum = parseInt(atomName.substring(1));
    for (let j = 0; j < aminoAcids.length; j++) {
      const aminoAcid = aminoAcids[j];
      processedData.push({
        xValue: i + 1,
        yValue: aminoAcid,
        score: 0.0,
        start: i + 1,
        residue: aminoAcid,
        atomName: atomName,
        freq: 0.0,
        perc: 0.0,
      });
      dataKeyToIdx[`${atomNum}-${aminoAcid}`] = k;
      k += 1;
    }
    xDomain.push(i + 1);
  }

  const generatedData = processAPIData(atomNamesList, resultIntDataAcc);
  const totalInteractions = generatedData['totalInteractions'];
  const toFilter = generatedData['toFilter'];

  const initialSortType = 'AAProp';
  const initialFreqType = 'Relative';

  const viewerData: ViewerData = {
    atomNames: atomNamesList,
    length: atomNamesList.length,
    averages: [],
    xDomain: xDomain,
    yDomain: JSON.parse(JSON.stringify(aminoAcids)),
    // fix this with filteredAtomNames from generatedData
    heatmap: processedData,
    originalHeatmap: JSON.parse(JSON.stringify(processedData)),
    sortType: initialSortType,
    freqType: initialFreqType,
    validFilters: Object.keys(resultIntDataAcc),
    filters: [],
    toFilter: toFilter,
    dataKeyToIdx: dataKeyToIdx,
    totalInteractions: totalInteractions,
    maxFreq: 0.0,
  };
  return filterRescaleData(viewerData, viewerData['freqType']);
}
