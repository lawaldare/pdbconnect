import { AfterViewInit, Component, input, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlternativeNumbering, SmartSequenceAnnotation, SmartSequenceVisOptions, SmartSequenceVisualisation } from './viewer/sequence-visualisation';
import { generateRandomAlternativeNumberings, generateRandomAnnotations } from './viewer/smart-generator';

@Component({
  selector: 'lib-smart-seq-viewer',
  imports: [CommonModule],
  templateUrl: './smart-seq-viewer.component.html',
  styleUrl: './smart-seq-viewer.component.scss',
})
export class SmartSeqViewerComponent implements AfterViewInit, OnDestroy {
  // External inputs (read-only)
  public readonly containerId = input<string>('smart-seq-id');
  public readonly sequence = input<string>('TESTSTRING');
  public readonly altSequences = input<AlternativeNumbering[]>([]);
  public readonly entityId = input<string | undefined>(undefined);
  public readonly chainId = input<string | undefined>(undefined);
  public readonly backgroundDataInput = input<SmartSequenceAnnotation | undefined>(undefined);
  public readonly underlineDataInput = input<SmartSequenceAnnotation | undefined>(undefined);
  public readonly circleAboveDataInput = input<SmartSequenceAnnotation | undefined>(undefined);
  public readonly options = input<SmartSequenceVisOptions | undefined>({
    grouping: true,
    groupingLineBreak: false,
    externalEvents: true,
    hoverTooltips: false,
  });
  public readonly isNucleic = input<boolean>(false);

  // Internally mutable copies
  private backgroundData = signal<SmartSequenceAnnotation | undefined>(undefined);
  private underlineData = signal<SmartSequenceAnnotation | undefined>(undefined);
  private circleAboveData = signal<SmartSequenceAnnotation | undefined>(undefined);

  // Instance reference to cleanup
  private visInstance?: SmartSequenceVisualisation;

  // private generateRandomAnnotations() {
  //   this.backgroundData.set(generateRandomAnnotations(1, this.sequence(), 'Background'));
  //   this.underlineData.set(generateRandomAnnotations(2, this.sequence(), 'Underline'));
  //   this.circleAboveData.set(generateRandomAnnotations(3, this.sequence(), 'CircleAbove'));
  //   const altSequences = generateRandomAlternativeNumberings(this.sequence(), true, true);
  // }

  ngAfterViewInit(): void {
    this.initVisualisation();
  }

  private initVisualisation() {
    // const sequence = 'M'.repeat(1000);
    // const sequence = generateRandomSequence(5000);
    // const sequence = 'IVGGYNCEENSVPYQVSLNSGYHFCGGSLINEQWVVSAGHCYKSRIQVRLGEHNIEVLEGNEQFINAAKIIRHPQYDRKTLNNDIMLIKLSSRAVINARVSTISLPTAPPATGTKCLISGWGNTASSGADYPDELQCLDAPVLSQAKCEASYPGKITSNMFCVGFLEGGKDSCQGDSGGPVVCNGQLQGVVSWGDGCAQKNKPGVYTKVYNYVKWIKNTIAANS';

    // Initialize internal signals from input
    this.backgroundData.set(this.backgroundDataInput());
    this.underlineData.set(this.underlineDataInput());
    this.circleAboveData.set(this.circleAboveDataInput());

    const annotations = [this.backgroundData(), this.underlineData(), this.circleAboveData()].filter((annotation) => annotation !== undefined);

    const options = this.options();
    if (options && this.isNucleic()) {
      options.isNucleic = true;
    }
    if (this.visInstance) {
      this.visInstance.destroy();
      this.visInstance = undefined;
    }

    this.visInstance = new SmartSequenceVisualisation(
      this.sequence(),
      this.containerId(),
      this.altSequences(),
      annotations,
      this.entityId(),
      this.chainId(),
      options
    );
  }

  ngOnDestroy(): void {
    this.visInstance?.destroy();
    this.visInstance = undefined;
  }
}
