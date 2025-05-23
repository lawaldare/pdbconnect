import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelResidueDatum } from '../../../models/pv-search-residue-data.model';
import { MaterialModule } from '@pdbc/core';

@Component({
  selector: 'lib-map-custom-data-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './pv-map-custom-data-panel.component.html',
  styleUrls: ['./pv-map-custom-data-panel.component.scss'],
})
export class MapCustomDataPanelComponent {
  private _residueData = signal<PanelResidueDatum[]>([]);

  /**
   * Input: Residue data used to validate user input against valid residue IDs.
   */
  @Input() set residueData(value: PanelResidueDatum[]) {
    this._residueData.set(value);
  }
  get residueData(): PanelResidueDatum[] {
    return this._residueData();
  }

  /**
   * Input: Residue data used to validate user input against valid residue IDs.
   */
  @Input() panelPosition: { top: number; left: number } = { top: 0, left: 0 };

  /**
   * Input/Output: Raw text value the user types for track + residue range mapping.
   */
  @Input() customRawTrackData = '';
  @Output() customRawTrackDataChange = new EventEmitter<string>();

  /**
   * Output: Emit when the user closes the panel.
   */
  @Output() close = new EventEmitter<void>();

  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';

  public resNumTooltip = `Sequential numbering (e.g. "45" for 45th residue of sequence)`;
  public uniprotNumTooltip = `UniProt numbering with mandatory accession prefix (e.g. "P12345:45"). Please note this accession can differ for fusion proteins`;

  /**
   * Computed signal: Whether any residue has UniProt info, to conditionally show the numbering option.
   */
  public readonly hasUniProtData = computed(() => this._residueData().some((resDatum) => !!resDatum.uniprotIdx));

  /**
   * Internal: Current numbering scheme selected.
   */
  private _numberingScheme: 'residue' | 'author' | 'uniprot' = 'residue';

  get numberingScheme(): 'residue' | 'author' | 'uniprot' {
    return this._numberingScheme;
  }

  /**
   * When user changes numbering scheme, re-validate the current input.
   */
  set numberingScheme(value: 'residue' | 'author' | 'uniprot') {
    this._numberingScheme = value;
    this.validateInput();
  }

  /**
   * Stores the list of validation errors to show in the UI.
   */
  validationErrors: string[] = [];

  /**
   * Sample template string shown to the user.
   */
  sampleTemplate = `Track: Important residues\nResidues: `;

  /**
   * When user types in the textarea, update value and trigger validation.
   */
  onInputChange(event: any) {
    if (event) {
      this.customRawTrackData = event.target.value;
      this.validateInput();
    }
  }

  /**
   * Emit valid custom data to parent Angular component and close the panel.
   */
  sendToPlot() {
    this.validateInput();
    if (this.validationErrors.length === 0) {
      this.customRawTrackDataChange.emit(this.customRawTrackData);
    }
    this.closePanel();
  }

  /**
   * Clears all input from the text box and notifies the parent.
   */
  clearData() {
    this.customRawTrackData = '';
    this.customRawTrackDataChange.emit(this.customRawTrackData);
  }

  /**
   * Validates the format of the raw input and updates `validationErrors` accordingly.
   * Checks for correct `Track:` and `Residues:` lines, and validates residue values against current numbering scheme.
   */
  validateInput() {
    this.validationErrors = [];

    const lines = this.customRawTrackData.split('\n');
    let currentTrack = '';
    let residuesLine = '';
    const residueSet = this.getResidueSetForScheme();

    let correctTrackLines = 0;
    let correctResiduesLines = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('Track:')) {
        currentTrack = line.slice(6).trim();
        if (currentTrack.length < 1) {
          this.validationErrors.push(`Line ${i + 1}: Empty track name.`);
        } else {
          correctTrackLines += 1;
        }
      } else if (line.startsWith('Residues:')) {
        residuesLine = line.slice(9).trim();
        const residueValidationErrors: string[] = [];

        const ranges = residuesLine.split(',').map((r) => r.trim());
        for (const range of ranges) {
          const [startStr, endStr] = range.split('-').map((s) => s.trim());

          if (!residueSet.has(startStr)) {
            residueValidationErrors.push(`Line ${i + 1}: Start residue "${startStr}" not found.`);
          }
          if (!residueSet.has(endStr ?? startStr)) {
            residueValidationErrors.push(`Line ${i + 1}: End residue "${endStr ?? startStr}" not found.`);
          }
        }
        if (residueValidationErrors.length === 0) {
          correctResiduesLines += 1;
        }
        this.validationErrors.push(...residueValidationErrors);
      } else if (line.length === 0) {
        if (lines[i - 1] && lines[i - 1].startsWith('Residues:')) continue;
        this.validationErrors.push(`Line ${i + 1}: Invalid format.`);
        continue;
      } else {
        this.validationErrors.push(`Line ${i + 1}: Invalid format.`);
        continue;
      }
    }
    if (correctTrackLines === 0) {
      this.validationErrors.push(`No valid 'Track:' lines found.`);
    } else if (correctResiduesLines > correctTrackLines) {
      this.validationErrors.push(`There are tracks with missing valid 'Track:' lines.`);
    }
    if (correctResiduesLines === 0) {
      this.validationErrors.push(`No valid 'Residues:' lines found.`);
    } else if (correctTrackLines > correctResiduesLines) {
      this.validationErrors.push(`There are tracks with missing valid 'Residues:' lines.`);
    }
  }

  /**
   * Helper: Based on the selected numbering scheme, return a set of valid residues for quick lookup.
   */
  private getResidueSetForScheme(): Set<string> {
    switch (this.numberingScheme) {
      case 'author':
        return new Set(this.residueData.map((resDatum) => resDatum.authorIdx!));
      case 'uniprot':
        return new Set(this.residueData.map((resDatum) => resDatum.uniprotIdx!));
      case 'residue':
      default:
        return new Set(this.residueData.map((resDatum) => resDatum.resId));
    }
  }

  /**
   * Emits `close` event to the parent Angular component to hide the panel.
   */
  closePanel() {
    this.close.emit();
  }
}
