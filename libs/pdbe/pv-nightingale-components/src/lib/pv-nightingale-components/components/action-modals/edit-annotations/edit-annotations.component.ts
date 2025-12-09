/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { validateRanges } from '../nightingale.helpers';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-edit-custom-modal',
  templateUrl: './edit-annotations.component.html',
  styleUrl: './edit-annotations.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PvEditCustomTracksModalComponent implements OnInit {
  trackIds: string[] = [];
  trackNames: string[] = [];
  trackNameErrors: Array<string | undefined> = [];
  residueRanges: string[] = [];
  residueRangesErrors: string[][] = []; // array of arrays of error messages per input

  @Input() sequenceLength = 0;
  @Input() customTracks: any[] = [];

  @Output() closeDialog = new EventEmitter<void>();
  @Output() editAnnotations: EventEmitter<any> = new EventEmitter();
  @Output() deleteAnnotations: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    // initialize arrays based on input tracks
    this.trackIds = this.customTracks.map((t) => t.id || '');
    this.trackNames = this.customTracks.map((t) => t.name || '');
    this.residueRanges = this.customTracks.map((t) => t.rawData.residueRanges || '');
    this.trackNameErrors = this.customTracks.map(() => undefined);
    this.residueRangesErrors = this.customTracks.map(() => []);
  }

  // Called live when typing residue ranges
  onResidueRangesInput(index: number) {
    const value = this.residueRanges[index];
    const { isValid, messages } = validateRanges({ start: 1, end: this.sequenceLength }, value);
    this.residueRangesErrors[index] = isValid ? [] : messages;
  }

  // Called live when typing track names
  onTrackNameInput(index: number) {
    const value = this.trackNames[index];
    if (!value.trim()) {
      this.trackNameErrors[index] = 'Please enter track name';
    } else {
      this.trackNameErrors[index] = undefined;
    }
  }

  onClose() {
    this.closeDialog.emit();
  }
  editTrack() {
    // validate tracks before editing
    const anyTrackNameErrors = this.trackNameErrors.some((name) => name !== undefined);
    const anyResidueRangeErrors = this.residueRangesErrors.flat().length > 0;
    if (anyTrackNameErrors || anyResidueRangeErrors) return;

    // edit tracks
    for (let trackIdx = 0; trackIdx < this.trackNames.length; trackIdx++) {
      const trackId = this.trackIds[trackIdx];
      const newName = this.trackNames[trackIdx];
      const newResidues = this.residueRanges[trackIdx];
      const track = this.customTracks.find((t: any) => t.id === trackId);
      if (track) {
        const segments: string[] = newResidues.split(',');
        const fragments = segments.map((segmentString: string) => {
          let start = segmentString.trim();
          let end = segmentString.trim();
          if (segmentString.includes('-')) {
            start = start.split('-')[0];
            end = end.split('-')[1];
          }
          const tooltipContent = `
            Track name: <b>${newName}</b><br>
            Residues: <b>${segmentString}</b>
          `;
          return {
            start: parseInt(start),
            end: parseInt(end),
            tooltipContent,
          };
        });
        track.name = newName;
        track.rawData.residueRanges = newResidues;
        if (track.data?.[0]) {
          track.data[0].label = newName;
        }
        track.data[0].locations = [
          {
            fragments,
          },
        ];
      }
    }
    this.editAnnotations.emit({ customTracks: this.customTracks });
  }

  deleteTrack(id: string) {
    const index = this.customTracks.findIndex((t) => t.id === id);
    if (index === -1) return;

    // Remove the track from all synced arrays by index
    this.customTracks.splice(index, 1);
    this.trackIds.splice(index, 1);
    this.trackNames.splice(index, 1);
    this.residueRanges.splice(index, 1);
    this.residueRangesErrors.splice(index, 1);
    this.trackNameErrors.splice(index, 1);
  }
}
