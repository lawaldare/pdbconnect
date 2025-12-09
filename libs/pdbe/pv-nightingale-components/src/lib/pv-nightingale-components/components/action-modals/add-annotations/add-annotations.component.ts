/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { validateRanges } from '../nightingale.helpers';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-add-custom-modal',
  templateUrl: './add-annotations.component.html',
  styleUrl: './add-annotations.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PvAddCustomTracksModalComponent {
  trackName = '';
  residueRanges = '';

  trackNameError = '';
  residueRangesErrors: string[] = [];

  @Input() sequenceLength = 0;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() addAnnotations: EventEmitter<any> = new EventEmitter();

  // Called live when typing residue ranges
  onResidueRangesInput() {
    const { isValid, messages } = validateRanges({ start: 1, end: this.sequenceLength }, this.residueRanges);
    this.residueRangesErrors = isValid ? [] : messages;
  }

  addTrack() {
    this.trackNameError = '';
    this.residueRangesErrors = [];

    // Validate both fields
    if (!this.trackName.trim()) {
      this.trackNameError = 'Please enter track name';
    }

    const { isValid, messages } = validateRanges({ start: 1, end: this.sequenceLength }, this.residueRanges);
    if (!isValid) {
      this.residueRangesErrors = messages;
    }

    // If all valid, emit the event
    if (!this.trackNameError && this.residueRangesErrors.length === 0) {
      this.addAnnotations.emit({ trackName: this.trackName, residueRanges: this.residueRanges });
    }
  }

  onClose() {
    this.closeDialog.emit();
  }
}
