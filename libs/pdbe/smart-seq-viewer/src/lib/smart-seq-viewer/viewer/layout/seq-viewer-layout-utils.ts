export interface CanvasBoxData {
  // Number of residues that can fit per rendered line
  canvasBoxPerLines?: number;

  // Number of full residue groups that fit in one line
  // (only relevant when grouping is enabled)
  fullGroupsPerLine?: number;

  // Remaining horizontal space that was not used after fitting groups
  // Useful for centering the sequence horizontally
  notDrawnWidth?: number;
}

/**
 * Calculates how many residue boxes can fit per line based on
 * canvas width, margins, hover spacing, and grouping mode.
 * Also computes grouping layout metadata used later for
 * rendering and horizontal centering.
 */
export function calculateCanvasBoxPerLines(
  canvasWidth: number,
  maxBoxWidth: number,
  hoverBorderWidth: number,
  margins: { left: number; right: number; top: number; bottom: number },
  groupingLineBreak: boolean,
  grouping: boolean,
  groupingData?: {
    residueGroupSize: number;
    residueGroupRightMargin: number;
  }
): CanvasBoxData {
  // Extract horizontal margins
  // top/bottom are unused here but kept for consistency with shared margin object
  const { left: marginLeft, right: marginRight, top: _marginTop, bottom: _marginBottom } = margins;

  // Available drawable width inside the canvas
  const availableWidth = canvasWidth - marginLeft - marginRight;

  // Effective width occupied by a residue box
  // Includes hover border spacing
  const effectiveBoxWidth = maxBoxWidth + hoverBorderWidth;

  const canvasBoxData: CanvasBoxData = {};

  if (groupingLineBreak) {
    // --------------------------------------------
    // MODE 1:
    // groupingLineBreak = true
    //
    // Sequence is treated as continuous flow.
    // Groups are allowed to wrap across lines.
    // --------------------------------------------

    canvasBoxData.canvasBoxPerLines = Math.floor(availableWidth / effectiveBoxWidth); // spacing handled during drawing
  } else if (grouping && groupingData) {
    // --------------------------------------------
    // MODE 2:
    // grouping = true
    //
    // Groups must stay intact.
    // Layout is calculated in full residue groups.
    // --------------------------------------------
    const residueGroupSize = groupingData.residueGroupSize;
    const residueGroupRightMargin = groupingData.residueGroupRightMargin;

    // Width occupied by one full residue group
    // Example:
    // [10 residues] + [group spacing]
    const groupBoxWidth = residueGroupSize * effectiveBoxWidth + residueGroupRightMargin;

    // Calculate how many complete groups fit on one line
    const fullGroupsPerLine = Math.floor((availableWidth + residueGroupRightMargin) / groupBoxWidth);

    // Calculate leftover unused horizontal space
    // Used later for horizontal centering
    canvasBoxData.notDrawnWidth = Math.floor(availableWidth + residueGroupRightMargin) - fullGroupsPerLine * groupBoxWidth;

    // Total residues that fit on one line
    canvasBoxData.canvasBoxPerLines = fullGroupsPerLine * residueGroupSize;
  } else {
    // --------------------------------------------
    // MODE 3:
    // No grouping
    //
    // Pure linear layout
    // --------------------------------------------

    canvasBoxData.canvasBoxPerLines = Math.floor(availableWidth / effectiveBoxWidth);
  }
  return canvasBoxData;
}

/**
 * Adjusts the left margin to horizontally center the rendered
 * sequence using any leftover unused width from the layout
 * calculation step.
 */
export function calculateHorizontalCenterMargin(originalLeftMargin: number, notDrawnWidth?: number) {
  // If there is no unused width,
  // keep original margin unchanged
  if (!notDrawnWidth) return originalLeftMargin;

  // Shift left margin by half of unused width
  // to visually center the rendered sequence
  return originalLeftMargin + Math.floor(notDrawnWidth / 2);
}

/**
 * Simulates sequence line wrapping to calculate the total canvas
 * height required to render the entire sequence, including
 * numbering rows, residue rows, margins, and grouping spacing.
 */
export function calculateCanvasHeightForFullSequence(
  maxBoxWidth: number,
  sequenceLength: number,
  canvasWidth: number,
  residueGroupSize: number,
  currentGroupSize: number,
  hoverBorderWidth: number,
  maxNumberingBoxHeight: number,
  maxBoxHeight: number,
  lineBottomMargin: number,
  margins: { left: number; right: number; top: number; bottom: number },
  grouping: boolean,
  groupingData?: {
    residueGroupSize: number;
    residueGroupRightMargin: number;
    fullGroupsPerLine: number;
  }
): number {
  // Current horizontal cursor
  let x = margins.left;

  // Start with one line
  let lineCount = 1;

  // Use current responsive group size if available
  const groupSize = currentGroupSize ?? residueGroupSize;

  // Iterate through every residue
  for (let i = 1; i <= sequenceLength; i++) {
    // If next residue exceeds drawable width,
    // wrap to next line
    if (x + maxBoxWidth > canvasWidth - margins.right) {
      x = margins.left;
      lineCount++;
    }

    // Advance horizontal cursor by residue width
    x += maxBoxWidth + hoverBorderWidth;

    // Add extra spacing between residue groups
    if (grouping && groupingData && i % groupSize === 0) {
      const residueGroupRightMargin = groupingData.residueGroupRightMargin;
      x += residueGroupRightMargin;
    }
  }

  // const extraCircleHeight = this.hasCircleAnnotation ? this.circleAnnotationRadius * 2 + this.circleAnnotationMarginTop + this.circleAnnotationMarginBottom : 0;

  // Total vertical space occupied by one rendered line:
  // numbering + residue box + bottom spacing
  const totalLineHeight = maxNumberingBoxHeight + maxBoxHeight + lineBottomMargin;

  // Final canvas height:
  // top margin + all lines + bottom margin
  return margins.top + lineCount * totalLineHeight + margins.bottom;
}

export interface LineBoxLayoutData {
  // Total number of rendered text lines that can fit vertically
  // inside the current canvas height
  canvasTextLines: number;

  // Sequence split into renderable line chunks
  // Used during rendering and coordinate calculations
  chunkedSequence: string[];

  // First visible/rendered line index
  currentStartLine: number;

  // Last visible/rendered line index
  currentEndLine: number;

  // Frozen responsive residue group size used during rendering
  // to ensure consistent layout after resize calculations
  currentGroupSize: number | null;

  // Frozen numbering frequency used during rendering
  // to keep numbering layout visually stable
  currentResidueNumberingFreq: number | null;
}

/**
 * Calculates sequence line segmentation and visible line layout
 * based on canvas dimensions, residue sizing, and grouping mode.
 * Produces chunked sequence data and line metadata used during rendering.
 */
export function calculateLineBoxLayout(
  maxBoxWidth: number,
  maxBoxHeight: number,
  maxNumberingBoxHeight: number,
  canvasBoxPerLines: number | undefined,
  sequence: string,
  lineBottomMargin: number,
  margins: { left: number; right: number; top: number; bottom: number },
  canvasHeight: number,
  groupingLineBreak: boolean,
  currentGroupSize: number | null,
  currentResidueNumberingFreq: number | null,
  groupingData?: {
    residueGroupSize: number;
    residueNumberingFreq: number;
  }
): LineBoxLayoutData | undefined {
  // Validate calculated residue box dimensions before layout calculation
  if (maxBoxWidth <= 0 || maxBoxHeight <= 0 || maxNumberingBoxHeight <= 0) {
    console.warn('Box or numbering dimensions not calculated yet.');
    return;
  }

  // Validate how many residues can fit per line
  if (!canvasBoxPerLines || isNaN(canvasBoxPerLines) || canvasBoxPerLines <= 0) {
    console.warn('canvasBoxPerLines is invalid:', canvasBoxPerLines);
    return;
  }

  const { left: _marginLeft, right: _marginRight, top: marginTop, bottom: marginBottom } = margins;

  // Calculate total vertical space occupied by one rendered line
  // (numbering row + residue row + bottom spacing)
  const totalLineHeight = maxNumberingBoxHeight + maxBoxHeight + lineBottomMargin;

  // Determine how many rendered lines can vertically fit
  // inside the current canvas height
  const canvasTextLines = Math.floor((canvasHeight - marginTop - marginBottom + lineBottomMargin) / totalLineHeight);

  // --------------------------------------------
  // MODE 1:
  // groupingLineBreak = true
  //
  // Entire sequence is treated as one continuous
  // flow and wrapping happens dynamically during
  // rendering.
  //
  // Residue groups are allowed to break across
  // multiple lines.
  // --------------------------------------------
  let chunkedSequence = [sequence]; // single chunk, flat loop

  // --------------------------------------------
  // MODE 2:
  // grouping = true
  //
  // Sequence is pre-split into fixed line chunks
  // where residue groups remain intact.
  //
  // Layout uses fixed residues-per-line values.
  // --------------------------------------------
  if (!groupingLineBreak && groupingData) {
    const residueGroupSize = groupingData.residueGroupSize;
    const residueNumberingFreq = groupingData.residueNumberingFreq;

    chunkedSequence = [];
    for (let i = 0; i < sequence.length; i += canvasBoxPerLines!) {
      chunkedSequence.push(sequence.slice(i, i + canvasBoxPerLines!));
    }

    // Freeze current responsive layout values so rendering
    // remains visually consistent during interactions/resizes
    currentGroupSize = residueGroupSize;
    currentResidueNumberingFreq = residueNumberingFreq;
  }

  // First visible rendered line
  const currentStartLine = 0;

  // Last visible rendered line
  //
  // In MODE 1 where entire sequence is treated as one continuous flow:
  // visible lines are based on vertical canvas capacity
  //
  // In MODE 2 where sequence is pre-split into fixed line chunks:
  // visible lines are constrained by chunked sequence size
  const currentEndLine = groupingLineBreak ? canvasTextLines : Math.min(canvasTextLines, chunkedSequence.length);

  // Return all computed line layout metadata
  // used later by rendering and interaction systems
  return {
    canvasTextLines,
    chunkedSequence,
    currentStartLine,
    currentEndLine,
    currentGroupSize,
    currentResidueNumberingFreq,
  };
}

export interface BoxDimensionData {
  // Maximum width required to render a residue character box
  maxBoxWidth: number;
  // Maximum height required to render a residue character box
  maxBoxHeight: number;
  // Cached per-character text widths used during rendering/layout
  characterWidthMap: Map<string, number>;
}

/**
 * Measures residue character dimensions and calculates the maximum
 * residue box size used by layout and rendering.
 */
export function calculateBoxMaxDimensions(fontSize: number, fontFamily: string, characterBgPadding: number): BoxDimensionData | undefined {
  // Create temporary canvas used only for text measurement
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');

  // Abort if browser does not support 2D canvas context
  if (!ctx) {
    console.warn('2D context not available for font measurement.');
    return;
  }

  // Apply the same font settings used during rendering
  // so measured dimensions match actual draw dimensions
  ctx.font = `${fontSize}px ${fontFamily}`;

  // Track largest residue character dimensions
  let maxWidth = 0;
  let maxHeight = 0;

  // Cache per-character widths for later rendering/layout use
  const characterWidthMap = new Map<string, number>();

  // Measure all uppercase residue characters (A-Z)
  for (let charCode = 65; charCode <= 90; charCode++) {
    const char = String.fromCharCode(charCode);

    // Measure rendered text dimensions
    const metrics = ctx.measureText(char);

    // Horizontal rendered width
    const width = metrics.width;

    // Actual rendered height above + below baseline
    const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    // Update largest detected width/height
    if (width > maxWidth) maxWidth = width;
    if (height > maxHeight) maxHeight = height;

    // Store width for later per-residue calculations
    characterWidthMap.set(char, width);
  }

  // Add internal residue padding to measured dimensions
  // so text does not touch box borders during rendering
  return {
    maxBoxWidth: Math.ceil(maxWidth + characterBgPadding * 2),
    maxBoxHeight: Math.ceil(maxHeight + characterBgPadding * 2),
    characterWidthMap,
  };
}

export interface NumberingBoxDimensionData {
  // Total height required for numbering labels above residues
  maxNumberingBoxHeight: number;

  // Extra vertical spacing added between numbering and sequence
  numberingVerticalSpacing: number;

  // Updated line spacing between sequence rows
  lineBottomMargin: number;
}

/**
 * Measures residue numbering text dimensions and calculates
 * the vertical space required for numbering labels rendered
 * above the sequence.
 *
 * Additional spacing is added when circle annotations are enabled
 * to avoid overlap between numbering labels and annotations.
 */
export function calculateNumberingBoxMaxHeight(
  numberingFontSize: number,
  fontFamily: string,
  characterBgPadding: number,
  lineBottomMargin: number,
  hasCircleAnnotation: boolean
): NumberingBoxDimensionData | undefined {
  // Create temporary canvas used only for text measurement
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');

  // Abort if browser does not support 2D canvas context
  if (!ctx) {
    console.warn('2D context not available for font measurement.');
    return;
  }

  // Apply numbering font settings used during rendering
  // so measured dimensions match actual draw dimensions
  ctx.font = `${numberingFontSize}px ${fontFamily}`;

  // Track tallest numbering character height
  let maxHeight = 0;

  // Measure numeric characters (0-9) used in residue numbering
  for (let charCode = 48; charCode <= 57; charCode++) {
    const char = String.fromCharCode(charCode);

    // Measure rendered text dimensions
    const metrics = ctx.measureText(char);

    // Actual rendered height above + below baseline
    const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    // Update tallest detected character height
    if (height > maxHeight) {
      maxHeight = height;
    }
  }

  // Default spacing between numbering and sequence
  let numberingVerticalSpacing = 0;

  // Clone line spacing value so original input remains unchanged
  let updatedLineBottomMargin = lineBottomMargin;

  // Add extra spacing when circle annotations are present
  // to prevent overlap with numbering labels
  if (hasCircleAnnotation) {
    numberingVerticalSpacing = 4;
    updatedLineBottomMargin += 4;
  }

  // Add internal padding to numbering height
  // so text does not touch box boundaries
  return {
    maxNumberingBoxHeight: Math.ceil(maxHeight + characterBgPadding * 2) + numberingVerticalSpacing,
    numberingVerticalSpacing,
    lineBottomMargin: updatedLineBottomMargin,
  };
}
