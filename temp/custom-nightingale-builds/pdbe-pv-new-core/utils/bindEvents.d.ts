import NightingaleBaseElementAdam from '../nightingale-base-element-adam';
import { WithHighlightInterface } from '../mixins/withHighlight';
import { Selection, BaseType } from 'd3';
export declare const HIGHLIGHT_EVENT = 'highlight-event';
type EventType = 'click' | 'mouseover' | 'mouseout' | 'reset';
type FeatureData = {
  accession: string;
  feature?: FeatureData | null;
  fragments?: Array<{
    start: number;
    end: number;
  }>;
  start?: number;
  end?: number;
};
type SequenceBaseData = {
  position: number;
  aa: string;
};
export declare function createEvent(
  type: EventType,
  feature?: FeatureData | SequenceBaseData | null,
  withHighlight?: boolean,
  withId?: boolean,
  start?: number,
  end?: number,
  target?: HTMLElement,
  event?: Event,
  element?: NightingaleBaseElementAdam & WithHighlightInterface
): Event;
export default function bindEvents<T extends BaseType>(feature: Selection<T, any, any, any>, element: NightingaleBaseElementAdam): void;
export {};
//# sourceMappingURL=bindEvents.d.ts.map
