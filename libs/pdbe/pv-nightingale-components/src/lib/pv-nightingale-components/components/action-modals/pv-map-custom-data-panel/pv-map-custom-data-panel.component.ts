import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomTrackPayload, PanelResidueDatum } from '../../../models/pv-search-residue-data.model';
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
   * Input: Raw text value the user types for track + residue range mapping.
   */
  @Input() customRawTrackData = '';

  /**
   * Internal state: Current numbering scheme selected by the user.
   * This determines how residue identifiers are interpreted and validated.
   * Possible values:
   *  - 'residue': Sequential residue numbering (default)
   *  - 'author':  Author-provided numbering
   *  - 'uniprot': UniProt-based numbering (with optional accession prefix)
   */
  private _numberingScheme: 'residue' | 'author' | 'uniprot' = 'residue';

  get numberingScheme(): 'residue' | 'author' | 'uniprot' {
    return this._numberingScheme;
  }

  /**
   * Input binding for the numbering scheme.
   * When changed externally (by the parent component),
   * this setter updates the internal state and revalidates the current input.
   *
   * If 'uniprot' is selected:
   *  - Auto-selects the UniProt accession when there is exactly one available.
   *  - Resets the selection if multiple accessions exist and none match.
   *
   * Always triggers input validation after updating.
   */
  @Input() set numberingScheme(value: 'residue' | 'author' | 'uniprot') {
    this._numberingScheme = value;

    if (value === 'uniprot') {
      const accessions = this.uniprotAccessions();
      if (accessions.length === 1) {
        this.selectedUniProtAccession.set(accessions[0]);
      } else if (!accessions.includes(this.selectedUniProtAccession()!)) {
        this.selectedUniProtAccession.set(null);
      }
    }
    this.validateInput();
  }

  /**
   * Backing field for the currently selected UniProt accession.
   * This is used when the numbering scheme is 'uniprot' and multiple
   * accessions are available for mapping residue identifiers.
   */
  private _selectedUnpAcc: string | null = null;

  /**
   * Input binding for the selected UniProt accession.
   * Keeps the internal signal `selectedUniProtAccession` synchronized
   * with the parent component's state.
   *
   * This allows parent components to control which UniProt accession
   * is active (e.g. via [(selectedUnpAcc)] two-way binding).
   */
  @Input() set selectedUnpAcc(value: string | null) {
    this._selectedUnpAcc = value;
    this.selectedUniProtAccession.set(value);
  }

  get selectedUnpAcc(): string | null {
    return this._selectedUnpAcc;
  }

  /**
   * Emits parsed and validated custom track data (and related metadata)
   * whenever the user clicks "Map custom data in plot" or clears the input.
   *
   * The emitted payload includes:
   *  - rawText: the multiline user input
   *  - numberingScheme: current numbering mode ('residue' | 'author' | 'uniprot')
   *  - selectedUniProtAccession: active accession (if applicable)
   */
  @Output() customRawTrackDataChange = new EventEmitter<CustomTrackPayload>();

  /**
   * Output: Emit when the user closes the panel.
   */
  @Output() close = new EventEmitter<void>();

  /**
   * Computed signal: picks up unique list  of UniProt accessions
   */
  public readonly uniprotAccessions = computed(() => {
    const accessions = new Set<string>();
    for (const resDatum of this._residueData()) {
      const idx = resDatum.uniprotIdx;
      if (idx && idx.includes(':')) {
        accessions.add(idx.split(':')[0]);
      }
    }
    return Array.from(accessions);
  });

  // Signal: represents the selected UniProt accession for numbering parsing
  public selectedUniProtAccession = signal<string | null>(null);

  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';

  public resNumTooltip = 'Sequential numbering (e.g. "45" for 45th residue of sequence)';
  public uniprotNumTooltip = 'UniProt numbering (e.g. "45" for 45th residue of UniProt sequence)';

  /**
   * Computed signal: Whether any residue has UniProt info, to conditionally show the numbering option.
   */
  public readonly hasUniProtData = computed(() => this._residueData().some((resDatum) => !!resDatum.uniprotIdx));

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
      this.customRawTrackDataChange.emit({
        rawText: this.customRawTrackData,
        numberingScheme: this.numberingScheme,
        selectedUniProtAccession: this.selectedUniProtAccession(),
      });
    }
    this.closePanel();
  }

  /**
   * Clears all input from the text box and notifies the parent.
   */
  clearData() {
    this.customRawTrackData = '';
    this.customRawTrackDataChange.emit({
      rawText: this.customRawTrackData,
      numberingScheme: this.numberingScheme,
      selectedUniProtAccession: this.selectedUniProtAccession(),
    });
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
    if (this.numberingScheme === 'uniprot' && this.selectedUniProtAccession === null) {
      this.validationErrors.push(`Missing UniProt id selection`);
    }
  }

  /**
   * Helper: Based on the selected numbering scheme, return a set of valid residues for quick lookup.
   */
  private getResidueSetForScheme(): Set<string> {
    switch (this.numberingScheme) {
      case 'author':
        return new Set(this.residueData.map((resDatum) => resDatum.authorIdx!));
      case 'uniprot': {
        const selectedAcc = this.selectedUniProtAccession();
        const relevant = this.residueData.filter((resDatum) => resDatum.uniprotIdx && (!selectedAcc || resDatum.uniprotIdx.startsWith(selectedAcc + ':')));
        return new Set(relevant.map((resDatum) => resDatum.uniprotIdx!.split(':')[1]));
      }
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
