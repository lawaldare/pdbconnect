import NightingaleTrack from '@nightingale-elements/nightingale-track';
export default class NightingaleTrackCanvas extends NightingaleTrack {
  private canvas?;
  private canvasCtx?;
  /** Ratio of canvas logical size versus canvas display size */
  private canvasScale;
  /** Feature fragments, stored in a data structure for fast range queries */
  private fragmentCollection?;
  connectedCallback(): void;
  disconnectedCallback(): void;
  onDimensionsChange(): void;
  protected createTrack(): void;
  refresh(): void;
  render(): import('lit').TemplateResult<1>;
  private _drawStamp;
  /** If `_drawStamp` has become outdated since the last call to this function, update `_drawStamp` and return true.
   * Otherwise return false. */
  private needsRedraw;
  /** Request canvas redraw. */
  private requestDraw;
  private readonly _drawer;
  /** Do not call directly! Call `requestDraw` instead to avoid browser freezing. */
  private _draw;
  private adjustCanvasLogicalSize;
  private drawCanvasContent;
  private _unknownShapeWarningPrinted;
  private printUnknownShapeWarning;
  /** Inverse of `this.getXFromSeqPosition`. */
  getSeqPositionFromX(x: number): number | undefined;
  private getFragmentAt;
  private bindEvents;
  private unbindEvents;
  private handleClick;
  private handleMousemove;
  private handleMouseout;
}
//# sourceMappingURL=nightingale-track-canvas.d.ts.map
