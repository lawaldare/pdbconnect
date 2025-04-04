import { LineData as NightingaleLineData } from '@nightingale-elements/nightingale-linegraph-track';
import { AminoAcidProbabilities, APIConservationData } from '../../../models/pv-api-conservation-track-data.model';

interface Probabilities {
  [letter: string]: number[];
}

export interface NightingaleSequenceConservation {
  /** Sequence number for each position */
  index: number[];
  /** Amino acid probability for each amino acid for each position */
  probabilities: Probabilities;
}

export function processEntityConservationDataFromAPI(apiData: APIConservationData): NightingaleSequenceConservation {
  const aminoAcidKeys: (keyof AminoAcidProbabilities)[] = [
    'probability_A',
    'probability_C',
    'probability_D',
    'probability_E',
    'probability_F',
    'probability_G',
    'probability_H',
    'probability_I',
    'probability_K',
    'probability_L',
    'probability_M',
    'probability_N',
    'probability_P',
    'probability_Q',
    'probability_R',
    'probability_S',
    'probability_T',
    'probability_V',
    'probability_W',
    'probability_Y',
  ];

  const processedProbabilities: Probabilities = {};
  for (const probKey of aminoAcidKeys) {
    const aminoAcid = probKey[probKey.length - 1];
    processedProbabilities[aminoAcid] = apiData.data[probKey];
  }

  const processedData: NightingaleSequenceConservation = {
    index: apiData.data.index,
    probabilities: processedProbabilities,
  };

  return processedData;
}

export function processEntityConservationLineChartDataFromAPI(apiData: APIConservationData): NightingaleLineData[] {
  const maxConservationScore = Math.max(...apiData.data.conservation_score);

  const valuesList = apiData.data.conservation_score.map((eachScore, idx) => {
    return { position: idx + 1, value: eachScore };
  });

  const lineData: NightingaleLineData = {
    name: 'conservationScore',
    color: '#808080',
    fill: '#808080',
    range: [0, maxConservationScore * 1.5],
    lineCurve: 'curveStep',
    values: valuesList,
  };
  return [lineData];
}
