import { Directive, HostListener, inject, Input } from '@angular/core';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { clearInteractivityFocusInMolstar, drawSelectionInMolstar, showInteractivityFocusInMolstar } from '../helpers/molstar-helpers';
import { timer } from 'rxjs';
import { protToMolBuildHighlightQuery, protToMolExtractColor, protToMolShouldShowInteraction } from '../helpers/protvista-interactivity';
import { VisualisationInteractivityService } from '../services/vis-interactivity-service';

@Directive({
  selector: '[pdbcVisualisationInteractivity]',
  standalone: true,
})
export class VisualisationInteractivityDirective {
  @Input({ required: true }) parentType!: 'macromolecules' | 'llm' | 'domains';
  @Input({ required: true }) hasSeqViewer = false;
  @Input({ required: true }) hasNewProtvista = false;
  @Input({ required: true }) hasLLMTable = false;
  // TODO @Input({required: true}) hasTopologyViewer: boolean = false;

  public readonly visInteractivity = inject(VisualisationInteractivityService);

  private lastClickedResidue?: {
    entity_id: string;
    auth_asym_id: string;
    residue_number: number;
  } = undefined;

  private applyFocus(selectionData: QueryParam[], toFocus: boolean) {
    if (!selectionData) return;
    return selectionData.map((datum) => {
      // Create a new object with the updated focus
      return { ...datum, focus: toFocus };
    });
  }

  @HostListener('document:smartSeqViewerSelect', ['$event'])
  private handleSmartSeqViewerSelection(event: any) {
    if (!this.hasSeqViewer) return;
    if (this.hasLLMTable) {
      const residueNumber = event.detail.eventData.residueNumber;
      const eventObj = new CustomEvent('llm-filter-list', {
        detail: {
          eventData: {
            residueNumber: residueNumber,
          },
        },
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(eventObj);
    }
    const clickData = {
      entity_id: event.detail.eventData.entityId,
      auth_asym_id: event.detail.eventData.chainId,
      residue_number: event.detail.eventData.residueNumber,
    };
    const doNotPropagateEvt = true;
    this.handleSelectionOnMolstarResClick(clickData, doNotPropagateEvt);
  }

  @HostListener('document:smartSeqViewerUnselect', ['$event'])
  private async handleSmartSeqViewerDeselection(event: any) {
    if (!this.hasSeqViewer) return;

    if (this.hasLLMTable) {
      const eventObj = new CustomEvent('llm-reset-list');
      document.dispatchEvent(eventObj);
    }

    const instance = this.visInteractivity.currentMolstarComponent?.getInstance() ?? null;
    if (!instance) return;

    // if already deselected, do nothing
    if (this.lastClickedResidue === undefined) return;
    this.lastClickedResidue = undefined;

    await clearInteractivityFocusInMolstar(instance);
    const selection = this.visInteractivity.currentSelectionData();
    if (!selection) return;

    const selectionData = this.applyFocus([...selection], true);
    await drawSelectionInMolstar(instance, selectionData);
    return;
  }

  @HostListener('document:PDB.molstar.click', ['$event'])
  private keepSelectionOnMolstarResClick(event: Event) {
    const eventData = (event as any).eventData;
    const clickData = {
      entity_id: eventData.entity_id,
      auth_asym_id: eventData.auth_asym_id,
      residue_number: eventData.residueNumber,
    };
    this.handleSelectionOnMolstarResClick(clickData);
  }

  @HostListener('document:to-molstar-click', ['$event'])
  private handleTableResidueSelection(event: Event) {
    if (!this.hasLLMTable) return;

    const eventData = (event as any).detail.eventData;

    const entityId = this.visInteractivity.currentSelectionEntityId();
    const chainId = this.visInteractivity.currentSelectionChainId();
    const residueNumber = eventData.residueNumber;

    if (!entityId || !chainId) return;
    const clickData = {
      entity_id: entityId,
      auth_asym_id: chainId,
      residue_number: residueNumber,
    };

    const doNotPropagateEvt = true;
    const doNotCheckOrUpdState = true;
    this.handleSelectionOnMolstarResClick(clickData, doNotPropagateEvt, doNotCheckOrUpdState);
    const eventObj = new CustomEvent('llm-filter-list', {
      detail: {
        eventData: {
          residueNumber: clickData.residue_number,
        },
      },
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(eventObj);
  }

  private async handleSelectionOnMolstarResClick(
    clickData: { entity_id: string; auth_asym_id: string; residue_number: number },
    doNotPropagate?: boolean,
    doNotCheckOrUpdState?: boolean
  ) {
    const selection = this.visInteractivity.currentSelectionData();
    const instance = this.visInteractivity.currentMolstarComponent?.getInstance() ?? null;

    if (!instance) return;
    // 50 ms to let molstar update components before overriding slection
    timer(50).subscribe(async () => {
      // we create a residue selection from on clickData input
      let currentResidue:
        | undefined
        | {
            entity_id: string;
            auth_asym_id: string;
            residue_number: number;
          } = clickData;

      // if switching between selection and deselection is on (!this.hasLLMTable)
      // if clickData equals currently selected residue -> proceed to unselect residue (undefined)
      if (
        !doNotCheckOrUpdState &&
        this.lastClickedResidue &&
        this.lastClickedResidue.entity_id === currentResidue.entity_id &&
        this.lastClickedResidue.auth_asym_id === currentResidue.auth_asym_id &&
        this.lastClickedResidue.residue_number === currentResidue.residue_number
      ) {
        currentResidue = undefined;
      }

      const toFocus = currentResidue ? false : true;
      const dataToFocus = selection ? [...selection] : [];
      const selectionData: QueryParam[] = this.applyFocus(dataToFocus, toFocus)!;

      // if residue is to be selected (exists)
      if (currentResidue) {
        // add it to selection data
        selectionData.push({ ...currentResidue, focus: true });
        // show interactions around it
        await showInteractivityFocusInMolstar(instance, [currentResidue]);
      } else {
        // if residue is not to be selected, clear interactivity focus of it
        await clearInteractivityFocusInMolstar(instance);
      }

      // if switching between selection and deselection is on (!this.hasLLMTable) ...
      // ... we update the residue selection state to clickData (selection) or undefined (deselection)
      // if (!doNotCheckOrUpdState) this.lastClickedResidue = currentResidue;
      this.lastClickedResidue = currentResidue;

      // we update molstar state with selectionData (domain or domain+residue)
      await drawSelectionInMolstar(instance, selectionData);

      // if clicks in other residues/entity do not propagate evt to seq. viewer
      if (
        !this.visInteractivity.currentSelectionEntityId() ||
        !this.visInteractivity.currentSelectionChainId() ||
        clickData.entity_id !== this.visInteractivity.currentSelectionEntityId() ||
        clickData.auth_asym_id !== this.visInteractivity.currentSelectionChainId()
      )
        return;

      // if evt originates from seq. viewer do not propagate evt to seq. viewer (infinite loop) ...
      if (!doNotPropagate) {
        // ... but if it doesn't (!doNotPropagate), sent it to seq. viewer ...
        const eventObj = new CustomEvent('to-seq-viewer-click', {
          detail: {
            eventData: {
              residueNumber: clickData.residue_number,
              entityId: 'ignore',
              chainId: 'ignore',
              unselect: currentResidue ? 'ignore' : true,
            },
          },
          bubbles: true,
          cancelable: true,
        });
        document.dispatchEvent(eventObj);

        // ... and do extra actions necessary if on llm tab
        if (this.hasLLMTable && !currentResidue) {
          const eventObj = new CustomEvent('llm-reset-list');
          document.dispatchEvent(eventObj);
        } else if (this.hasLLMTable && currentResidue) {
          const eventObj = new CustomEvent('llm-filter-list', {
            detail: {
              eventData: {
                residueNumber: clickData.residue_number,
              },
            },
            bubbles: true,
            cancelable: true,
          });
          document.dispatchEvent(eventObj);
        }
      }
    });
  }

  @HostListener('document:new-protvista-click', ['$event'])
  private async handleProtvistaTrackClick(event: CustomEvent) {
    if (!this.hasNewProtvista) return;
    const detail = event.detail;
    if (!detail) return;

    const selection = this.visInteractivity.currentSelectionData();
    const instance = this.visInteractivity.currentMolstarComponent?.getInstance() ?? null;
    if (!instance) return;

    // Build highlight query
    const highlightQuery: any = protToMolBuildHighlightQuery(detail);
    if (!highlightQuery) return;

    // Determine whether to show side-chain interaction
    const showInteraction = protToMolShouldShowInteraction(detail);

    // If not interaction, assign color
    if (!showInteraction) {
      highlightQuery.color = protToMolExtractColor(detail);
    } else {
      highlightQuery.sideChain = true;
    }

    // Always focus
    highlightQuery.focus = true;

    const dataToFocus = selection ? [...selection] : [];
    const selectionData = this.applyFocus(dataToFocus, false)!;

    selectionData.push(highlightQuery);

    await clearInteractivityFocusInMolstar(instance);
    await drawSelectionInMolstar(instance, selectionData);

    this.lastClickedResidue = undefined;
    const eventObj = new CustomEvent('to-seq-viewer-click', {
      detail: {
        eventData: {
          residueNumber: -1,
          entityId: 'ignore',
          chainId: 'ignore',
          unselect: true,
          doNotReport: true,
        },
      },
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(eventObj);
  }

  @HostListener('document:protvista-close-pin', ['$event'])
  private async handleProtvistaClosePin(event: CustomEvent) {
    if (!this.hasNewProtvista) return;
    const selection = this.visInteractivity.currentSelectionData();
    const instance = this.visInteractivity.currentMolstarComponent?.getInstance() ?? null;

    if (!instance) return;

    // if after opening pin, res has been selected in smart seq viewer, abort
    if (this.lastClickedResidue !== undefined) return;

    const dataToFocus = selection ? [...selection] : [];
    const selectionData = this.applyFocus(dataToFocus, true)!;

    await clearInteractivityFocusInMolstar(instance);
    await drawSelectionInMolstar(instance, selectionData);
  }
}
