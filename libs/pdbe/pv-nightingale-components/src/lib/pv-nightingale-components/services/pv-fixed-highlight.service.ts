import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: null })
export class PvFixedHighlightService {
  public currentHighlight = '';
  public searchSelections: string[] = [];
  public fixedTooltipSelection = signal<string>('');
  public selectionHighlight = signal<string>('');
  public parentComponent: HTMLElement | null = null;

  /**
   * Function should be called when a Track is clicked for setting current fixedTooltipSelection
   * @param selection: string in Nightingale highlight format (e.g 1:30,50:100)
   * for residues 1 to 30 and 50 to 100
   */
  setFixedTooltipSelection(selection: string) {
    this.fixedTooltipSelection.set(selection);
  }
  /**
   * Function should be called for externally creating/updating fixed highlight selections
   * on Nightingale in searchSelections variable
   * @param selections: array of strings in Nightingale highlight format (e.g ["1:30","50:100"])
   * for residues 1 to 30 and 50 to 100
   */
  setSearchSelections(selections: string[]) {
    this.searchSelections = selections;
  }

  /**
   * Function should be called when Nightingale manager Lit component is initialized. It sets the parent
   * component so fixedHighlight can be manually set for all Nightingale tracks
   * @param parent HTMLElement of Angular component containing Nightingale manager Lit component
   */
  setParentComponent(parent: HTMLElement) {
    this.parentComponent = parent;
  }

  /**
   * Function should be called when there is a need to merge
   * 1. tooltip clicked fixed highlight selections (this.fixedTooltipSelection)
   * 2. externally created/updated fixed highlight selections (this.searchSelections)
   */
  createSelectionHighlight() {
    let allSelections = [...this.searchSelections, this.fixedTooltipSelection()];
    if (this.fixedTooltipSelection()) {
      allSelections.push(this.fixedTooltipSelection());
    }
    allSelections = [...new Set(allSelections)];

    let toHighlight = allSelections.join(',');
    if (toHighlight[toHighlight.length - 1] === ',') {
      toHighlight = toHighlight.slice(0, -1);
    }
    this.selectionHighlight.set(toHighlight);
  }

  /**
   * If parent component exists, this function manually triggers fixed highlight for all Nightingale
   * components compatible with fixedHighlight attribute that also contain with-fixed-highlight class
   */
  triggerDynamicFixedHighlight() {
    if (!this.parentComponent) return;
    const highlight = this.selectionHighlight().length > 0 ? this.selectionHighlight() : null;
    const dynamicTracks = this.parentComponent.getElementsByClassName('with-fixed-highlight');
    for (let s = 0; s < dynamicTracks.length; s++) {
      const dynamicTrack = dynamicTracks[s];
      (dynamicTrack as any).fixedHighlight = highlight;
    }
  }
}
