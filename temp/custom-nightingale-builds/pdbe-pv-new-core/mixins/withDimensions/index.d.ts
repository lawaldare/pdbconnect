import NightingaleBaseElementAdam, { Constructor } from '../../nightingale-base-element-adam';
export declare class WithDimensionsInterface {
  width: number;
  height: number;
}
declare const withDimensions: <T extends Constructor<NightingaleBaseElementAdam>>(
  superClass: T,
  options?: {
    width?: number;
    height?: number;
  }
) => Constructor<WithDimensionsInterface> & T;
export default withDimensions;
//# sourceMappingURL=index.d.ts.map
