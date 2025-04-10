import { APITrackData, APITrackDatum, APITrackFragment, APITrackItem, PanelResidueDatum } from '@pdbe-lib/pv-nightingale-components';
import { Feature as NightingaleFeature } from '@nightingale-elements/nightingale-track';

const AAS_ONE_TO_THREE: { [key: string]: string } = {
  A: 'Ala',
  R: 'Arg',
  N: 'Asn',
  D: 'Asp',
  C: 'Cys',
  E: 'Glu',
  Q: 'Gln',
  G: 'Gly',
  H: 'His',
  I: 'Ile',
  L: 'Leu',
  K: 'Lys',
  M: 'Met',
  F: 'Phe',
  P: 'Pro',
  S: 'Ser',
  T: 'Thr',
  W: 'Trp',
  Y: 'Tyr',
  V: 'Val',
  B: 'Asx', // Asp or Asn
  Z: 'Glx', // Glu or Gln
  X: 'Xaa', // Unknown
};

// list of tracks displayed on Protvista for entryId + entityId
const PDBE_ENTITY_TRACKS = [
  'UniProt',
  'Chains',
  'Secondary structure',
  'Ligand binding sites',
  'Interaction interfaces',
  'Domains',
  'CATH domains',
  'CATH-B domains',
  'SCOP domains',
  'Pfam domains',
  'InterPro annotations',
  'Rfam',
  'Flexibility predictions',
  'Early folding residue predictions',
  'Sequence conservation',
  'Variants',
];

export function processPdbEntityDataToTracks(entryId: string, sequence: string, trackDataArray: (Record<string, APITrackData> | null)[]) {
  // convert track from raw API data to list of TrackData | null
  const entryInitData = trackDataArray.map((eachTrackDatum) => {
    if (eachTrackDatum === null) return null;
    else return eachTrackDatum[entryId];
  });

  // now we parse the TrackData | null list to Angular template variables trackNames and trackList
  let trackNames: string[] = [];
  let trackList: NightingaleFeature[][] = [];
  const tooltips: { [key: string]: string } = {};

  // we just iterate over each TrackData and convert track.data to NightingaleFeature[]
  for (let i = 0; i < entryInitData.length; i++) {
    const trackData = entryInitData[i];
    0;
    if (trackData === null) continue;
    const dataTracks = trackData.tracks;
    for (const track of dataTracks) {
      const tracksToNightingale: NightingaleFeature[] = [...(track.data as unknown as NightingaleFeature[])];

      let currentTrackNames = [track.label];
      let currentTrackList = [tracksToNightingale];

      if (track.label === 'Domains') {
        const { newDomainTrackNames, newDomainTrackList } = splitPDBeEntityDomainsAPIData(track);
        currentTrackNames = newDomainTrackNames;
        currentTrackList = newDomainTrackList;
      }

      for (let j = 0; j < currentTrackNames.length; j++) {
        const eachTrackName = currentTrackNames[j];
        const eachTrackData = currentTrackList[j];
        for (const eachTrackDatum of eachTrackData) {
          const eachTrackDatumProcessed = eachTrackDatum as NightingaleFeature & {label?: string};
          
          // const tooltipId = `${eachTrackName}-${eachTrackDatum.accession}`;
          const tooltipId = `${eachTrackName}-${eachTrackDatumProcessed.label}`;
          tooltips[tooltipId] = (eachTrackDatum as APITrackItem).labelTooltip;
        }
      }
      trackNames.push(...currentTrackNames);
      trackList.push(...currentTrackList);
    }
  }

  // extra processing for the "Search for residues and Map your data panel is done"
  const uniprotTrackData = trackList[trackNames.indexOf('UniProt')] || undefined;
  const panelResidueData = sequenceToPanelData(sequence, uniprotTrackData);

  // we then have to sort and filter tracks according to PDBE_ENTITY_TRACKS constant

  // step 1: Create a map of priority
  const priorityMap = new Map<string, number>();
  PDBE_ENTITY_TRACKS.forEach((name, index) => {
    priorityMap.set(name, index);
  });

  // step 2: Sort both arrays based on priority
  const combined = trackNames.map((name, idx) => ({
    name,
    obj: trackList[idx],
  }));

  // step 3: Filter out unwanted tracks, sort valid ones
  const filteredAndSorted = combined
    .filter((el) => priorityMap.has(el.name)) // filter step
    .sort((a, b) => {
      return priorityMap.get(a.name)! - priorityMap.get(b.name)!;
    });

  // step 4: Split back
  trackNames = filteredAndSorted.map((el) => el.name);
  trackList = filteredAndSorted.map((el) => el.obj);

  return { trackNames, trackList, tooltips, panelResidueData };
}

function parseDomainTooltipForAccession(textContent: string): string | undefined {
  const regex = /\(([^()]*)\)[^()]*<\/a>/g;
  let match;
  let lastParenthesisContent = null;
  while ((match = regex.exec(textContent)) !== null) {
    lastParenthesisContent = match[1];
  }

  if (lastParenthesisContent) {
    const items = lastParenthesisContent.split(',').map((item) => item.trim());
    return items[0];
  }
  return undefined;
}

function splitPDBeEntityDomainsAPIData(apiData: APITrackDatum) {
  const newDomainTrackNames: string[] = [];
  const newDomainTrackList: NightingaleFeature[][] = [];

  for (const trackDatum of apiData.data) {
    // let newTrackDatum = { ...trackDatum } as NightingaleFeature;
    // delete newTrackDatum['locations'];
    // /**
    //  *
    //    accession: string;
    //    color?: string;
    //    fill?: string;
    //    shape?: 'rectangle' | 'bridge' | 'diamond' | 'chevron' | 'catFace' | 'triangle' | 'wave' | 'hexagon' | 'pentagon' | 'circle' | 'arrow' | 'doubleBar';
    //    tooltipContent?: string;
    //    type?: string;
    //    locations?: Array<NightingaleFeatureLocation>;
    //    feature?: NightingaleFeature;
    //    start?: number;
    //    end?: number;
    //    opacity?: number;
    //  */
    // newTrackDatum.feature = {}

    const trackDatumFragments = trackDatum.locations[0].fragments;
    // const fragmentsByAccession: {[key: string]: APITrackFragment[]} = {};
    const fragmentsByAccession = new Map<string, APITrackFragment[]>();

    for (const trackDatumFragment of trackDatumFragments) {
      const domainAccession = parseDomainTooltipForAccession(trackDatumFragment.tooltipContent);
      if (domainAccession) {
        const existingFragments = fragmentsByAccession.get(domainAccession) || [];
        fragmentsByAccession.set(domainAccession, [trackDatumFragment, ...existingFragments]);
      }
    }

    const convertedLocationsToFeatures: NightingaleFeature[] = [];
    for (const [accession, fragments] of fragmentsByAccession) {
      convertedLocationsToFeatures.push({
        accession: accession,
        tooltipContent: '',
        label: accession,
        labelTooltip: `${trackDatum.accession.slice(0, -1)}: ${accession}`,
        locations: [{ fragments: fragments }],
      } as NightingaleFeature);
    }

    newDomainTrackNames.push(trackDatum.accession);
    // newDomainTrackNames.push(trackDatum.label);

    // newDomainTrackList.push([trackDatum as unknown as NightingaleFeature]);
    newDomainTrackList.push(convertedLocationsToFeatures);
  }

  return { newDomainTrackNames, newDomainTrackList };
}

function sequenceToPanelData(sequence: string, uniprotData?: NightingaleFeature[]): PanelResidueDatum[] {
  const panelResidueData: PanelResidueDatum[] = sequence.split('').map((eachAa, i) => {
    let resId = `${i + 1}`;
    let resName = AAS_ONE_TO_THREE[eachAa] || eachAa; // fallback to raw AA
    let uniprotIdx: string | undefined;

    if (uniprotData) {
      for (const uniprotFeature of uniprotData) {
        const { accession, locations } = uniprotFeature;

        if (!locations?.[0]?.fragments) continue;

        for (let j = 0; j < locations[0].fragments.length; j++) {
          const fragment = locations[0].fragments[j];
          const extendedFragment = fragment as {
            start: number;
            end: number;
            tooltipContent: string;
            unp_start: number;
            unp_end: number;
          };
          const hasNextFragment = j < locations[0].fragments.length - 1;

          const tooltip = extendedFragment.tooltipContent || '';
          const pdbStart = fragment.start;
          const pdbEnd = fragment.end;
          const unpStart = extendedFragment.unp_start;
          const unpEnd = extendedFragment.unp_end;
          const currentRes = i + 1;

          // Check if this fragment includes the current residue
          if (currentRes >= pdbStart && currentRes <= pdbEnd) {
            const offset = unpStart - pdbStart;
            const uniprotNumber = currentRes + offset;
            uniprotIdx = `${accession}:${uniprotNumber}`;

            const rangeMatch = tooltip.match(/Range: (\w+) - /);
            const modMatch = tooltip.match(/Modified residue: (\w+)/);
            const confMatch = tooltip.match(/Conflict: (\w+) --> (\w+)/);

            // skip if aa is '*', no modified found and has more fragments
            if (eachAa === '*' && !modMatch && hasNextFragment) continue;

            if (eachAa === '*' && rangeMatch) {
              resName = rangeMatch[1].slice(0, 3).toLowerCase();
              resName = resName[0].toUpperCase() + resName.slice(1);
            }
            if (modMatch) {
              const modRes = modMatch[1];
              resId = `${resId} (Mod: ${modRes})`;
            } else if (confMatch) {
              const startRes = confMatch[1];
              const endRes = confMatch[2];
              resId = `${resId} (Mut: ${startRes} -> ${endRes})`;
            } else if (eachAa === '*') {
              resName = '*'; // fallback if unexpected
            }
            break; // first matching fragment wins
          }
        }

        if (uniprotIdx) break; // first matching UniProt feature wins
      }
    }

    return {
      resId,
      resName,
      ...(uniprotIdx && { uniprotIdx }),
    };
  });

  return panelResidueData;
}
