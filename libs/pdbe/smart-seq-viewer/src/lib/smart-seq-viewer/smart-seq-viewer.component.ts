import { AfterViewInit, Component, effect, ElementRef, input, OnDestroy, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateRandomAlternativeNumberings, generateRandomAnnotations } from './viewer/smart-generator';
import { AlternativeNumbering, SmartSequenceAnnotation, SmartSequenceVisOptions } from './viewer/seq-viewer-models';
import { SmartSequenceVisualisation } from './viewer/sequence-visualisation';
import { validateAlternativeNumberings, validateAnnotations, validateNonObserved } from './viewer/seq-viewer-validation';

@Component({
  selector: 'lib-smart-seq-viewer',
  imports: [CommonModule],
  templateUrl: './smart-seq-viewer.component.html',
  styleUrl: './smart-seq-viewer.component.scss',
})
export class SmartSeqViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('containerElement', { read: ElementRef }) public containerElement!: ElementRef;

  // External inputs (read-only)
  public readonly containerId = input<string>('smart-seq-id');
  public readonly sequence = input<string>('TESTSTRING');
  public readonly altSequences = input<AlternativeNumbering[]>([]);
  public readonly nonObserved = input<number[]>([]);
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
    useAuthNumbers: true,
    helpLogoSrc: '/assets/images/help_outline_24px.svg',
  });
  public readonly isNucleic = input<boolean>(false);

  // Internally mutable copies
  private backgroundData = signal<SmartSequenceAnnotation | undefined>(undefined);
  private underlineData = signal<SmartSequenceAnnotation | undefined>(undefined);
  private circleAboveData = signal<SmartSequenceAnnotation | undefined>(undefined);
  private altSequencesData = signal<AlternativeNumbering[]>([]);
  private nonObservedData = signal<number[]>([]);

  // Instance reference to cleanup
  private visInstance?: SmartSequenceVisualisation;
  private resizeTimeoutId?: any;

  // private generateRandomAnnotations() {
  //   this.backgroundData.set(generateRandomAnnotations(1, this.sequence(), 'Background'));
  //   this.underlineData.set(generateRandomAnnotations(2, this.sequence(), 'Underline'));
  //   this.circleAboveData.set(generateRandomAnnotations(3, this.sequence(), 'CircleAbove'));
  //   const altSequences = generateRandomAlternativeNumberings(this.sequence(), true, true);
  // }
  constructor() {
    effect(() => {
      // Re-run whenever ANY input used here changes
      this.initVisualisation();
    });
  }

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

    const validAlt = validateAlternativeNumberings(this.sequence(), this.altSequences(), true).valid;
    const validNonObs = validateNonObserved(this.sequence(), this.nonObserved(), true).valid;

    if (validAlt) this.altSequencesData.set(this.altSequences());
    else this.altSequencesData.set([]);

    if (validNonObs) this.nonObservedData.set(this.nonObserved());
    else this.nonObservedData.set([]);

    const annotations = [this.backgroundData(), this.underlineData(), this.circleAboveData()].filter((annotation) => annotation !== undefined);

    const options = this.options();
    if (options && this.isNucleic()) {
      options.isNucleic = true;
    }
    if (this.visInstance) {
      if (this.resizeTimeoutId) clearTimeout(this.resizeTimeoutId);
      this.visInstance.destroy();
      this.visInstance = undefined;
    }

    this.visInstance = new SmartSequenceVisualisation(
      this.sequence(),
      this.containerId(),
      this.altSequencesData(),
      this.nonObservedData(),
      annotations,
      this.entityId(),
      this.chainId(),
      options
    );
    this.waitForCanvasAndResize();
  }

  private waitForCanvasAndResize(): void {
    if (!this.containerElement) return;
    const element = this.containerElement.nativeElement;
    if (!element) return;
    const canvasElement = element.querySelector('canvas');
    if (canvasElement) {
      this.visInstance?.onContainerResize(); // Call resize when canvas is available
      if (this.resizeTimeoutId) clearTimeout(this.resizeTimeoutId);
    } else if (this.visInstance) {
      // If canvas is not found, retry after a big delay (e.g., 1s)
      this.resizeTimeoutId = setTimeout(() => this.waitForCanvasAndResize(), 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeTimeoutId) clearTimeout(this.resizeTimeoutId);
    this.visInstance?.destroy();
    this.visInstance = undefined;
  }
}
