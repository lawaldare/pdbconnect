import NightingaleBaseElementAdam, { Constructor } from '../../nightingale-base-element-adam';
import { WithDimensionsInterface } from '../withDimensions';
export interface WithResizableInterface extends WithDimensionsInterface {
  'min-width': number;
  'min-height': number;
  onDimensionsChange(): void;
}
declare const withResizable: <T extends Constructor<NightingaleBaseElementAdam>>(
  superClass: T,
  options?: {
    'min-width'?: number;
    'min-height'?: number;
  }
) => Constructor<WithResizableInterface> & T;
export default withResizable;
//# sourceMappingURL=index.d.ts.map
