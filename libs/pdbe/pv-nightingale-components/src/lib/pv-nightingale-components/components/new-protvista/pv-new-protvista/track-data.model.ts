import { type Feature as NightingaleFeature } from '@nightingale-elements/nightingale-track';

export interface NewProtvistaTrackDatum {
  name: string;
  data: NightingaleFeature[];
}

export interface NewProtvistaTrackData {
  name: string;
  isNested: boolean;
  expandedState: boolean;
  data?: NewProtvistaTrackDatum[]; // exists ifNested false
  nestedTracks?: Array<{
    // exists ifNested true
    name: string;
    expandedState: boolean;
    data: NewProtvistaTrackDatum[];
  }>;
}
