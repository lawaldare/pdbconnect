import { Directive, HostListener, Inject, InjectionToken, Input } from '@angular/core';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { clearInteractivityFocusInMolstar, drawSelectionInMolstar, showInteractivityFocusInMolstar } from '../helpers/molstar-helpers';
import { timer } from 'rxjs';
import { protToMolBuildHighlightQuery, protToMolExtractColor, protToMolShouldShowInteraction } from '../helpers/protvista-interactivity';
import { DomainsTabComponent } from '../components/domains-tab/domains-tab.component';
import { MacromoleculesTabComponent } from '../components/macromolecules-tab/macromolecules-tab.component';
import { LLMTabComponent } from '../components/llm-tab/llm-tab.component';

export const PARENT_COMPONENT_TOKEN = new InjectionToken<DomainsTabComponent | MacromoleculesTabComponent | LLMTabComponent>('ParentComponent');

@Directive({
  selector: '[pdbcVisualisationInteractivity]',
  standalone: true,
})
export class VisualisationInteractivityDirective {
  @Input({ required: true }) hasSeqViewer = false;
  @Input({ required: true }) hasNewProtvista = false;
  @Input({ required: true }) hasLLMTable = false;
  // TODO @Input({required: true}) hasTopologyViewer: boolean = false;

  private parent: DomainsTabComponent | MacromoleculesTabComponent | LLMTabComponent;

  private lastClickedResidue?: {
    entity_id: string;
    auth_asym_id: string;
    residue_number: number;
  } = undefined;

  constructor(@Inject(PARENT_COMPONENT_TOKEN) parent: DomainsTabComponent | MacromoleculesTabComponent | LLMTabComponent) {
    this.parent = parent;
  }

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
      (this.parent as LLMTabComponent).filterAnnotationList(residueNumber);
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
      (this.parent as LLMTabComponent).resetAnnotationList();
    }

    const instance = this.parent._molstarComponent?.getInstance() ?? null;
    if (!instance) return;

    // if already deselected, do nothing
    if (this.lastClickedResidue === undefined) return;
    this.lastClickedResidue = undefined;

    await clearInteractivityFocusInMolstar(instance);
    if (!this.parent.selectionData) return;

    const selectionData = this.applyFocus([...this.parent.selectionData], true);
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
    console.log('handleTableResidueSelection');

    if (!this.hasLLMTable) return;

    const eventData = (event as any).detail.eventData;
    const entityId = this.parent.currentSelectionEntityId();
    const chainId = this.parent.currentSelectionChainId();
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
    (this.parent as LLMTabComponent).filterAnnotationList(clickData.residue_number);
  }

  // TODO: update timer, interactivity and clearFocus on all relevant tabs
  private async handleSelectionOnMolstarResClick(
    clickData: { entity_id: string; auth_asym_id: string; residue_number: number },
    doNotPropagate?: boolean,
    doNotCheckOrUpdState?: boolean
  ) {
    const instance = this.parent._molstarComponent?.getInstance() ?? null;
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
      const dataToFocus = this.parent.selectionData ? [...this.parent.selectionData] : [];
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
        !this.parent.currentSelectionEntityId() ||
        !this.parent.currentSelectionChainId() ||
        clickData.entity_id !== this.parent.currentSelectionEntityId() ||
        clickData.auth_asym_id !== this.parent.currentSelectionChainId()
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
          (this.parent as LLMTabComponent).resetAnnotationList();
        } else if (this.hasLLMTable && currentResidue) {
          (this.parent as LLMTabComponent).filterAnnotationList(clickData.residue_number);
        }
      }
    });
  }

  @HostListener('document:new-protvista-click', ['$event'])
  private async handleProtvistaTrackClick(event: CustomEvent) {
    if (!this.hasNewProtvista) return;

    const detail = event.detail;
    if (!detail) return;

    const instance = this.parent._molstarComponent?.getInstance() ?? null;
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

    const dataToFocus = this.parent.selectionData ? [...this.parent.selectionData] : [];
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

    const instance = this.parent._molstarComponent?.getInstance() ?? null;
    if (!instance) return;

    // if after opening pin, res has been selected in smart seq viewer, abort
    if (this.lastClickedResidue !== undefined) return;

    const dataToFocus = this.parent.selectionData ? [...this.parent.selectionData] : [];
    const selectionData = this.applyFocus(dataToFocus, true)!;

    await clearInteractivityFocusInMolstar(instance);
    await drawSelectionInMolstar(instance, selectionData);
  }
}
