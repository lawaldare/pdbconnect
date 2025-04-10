import { type Shapes } from '@nightingale-elements/nightingale-track';
/** Draw an "unknown shape" symbol (a question mark). */
export declare function drawUnknown(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void;
/** Try to draw a symbol and return true.
 * Draw nothing and return false if `shape` is not supported.
 * This only draws "symbols", i.e. shapes that do not stretch when zoomed in. */
export declare function drawSymbol(ctx: CanvasRenderingContext2D, shape: Shapes, cx: number, cy: number, r: number): boolean;
/** Try to draw a range and return true.
 * Draw nothing and return false if `shape` is not supported.
 * This only draws "ranges", i.e. shapes that stretch when zoomed in. */
export declare function drawRange(
  ctx: CanvasRenderingContext2D,
  shape: Shapes,
  x: number,
  y: number,
  width: number,
  height: number,
  optXPadding: number,
  fragmentLength: number
): boolean;
/** Return shape category this shape belongs to.
 * "range" are shapes that stretch when zoomed in;
 * "symbol" are shapes that do not stretch when zoomed in
 * (but they are rendered with a stretching line, when applied to more than one residue);
 * "unknown" are shapes that are not implemented (drawn as a question mark, thus they behave as "symbol"). */
export declare function shapeCategory(shape: Shapes): 'range' | 'symbol' | 'unknown';
//# sourceMappingURL=draw-shapes.d.ts.map
