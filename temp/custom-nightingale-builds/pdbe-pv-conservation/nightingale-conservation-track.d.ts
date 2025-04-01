import NightingaleElementAdam from '@nightingale-elements/nightingale-new-core-adam';
import { Selection } from 'd3';
import { PropertyValues } from 'lit';
/** Amino acid probability for each amino acid for each position */
interface Probabilities {
  [letter: string]: number[];
}
type LetterOrder = 'default' | 'probability';
/** Type for `NightingaleConservationTrack.data`` */
export interface SequenceConservationData {
  /** Sequence number for each position */
  index: number[];
  /** Amino acid probability for each amino acid for each position */
  probabilities: Probabilities;
}
declare const NightingaleConservationTrack_base: import('@nightingale-elements/nightingale-new-core-adam/dist/nightingale-base-element-adam').Constructor<
  import('@nightingale-elements/nightingale-new-core-adam/dist/mixins/withCanvas').WithCanvasInterface
> &
  import('@nightingale-elements/nightingale-new-core-adam/dist/nightingale-base-element-adam').Constructor<
    import('@nightingale-elements/nightingale-new-core-adam/dist/mixins/withZoom').WithZoomInterface
  > &
  import('@nightingale-elements/nightingale-new-core-adam/dist/nightingale-base-element-adam').Constructor<
    import('@nightingale-elements/nightingale-new-core-adam/dist/mixins/withResizable').WithResizableInterface
  > &
  import('@nightingale-elements/nightingale-new-core-adam/dist/nightingale-base-element-adam').Constructor<
    import('@nightingale-elements/nightingale-new-core-adam/dist/mixins/withMargin').withMarginInterface
  > &
  import('@nightingale-elements/nightingale-new-core-adam/dist/nightingale-base-element-adam').Constructor<
    import('@nightingale-elements/nightingale-new-core-adam/dist/mixins/withPosition').withPositionInterface
  > &
  import('@nightingale-elements/nightingale-new-core-adam/dist/nightingale-base-element-adam').Constructor<
    import('@nightingale-elements/nightingale-new-core-adam/dist/mixins/withDimensions').WithDimensionsInterface
  > &
  import('@nightingale-elements/nightingale-new-core-adam/dist/nightingale-base-element-adam').Constructor<
    import('@nightingale-elements/nightingale-new-core-adam/dist/mixins/withHighlight').WithHighlightInterface
  > &
  typeof NightingaleElementAdam;
export default class NightingaleConservationTrack extends NightingaleConservationTrack_base {
  #private;
  /** Order of amino acids within a column (top-to-bottom). default = fixed order based on amino acid groups, probability = on every position sort by descending probability */
  'letter-order': LetterOrder;
  /** Font family for labels (can be a list of multiple font families separated by comma, like in CSS) */
  'font-family': string;
  /** Font size below which labels are hidden */
  'min-font-size': number;
  /** Column width below which labels are shown with lower opacity */
  'fade-font-size': number;
  /** Maximum font size for labels */
  'max-font-size': number;
  private yPositions?;
  protected highlighted?: Selection<SVGGElement, unknown, HTMLElement | SVGElement | null, unknown>;
  connectedCallback(): void;
  /** Sequence conservation data, e.g. `{ index: [1, 2, 3, 4, 5], probabilities: { A: [0.1, 0.1, 0, 0.2, 0.3], C: [0, 0.05, 0.1, 0.1, 0], ... }}` */
  get data(): SequenceConservationData | undefined;
  set data(data: SequenceConservationData | undefined);
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
  protected createTrack(): void;
  refresh(): void;
  private _drawStamp;
  /** If `_drawStamp` has become outdated since the last call to this function, update `_drawStamp` and return true. Otherwise return false. */
  private needsRedraw;
  /** Request canvas redraw. */
  private requestDraw;
  private readonly _drawer;
  /** Do not call directly! Call `requestDraw` instead to avoid browser freezing. */
  private _draw;
  private clearCanvas;
  private drawColumns;
  private drawMargins;
  private getFontOpacity;
  /** Inverse of `this.getXFromSeqPosition`. */
  getSeqPositionFromX(x: number): number | undefined;
  protected updateHighlight(): void;
  zoomRefreshed(): void;
  firstUpdated(_changedProperties: PropertyValues): void;
  render(): import('lit').TemplateResult<1>;
  onCanvasScaleChange(): void;
  private bindEvents;
  private unbindEvents;
  private handleClick;
  private handleMousemove;
  private handleMouseout;
  private getPointedAminoAcid;
}
export {};
//# sourceMappingURL=nightingale-conservation-track.d.ts.map
