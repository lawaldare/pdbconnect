import { Selection } from 'd3';
import NightingaleBaseElementAdam, { Constructor } from '../../nightingale-base-element-adam';
import { WithResizableInterface } from '../withResizable';
export interface WithCanvasInterface {
  /** D3 selection with this element's <canvas> node. Is automatically set to the first ancestor <canvas> node when first rendered. */
  canvas?: Selection<HTMLCanvasElement, unknown, HTMLElement, unknown>;
  /** Canvas rendering context. */
  canvasCtx?: CanvasRenderingContext2D;
  /** Ratio of canvas logical size versus canvas display size. */
  canvasScale: number;
  /** Runs when device pixel ratio (`this.canvasScale`) changes, e.g. when browser zoom is changed or browser window is moved to a different screen. */
  onCanvasScaleChange(): void;
  /** Adjust width and height of `this.canvasCtx` based on canvas size and scale if needed (clears canvas content!). Subclass should call this method just before redrawing the canvas. */
  adjustCanvasCtxLogicalSize(): void;
}
declare const withCanvas: <T extends Constructor<NightingaleBaseElementAdam & WithResizableInterface>>(superClass: T) => Constructor<WithCanvasInterface> & T;
export default withCanvas;
//# sourceMappingURL=index.d.ts.map
