import {
  AlternativeNumbering,
  SmartSequenceAnnotation,
  SmartSequenceAnnotationForEvent,
  SmartSequenceVisOptions,
  TooltipFormatting,
} from './data-processing/seq-viewer-models';
import { validateAlternativeNumberings, validateAnnotations, validateNonObserved } from './data-processing/seq-viewer-validation';
import {
  calculateCanvasHeightForFullSequence,
  calculateHorizontalCenterMargin,
  calculateLineBoxLayout,
  calculateCanvasBoxPerLines,
  LineBoxLayoutData,
  calculateBoxMaxDimensions,
  calculateNumberingBoxMaxHeight,
} from './layout/seq-viewer-layout-utils';
import {
  createFlexBoxWrapper,
  createScrollableCanvasWrapper,
  createSidebarPanel,
  createTooltipElement,
  createWarningDiv,
} from './rendering/seq-viewer-ui-main-panels';
import { createHiPPICanvas } from './rendering/canvas/seq-viewer-canvas-renderer';
import {
  processBgAnnotations,
  processCircleAboveAnnotations,
  processDistStarAboveAnnotations,
  processHexagonAboveAnnotations,
  processUnderlineAnnotations,
} from './data-processing/seq-viewer-annotation-processing';
import { buildSidebarContent, getSidebarPanelEmptyState } from './rendering/seq-viewer-ui-sidebar';
import { drawResidue } from './rendering/canvas/seq-viewer-residue-renderer';
import { SmartSeqViewerEventManager } from './events/seq-viewer-evt-manager';

export class SmartSequenceVisualisation {
  public sequence: string;
  public alternativeNumberings?: AlternativeNumbering[];
  public nonObservedResidues?: number[];
  public indexWithMultipleResiduesData?: {
    [key: string]: {
      three_letter_code: string;
      one_letter_code: string;
      parent_chem_comp_ids: string[];
    };
  };

  public entityId?: string;
  public chainId?: string;
  private containerId: string;
  public grouping = true;
  private groupingLineBreak = false;
  private responsive = true;
  public externalEvents = false;
  public hoverTooltips = true;
  public tooltipFormatting: TooltipFormatting;
  private scrollContainerMaxHeight = 160;
  public isNucleic = false;
  public useAuthNumbers = false;
  public helpLogoSrc: string | undefined = undefined;
  private authOffset: string | undefined = undefined;

  private fontFamily = 'IBM Plex Sans';
  private fontSize = 14;
  private characterBgPadding = 2;
  private originalMargins = { top: 4, bottom: 4, left: 4, right: 4 };
  public margins = { top: 4, bottom: 4, left: 4, right: 4 };
  private resizeObserver: ResizeObserver | null = null;
  private resizeDebounceTimer: number | null = null;

  private residueNumberingFreq = 10; // Number of residues to add numbering above
  private currentResidueNumberingFreq: number | null = null;
  public residueGroupSize = 10; // Number of residues per group
  public currentGroupSize: number | null = null;
  public residueGroupRightMargin = 16; // Pixels between residue groups
  public lineBottomMargin = 6; // Pixels between lines
  private numberingFontSize = 12; // Smaller font size for numbering
  // private numberingHeight = 12; // Space above sequences for numbers
  private numberingVerticalSpacing = 0; // Space between sequences and numbers, auto-calculated

  public maxBoxWidth = -1;
  public maxBoxHeight = -1;
  private characterWidthMap = new Map<string, number>();

  public maxNumberingBoxHeight = -1;

  public canvas!: HTMLCanvasElement;
  private canvasWidth = 0;
  private canvasHeight = 0;
  private canvasTextLines: number | undefined = undefined;
  private fullGroupsPerLine: number | undefined = undefined;
  private notDrawnWidth: number | undefined = undefined;
  public canvasBoxPerLines: number | undefined = undefined;

  public chunkedSequence: string[] = [];
  private currentStartLine = 0;
  private currentEndLine = 0;

  public annotations: SmartSequenceAnnotation[] = [];
  private hasCircleAnnotation = false;
  public backgroundColorMap: Map<number, string> | undefined;
  public underlineColorMap: Map<number, string> | undefined;
  public circleColorMap: Map<number, string> | undefined;
  public distStarColorMap: Map<number, string> | undefined;
  public hexagonColorMap: Map<number, string> | undefined;

  // private defaultBgColour = '#f0f0f0';
  private defaultBgColour = 'rgba(255, 255, 255, 0.0)';
  private circleAnnotationRadius = 4;
  private circleAnnotationMarginTop = 3;
  private circleAnnotationMarginBottom = 0;

  public eventManager = new SmartSeqViewerEventManager(this);

  private clickedBorderColour = '';
  private clickedBorderWidth = 2;
  public hoverBorderWidth = 2;
  private residueRects = new Map<number, { x: number; y: number; width: number; height: number }>();
  private externalEventListeners: { type: string; listener: EventListener }[] = [];

  public tooltipEl: HTMLDivElement | null = null;
  public sidebarPanel: HTMLDivElement | null = null;
  private sidebarPanelWidth = 250;
  private visualisationAndSidebarContainer: HTMLDivElement | null = null;
  private visualisationContainer: HTMLDivElement | null = null;
  private warningDiv: HTMLDivElement | null = null;

  public annotationRenderers: Map<string, (ann: SmartSequenceAnnotationForEvent, residueIndex: number) => string> = new Map();

  private boundOnMouseMove!: (e: MouseEvent) => void;
  private boundOnMouseLeave!: (e: MouseEvent) => void;
  private boundOnClick!: (e: MouseEvent) => void;

  constructor(
    sequence: string,
    containerId: string,
    alternativeNumberings?: AlternativeNumbering[],
    nonObservedResidues?: number[],
    initialAnnotations: SmartSequenceAnnotation[] = [],
    indexWithMultipleResiduesData?: {
      [key: string]: {
        three_letter_code: string;
        one_letter_code: string;
        parent_chem_comp_ids: string[];
      };
    },
    entityId?: string,
    chainId?: string,
    options?: SmartSequenceVisOptions
  ) {
    this.sequence = sequence;
    this.indexWithMultipleResiduesData = indexWithMultipleResiduesData;
    this.containerId = containerId;

    this.grouping = options?.grouping !== false;
    this.groupingLineBreak = options?.groupingLineBreak === true;
    this.responsive = options?.responsive !== false;
    this.externalEvents = options?.externalEvents === true;
    this.isNucleic = options?.isNucleic === true;
    this.useAuthNumbers = options?.useAuthNumbers === true;

    this.entityId = entityId;
    this.chainId = chainId;
    this.hoverTooltips = options?.hoverTooltips !== false;
    const defaultTooltipFormatting: TooltipFormatting = {
      preferred: 'auth',
      secondary: 'none',
      extraLine: 'uniprot',
    };
    this.tooltipFormatting = options?.tooltipFormatting ?? defaultTooltipFormatting;
    this.scrollContainerMaxHeight = options?.scrollContainerMaxHeight ?? 160;
    this.tooltipFormatting = options?.tooltipFormatting ?? defaultTooltipFormatting;
    this.helpLogoSrc = options?.helpLogoSrc ?? undefined;

    const container = document.getElementById(this.containerId);
    if (!container) {
      // throw new Error(`Container with id "${this.containerId}" not found.`);
      return;
    }
    container.innerHTML = '';
    container.style.width = '100%';
    container.style.maxWidth = '100%';

    // ------- Validate annotations data START -------
    const altNumVal = validateAlternativeNumberings(this.sequence, alternativeNumberings || []);
    this.authOffset = altNumVal.authOffset;

    this.alternativeNumberings = alternativeNumberings;

    validateNonObserved(this.sequence, nonObservedResidues || []);
    this.nonObservedResidues = nonObservedResidues;

    validateAnnotations(initialAnnotations);
    this.annotations = [...initialAnnotations];
    // -------  END -------

    // ------- DOM elements creation START -------
    this.visualisationAndSidebarContainer = createFlexBoxWrapper(this.scrollContainerMaxHeight);
    this.visualisationContainer = createScrollableCanvasWrapper(this.scrollContainerMaxHeight);
    this.warningDiv = createWarningDiv();
    this.sidebarPanel = createSidebarPanel(this.sidebarPanelWidth);
    this.sidebarPanel.innerHTML = getSidebarPanelEmptyState(this.annotations, this.nonObservedResidues);

    container.appendChild(this.visualisationAndSidebarContainer);
    // container.appendChild(this.sidebarPanel);
    this.visualisationAndSidebarContainer.appendChild(this.visualisationContainer);
    this.visualisationAndSidebarContainer.appendChild(this.sidebarPanel);
    // -------  END -------

    // ------- Initial dimensions calculations START -------
    const width = this.visualisationAndSidebarContainer.offsetWidth - this.sidebarPanelWidth;
    this.canvasWidth = width;
    this.canvasHeight = 0;

    const boxDimensionData = calculateBoxMaxDimensions(this.fontSize, this.fontFamily, this.characterBgPadding);
    if (boxDimensionData) {
      this.maxBoxWidth = boxDimensionData.maxBoxWidth;
      this.maxBoxHeight = boxDimensionData.maxBoxHeight;
      this.characterWidthMap = boxDimensionData.characterWidthMap;
    }

    const hasCircle = this.annotations.map((annotation) => annotation.rendering).indexOf('CircleAbove') > -1;
    const resNumBoxDimensionData = calculateNumberingBoxMaxHeight(this.numberingFontSize, this.fontFamily, this.characterBgPadding, this.lineBottomMargin, hasCircle);
    if (resNumBoxDimensionData) {
      (this.maxNumberingBoxHeight = resNumBoxDimensionData.maxNumberingBoxHeight),
        (this.numberingVerticalSpacing = resNumBoxDimensionData.numberingVerticalSpacing),
        (this.lineBottomMargin = resNumBoxDimensionData.lineBottomMargin);
    }
    // -------  END -------

    // ------- Annotations processing START -------
    this.backgroundColorMap = processBgAnnotations(this.annotations);
    this.underlineColorMap = processUnderlineAnnotations(this.annotations);
    const circleAnnotationsData = processCircleAboveAnnotations(this.annotations);
    this.circleColorMap = circleAnnotationsData.circleColorMap;
    this.hasCircleAnnotation = circleAnnotationsData.hasCircleAnnotation;
    this.distStarColorMap = processDistStarAboveAnnotations(this.annotations);
    this.hexagonColorMap = processHexagonAboveAnnotations(this.annotations);
    // -------  END -------

    this.calculateLayout(false);

    if (this.authOffset && this.authOffset !== '0') {
      const inclusionExplanation =
        this.authOffset === 'non-trivial'
          ? ' The author-provided numbering also includes inclusion codes (e.g: Ala 141A) which make offset calculation non-trivial.'
          : '';
      this.warningDiv.textContent = `Note: There is a ${this.authOffset} offset between author-provided numbering used in the sequence below and sequential residue numbering.${inclusionExplanation}`;
    }
    if (this.sequence.includes('*')) {
      const commaSepPositions = this.indexWithMultipleResiduesData ? Object.keys(this.indexWithMultipleResiduesData).join(', ') : 'unknown';
      this.warningDiv.textContent += ` Note: The sequence contains wildcard characters (*) at position${
        commaSepPositions.includes(',') ? 's' : ''
      } ${commaSepPositions} representing non-standard residues with multiple parent residues.`;
    }

    this.visualisationContainer.appendChild(this.warningDiv);
    this.canvas = createHiPPICanvas(this.canvasWidth, this.canvasHeight);
    this.registerCanvasMouseEvents();
    this.visualisationContainer.appendChild(this.canvas);
    if (this.hoverTooltips) {
      this.tooltipEl = createTooltipElement(this.visualisationContainer);
    }

    // this.showSidebar(undefined); // show default placeholder
    this.eventManager.unselectResidueState();
    this.draw();
    this.setupResizeObserver();
    // this.onContainerResize();
    this.registerExternalEventsListeners();
  }

  private calculateLayout(recalculate: boolean) {
    const canvasBoxData = this.calculateCanvasBoxPerLines();
    if (this.grouping) this.fullGroupsPerLine = canvasBoxData.fullGroupsPerLine;
    if (this.grouping) this.notDrawnWidth = canvasBoxData.notDrawnWidth;
    this.canvasBoxPerLines = canvasBoxData.canvasBoxPerLines;

    this.margins.left = calculateHorizontalCenterMargin(this.originalMargins.left + 0, this.notDrawnWidth);
    if (recalculate === false) {
      // Recalculate height after layout for non-scroll mode
      // chunkedSequence is populated and canvasTextLines is correct
      this.canvasHeight = this.calculateCanvasHeightForFullSequence();
      // This early calc makes sure calculateLineBoxLayout has correct canvasHeight
    }
    const layoutData = this.calculateLineBoxLayout();
    if (layoutData) {
      this.canvasTextLines = layoutData.canvasTextLines;
      this.chunkedSequence = layoutData.chunkedSequence;
      this.currentStartLine = layoutData.currentStartLine;
      this.currentEndLine = layoutData.currentEndLine;
      this.currentGroupSize = layoutData.currentGroupSize;
      this.currentResidueNumberingFreq = layoutData.currentResidueNumberingFreq;
    }
    if (recalculate === true) {
      this.canvasHeight = this.calculateCanvasHeightForFullSequence();
      // freeze current group size & numbering frequency for consistency
      this.currentGroupSize = this.residueGroupSize;
      this.currentResidueNumberingFreq = this.residueNumberingFreq;
    }
  }

  public onContainerResize() {
    // const container = document.getElementById(this.containerId);
    if (!this.visualisationContainer || !this.visualisationAndSidebarContainer || !this.sidebarPanel) return;

    const newCanvasWidth = this.visualisationAndSidebarContainer.offsetWidth - this.sidebarPanelWidth;

    // decide group size for this width
    let num = 8;
    if (newCanvasWidth > 820) num = 10;
    else if (newCanvasWidth > 735) num = 12;
    else if (newCanvasWidth > 625) num = 10;
    else if (newCanvasWidth > 495) num = 12;
    else if (newCanvasWidth > 415) num = 10;
    else if (newCanvasWidth > 310) num = 15;
    else if (newCanvasWidth > 210) num = 10;
    this.residueGroupSize = num;
    this.residueNumberingFreq = num;

    // const newCanvasHeight = this.calculateCanvasHeightForFullSequence();

    // Skip if dimensions haven't changed
    // if (newCanvasWidth === this.canvasWidth && newCanvasHeight === this.canvasHeight) return;
    if (newCanvasWidth === this.canvasWidth) return;

    this.canvasWidth = newCanvasWidth;
    // this.canvasHeight = newCanvasHeight;
    this.calculateLayout(true);

    // remove only the old canvas, keep warningDiv intact
    if (this.canvas && this.visualisationContainer.contains(this.canvas)) {
      this.visualisationContainer.removeChild(this.canvas);
    }

    this.canvas = createHiPPICanvas(this.canvasWidth, this.canvasHeight);
    this.registerCanvasMouseEvents();

    // add sidebar panel
    const sel = this.eventManager.currentClickedResidue ? this.eventManager.currentClickedResidue : undefined;
    this.showSidebar(sel); // show default placeholder

    this.visualisationContainer.appendChild(this.canvas);

    this.draw();
  }

  private setupResizeObserver() {
    if (!this.visualisationContainer || !this.responsive) return;

    const handleResize = () => {
      if (this.resizeDebounceTimer !== null) {
        window.clearTimeout(this.resizeDebounceTimer);
      }

      this.resizeDebounceTimer = window.setTimeout(() => {
        this.onContainerResize(); // keep same name
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    this.resizeObserver = {
      disconnect: () => window.removeEventListener('resize', handleResize),
    } as unknown as ResizeObserver;
  }

  private teardownResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  public getResidueHoverObservable() {
    return this.eventManager.residueHover$.asObservable();
  }

  public getResidueSelectionObservable() {
    return this.eventManager.residueClick$.asObservable();
  }

  public scrollAndCenterToResidue(residueIndex: number) {
    if (!this.visualisationContainer) return;
    if (!this.canvasBoxPerLines || !this.canvasTextLines) return;

    const { top: marginTop } = this.margins;
    const lineHeight = this.maxBoxHeight + this.maxNumberingBoxHeight + this.lineBottomMargin;

    const lineIndex = Math.floor((residueIndex - 1) / this.canvasBoxPerLines);
    const yStart = marginTop + lineIndex * lineHeight;

    const centerOffset = this.visualisationContainer.clientHeight / 2 - lineHeight / 2;
    const scrollTop = yStart - centerOffset;

    // Clamp scrollTop to valid scroll range
    const maxScroll = this.visualisationContainer.scrollHeight - this.visualisationContainer.clientHeight;
    const clampedScroll = Math.max(0, Math.min(scrollTop, maxScroll));

    this.visualisationContainer.scrollTo({ top: clampedScroll, behavior: 'smooth' });
  }

  public showSidebar(residueIndex?: number) {
    if (typeof residueIndex !== 'number') return;
    if (!this.sidebarPanel) return;

    const content = buildSidebarContent(
      residueIndex,
      this.sequence,
      this.isNucleic,
      this.sidebarPanel,
      this.eventManager,
      this.useAuthNumbers,
      this.annotations,
      this.helpLogoSrc,
      this.nonObservedResidues,
      this.backgroundColorMap,
      this.underlineColorMap,
      this.circleColorMap,
      this.distStarColorMap,
      this.hexagonColorMap,
      this.annotationRenderers,
      this.alternativeNumberings,
      this.indexWithMultipleResiduesData
    );
    this.sidebarPanel.scrollTop = 0;

    this.sidebarPanel.innerHTML = content;
    this.attachSidebarHelpIconEvents();
    this.onContainerResize(); // re-layout with sidebar visible
  }

  private calculateCanvasHeightForFullSequence(): number {
    return calculateCanvasHeightForFullSequence(
      this.maxBoxWidth,
      this.sequence.length,
      this.canvasWidth,
      this.residueGroupSize,
      this.currentGroupSize ?? this.residueGroupSize,
      this.hoverBorderWidth,
      this.maxNumberingBoxHeight,
      this.maxBoxHeight,
      this.lineBottomMargin,
      this.margins,
      this.grouping,
      {
        residueGroupSize: this.residueGroupSize,
        residueGroupRightMargin: this.residueGroupRightMargin,
        fullGroupsPerLine: this.fullGroupsPerLine ?? 0,
      }
    );
  }

  private calculateCanvasBoxPerLines() {
    const canvasBoxData = calculateCanvasBoxPerLines(this.canvasWidth, this.maxBoxWidth, this.hoverBorderWidth, this.margins, this.groupingLineBreak, this.grouping, {
      residueGroupSize: this.residueGroupSize,
      residueGroupRightMargin: this.residueGroupRightMargin,
    });
    return canvasBoxData;
  }

  private calculateLineBoxLayout() {
    const layoutData: LineBoxLayoutData | undefined = calculateLineBoxLayout(
      this.maxBoxWidth,
      this.maxBoxHeight,
      this.maxNumberingBoxHeight,
      this.canvasBoxPerLines,
      this.sequence,
      this.lineBottomMargin,
      this.margins,
      this.canvasHeight,
      this.groupingLineBreak,
      this.currentGroupSize,
      this.currentResidueNumberingFreq,
      {
        residueGroupSize: this.residueGroupSize,
        residueNumberingFreq: this.residueNumberingFreq,
      }
    );
    return layoutData;
  }

  public draw() {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      console.warn('Canvas context not available.');
      return;
    }

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';

    const { left: marginLeft, top: marginTop } = this.margins;

    const lineHeight = this.maxBoxHeight + this.maxNumberingBoxHeight + this.lineBottomMargin;
    const residueDrawConfigs = {
      nonObservedResidues: this.nonObservedResidues,

      backgroundColorMap: this.backgroundColorMap,
      underlineColorMap: this.underlineColorMap,
      circleColorMap: this.circleColorMap,
      distStarColorMap: this.distStarColorMap,
      hexagonColorMap: this.hexagonColorMap,

      currentHoveredResidue: this.eventManager.currentHoveredResidue,
      currentClickedResidue: this.eventManager.currentClickedResidue,

      clickedBorderColour: this.clickedBorderColour,
      clickedBorderWidth: this.clickedBorderWidth,

      maxNumberingBoxHeight: this.maxNumberingBoxHeight,
      maxBoxWidth: this.maxBoxWidth,
      maxBoxHeight: this.maxBoxHeight,

      defaultBgColour: this.defaultBgColour,

      fontSize: this.fontSize,
      fontFamily: this.fontFamily,

      numberingFontSize: this.numberingFontSize,
      numberingVerticalSpacing: this.numberingVerticalSpacing,

      characterBgPadding: this.characterBgPadding,

      circleAnnotationRadius: this.circleAnnotationRadius,
      circleAnnotationMarginTop: this.circleAnnotationMarginTop,
      circleAnnotationMarginBottom: this.circleAnnotationMarginBottom,

      residueNumberingFreq: this.residueNumberingFreq,
      currentResidueNumberingFreq: this.currentResidueNumberingFreq,

      useAuthNumbers: this.useAuthNumbers,
      alternativeNumberings: this.alternativeNumberings,

      sequenceLength: this.sequence.length,
    };

    if (this.groupingLineBreak) {
      // Draw entire sequence with dynamic line wrapping and group margin

      let x = marginLeft;
      let y = marginTop;
      let residueIndex = 1;
      let currentLine = 0;

      for (const char of this.sequence) {
        const charWidth = this.characterWidthMap.get(char) || this.maxBoxWidth;

        // Wrap to next line if needed
        if (x + this.maxBoxWidth > this.canvasWidth - this.margins.right) {
          x = marginLeft;
          y += lineHeight;
          currentLine++;
        }

        // Draw background, borders, character, annotations (like before)
        drawResidue(ctx, x, y, char, residueIndex, residueDrawConfigs);

        this.residueRects.set(residueIndex, {
          x,
          y: y + this.maxNumberingBoxHeight,
          width: this.maxBoxWidth,
          height: this.maxBoxHeight,
        });

        x += this.maxBoxWidth + this.hoverBorderWidth;

        // Add group spacing if needed
        // if (residueIndex % this.residueGroupSize === 0) {
        const grpSize = this.currentGroupSize ? this.currentGroupSize : this.residueGroupSize;
        if (residueIndex % grpSize === 0) {
          x += this.residueGroupRightMargin;
        }

        residueIndex++;
      }
    } else {
      // Existing logic
      for (let lineIndex = this.currentStartLine; lineIndex < this.currentEndLine; lineIndex++) {
        const sequenceLine = this.chunkedSequence[lineIndex];
        const yStart = marginTop + (lineIndex - this.currentStartLine) * lineHeight;

        let x = marginLeft;
        const residueGlobalIndex = lineIndex * this.canvasBoxPerLines!;

        for (let i = 0; i < sequenceLine.length; i++) {
          const char = sequenceLine[i];
          const residueIndex = residueGlobalIndex + i + 1;

          const grpSize = this.currentGroupSize ? this.currentGroupSize : this.residueGroupSize;
          if (this.grouping && i > 0 && i % grpSize === 0) {
            x += this.residueGroupRightMargin;
          }

          drawResidue(ctx, x, yStart, char, residueIndex, residueDrawConfigs);

          this.residueRects.set(residueIndex, {
            x,
            y: yStart + this.maxNumberingBoxHeight,
            width: this.maxBoxWidth,
            height: this.maxBoxHeight,
          });

          x += this.maxBoxWidth + this.hoverBorderWidth;
        }
      }
    }
  }

  private registerCanvasMouseEvents() {
    this.boundOnMouseMove = this.eventManager.onMouseMove.bind(this.eventManager);
    this.boundOnMouseLeave = this.eventManager.onMouseLeave.bind(this.eventManager);
    this.boundOnClick = this.eventManager.onClick.bind(this.eventManager);

    this.canvas.addEventListener('mousemove', this.boundOnMouseMove);
    this.canvas.addEventListener('mouseleave', this.boundOnMouseLeave);
    this.canvas.addEventListener('click', this.boundOnClick);
  }

  private registerExternalEventsListeners() {
    if (!this.externalEvents || this.entityId === undefined || this.chainId === undefined) return;

    const relevantEvents: [string, EventListener][] = [
      ['PDB.RNA.viewer.mouseover', this.eventManager.handleExternalMouseoverEvent.bind(this.eventManager)],
      ['PDB.topologyViewer.mouseover', this.eventManager.handleExternalMouseoverEvent.bind(this.eventManager)],
      ['PDB.molstar.mouseover', this.eventManager.handleExternalMouseoverEvent.bind(this.eventManager)],
      // ['protvista-mouseover', this.eventManager.handleExternalMouseoverEvent.bind(this.eventManager)],

      ['PDB.RNA.viewer.mouseout', this.eventManager.handleExternalMouseoutEvent.bind(this.eventManager)],
      ['PDB.topologyViewer.mouseout', this.eventManager.handleExternalMouseoutEvent.bind(this.eventManager)],
      ['PDB.molstar.mouseout', this.eventManager.handleExternalMouseoutEvent.bind(this.eventManager)],
      // ['protvista-mouseout', this.eventManager.handleExternalMouseoutEvent.bind(this.eventManager)],

      ['to-seq-viewer-click', this.eventManager.handleExternalClickEvent.bind(this.eventManager)],
      ['PDB.topologyViewer.click', this.eventManager.handleExternalClickEvent.bind(this.eventManager)],
      // ['PDB.molstar.click', this.eventManager.handleExternalClickEvent.bind(this.eventManager)],
      // ['protvista-click', this.eventManager.handleExternalClickEvent.bind(this.eventManager)],
    ];

    for (const [eventType, handler] of relevantEvents) {
      document.addEventListener(eventType, handler);
      this.externalEventListeners.push({ type: eventType, listener: handler });
    }
  }

  /**
   * Registers a custom HTML renderer for a specific annotation identifier.
   *
   * This allows users to override the default sidebar rendering for a given
   * annotation with their own custom HTML logic.
   *
   * @param identifier - The unique annotation identifier that the renderer should handle.
   * @param renderer - A function that receives the annotation and residue index, and returns raw HTML (as a string) to be rendered in the sidebar.
   *
   * Example of usage:
   *  mySmartViewer.registerAnnotationRenderer('my-annotation-id', (ann, residueIndex) => {
   *    const value = ann.datum.value;
   *    return `
   *      <div style="margin-bottom: 8px;">
   *        <strong>${ann.name}:</strong>
   *        <div style="color: green;">Custom value at ${residueIndex}: ${value}</div>
   *      </div>
   *    `;
   *  });
   */
  public registerAnnotationRenderer(identifier: string, renderer: (ann: SmartSequenceAnnotationForEvent, residueIndex: number) => string) {
    this.annotationRenderers.set(identifier, renderer);
  }

  private attachSidebarHelpIconEvents() {
    if (!this.sidebarPanel) return;

    const helpIcons = this.sidebarPanel.querySelectorAll<HTMLImageElement>('.help-icon');
    helpIcons.forEach((icon) => {
      const tooltipText = icon.dataset['tooltip'] || '';

      // Create tooltip element (global, outside sidebar)
      const tooltip = document.createElement('div');
      tooltip.innerHTML = tooltipText;
      tooltip.style.position = 'fixed';
      tooltip.style.display = 'none';
      tooltip.style.background = '#fff';
      tooltip.style.color = '#1a1c1a';
      tooltip.style.fontFamily = 'Roboto, sans-serif';
      tooltip.style.fontSize = '16px';
      tooltip.style.letterSpacing = '0.0333333333em';
      tooltip.style.fontWeight = '400';
      tooltip.style.lineHeight = '27px';
      tooltip.style.padding = '10px';
      tooltip.style.boxShadow = '0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%)';
      tooltip.style.borderRadius = '0';
      tooltip.style.zIndex = '1000';
      tooltip.style.maxWidth = '400px';

      document.body.appendChild(tooltip);

      icon.addEventListener('mouseenter', () => {
        const rect = icon.getBoundingClientRect();
        tooltip.style.left = `${rect.left - 200}px`;
        tooltip.style.top = `${rect.bottom + 5}px`; // 5px gap
        tooltip.style.display = 'block';
      });

      icon.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  }

  public destroy() {
    this.teardownResizeObserver();
    for (const { type, listener } of this.externalEventListeners) {
      document.removeEventListener(type, listener);
    }
    this.externalEventListeners = [];
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.boundOnMouseMove);
      this.canvas.removeEventListener('mouseleave', this.boundOnMouseLeave);
      this.canvas.removeEventListener('click', this.boundOnClick);
    }
  }
}
