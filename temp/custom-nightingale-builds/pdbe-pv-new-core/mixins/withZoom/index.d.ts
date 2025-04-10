import { ScaleLinear, Selection } from 'd3';
import NightingaleBaseElementAdam, { Constructor } from '../../nightingale-base-element-adam';
import { WithDimensionsInterface } from '../withDimensions';
import { withPositionInterface } from '../withPosition';
import { withMarginInterface } from '../withMargin';
import { WithResizableInterface } from '../withResizable';
type SVGSelection = Selection<SVGSVGElement, unknown, HTMLElement | SVGElement | null, unknown>;
export interface WithZoomInterface extends WithDimensionsInterface, withPositionInterface, withMarginInterface, WithResizableInterface {
  xScale?: ScaleLinear<number, number>;
  svg?: SVGSelection;
  updateScaleDomain(): void;
  getSingleBaseWidth(): number;
  getXFromSeqPosition(position: number): number;
  applyZoomTranslation(): void;
}
declare const withZoom: <T extends Constructor<NightingaleBaseElementAdam>>(superClass: T) => Constructor<WithZoomInterface> & T;
export default withZoom;
//# sourceMappingURL=index.d.ts.map
