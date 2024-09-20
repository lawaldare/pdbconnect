import { Directive, ElementRef, Renderer2, Input, OnChanges } from '@angular/core';
import { Participant } from '../models/complex-structure.model';

@Directive({
  selector: '[pdbcParticipant]',
  standalone: true,
})
export class ParticipantDirective implements OnChanges {
  @Input() participants!: Participant[];
  @Input() isItForSummary = true;

  private anchors: any[] = [];
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.init();
  }

  private init(): void {
    this.resetEnv();
    for (const participant of this.participants) {
      if (!participant.accession.includes('_')) {
        const anchorTag = this.renderer.createElement('a');
        anchorTag.textContent = `${participant.accession} (${participant.stoichiometry})`;
        const proteinLink = `https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/${participant.accession}`;
        const rfLink = `https://rfam.org/family/${participant.accession}`;
        const link = participant.accession.startsWith('RF') ? rfLink : proteinLink;
        this.renderer.setAttribute(anchorTag, 'href', link);
        this.renderer.setAttribute(anchorTag, 'target', '_blank');
        this.renderer.appendChild(this.el.nativeElement, anchorTag);
        this.anchors.push(anchorTag);
      }

      if (participant.accession.includes('_')) {
        const spanTag = this.renderer.createElement('span');
        spanTag.textContent = `${participant.accession} (${participant.stoichiometry})`;
        this.renderer.appendChild(this.el.nativeElement, spanTag);
        this.anchors.push(spanTag);
      }
    }
  }

  resetEnv(): void {
    for (const anchor of this.anchors) {
      this.renderer.removeChild(this.el.nativeElement, anchor);
    }
  }
}
