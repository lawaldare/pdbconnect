import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartSequenceVisualisation } from './viewer/sequence-visualisation';
import { generateRandomAlternativeNumberings, generateRandomAnnotations, generateRandomSequence } from './viewer/smart-generator';

@Component({
  selector: 'lib-smart-seq-viewer',
  imports: [CommonModule],
  templateUrl: './smart-seq-viewer.component.html',
  styleUrl: './smart-seq-viewer.component.scss',
})
export class SmartSeqViewerComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // const sequence = 'M'.repeat(1000);
    // const sequence = generateRandomSequence(5000);
    const sequence =
      'IVGGYNCEENSVPYQVSLNSGYHFCGGSLINEQWVVSAGHCYKSRIQVRLGEHNIEVLEGNEQFINAAKIIRHPQYDRKTLNNDIMLIKLSSRAVINARVSTISLPTAPPATGTKCLISGWGNTASSGADYPDELQCLDAPVLSQAKCEASYPGKITSNMFCVGFLEGGKDSCQGDSGGPVVCNGQLQGVVSWGDGCAQKNKPGVYTKVYNYVKWIKNTIAANS';
    const annotation1 = generateRandomAnnotations(1, sequence, 'Background');
    const annotation2 = generateRandomAnnotations(2, sequence, 'Underline');
    const annotation3 = generateRandomAnnotations(3, sequence, 'CircleAbove');
    const altSequences = generateRandomAlternativeNumberings(sequence, true, true);

    new SmartSequenceVisualisation(sequence, 'smart-seq-container', altSequences, [annotation1, annotation2, annotation3], '1', 'A', {
      grouping: true,
      groupingLineBreak: false,
      externalEvents: true,
      hoverTooltips: false,
    });
  }
}
