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

export function sequenceToPanelData(sequence: string, uniprotData?: NightingaleFeature[], isNucleic?: boolean): PanelResidueDatum[] {
  const panelResidueData: PanelResidueDatum[] = sequence.split('').map((eachAa, i) => {
    let resId = `${i + 1}`;
    let resName = eachAa;
    if (!isNucleic) {
      resName = AAS_ONE_TO_THREE[eachAa] || eachAa; // fallback to raw AA
    }
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

export function extractAllTooltips(trackDataArray: (APITrackData | null)[]) {
  const tooltips: { [key: string]: string } = {};
  for (let i = 0; i < trackDataArray.length; i++) {
    const trackData = trackDataArray[i];

    if (trackData === null) continue;
    const dataTracks = trackData.tracks;
    for (const track of dataTracks) {
      const trackDataCopy = JSON.parse(JSON.stringify(track.data));
      const tracksToNightingale: NightingaleFeature[] = [...(trackDataCopy as unknown as NightingaleFeature[])];

      let currentTrackNames = [track.label];
      let currentTrackList = [tracksToNightingale];

      if (track.label === 'Chains') {
        currentTrackNames = ['Validation'];
      }

      if (track.label === 'Domains' || track.label === 'Rfam') {
        const { newDomainTrackNames, newDomainTrackList } = splitPDBeEntityDomainsAPIData(track);
        currentTrackNames = newDomainTrackNames;
        currentTrackList = newDomainTrackList;
      }

      for (let j = 0; j < currentTrackNames.length; j++) {
        const eachTrackName = currentTrackNames[j];
        const eachTrackData = currentTrackList[j];
        for (const eachTrackDatum of eachTrackData) {
          const eachTrackDatumProcessed = eachTrackDatum as NightingaleFeature & { label?: string };

          // const tooltipId = `${eachTrackName}-${eachTrackDatum.accession}`;
          const tooltipId = `${eachTrackName}-${eachTrackDatumProcessed.label}`;
          tooltips[tooltipId] = (eachTrackDatum as APITrackItem).labelTooltip;
        }
      }
    }
  }
  return tooltips;
}

export function extractOtherTracks(trackName: string, trackData: APITrackData | null) {
  if (trackData === null) return null;

  const trackList: NightingaleFeature[] = [];
  const dataTracks = trackData.tracks;
  for (const track of dataTracks) {
    const trackDataCopy = JSON.parse(JSON.stringify(track.data));
    const tracksToNightingale: NightingaleFeature[] = [...(trackDataCopy as unknown as NightingaleFeature[])];

    let currentTrackName = track.label;
    const currentTrackList = tracksToNightingale;

    // rename Chains to Validation
    if (track.label === 'Chains') {
      currentTrackName = 'Validation';
    }

    // has its own processing function
    if (track.label === 'Flexibility predictions' || track.label === 'Early folding residue predictions') {
      continue;
    }

    if (trackName !== currentTrackName) continue;

    trackList.push(...currentTrackList);
  }
  return trackList;
}

export function extractDomainResources(trackDomains: APITrackData | null, trackRfam: APITrackData | null) {
  const domainResourcesList: string[] = [];
  const domainsByResource: NightingaleFeature[][] = [];

  if (trackDomains !== null) {
    const domainTracks = trackDomains.tracks[0]?.data ?? [];

    for (const domainTrack of domainTracks) {
      const resourceLabel = domainTrack.label; // example: "CATH domains", "SCOP domains", "InterPro annotations"

      const features: NightingaleFeature[] = [];

      const fragmentsByAccession = new Map<string, APITrackFragment[]>();
      const trackDatumFragments = domainTrack.locations[0]?.fragments ?? [];

      for (const fragment of trackDatumFragments) {
        const domainAccession = parseDomainTooltipForAccession(fragment.tooltipContent);

        if (domainAccession) {
          const existingFragments = fragmentsByAccession.get(domainAccession) || [];
          fragmentsByAccession.set(domainAccession, [...existingFragments, fragment]);
        }
      }

      for (const [accession, fragments] of fragmentsByAccession) {
        features.push({
          accession,
          tooltipContent: '',
          label: accession,
          labelTooltip: `${domainTrack.accession}: ${accession}`,
          locations: [{ fragments }],
        } as NightingaleFeature);
      }

      domainResourcesList.push(resourceLabel);
      domainsByResource.push(features);
    }
  }

  if (trackRfam !== null) {
    const rfamTracks = trackRfam.tracks[0]?.data ?? [];

    for (const rfamTrack of rfamTracks) {
      const resourceLabel = rfamTrack.label;
      const features: NightingaleFeature[] = [];

      const fragmentsByAccession = new Map<string, APITrackFragment[]>();
      const trackDatumFragments = rfamTrack.locations[0]?.fragments ?? [];

      for (const fragment of trackDatumFragments) {
        const domainAccession = parseDomainTooltipForAccession(fragment.tooltipContent);

        if (domainAccession) {
          const existingFragments = fragmentsByAccession.get(domainAccession) || [];
          fragmentsByAccession.set(domainAccession, [...existingFragments, fragment]);
        }
      }

      for (const [accession, fragments] of fragmentsByAccession) {
        features.push({
          accession,
          tooltipContent: '',
          label: accession,
          labelTooltip: `${rfamTrack.accession}: ${accession}`,
          locations: [{ fragments }],
        } as NightingaleFeature);
      }
      domainResourcesList.push(resourceLabel);
      domainsByResource.push(features);
    }
  }

  return { domainResourcesList, domainsByResource };
}

export function extractBiophysicalResources(trackBiophysical: APITrackData | null) {
  const biophysicalResourcesList: string[] = [];
  const biophysicalByResource: NightingaleFeature[][] = [];

  if (!trackBiophysical) return { biophysicalResourcesList, biophysicalByResource };

  for (const trackDatum of trackBiophysical.tracks) {
    const resourceLabel = trackDatum.label;

    // ❗️ Skip Secondary structure → it's not biophysical nested
    if (resourceLabel === 'Secondary structure') continue;

    const trackDatumData = trackDatum.data ?? [];
    const features: NightingaleFeature[] = [];

    for (const datum of trackDatumData) {
      const fragments = datum.locations[0]?.fragments ?? [];

      features.push({
        accession: datum.accession,
        tooltipContent: datum.tooltipContent ?? '',
        label: datum.label ?? datum.accession,
        labelTooltip: datum.labelTooltip ?? datum.accession,
        locations: [{ fragments }],
      } as NightingaleFeature);
    }

    if (features.length > 0) {
      biophysicalResourcesList.push(resourceLabel);
      biophysicalByResource.push(features);
    }
  }

  return { biophysicalResourcesList, biophysicalByResource };
}
