/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { validateResidue } from '../nightingale.helpers';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-zoom-residues-modal',
  templateUrl: './zoom-annotations.component.html',
  styleUrl: './zoom-annotations.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PvZoomResiduesModalComponent {
  start = '';
  end = '';

  startErrors: string[] = [];
  endErrors: string[] = [];

  @Input() sequenceLength = 0;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() zoomAnnotations: EventEmitter<any> = new EventEmitter();

  // Called live when typing residue ranges
  onResidueInput(inputType: 'start' | 'end') {
    if (inputType === 'start') {
      const { isValidStart, messagesStart } = this.validateStart();
      this.startErrors = isValidStart ? [] : messagesStart;
    }
    if (inputType === 'end') {
      const { isValidEnd, messagesEnd } = this.validateEnd();
      if (this.end.length > 0) this.endErrors = isValidEnd ? [] : messagesEnd;
      else this.endErrors = [];
    }
  }

  validateStart() {
    const { isValid, messages } = validateResidue({ start: 1, end: this.sequenceLength }, this.start);
    return { isValidStart: isValid, messagesStart: messages };
  }

  validateEnd() {
    const { isValid, messages } = validateResidue({ start: 1, end: this.sequenceLength }, this.end);
    return { isValidEnd: isValid, messagesEnd: messages };
  }

  onClose() {
    this.closeDialog.emit();
  }

  onZoom(type: 'highlight' | 'zoom') {
    const { isValidStart, messagesStart } = this.validateStart();
    let isValidEnd = true;
    let messagesEnd: string[] = [];

    // Only validate "end" if it was actually filled
    if (this.end.trim() !== '') {
      const result = this.validateEnd();
      isValidEnd = result.isValidEnd;
      messagesEnd = result.messagesEnd;
    }
    this.startErrors = isValidStart ? [] : messagesStart;
    this.endErrors = isValidEnd ? [] : messagesEnd;
    if (isValidStart && isValidEnd) {
      const startVal = Number(this.start);
      const endVal = this.end.trim() === '' ? startVal : Number(this.end);
      this.zoomAnnotations.emit({ type: type, start: startVal, end: endVal });
    }
  }
}
