import { lightenColor } from './seq-viewer-ui-canvas-colours';

/**
 * Creates a repeating checkered canvas pattern using a base colour and
 * a lighter variation of that colour.
 *
 * The generated pattern is useful for visually representing:
 * - partially observed residues
 * - masked regions
 * - special annotation overlays
 *
 * The pattern is rendered onto a temporary offscreen canvas and converted
 * into a reusable CanvasPattern object.
 *
 * @param ctx - Rendering context where the pattern will be used.
 * @param baseColor - Primary colour used for the pattern background.
 * @returns Repeating checkered CanvasPattern instance.
 */
export function createCheckeredPattern(ctx: CanvasRenderingContext2D, baseColor: string): CanvasPattern {
  const size = 6; // size of the small squares
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = size * 2;
  patternCanvas.height = size * 2;
  const pctx = patternCanvas.getContext('2d')!;

  const lighter = lightenColor(baseColor, 0.2);

  // Fill with baseColor
  pctx.fillStyle = baseColor;
  pctx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);

  // Draw lighter small squares
  pctx.fillStyle = lighter;
  pctx.fillRect(0, 0, size, size);
  pctx.fillRect(size, size, size, size);

  return ctx.createPattern(patternCanvas, 'repeat')!;
}

/**
 * Creates a repeating diagonal striped canvas pattern using a base colour
 * and a lighter stripe overlay.
 *
 * This pattern is primarily used to visually indicate residues with
 * non-observed or partially missing coordinates while still preserving
 * underlying annotation colouring.
 *
 * The stripes are rendered on a temporary offscreen canvas and converted
 * into a reusable CanvasPattern object.
 *
 * @param ctx - Rendering context where the pattern will be applied.
 * @param baseColor - Base fill colour used beneath the stripes.
 * @returns Repeating striped CanvasPattern instance.
 */
export function createStripedPattern(ctx: CanvasRenderingContext2D, baseColor: string): CanvasPattern {
  const size = 6; // tile size controls stripe spacing
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = size;
  patternCanvas.height = size;
  const pctx = patternCanvas.getContext('2d')!;

  const stripeColor = lightenColor(baseColor, 0.3);

  // fill base
  pctx.fillStyle = baseColor;
  pctx.fillRect(0, 0, size, size);

  // draw multiple diagonal lines that wrap around the tile
  pctx.strokeStyle = stripeColor;
  pctx.lineWidth = 2;

  pctx.beginPath();
  pctx.moveTo(0, size / 2);
  pctx.lineTo(size / 2, 0);
  pctx.moveTo(size / 2, size);
  pctx.lineTo(size, size / 2);
  pctx.stroke();

  return ctx.createPattern(patternCanvas, 'repeat')!;
}
