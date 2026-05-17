import { SmartSequenceAnnotationForEvent } from '../data-processing/seq-viewer-models';
import { BehaviorSubject } from 'rxjs';
import { getResidueNameFromCode } from '../data-processing/seq-viewer.helpers';
import { getAnnotationsForResidue } from '../data-processing/seq-viewer-annotation-processing';
import { getSidebarPanelEmptyState } from '../rendering/seq-viewer-ui-sidebar';
import { SmartSequenceVisualisation } from '../sequence-visualisation';
import { buildTooltipContent, showTooltip } from '../rendering/seq-viewer-ui-tooltip';

export function getResidueAtCoords(
  x: number,
  y: number,
  maxBoxWidth: number,
  maxBoxHeight: number,
  maxNumberingBoxHeight: number,
  lineBottomMargin: number,
  margins: { top: number; left: number; right: number; bottom: number },
  chunkedSequence: string[],
  canvasBoxPerLines: number | undefined,
  grouping: boolean,
  currentGroupSize: number | null = null,
  residueGroupSize: number,
  residueGroupRightMargin: number,
  hoverBorderWidth: number
): number | null {
  const { top: marginTop, left: marginLeft } = margins;
  const lineHeight = maxBoxHeight + maxNumberingBoxHeight + lineBottomMargin;

  const lineIndex = Math.floor((y - marginTop) / lineHeight);
  if (lineIndex < 0 || lineIndex >= chunkedSequence.length) return null;

  const yStart = marginTop + lineIndex * lineHeight;
  let xCursor = marginLeft;
  const sequenceLine = chunkedSequence[lineIndex];
  const residueGlobalIndex = lineIndex * canvasBoxPerLines!;

  for (let i = 0; i < sequenceLine.length; i++) {
    const residueIndex = residueGlobalIndex + i + 1;

    // if (grouping && i > 0 && i % residueGroupSize === 0) {
    const grpSize = currentGroupSize ? currentGroupSize : residueGroupSize;
    if (grouping && i > 0 && i % grpSize === 0) {
      xCursor += residueGroupRightMargin;
    }

    const box = {
      x: xCursor,
      y: yStart + maxNumberingBoxHeight,
      width: maxBoxWidth,
      height: maxBoxHeight,
    };

    if (x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height) {
      return residueIndex;
    }

    xCursor += maxBoxWidth + hoverBorderWidth;
  }

  return null;
}

export function triggerExternalEvents(eventType: 'hover' | 'click', residueIndex?: number, entityId?: string, chainId?: string) {
  if (entityId === undefined || chainId === undefined) {
    console.warn('Cannot trigger external events without entityId and chainId');
    return;
  }

  const eventData = residueIndex
    ? {
        entityId: entityId,
        chainId: chainId,
        residueNumber: residueIndex,
      }
    : {
        entityId: entityId,
        chainId: chainId,
      };

  if (eventType === 'hover' && residueIndex) {
    // for Molstar, Topology Viewer, etc
    const eventObj = new CustomEvent('protvista-mouseover', {
      detail: {
        start: `${residueIndex}`,
        end: `${residueIndex}`,
        feature: {
          entityId: entityId,
          chainId: chainId,
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
          entityId: entityId,
          chainId: chainId,
        },
      },
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(eventObj);
  }
  // unsupported by molstar
  // else if (eventType === 'click') {
  //   console.log("does NOT has residue index")
  //   // for Molstar, Topology Viewer, etc
  //   const eventObj = new CustomEvent('protvista-click', {
  //     detail: null,
  //     bubbles: true,
  //     cancelable: true,
  //   });
  //   document.dispatchEvent(eventObj);
  // }
}

export function dispatchSelectEvent(sequence: string, isNucleic: boolean, residueIndex: number, entityId?: string, chainId?: string) {
  const eventData = residueIndex
    ? {
        entityId: entityId,
        chainId: chainId,
        residueNumber: residueIndex,
      }
    : {
        entityId: entityId,
        chainId: chainId,
      };
  const residue = sequence[residueIndex - 1];
  const residueName = isNucleic === false ? getResidueNameFromCode(residue) : residue;
  const title = `${residueName} ${residueIndex}`;

  // for new Sequence Track Viewer and LLM tab
  const detail = { eventData, title };
  const clickEvent = new CustomEvent('smartSeqViewerSelect', {
    detail: detail,
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(clickEvent);
}

export function dispatchDeselectEvent() {
  const clickEvent = new CustomEvent('smartSeqViewerUnselect', {
    detail: null,
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(clickEvent);
}

export class SmartSeqViewerEventManager {
  public currentHoveredResidue: number | null = null;
  public currentClickedResidue: number | null = null;
  public residueHover$ = new BehaviorSubject<{ residueIndex: number; annotations: SmartSequenceAnnotationForEvent[] | null } | null>(null);
  public residueClick$ = new BehaviorSubject<{ residueIndex: number; annotations: SmartSequenceAnnotationForEvent[] | null } | null>(null);

  constructor(private parent: SmartSequenceVisualisation) {}

  public selectResidueState(residueIndex: number, doNotPropagate?: boolean, doNotReport?: boolean) {
    this.currentHoveredResidue = null;
    this.currentClickedResidue = residueIndex;
    this.residueClick$.next({
      residueIndex,
      annotations: getAnnotationsForResidue(residueIndex, this.parent.annotations),
    });
    if (this.parent.externalEvents && !doNotPropagate) triggerExternalEvents('click', residueIndex, this.parent.entityId, this.parent.chainId);
    if (!doNotReport) dispatchSelectEvent(this.parent.sequence, this.parent.isNucleic, residueIndex, this.parent.entityId, this.parent.chainId);
    if (doNotPropagate && doNotReport) this.parent.scrollAndCenterToResidue(residueIndex);
    this.parent.showSidebar(residueIndex);
  }

  public unselectResidueState(doNotReport?: boolean) {
    if (!this.parent.sidebarPanel) return;
    // if (this.externalEvents) triggerExternalEvents('click', undefined, this.entityId, this.chainId);
    this.parent.sidebarPanel.innerHTML = getSidebarPanelEmptyState(this.parent.annotations, this.parent.nonObservedResidues);
    this.currentClickedResidue = null;
    this.parent.draw();
    this.residueClick$.next(null);
    if (!doNotReport) dispatchDeselectEvent();
  }

  public onMouseMove(event: MouseEvent) {
    const rect = this.parent.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const residueIndex = getResidueAtCoords(
      x,
      y,
      this.parent.maxBoxWidth,
      this.parent.maxBoxHeight,
      this.parent.maxNumberingBoxHeight,
      this.parent.lineBottomMargin,
      this.parent.margins,
      this.parent.chunkedSequence,
      this.parent.canvasBoxPerLines,
      this.parent.grouping,
      this.parent.currentGroupSize,
      this.parent.residueGroupSize,
      this.parent.residueGroupRightMargin,
      this.parent.hoverBorderWidth
    );

    if (residueIndex !== null) {
      if (this.currentHoveredResidue !== residueIndex) {
        this.currentHoveredResidue = residueIndex;
        const eventData = {
          residueIndex,
          annotations: getAnnotationsForResidue(residueIndex, this.parent.annotations),
        };
        this.residueHover$.next(eventData);
        if (this.parent.externalEvents) triggerExternalEvents('hover', residueIndex, this.parent.entityId, this.parent.chainId);
        this.parent.canvas.style.cursor = 'pointer';
        this.parent.draw();
        if (this.parent.hoverTooltips && this.parent.tooltipEl) {
          const content = buildTooltipContent(
            this.parent.sequence,
            this.parent.isNucleic,
            residueIndex,
            this.parent.tooltipFormatting,
            this.parent.alternativeNumberings
          );
          if (content) showTooltip(content, x, y, this.parent.tooltipEl);
        }
      }
    } else {
      if (this.currentHoveredResidue !== null) {
        this.currentHoveredResidue = null;
        this.residueHover$.next(null);
        if (this.parent.externalEvents) triggerExternalEvents('hover', undefined, this.parent.entityId, this.parent.chainId);
        this.parent.canvas.style.cursor = 'default';
        this.parent.draw();
        if (this.parent.hoverTooltips && this.parent.tooltipEl) this.parent.tooltipEl.style.display = 'none';
      }
    }
  }

  public onMouseLeave() {
    if (this.currentHoveredResidue !== null) {
      this.currentHoveredResidue = null;
      this.residueHover$.next(null);
      if (this.parent.externalEvents) triggerExternalEvents('hover', undefined, this.parent.entityId, this.parent.chainId);
      this.parent.canvas.style.cursor = 'default';
      this.parent.draw();
      if (this.parent.hoverTooltips && this.parent.tooltipEl) this.parent.tooltipEl.style.display = 'none';
    }
  }

  public onClick(event: MouseEvent) {
    const rect = this.parent.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const residueIndex = getResidueAtCoords(
      x,
      y,
      this.parent.maxBoxWidth,
      this.parent.maxBoxHeight,
      this.parent.maxNumberingBoxHeight,
      this.parent.lineBottomMargin,
      this.parent.margins,
      this.parent.chunkedSequence,
      this.parent.canvasBoxPerLines,
      this.parent.grouping,
      this.parent.currentGroupSize,
      this.parent.residueGroupSize,
      this.parent.residueGroupRightMargin,
      this.parent.hoverBorderWidth
    );

    if (residueIndex !== null) {
      if (this.currentClickedResidue === residueIndex) {
        this.unselectResidueState();
      } else {
        this.currentClickedResidue = null;
        this.parent.draw();
        this.selectResidueState(residueIndex);
      }
    }
  }

  public handleExternalMouseoverEvent(event: Event) {
    const detail = (event as any).eventData || (event as CustomEvent).detail?.feature;
    if (!detail) return;

    const entityId = detail.entity_id || detail.entityId;
    const chainId = detail.auth_asym_id || detail.chainId;
    const residueNumber = detail.residueNumber || parseInt(detail.start) || detail.label_seq_ids?.[0];

    if (entityId !== this.parent.entityId || chainId !== this.parent.chainId || residueNumber === undefined) return;

    this.currentHoveredResidue = residueNumber;
    const annotations = getAnnotationsForResidue(residueNumber, this.parent.annotations);
    this.residueHover$.next({ residueIndex: residueNumber, annotations });
    this.parent.draw();
  }

  public handleExternalMouseoutEvent(_event: Event) {
    // const detail = (event as CustomEvent).detail?.eventData || (event as CustomEvent).detail?.feature;
    // if (!detail) return;

    // const entityId = detail.entityId;
    // const chainId = detail.chainId;

    // if (entityId !== this.entityId || chainId !== this.chainId) return;

    this.currentHoveredResidue = null;
    this.residueHover$.next(null);
    this.parent.draw();
  }

  public handleExternalClickEvent(event: any) {
    const detail = event.eventData || event.detail?.eventData;
    if (!detail) return;

    const entityKey = detail['entityId'] ? 'entityId' : 'entity_id';
    let chainKey = detail['chainId'] ? 'chainId' : 'chain_id';
    if (chainKey === 'chain_id') chainKey = detail['chain_id'] ? 'chain_id' : 'auth_asym_id';

    const entityId = detail[entityKey] !== 'ignore' ? detail[entityKey] : this.parent.entityId;
    const chainId = detail[chainKey] !== 'ignore' ? detail[chainKey] : this.parent.chainId;
    const residueNumber = detail.residueNumber || parseInt(detail.start) || detail.label_seq_id;

    if (entityId !== this.parent.entityId || chainId !== this.parent.chainId || residueNumber === undefined) return;

    if (detail.unselect !== 'ignore') {
      const doNotReport = detail.doNotReport;
      this.unselectResidueState(doNotReport);
      return;
    }
    if (residueNumber !== this.currentClickedResidue) {
      this.selectResidueState(residueNumber, true, true);
    }
    this.parent.draw();
  }
}
