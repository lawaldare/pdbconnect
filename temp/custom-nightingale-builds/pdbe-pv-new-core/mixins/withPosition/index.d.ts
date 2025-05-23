import NightingaleBaseElementAdam, { Constructor } from '../../nightingale-base-element-adam';
export interface withPositionInterface extends NightingaleBaseElementAdam {
  'display-start'?: number;
  'display-end'?: number;
  length?: number;
}
export declare const WHOLE_SEQ = -1;
declare const withPosition: <T extends Constructor<NightingaleBaseElementAdam>>(
  superClass: T,
  options?: {
    'display-start'?: number;
    'display-end'?: number;
    length?: number;
  }
) => Constructor<withPositionInterface> & T;
export default withPosition;
//# sourceMappingURL=index.d.ts.map
