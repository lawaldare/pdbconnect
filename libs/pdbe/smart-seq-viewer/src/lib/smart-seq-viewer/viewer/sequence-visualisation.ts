import { scaleOrdinal, scaleQuantile } from 'd3-scale';
import { BehaviorSubject } from 'rxjs';

export type SmartSequenceAnnotationScales = 'ordinal' | 'quantile';
export type SmartSequenceAnnotationRenderingTypes = 'Background' | 'Underline' | 'CircleAbove' | 'TextColour';

export interface AlternativeNumbering {
  numberingType: 'Auth' | 'UniProt'; // e.g Auth, UniProt
  identifier: 'auth' | 'uniprot';
  alternativeSequence: Array<Array<string | number>>;
  extraIdentifiers?: string[][];
}

export interface TooltipFormatting {
  preferred: 'auth' | 'uniprot' | 'none';
  secondary?: 'auth' | 'uniprot' | 'none';
  extraLine?: 'auth' | 'uniprot' | 'none';
}

export interface SmartSequenceAnnotation {
  name: string; // Human-readable label for the annotation
  identifier: string; // Unique ID defined by the user
  scaleType: SmartSequenceAnnotationScales; // D3 scale type
  scaleDomain: 'auto' | string[]; // Categories or values; 'auto' will infer from data
  scaleRange: string[]; // Array of colors to map values to
  rendering: SmartSequenceAnnotationRenderingTypes; // For now only 'Background' supported
  data: {
    residueIndex: number; // 1-indexed
    value: string; // Category label or value used for color mapping
    extraData?: any;
  }[];
}

export interface SmartSequenceAnnotationForEvent {
  name: string; // Human-readable label for the annotation
  identifier: string; // Unique ID defined by the user
  scaleType: SmartSequenceAnnotationScales; // D3 scale type
  scaleDomain: 'auto' | string[]; // Categories or values; 'auto' will infer from data
  scaleRange: string[]; // Array of colors to map values to
  rendering: SmartSequenceAnnotationRenderingTypes; // For now only 'Background' supported
  datum: {
    residueIndex: number; // 1-indexed
    value: string; // Category label or value used for color mapping
    extraData?: any;
  };
}

export class SmartSequenceVisualisation {
  private sequence: string;
  private alternativeNumberings?: AlternativeNumbering[];
  private entityId?: string;
  private chainId?: string;
  private containerId: string;
  private grouping = true;
  private groupingLineBreak = false;
  private responsive = true;
  private externalEvents = false;
  private hoverTooltips = true;
  private tooltipFormatting: TooltipFormatting;
  private scrollContainerMaxHeight = 140;

  private fontFamily = 'IBM Plex Sans';
  private fontSize = 14;
  private fontColor = '#000';
  private characterBgPadding = 2;
  private margins = { top: 4, bottom: 4, left: 4, right: 4 };
  private resizeObserver: ResizeObserver | null = null;
  private resizeDebounceTimer: number | null = null;

  private residueNumberingFreq = 10; // Number of residues per group
  private residueGroupSize = 10; // Number of residues per group
  private residueGroupRightMargin = 16; // Pixels between residue groups
  private lineBottomMargin = 4; // Pixels between lines
  private numberingFontSize = 12; // Smaller font size for numbering
  // private numberingHeight = 12; // Space above sequences for numbers

  private maxBoxWidth = -1;
  private maxBoxHeight = -1;
  private characterWidthMap = new Map<string, number>();

  private maxNumberingBoxHeight = -1;

  private canvas: HTMLCanvasElement;
  private canvasWidth = 0;
  private canvasHeight = 0;
  private canvasTextLines: number | undefined = undefined;
  private canvasBoxPerLines: number | undefined = undefined;

  private chunkedSequence: string[] = [];
  private currentStartLine = 0;
  private currentEndLine = 0;

  private annotations: SmartSequenceAnnotation[] = [];
  private hasCircleAnnotation = false;
  private backgroundColorMap: Map<number, string> | undefined;
  private underlineColorMap: Map<number, string> | undefined;
  private circleColorMap: Map<number, string> | undefined;

  // private defaultBgColour = '#f0f0f0';
  private defaultBgColour = 'rgba(255, 255, 255, 0.0)';
  private circleAnnotationRadius = 3;
  private circleAnnotationMarginTop = 2;
  private circleAnnotationMarginBottom = 2;

  private currentHoveredResidue: number | null = null;
  private currentClickedResidue: number | null = null;

  private hoverTextColour = '';
  private hoverBorderColour = '';
  private hoverBorderWidth = 2;
  private residueRects = new Map<number, { x: number; y: number; width: number; height: number }>();
  private residueHover$ = new BehaviorSubject<{ residueIndex: number; annotations: SmartSequenceAnnotationForEvent[] | null } | null>(null);
  private residueClick$ = new BehaviorSubject<{ residueIndex: number; annotations: SmartSequenceAnnotationForEvent[] | null } | null>(null);
  private externalEventListeners: { type: string; listener: EventListener }[] = [];

  private tooltipEl: HTMLDivElement | null = null;
  private sidebarPanel: HTMLDivElement | null = null;
  private visualisationAndSidebarContainer: HTMLDivElement | null = null;
  private visualisationContainer: HTMLDivElement | null = null;

  constructor(
    sequence: string,
    containerId: string,
    alternativeNumberings?: AlternativeNumbering[],
    initialAnnotations: SmartSequenceAnnotation[] = [],
    entityId?: string,
    chainId?: string,
    options?: {
      grouping?: boolean;
      groupingLineBreak?: boolean;
      responsive?: boolean;
      externalEvents?: boolean;
      hoverTooltips?: boolean;
      tooltipFormatting?: TooltipFormatting;
      scrollContainerMaxHeight?: number;
    }
  ) {
    this.sequence = sequence;
    this.containerId = containerId;
    this.grouping = options?.grouping !== false;
    this.groupingLineBreak = options?.groupingLineBreak === true;
    this.responsive = options?.responsive !== false;
    this.externalEvents = options?.externalEvents === true;
    this.entityId = entityId;
    this.chainId = chainId;
    this.alternativeNumberings = alternativeNumberings;
    this.hoverTooltips = options?.hoverTooltips !== false;
    const defaultTooltipFormatting: TooltipFormatting = {
      preferred: 'auth',
      secondary: 'none',
      extraLine: 'uniprot',
    };
    this.tooltipFormatting = options?.tooltipFormatting ?? defaultTooltipFormatting;
    this.scrollContainerMaxHeight = options?.scrollContainerMaxHeight ?? 140;

    const container = document.getElementById(this.containerId);
    if (!container) {
      throw new Error(`Container with id "${this.containerId}" not found.`);
    }
    this.validateAnnotations(initialAnnotations);
    this.annotations = [...initialAnnotations];

    this.visualisationAndSidebarContainer = this.createFlexBoxWrapper();
    this.visualisationContainer = this.createScrollableCanvasWrapper();
    this.sidebarPanel = this.createSidebarPanel();

    container.appendChild(this.visualisationAndSidebarContainer);
    this.visualisationAndSidebarContainer.appendChild(this.visualisationContainer);
    this.visualisationAndSidebarContainer.appendChild(this.sidebarPanel);

    const sidebarWidth = this.sidebarPanel.offsetWidth;
    const width = this.visualisationAndSidebarContainer.offsetWidth - sidebarWidth;

    this.canvasWidth = width;
    this.canvasHeight = 0;

    this.calcBoxMaxDimensions();
    this.calcNumberingBoxMaxHeight();
    this.processAnnotations();
    // First pass: calculate layout to determine canvasBoxPerLines
    this.setCanvasBoxPerLines();
    // Recalculate height after layout for non-scroll mode
    // chunkedSequence is populated and canvasTextLines is correct
    this.canvasHeight = this.calcCanvasHeightForFullSequence();
    // recalculate layout with the correct canvasHeight
    this.calculateLineBoxLayout();

    this.canvas = this.createHiPPICanvas(this.canvasWidth, this.canvasHeight);
    this.registerCanvasMouseEvents();
    this.visualisationContainer.appendChild(this.canvas);
    if (this.hoverTooltips) {
      this.createTooltipElement(this.visualisationContainer);
    }

    this.showSidebar(undefined); // show default placeholder
    this.draw();
    this.setupResizeObserver();
    this.registerExternalEventsListeners();
  }

  private onContainerResize() {
    // const container = document.getElementById(this.containerId);
    if (!this.visualisationContainer || !this.visualisationAndSidebarContainer || !this.sidebarPanel) return;

    const sidebarWidth = this.sidebarPanel.offsetWidth;

    const newCanvasWidth = this.visualisationAndSidebarContainer.offsetWidth - sidebarWidth;
    const newCanvasHeight = this.calcCanvasHeightForFullSequence();

    // Skip if dimensions haven't changed
    if (newCanvasWidth === this.canvasWidth && newCanvasHeight === this.canvasHeight) return;

    this.canvasWidth = newCanvasWidth;
    this.canvasHeight = newCanvasHeight;

    this.setCanvasBoxPerLines();
    this.calculateLineBoxLayout();
    this.canvas = this.createHiPPICanvas(this.canvasWidth, this.canvasHeight);
    this.registerCanvasMouseEvents();
    this.visualisationContainer.innerHTML = ''; // clear old canvas

    // add sidebar panel
    const sel = this.currentClickedResidue ? this.currentClickedResidue : undefined;
    this.showSidebar(sel); // show default placeholder

    this.visualisationContainer.appendChild(this.canvas);

    this.draw();
  }

  private getSidebarWidth(container: HTMLElement): number {
    const percentWidth = container.offsetWidth * 0.25;
    return Math.max(percentWidth, 200);
  }

  private createFlexBoxWrapper(): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'flexbox-wrapper';
    wrapper.style.display = 'flex';
    wrapper.style.height = `${this.scrollContainerMaxHeight}px`;
    wrapper.style.width = '100%';
    wrapper.style.background = '#f3f3f3';
    return wrapper;
  }

  private createScrollableCanvasWrapper(): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'canvas-wrapper';
    wrapper.style.width = 'calc(100% - 250px)';
    wrapper.style.overflowY = 'auto';
    wrapper.style.maxHeight = `${this.scrollContainerMaxHeight}px`;
    return wrapper;
  }

  private setupResizeObserver() {
    // const container = document.getElementById(this.containerId);
    if (!this.visualisationContainer || !this.responsive) return;

    this.resizeObserver = new ResizeObserver(() => {
      if (this.resizeDebounceTimer !== null) {
        window.clearTimeout(this.resizeDebounceTimer);
      }

      this.resizeDebounceTimer = window.setTimeout(() => {
        this.onContainerResize();
      }, 200); // debounce 200ms
    });

    this.resizeObserver.observe(this.visualisationContainer);
  }

  private teardownResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  private validateAnnotations(annotations: SmartSequenceAnnotation[]): void {
    const identifiers = new Set<string>();
    const names = new Set<string>();
    const renderings = new Set<SmartSequenceAnnotationRenderingTypes>();

    for (const ann of annotations) {
      if (identifiers.has(ann.identifier)) {
        throw new Error(`Duplicate annotation identifier: ${ann.identifier}`);
      }
      if (names.has(ann.name)) {
        throw new Error(`Duplicate annotation name: ${ann.name}`);
      }
      if (renderings.has(ann.rendering)) {
        throw new Error(`Only one annotation per rendering type is allowed. Duplicate: ${ann.rendering}`);
      }

      identifiers.add(ann.identifier);
      names.add(ann.name);
      renderings.add(ann.rendering);
    }
  }

  private processAnnotations() {
    this.backgroundColorMap = this.processBgAnnotations();
    this.underlineColorMap = this.processUnderlineAnnotations();
    this.circleColorMap = this.processCircleAboveAnnotations();
  }

  private processBgAnnotations(): Map<number, string> {
    const backgroundColorMap = new Map<number, string>();
    const bgAnnotation = this.annotations.find((a) => a.rendering === 'Background');

    if (!bgAnnotation) return backgroundColorMap;

    let scale: (value: any) => string;

    if (bgAnnotation.scaleType === 'ordinal') {
      const domain = bgAnnotation.scaleDomain === 'auto' ? [...new Set(bgAnnotation.data.map((d) => d.value))] : bgAnnotation.scaleDomain;

      scale = scaleOrdinal<string, string>().domain(domain).range(bgAnnotation.scaleRange);
    } else if (bgAnnotation.scaleType === 'quantile') {
      const numericValues = bgAnnotation.data.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v));
      if (numericValues.length === 0) return backgroundColorMap;

      const domain = bgAnnotation.scaleDomain === 'auto' ? numericValues : bgAnnotation.scaleDomain.map((v) => parseFloat(v)).filter((v) => !isNaN(v));

      scale = scaleQuantile<string>().domain(domain).range(bgAnnotation.scaleRange);
    } else {
      console.warn(`Unsupported scaleType: ${bgAnnotation.scaleType}`);
      return backgroundColorMap;
    }

    for (const d of bgAnnotation.data) {
      const color = scale(d.value);
      if (color) {
        backgroundColorMap.set(d.residueIndex, color);
      }
    }

    return backgroundColorMap;
  }

  private processUnderlineAnnotations(): Map<number, string> {
    const underlineColorMap = new Map<number, string>();
    const underlineAnnotation = this.annotations.find((a) => a.rendering === 'Underline');

    if (!underlineAnnotation) return underlineColorMap;

    let scale: (value: any) => string;

    if (underlineAnnotation.scaleType === 'ordinal') {
      const domain = underlineAnnotation.scaleDomain === 'auto' ? [...new Set(underlineAnnotation.data.map((d) => d.value))] : underlineAnnotation.scaleDomain;

      scale = scaleOrdinal<string, string>().domain(domain).range(underlineAnnotation.scaleRange);
    } else if (underlineAnnotation.scaleType === 'quantile') {
      const numericValues = underlineAnnotation.data.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v));
      if (numericValues.length === 0) return underlineColorMap;

      const domain = underlineAnnotation.scaleDomain === 'auto' ? numericValues : underlineAnnotation.scaleDomain.map((v) => parseFloat(v)).filter((v) => !isNaN(v));

      scale = scaleQuantile<string>().domain(domain).range(underlineAnnotation.scaleRange);
    } else {
      console.warn(`Unsupported scaleType for Underline: ${underlineAnnotation.scaleType}`);
      return underlineColorMap;
    }

    for (const d of underlineAnnotation.data) {
      const color = scale(d.value);
      if (color) {
        underlineColorMap.set(d.residueIndex, color);
      }
    }

    return underlineColorMap;
  }

  private processCircleAboveAnnotations(): Map<number, string> {
    const circleColorMap = new Map<number, string>();
    const circleAnnotation = this.annotations.find((a) => a.rendering === 'CircleAbove');

    this.hasCircleAnnotation = false;
    if (!circleAnnotation) return circleColorMap;

    this.hasCircleAnnotation = true;

    let scale: (value: any) => string;

    if (circleAnnotation.scaleType === 'ordinal') {
      const domain = circleAnnotation.scaleDomain === 'auto' ? [...new Set(circleAnnotation.data.map((d) => d.value))] : circleAnnotation.scaleDomain;

      scale = scaleOrdinal<string, string>().domain(domain).range(circleAnnotation.scaleRange);
    } else if (circleAnnotation.scaleType === 'quantile') {
      const numericValues = circleAnnotation.data.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v));
      if (numericValues.length === 0) return circleColorMap;

      const domain = circleAnnotation.scaleDomain === 'auto' ? numericValues : circleAnnotation.scaleDomain.map((v) => parseFloat(v)).filter((v) => !isNaN(v));

      scale = scaleQuantile<string>().domain(domain).range(circleAnnotation.scaleRange);
    } else {
      console.warn(`Unsupported scaleType for CircleAbove: ${circleAnnotation.scaleType}`);
      return circleColorMap;
    }

    for (const d of circleAnnotation.data) {
      const color = scale(d.value);
      if (color) {
        circleColorMap.set(d.residueIndex, color);
      }
    }

    return circleColorMap;
  }

  public getResidueHoverObservable() {
    return this.residueHover$.asObservable();
  }

  public getResidueClickObservable() {
    return this.residueClick$.asObservable();
  }

  private getAnnotationsForResidue(residueIndex: number): SmartSequenceAnnotationForEvent[] {
    const matching: SmartSequenceAnnotationForEvent[] = [];

    for (const annotation of this.annotations) {
      const datum = annotation.data.find((d) => d.residueIndex === residueIndex);
      if (datum) {
        matching.push({
          name: annotation.name,
          identifier: annotation.identifier,
          scaleType: annotation.scaleType,
          scaleDomain: annotation.scaleDomain,
          scaleRange: annotation.scaleRange,
          rendering: annotation.rendering,
          datum,
        });
      }
    }
    return matching;
  }

  private onMouseMove(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (const [residueIndex, box] of this.residueRects.entries()) {
      if (x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height) {
        if (this.currentHoveredResidue !== residueIndex) {
          this.currentHoveredResidue = residueIndex;
          const eventData = {
            residueIndex,
            annotations: this.getAnnotationsForResidue(residueIndex),
          };
          this.residueHover$.next(eventData);
          if (this.externalEvents) this.triggerExternalEvents('hover', residueIndex);
          this.canvas.style.cursor = 'pointer';
          this.draw(); // trigger visual change
          if (this.hoverTooltips && this.tooltipEl) {
            const content = this.buildTooltipContent(residueIndex);
            if (content) this.showTooltip(content, x, y);
          }
        }
        return;
      }
    }

    // If no match, clear hover
    if (this.currentHoveredResidue !== null) {
      this.currentHoveredResidue = null;
      this.residueHover$.next(null);
      if (this.externalEvents) this.triggerExternalEvents('hover');
      this.canvas.style.cursor = 'default';
      this.draw(); // remove highlight
      if (this.hoverTooltips && this.tooltipEl) this.tooltipEl.style.display = 'none';
    }
  }

  private onMouseLeave() {
    if (this.currentHoveredResidue !== null) {
      this.currentHoveredResidue = null;
      this.residueHover$.next(null);
      if (this.externalEvents) this.triggerExternalEvents('hover');
      this.canvas.style.cursor = 'default';
      this.draw();
      if (this.hoverTooltips && this.tooltipEl) this.tooltipEl.style.display = 'none';
    }
  }

  private onClick(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (const [residueIndex, box] of this.residueRects.entries()) {
      if (x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height) {
        this.currentClickedResidue = residueIndex;
        this.residueClick$.next({
          residueIndex,
          annotations: this.getAnnotationsForResidue(residueIndex),
        });
        if (this.externalEvents) this.triggerExternalEvents('click', residueIndex);
        this.showSidebar(residueIndex);
        return;
      }
    }
  }

  private triggerExternalEvents(eventType: 'hover' | 'click', residueIndex?: number) {
    if (!this.entityId || !this.chainId) {
      console.warn('Cannot trigger external events without entityId and chainId');
      return;
    }

    const eventData = residueIndex
      ? {
          entityId: this.entityId,
          chainId: this.chainId,
          residueNumber: residueIndex,
        }
      : {
          entityId: this.entityId,
          chainId: this.chainId,
        };

    if (eventType === 'hover' && residueIndex) {
      // for Molstar, Topology Viewer, etc
      const eventObj = new CustomEvent('protvista-mouseover', {
        detail: {
          start: `${residueIndex}`,
          end: `${residueIndex}`,
          feature: {
            entityId: this.entityId,
            chainId: this.chainId,
          },
        },
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(eventObj);

      // for new Sequence Track Viewer
      const hoverEvent = new CustomEvent('smartSeqViewerMouseover', {
        detail: { eventData },
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(hoverEvent);
    } else if (eventType === 'hover') {
      // for Molstar, Topology Viewer, etc
      const eventObj = new CustomEvent('protvista-mouseout');
      document.dispatchEvent(eventObj);

      // for new Sequence Track Viewer
      const hoverEvent = new CustomEvent('smartSeqViewerMouseout', {
        detail: { eventData },
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(hoverEvent);
    } else if (eventType === 'click' && residueIndex) {
      // for Molstar, Topology Viewer, etc
      const eventObj = new CustomEvent('protvista-click', {
        detail: {
          start: `${residueIndex}`,
          end: `${residueIndex}`,
          feature: {
            entityId: this.entityId,
            chainId: this.chainId,
          },
        },
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(eventObj);

      // for new Sequence Track Viewer
      const clickEvent = new CustomEvent('smartSeqViewerClick', {
        detail: { eventData },
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(clickEvent);
    }
  }

  private handleExternalMouseoverEvent(event: Event) {
    const detail = (event as any).eventData || (event as CustomEvent).detail?.feature;
    if (!detail) return;

    const entityId = detail.entity_id || detail.entityId;
    const chainId = detail.auth_asym_id || detail.chainId;
    const residueNumber = detail.residueNumber || parseInt(detail.start);

    if (entityId !== this.entityId || chainId !== this.chainId) return;

    this.currentHoveredResidue = residueNumber;
    const annotations = this.getAnnotationsForResidue(residueNumber);
    this.residueHover$.next({ residueIndex: residueNumber, annotations });
    this.draw();
  }

  private handleExternalMouseoutEvent(event: Event) {
    const detail = (event as CustomEvent).detail?.eventData || (event as CustomEvent).detail?.feature;
    if (!detail) return;

    const entityId = detail.entityId;
    const chainId = detail.chainId;

    if (entityId !== this.entityId || chainId !== this.chainId) return;

    this.currentHoveredResidue = null;
    this.residueHover$.next(null);
    this.draw();
  }

  private handleExternalClickEvent(event: Event) {
    const detail = (event as CustomEvent).detail?.eventData || (event as CustomEvent).detail?.feature;
    if (!detail) return;

    const entityId = detail.entityId;
    const chainId = detail.chainId;
    const residueNumber = detail.residueNumber || parseInt(detail.start);

    if (entityId !== this.entityId || chainId !== this.chainId) return;

    const annotations = this.getAnnotationsForResidue(residueNumber);
    this.residueClick$.next({ residueIndex: residueNumber, annotations });
  }

  private showTooltip(content: string, x: number, y: number) {
    this.tooltipEl!.innerHTML = content;
    this.tooltipEl!.style.display = 'block';

    const GAP = 10;

    requestAnimationFrame(() => {
      const tooltipWidth = this.tooltipEl!.offsetWidth;
      const tooltipHeight = this.tooltipEl!.offsetHeight;
      const container = this.tooltipEl!.parentElement!;
      const containerRect = container.getBoundingClientRect();

      let left = x + GAP;
      let top = y + GAP;

      const willOverflowRight = left + tooltipWidth > containerRect.width;
      const willOverflowBottom = top + tooltipHeight > containerRect.height;

      if (willOverflowRight) {
        left = x - tooltipWidth - GAP;
        if (left < 0) left = containerRect.width - tooltipWidth - GAP; // fallback clamp
      }

      if (willOverflowBottom) {
        top = y - tooltipHeight - GAP;
        if (top < 0) top = containerRect.height - tooltipHeight - GAP; // fallback clamp
      }

      this.tooltipEl!.style.left = `${left}px`;
      this.tooltipEl!.style.top = `${top}px`;
    });
  }

  private showSidebar(residueIndex?: number) {
    if (typeof residueIndex !== 'number') return;
    if (!this.sidebarPanel) return;

    const content = this.buildSidebarContent(residueIndex);
    this.sidebarPanel.scrollTop = 0;
    this.sidebarPanel.innerHTML = content;
    this.onContainerResize(); // re-layout with sidebar visible

    const box = this.residueRects.get(residueIndex);
    if (!box) return;

    // const container = document.getElementById(this.containerId);
    if (!this.visualisationContainer || !this.sidebarPanel) return;

    this.sidebarPanel.innerHTML = this.buildSidebarContent(residueIndex);
  }

  private calcBoxMaxDimensions() {
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    if (!ctx) {
      console.warn('2D context not available for font measurement.');
      return;
    }

    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    let maxWidth = 0;
    let maxHeight = 0;

    const metricsCache: TextMetrics[] = [];

    for (let charCode = 65; charCode <= 90; charCode++) {
      // A-Z
      const char = String.fromCharCode(charCode);
      const metrics = ctx.measureText(char);
      metricsCache.push(metrics);

      const width = metrics.width;
      const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

      if (width > maxWidth) maxWidth = width;
      if (height > maxHeight) maxHeight = height;
      this.characterWidthMap.set(char, width);
    }

    this.maxBoxWidth = Math.ceil(maxWidth + this.characterBgPadding * 2);
    this.maxBoxHeight = Math.ceil(maxHeight + this.characterBgPadding * 2);
  }

  private calcNumberingBoxMaxHeight() {
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    if (!ctx) {
      console.warn('2D context not available for font measurement.');
      return;
    }

    ctx.font = `${this.numberingFontSize}px ${this.fontFamily}`;

    let maxHeight = 0;

    // We can safely use digits 0–9 for measuring numbering height
    for (let charCode = 48; charCode <= 57; charCode++) {
      // '0' to '9'
      const char = String.fromCharCode(charCode);
      const metrics = ctx.measureText(char);
      const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      if (height > maxHeight) {
        maxHeight = height;
      }
    }

    this.maxNumberingBoxHeight = Math.ceil(maxHeight + this.characterBgPadding * 2);
  }

  private calcCanvasHeightForFullSequence(): number {
    let x = this.margins.left;
    let lineCount = 1;

    for (let i = 1; i <= this.sequence.length; i++) {
      if (x + this.maxBoxWidth > this.canvasWidth - this.margins.right) {
        x = this.margins.left;
        lineCount++;
      }

      x += this.maxBoxWidth + this.hoverBorderWidth;

      // Add spacing after group
      if (this.grouping && i % this.residueGroupSize === 0) {
        x += this.residueGroupRightMargin;
      }
    }

    const extraCircleHeight = this.hasCircleAnnotation ? this.circleAnnotationRadius * 2 + this.circleAnnotationMarginTop + this.circleAnnotationMarginBottom : 0;

    const totalLineHeight = this.maxNumberingBoxHeight + this.maxBoxHeight + extraCircleHeight + this.lineBottomMargin;

    return this.margins.top + lineCount * totalLineHeight + this.margins.bottom;
  }

  private setCanvasBoxPerLines() {
    const { left: marginLeft, right: marginRight, top: marginTop, bottom: marginBottom } = this.margins;

    const availableWidth = this.canvasWidth - marginLeft - marginRight;
    const effectiveBoxWidth = this.maxBoxWidth + this.hoverBorderWidth;

    if (this.groupingLineBreak) {
      this.canvasBoxPerLines = Math.floor(availableWidth / effectiveBoxWidth); // spacing handled during drawing
    } else if (this.grouping) {
      const groupBoxWidth = this.residueGroupSize * effectiveBoxWidth + this.residueGroupRightMargin;
      const fullGroupsPerLine = Math.floor((availableWidth + this.residueGroupRightMargin) / groupBoxWidth);
      this.canvasBoxPerLines = fullGroupsPerLine * this.residueGroupSize;
    } else {
      this.canvasBoxPerLines = Math.floor(availableWidth / effectiveBoxWidth);
    }
  }

  private calculateLineBoxLayout() {
    if (this.maxBoxWidth <= 0 || this.maxBoxHeight <= 0 || this.maxNumberingBoxHeight <= 0) {
      console.warn('Box or numbering dimensions not calculated yet.');
      return;
    }

    const { left: _marginLeft, right: _marginRight, top: marginTop, bottom: marginBottom } = this.margins;

    // const availableWidth = this.canvasWidth - marginLeft - marginRight;
    // const effectiveBoxWidth = this.maxBoxWidth + this.hoverBorderWidth;

    // if (this.groupingLineBreak) {
    //   this.canvasBoxPerLines = Math.floor(availableWidth / effectiveBoxWidth); // spacing handled during drawing
    // } else if (this.grouping) {
    //   const groupBoxWidth = this.residueGroupSize * effectiveBoxWidth + this.residueGroupRightMargin;
    //   const fullGroupsPerLine = Math.floor((availableWidth + this.residueGroupRightMargin) / groupBoxWidth);
    //   this.canvasBoxPerLines = fullGroupsPerLine * this.residueGroupSize;
    // } else {
    //   this.canvasBoxPerLines = Math.floor(availableWidth / effectiveBoxWidth);
    // }

    const extraCircleHeight = this.hasCircleAnnotation ? this.circleAnnotationRadius * 2 + this.circleAnnotationMarginTop + this.circleAnnotationMarginBottom : 0;
    const totalLineHeight = this.maxNumberingBoxHeight + this.maxBoxHeight + extraCircleHeight + this.lineBottomMargin;
    this.canvasTextLines = Math.floor((this.canvasHeight - marginTop - marginBottom + this.lineBottomMargin) / totalLineHeight);

    if (this.groupingLineBreak) {
      this.chunkedSequence = [this.sequence]; // single chunk, flat loop
    } else {
      this.chunkedSequence = [];
      for (let i = 0; i < this.sequence.length; i += this.canvasBoxPerLines!) {
        this.chunkedSequence.push(this.sequence.slice(i, i + this.canvasBoxPerLines!));
      }
    }

    this.currentStartLine = 0;
    this.currentEndLine = this.groupingLineBreak ? this.canvasTextLines : Math.min(this.canvasTextLines, this.chunkedSequence.length);
  }

  private draw() {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      console.warn('Canvas context not available.');
      return;
    }

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.fontColor;

    const { left: marginLeft, top: marginTop } = this.margins;

    const lineHeight =
      this.maxBoxHeight +
      this.maxNumberingBoxHeight +
      this.lineBottomMargin +
      (this.hasCircleAnnotation ? this.circleAnnotationRadius * 2 + this.circleAnnotationMarginTop + this.circleAnnotationMarginBottom : 0);

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
        this.drawResidue(ctx, x, y, char, residueIndex);

        this.residueRects.set(residueIndex, {
          x,
          y: y + this.maxNumberingBoxHeight,
          width: this.maxBoxWidth,
          height: this.maxBoxHeight,
        });

        x += this.maxBoxWidth + this.hoverBorderWidth;

        // Add group spacing if needed
        if (residueIndex % this.residueGroupSize === 0) {
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

          if (this.grouping && i > 0 && i % this.residueGroupSize === 0) {
            x += this.residueGroupRightMargin;
          }

          this.drawResidue(ctx, x, yStart, char, residueIndex);

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

  private drawResidue(ctx: CanvasRenderingContext2D, x: number, yStart: number, char: string, residueIndex: number) {
    const annotationColor = this.backgroundColorMap!.get(residueIndex);
    ctx.fillStyle = annotationColor ?? this.defaultBgColour;
    ctx.fillRect(x, yStart + this.maxNumberingBoxHeight, this.maxBoxWidth, this.maxBoxHeight);

    if (residueIndex === this.currentHoveredResidue || residueIndex === this.currentClickedResidue) {
      ctx.strokeStyle = this.hoverBorderColour || '#000';
      ctx.lineWidth = this.hoverBorderWidth;
      ctx.strokeRect(x, yStart + this.maxNumberingBoxHeight, this.maxBoxWidth, this.maxBoxHeight);
      ctx.fillStyle = this.hoverTextColour || '#000';
    } else {
      ctx.fillStyle = this.fontColor;
    }

    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.fillText(char, x + this.maxBoxWidth / 2, yStart + this.maxNumberingBoxHeight + this.maxBoxHeight / 2);

    const circleColor = this.circleColorMap!.get(residueIndex);
    if (circleColor) {
      const circleCenterX = x + this.maxBoxWidth / 2;
      const circleCenterY = yStart + this.characterBgPadding + this.circleAnnotationMarginTop + this.circleAnnotationMarginBottom + this.circleAnnotationRadius * 2;
      ctx.beginPath();
      ctx.arc(circleCenterX, circleCenterY, this.circleAnnotationRadius, 0, 2 * Math.PI);
      ctx.fillStyle = circleColor;
      ctx.fill();
      ctx.fillStyle = this.fontColor;
    }

    const underlineColor = this.underlineColorMap!.get(residueIndex);
    if (underlineColor) {
      const underlineY = yStart + this.maxNumberingBoxHeight + this.maxBoxHeight + 4;
      ctx.strokeStyle = underlineColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 2, underlineY);
      ctx.lineTo(x + this.maxBoxWidth - 2, underlineY);
      ctx.stroke();
    }

    if (residueIndex % this.residueNumberingFreq === 0) {
      ctx.font = `${this.numberingFontSize}px ${this.fontFamily}`;
      ctx.fillText(residueIndex.toString(), x + this.maxBoxWidth / 2, yStart + this.maxNumberingBoxHeight / 2);
      ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    }
  }

  private createHiPPICanvas(width: number, height: number) {
    const ratio = window.devicePixelRatio;
    const canvas = document.createElement('canvas');

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const context = canvas.getContext('2d');
    if (context) context.scale(ratio, ratio);

    return canvas;
  }

  private registerCanvasMouseEvents() {
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    this.canvas.addEventListener('click', this.onClick.bind(this));
  }

  private registerExternalEventsListeners() {
    if (!this.externalEvents || !this.entityId || !this.chainId) return;

    const relevantEvents: [string, EventListener][] = [
      ['PDB.topologyViewer.mouseover', this.handleExternalMouseoverEvent.bind(this)],
      ['PDB.molstar.mouseover', this.handleExternalMouseoverEvent.bind(this)],
      // ['protvista-mouseover', this.handleExternalMouseoverEvent.bind(this)],

      ['PDB.topologyViewer.mouseout', this.handleExternalMouseoutEvent.bind(this)],
      ['PDB.molstar.mouseout', this.handleExternalMouseoutEvent.bind(this)],
      // ['protvista-mouseout', this.handleExternalMouseoutEvent.bind(this)],

      ['PDB.topologyViewer.click', this.handleExternalClickEvent.bind(this)],
      ['PDB.molstar.click', this.handleExternalClickEvent.bind(this)],
      // ['protvista-click', this.handleExternalClickEvent.bind(this)],
    ];

    for (const [eventType, handler] of relevantEvents) {
      document.addEventListener(eventType, handler);
      this.externalEventListeners.push({ type: eventType, listener: handler });
    }
  }

  private createTooltipElement(container: HTMLElement) {
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.background = '#fff';
    tooltip.style.color = '#1a1c1a';
    tooltip.style.borderRadius = '0px';
    tooltip.style.padding = '10px';
    tooltip.style.fontSize = '14px';
    tooltip.style.fontFamily = "'IBM Plex Sans', Arial, Helvetica, sans-serif";
    tooltip.style.boxShadow = '0 5px 5px -3px rgb(0 0 0 / 20%), 0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%)';
    tooltip.style.zIndex = '9999';
    tooltip.style.display = 'none';

    container.style.position = 'relative'; // make container the positioning context
    container.appendChild(tooltip);
    this.tooltipEl = tooltip;
  }

  private buildTooltipContent(residueIndex: number): string | null {
    const residue = this.sequence[residueIndex - 1];
    if (!residue) return null;

    const residueName = this.getResidueNameFromCode(residue);

    const authNumbering = this.alternativeNumberings?.find((n) => n.identifier === 'auth');
    const uniprotNumbering = this.alternativeNumberings?.find((n) => n.identifier === 'uniprot');

    const authId = authNumbering?.alternativeSequence?.[residueIndex - 1]?.[0];
    const uniprotResIds = uniprotNumbering?.alternativeSequence?.[residueIndex - 1];
    const uniprotIds = uniprotNumbering?.extraIdentifiers?.[residueIndex - 1];

    let displayResnum = `${residueName} ${residueIndex}`;
    let secondaryString = '';
    let extraLineString = '';
    let hasWarning = false;

    // --- Preferred display ---
    if (this.tooltipFormatting.preferred === 'auth' && authId) {
      displayResnum = `${residueName} ${authId} (Auth)`;
    } else if (this.tooltipFormatting.preferred === 'uniprot' && uniprotResIds && uniprotIds && uniprotResIds.length > 0 && uniprotIds.length > 0) {
      displayResnum = `${residueName} ${uniprotResIds[0]} (${uniprotIds[0]})`;
      if (uniprotIds.length > 1) hasWarning = true;
    }

    // --- Secondary line ---
    if (this.tooltipFormatting.secondary === 'none') {
      secondaryString = `Index: ${residueIndex}`;
    } else if (this.tooltipFormatting.secondary === 'auth' && authId) {
      secondaryString = ` Auth: ${authId}`;
    } else if (this.tooltipFormatting.secondary === 'uniprot' && uniprotResIds && uniprotIds && uniprotResIds.length > 0 && uniprotIds.length > 0) {
      secondaryString = ` ${uniprotIds[0]}: ${uniprotResIds[0]}`;
      if (uniprotIds.length > 1) hasWarning = true;
    }

    // --- Extra line ---
    if (this.tooltipFormatting.extraLine === 'none') {
      extraLineString = `Index: ${residueIndex}`;
    } else if (this.tooltipFormatting.extraLine === 'auth' && authId) {
      extraLineString = `Auth: ${authId}`;
    } else if (this.tooltipFormatting.extraLine === 'uniprot' && uniprotResIds && uniprotIds && uniprotResIds.length > 0 && uniprotIds.length > 0) {
      extraLineString = `${uniprotIds[0]}: ${uniprotResIds[0]}`;
      if (uniprotIds.length > 1) hasWarning = true;
    }

    // --- Optional warning line ---
    const warningLine = hasWarning ? `<div style="color: #d32f2f; font-size: 14px;">⚠ Multiple UniProt mappings</div>` : '';

    return `
      <div style="font-weight: 500;">${displayResnum}</div>
      <div style="font-size: 14px;">${secondaryString}</div>
      <div style="font-size: 14px;">${extraLineString}</div>
      ${warningLine}
      <em style="font-size: 12px;">Click to view info</em>
    `;
  }

  private createSidebarPanel() {
    const panel = document.createElement('div');
    panel.className = 'sidebar-panel';
    panel.style.width = '250px';
    panel.style.height = '100%';
    panel.style.background = '#fafafa';
    panel.style.borderLeft = '1px solid #ccc';
    panel.style.overflowY = 'auto';
    panel.style.padding = '12px';
    panel.style.zIndex = '9998';
    panel.innerHTML = `<p style="margin-top: 0; font-size: 14px;">Click a residue to view more details</p>`;
    panel.style.display = 'block';

    return panel;
    // container.style.position = 'relative';
    // container.appendChild(panel);
    // this.sidebarPanel = panel;
  }

  private buildSidebarContent(residueIndex: number): string {
    const residue = this.sequence[residueIndex - 1];
    const residueName = this.getResidueNameFromCode(residue);
    const authNumbering = this.alternativeNumberings?.find((n) => n.identifier === 'auth');
    const uniprotNumbering = this.alternativeNumberings?.find((n) => n.identifier === 'uniprot');

    const authId = authNumbering?.alternativeSequence?.[residueIndex - 1]?.[0];
    const uniprotResIds = uniprotNumbering?.alternativeSequence?.[residueIndex - 1];
    const uniprotIds = uniprotNumbering?.extraIdentifiers?.[residueIndex - 1];

    // Inline close handler
    const handleSidebarClose = () => {
      if (this.sidebarPanel) {
        // this.sidebarPanel.style.display = 'none';
        this.sidebarPanel.innerHTML = '<p style="margin-top: 0; font-size: 14px;">Click a residue to view more details</p>';
        this.currentClickedResidue = null;
        this.onContainerResize();
      }
    };

    // Attach to window so the button onclick can reference it
    (window as any).smartSeqSidebarClose = handleSidebarClose;

    let html = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h5 style="margin: 0;">${residueName} ${residueIndex}</h5>
      <button onclick="smartSeqSidebarClose()" style="background: transparent; border: none; font-size: 20px; cursor: pointer;">×</button>
    </div>
    `;

    // Auth
    if (authId) {
      html += `<p><strong>Auth:</strong> ${authId}</p>`;
    }

    // UniProt
    if (uniprotResIds && uniprotIds) {
      html += `<p><strong>UniProt:</strong></p><ul>`;
      for (let i = 0; i < uniprotIds.length; i++) {
        html += `<li><a href="https://www.uniprot.org/uniprotkb/${uniprotIds[i]}" target="_blank">${uniprotIds[i]}</a> - Residue: ${uniprotResIds[i]}</li>`;
      }
      if (uniprotIds.length === 0) {
        html += `<li>No mappings</li>`;
      }
      html += `</ul>`;
    }

    // TODO: Adapt this for validation data once it's here
    // Annotations
    const annotations = this.getAnnotationsForResidue(residueIndex);
    if (annotations.length > 0) {
      html += `<hr/><h5>Annotations</h5>`;
      for (const ann of annotations) {
        html += `<ul style="margin-bottom:10px;">`;
        html += `<li><strong>Name</strong>: ${ann.name}</li>`;
        const color = this.getAnnotationColor(residueIndex, ann.rendering);
        html += `<li><strong>Value</strong>: ${ann.datum.value}</li>`;
        html += `<li><strong>Colour</strong>: <div style="display:inline-block;width:12px;height:12px;background:${color};margin-right:6px;"></div></li>`;
        html += `</ul>`;
      }
    }

    return html;
  }

  private getAnnotationColor(residueIndex: number, rendering: SmartSequenceAnnotationRenderingTypes): string | undefined {
    if (rendering === 'Background') return this.backgroundColorMap?.get(residueIndex);
    if (rendering === 'Underline') return this.underlineColorMap?.get(residueIndex);
    if (rendering === 'CircleAbove') return this.circleColorMap?.get(residueIndex);
    return undefined;
  }

  private getResidueNameFromCode(code: string): string {
    const map: { [key: string]: string } = {
      A: 'Ala',
      R: 'Arg',
      N: 'Asn',
      D: 'Asp',
      C: 'Cys',
      Q: 'Gln',
      E: 'Glu',
      G: 'Gly',
      H: 'His',
      I: 'Ile',
      L: 'Leu',
      K: 'Lys',
      M: 'Met',
      F: 'Phe',
      P: 'Pro',
      S: 'Ser',
      T: 'Thr',
      W: 'Trp',
      Y: 'Tyr',
      V: 'Val',
    };
    return map[code.toUpperCase()] || code;
  }

  public destroy() {
    this.teardownResizeObserver();
    for (const { type, listener } of this.externalEventListeners) {
      document.removeEventListener(type, listener);
    }
    this.externalEventListeners = [];
    this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.removeEventListener('mouseleave', this.onMouseLeave.bind(this));
    this.canvas.removeEventListener('click', this.onClick.bind(this));
  }
}
