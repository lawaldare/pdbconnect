import { createStripedPattern } from './seq-viewer-ui-canvas-bg-patterns';
import { isColorLight } from './seq-viewer-ui-canvas-colours';
import { getAltNumber } from '../../data-processing/seq-viewer.helpers';
import { AlternativeNumbering } from '../../data-processing/seq-viewer-models';
import { DrawResidueConfig } from './seq-viewer-canvas-renderer';

/**
 * Draws a single residue box and all associated visual annotations on the canvas.
 *
 * Responsibilities:
 * - Draw residue background colour annotations
 * - Render non-observed residue patterns
 * - Render residue character text
 * - Render hover/selection borders
 * - Render circle and underline annotations
 * - Render residue numbering labels
 *
 * This function is intentionally stateless and receives all rendering
 * dependencies explicitly through the config object.
 *
 * Keeping this renderer isolated makes the main visualisation class
 * significantly easier to maintain and allows future rendering
 * strategies to evolve independently.
 */
export function drawResidue(ctx: CanvasRenderingContext2D, x: number, yStart: number, char: string, residueIndex: number, config: DrawResidueConfig) {
  const {
    nonObservedResidues,

    backgroundColorMap,
    underlineColorMap,
    circleColorMap,
    distStarColorMap,
    hexagonColorMap,

    currentHoveredResidue,
    currentClickedResidue,

    clickedBorderColour,
    clickedBorderWidth,

    maxNumberingBoxHeight,
    maxBoxWidth,
    maxBoxHeight,

    defaultBgColour,

    fontSize,
    fontFamily,

    numberingFontSize,
    numberingVerticalSpacing,

    characterBgPadding,

    circleAnnotationRadius,
    circleAnnotationMarginTop,
    circleAnnotationMarginBottom,

    residueNumberingFreq,
    currentResidueNumberingFreq,

    useAuthNumbers,
    alternativeNumberings,

    sequenceLength,
  } = config;

  /**
   * Check whether this residue is marked as non-observed.
   * Non-observed residues are rendered using a striped pattern.
   */
  const isNonObserved = nonObservedResidues?.includes(residueIndex) ?? false;

  /**
   * Retrieve residue background annotation colour.
   */
  const bgAnnotationColor = backgroundColorMap?.get(residueIndex);

  /**
   * Draw base residue background rectangle.
   */
  ctx.fillStyle = bgAnnotationColor ?? defaultBgColour;
  ctx.fillRect(x, yStart + maxNumberingBoxHeight, maxBoxWidth, maxBoxHeight);

  /**
   * Render striped overlay for non-observed residues.
   */
  if (isNonObserved) {
    const base = bgAnnotationColor ?? '#d0d0d0';

    const pattern = createStripedPattern(ctx, base);

    ctx.fillStyle = pattern;
    ctx.fillRect(x, yStart + maxNumberingBoxHeight, maxBoxWidth, maxBoxHeight);
  }

  /**
   * Choose residue text colour based on background luminance
   * to maintain contrast/readability.
   */
  let residueFontColour = '#000';
  if (bgAnnotationColor) {
    residueFontColour = isColorLight(bgAnnotationColor) ? '#FFF' : '#000';
  }
  ctx.fillStyle = residueFontColour;

  /**
   * Apply hover/selection visual state.
   */
  let fontWeight = '';
  if (residueIndex === currentHoveredResidue || residueIndex === currentClickedResidue) {
    fontWeight = 'bold ';
    // ... and draw a bold black rectangle around background
    ctx.strokeStyle = clickedBorderColour || '#000';
    ctx.lineWidth = clickedBorderWidth;

    ctx.strokeRect(x, yStart + maxNumberingBoxHeight, maxBoxWidth, maxBoxHeight);
  }

  /**
   * Draw residue character text.
   */
  let fontDelta = 0;
  let textYOffset = 0;
  if (char === '*') {
    // use a slightly larger font size for the '*' character to improve visibility when not hovered or clicked
    fontDelta = 2;
    if (fontWeight !== 'bold ') fontWeight = '500 ';
    textYOffset = 2;
  }
  ctx.font = `${fontWeight}${fontSize + fontDelta}px ${fontFamily}`;
  ctx.fillText(char, x + maxBoxWidth / 2, yStart + maxNumberingBoxHeight + maxBoxHeight / 2 + textYOffset);

  /**
   * Draw circle annotation above residue if present.
   */
  ctx.fillStyle = '#000';

  const circleColor = circleColorMap?.get(residueIndex);

  if (circleColor) {
    const circleCenterX = x + maxBoxWidth / 2;

    const circleCenterY = yStart + characterBgPadding + circleAnnotationMarginTop + circleAnnotationMarginBottom + circleAnnotationRadius * 2;

    ctx.beginPath();
    ctx.arc(circleCenterX, circleCenterY, circleAnnotationRadius, 0, 2 * Math.PI);
    ctx.fillStyle = circleColor;
    ctx.fill();
    ctx.fillStyle = '#000';
  }

  /**
   * Draw 45 degrees distorted 8 edged star above residue if present.
   */
  const distStarColor = distStarColorMap?.get(residueIndex);
  if (distStarColor) {
    const starCenterX = x + maxBoxWidth / 2;
    const starCenterY = yStart + characterBgPadding + circleAnnotationMarginTop + circleAnnotationMarginBottom + circleAnnotationRadius * 2;

    const starOuterRadius = circleAnnotationRadius; // size of the star
    const starInnerRadius = circleAnnotationRadius / 2.5;

    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + Math.PI / 8; // 45 degrees in radians, rotated by 22.5 degrees
      const radius = i % 2 === 0 ? starOuterRadius : starInnerRadius;
      const vertexX = starCenterX + radius * Math.cos(angle);
      const vertexY = starCenterY + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(vertexX, vertexY);
      } else {
        ctx.lineTo(vertexX, vertexY);
      }
    }
    ctx.closePath();
    ctx.fillStyle = distStarColor;
    ctx.fill();
    ctx.fillStyle = '#000';
  }

  /**
   * Draw hexagon annotation above residue if present.
   */
  const hexagonColor = hexagonColorMap?.get(residueIndex);
  if (hexagonColor) {
    const hexagonCenterX = x + maxBoxWidth / 2;
    const hexagonCenterY = yStart + characterBgPadding + circleAnnotationMarginTop + circleAnnotationMarginBottom + circleAnnotationRadius * 2;

    const hexagonSize = circleAnnotationRadius; // size of the hexagon

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3; // 60 degrees in radians
      const vertexX = hexagonCenterX + hexagonSize * Math.cos(angle);
      const vertexY = hexagonCenterY + hexagonSize * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(vertexX, vertexY);
      } else {
        ctx.lineTo(vertexX, vertexY);
      }
    }
    ctx.closePath();
    ctx.fillStyle = hexagonColor;
    ctx.fill();
    ctx.fillStyle = '#000';
  }

  /**
   * Draw underline annotation below residue if present.
   */
  const underlineColor = underlineColorMap?.get(residueIndex);
  if (underlineColor) {
    const underlineY = yStart + maxNumberingBoxHeight + maxBoxHeight + 4;

    ctx.strokeStyle = underlineColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 2, underlineY);
    ctx.lineTo(x + maxBoxWidth - 2, underlineY);

    ctx.stroke();
  }

  /**
   * Resolve residue numbering label.
   * Can optionally use author numbering instead of sequential numbering.
   */
  const residueNumberLabel = useAuthNumbers ? getAltNumber(residueIndex, 'auth', alternativeNumberings) : residueIndex.toString();

  /**
   * Determine numbering frequency currently being used.
   */
  const numberingFreq = currentResidueNumberingFreq ?? residueNumberingFreq;

  /**
   * Draw numbering labels for:
   * - first residue
   * - every Nth residue
   * - last residue
   */
  if (residueIndex === 1 || residueIndex % numberingFreq === 0 || residueIndex === sequenceLength) {
    ctx.font = `${numberingFontSize}px ${fontFamily}`;

    ctx.fillText(residueNumberLabel, x + maxBoxWidth / 2, yStart - numberingVerticalSpacing + maxNumberingBoxHeight / 2);

    /**
     * Restore default residue font after numbering rendering.
     */
    ctx.font = `${fontSize}px ${fontFamily}`;
  }
}
