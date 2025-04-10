import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { PanelResidueDatum } from '../../../models/pv-search-residue-data.model';

@Component({
  selector: 'lib-search-residue-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatButtonModule],
  templateUrl: './pv-search-residue-panel.component.html',
  styleUrls: ['./pv-search-residue-panel.component.scss'],
})
export class SearchResiduePanelComponent {
  /** Input: Full residue metadata to populate search options */
  @Input() residueData: PanelResidueDatum[] = [];

  /** Input: Full residue metadata to populate search options */
  @Input() selectedResidues: string[] = [];

  /** Input: Panel position on screen (absolute pixel values) */
  @Input() panelPosition: { top: number; left: number } = { top: 0, left: 0 };

  /** Output: Emit updated list of selected residue ranges */
  @Output() selectedResiduesChange = new EventEmitter<string[]>();

  /** Output: Emit when user closes the panel */
  @Output() close = new EventEmitter<void>();

  // Input and selection state
  startInput = '';
  endInput = '';
  startIdx: number | null = null;
  endIdx: number | null = null;

  // Autocomplete options
  filteredStartOptions: { index: number; label: string }[] = [];
  filteredEndOptions: { index: number; label: string }[] = [];

  /**
   * Formats the label shown in autocomplete options.
   */
  private getLabel(residueDatum: PanelResidueDatum) {
    const authLabel = residueDatum.authorIdx ? ` ${residueDatum.authorIdx} (Auth)` : '';
    const uniprotLabel = residueDatum.uniprotIdx ? ` | Uniprot: ${residueDatum.uniprotIdx}` : '';
    // return  `${residueDatum.resName}${authLabel} | Index: ${residueDatum.resId}${uniprotLabel}`
    return `${residueDatum.resName}${residueDatum.resId}${uniprotLabel}`;
  }

  /**
   * Returns a full list of residues formatted for autocomplete.
   */
  private getAllOptions(): { index: number; label: string }[] {
    return this.residueData.map((resId, i) => ({
      index: i,
      label: this.getLabel(this.residueData[i]),
    }));
  }

  /**
   * Filters start residue options based on input.
   */
  filterStartOptions() {
    const term = this.startInput.toLowerCase();
    const allOptions = this.getAllOptions();

    this.filteredStartOptions = term ? allOptions.filter((opt) => opt.label.toLowerCase().includes(term)) : allOptions.slice(0, 15); // limit results if input is empty
  }

  /**
   * Filters end residue options based on input and selected start.
   */
  filterEndOptions() {
    const term = this.endInput.toLowerCase();
    this.filteredEndOptions = this.getAllOptions()
      .filter((opt) => opt.index >= (this.startIdx ?? 0))
      .filter((opt) => opt.label.toLowerCase().includes(term));
  }

  /**
   * Called when a start residue is selected from the dropdown.
   */
  selectStart(option: { index: number; label: string }) {
    this.startIdx = option.index;
    this.startInput = option.label;
    this.filteredStartOptions = [];
    this.filterEndOptions(); // update end options after start is chosen
  }

  /**
   * Called when an end residue is selected from the dropdown.
   */
  selectEnd(option: { index: number; label: string }) {
    this.endIdx = option.index;
    this.endInput = option.label;
    this.filteredEndOptions = [];
  }

  /**
   * On focus, show or prefilter start options.
   */
  onStartInputFocus() {
    // Show all options or pre-filtered ones based on current input
    this.filterStartOptions();
  }

  /**
   * Hide dropdown options on blur with a delay to allow click selection.
   */
  onStartInputBlur() {
    // Add a short delay to allow clicks on the suggestion list
    setTimeout(() => {
      this.filteredStartOptions = [];
    }, 150);
  }

  /**
   * Reset state and filter options when start input changes.
   */
  onStartInputChange() {
    this.endIdx = null;
    this.endInput = '';
    this.filteredEndOptions = [];
    this.filterStartOptions();
  }

  /**
   * Filter end options when end input changes.
   */
  onEndInputChange() {
    this.filterEndOptions();
  }

  /**
   * Generate display string for a selected residue range.
   */
  formatResidueRange(startIdx: number, endIdx: number): string {
    const startName = this.residueData[startIdx].resName;
    const startAuth = this.residueData[startIdx].authorIdx;
    const startResId = this.residueData[startIdx].resId;
    const startUniprot = this.residueData[startIdx].uniprotIdx;

    const endName = this.residueData[endIdx].resName;
    const endAuth = this.residueData[endIdx].authorIdx;
    const endResId = this.residueData[endIdx].resId;
    const endUniprot = this.residueData[endIdx].uniprotIdx;

    let residueLabel =
      `${startName} ${startAuth} (Auth)` +
      (startIdx !== endIdx ? ` - ${endName} ${endAuth} (Auth)` : '') +
      ' | ' +
      `Index: ${startResId}` +
      (startIdx !== endIdx ? ` - ${endResId}` : '');
    if (!startAuth || !endAuth) {
      residueLabel = `Index: ${startResId}` + (startIdx !== endIdx ? ` - ${endResId}` : '');
    }

    let uniprotResidueLabel = ` | Uniprot: ${startUniprot}` + (startIdx !== endIdx ? ` - ${endUniprot}` : '');
    if (!startUniprot || !endUniprot) {
      uniprotResidueLabel = '';
    }

    return residueLabel + uniprotResidueLabel;
  }

  /**
   * Add current start-end residue selection to the list.
   */
  addSelectedRange() {
    if (this.startIdx !== null) {
      const end = this.endIdx ?? this.startIdx;
      const label = this.formatResidueRange(this.startIdx, end);
      if (!this.selectedResidues.includes(label)) {
        this.selectedResidues = [...this.selectedResidues, label];
        this.selectedResiduesChange.emit(this.selectedResidues);
      }

      this.startIdx = null;
      this.endIdx = null;
      this.startInput = '';
      this.endInput = '';
      this.filteredStartOptions = [];
      this.filteredEndOptions = [];
    }
  }

  /**
   * Remove a previously selected residue range.
   */
  removeSelected(label: string) {
    this.selectedResidues = this.selectedResidues.filter((res) => res !== label);
    this.selectedResiduesChange.emit(this.selectedResidues);
  }

  /**
   * Emit close event to parent component.
   */
  closePanel() {
    this.close.emit();
  }
}
