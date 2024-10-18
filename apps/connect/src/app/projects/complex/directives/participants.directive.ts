import { Directive, ElementRef, Renderer2, Input, OnChanges } from '@angular/core';
import { Participant } from '../models/complex-structure.model';

@Directive({
  selector: '[pdbcParticipant]',
  standalone: true,
})
export class ParticipantDirective implements OnChanges {
  @Input() participants!: Participant[];

  private orderedList: any;
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.init();
  }

  private init(): void {
    this.resetEnv();
    const orderedList = this.renderer.createElement('ul');
    this.renderer.appendChild(this.el.nativeElement, orderedList);
    for (const participant of this.participants) {
      if (participant.accession_type === 'UniProt') {
        const anchorTag = this.renderer.createElement('a');
        anchorTag.textContent = `${participant.accession}`;
        const proteinLink = `https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/${participant.accession}`;
        const rfLink = `https://rfam.org/family/${participant.accession}`;
        const link = participant.accession.startsWith('RF') ? rfLink : proteinLink;
        this.renderer.setAttribute(anchorTag, 'href', link);
        this.renderer.setAttribute(anchorTag, 'target', '_blank');

        const text = ` (${participant.name}, ${participant.stoichiometry} ${participant.stoichiometry > 1 ? 'copies' : 'copy'})`;
        const textTag = this.renderer.createText(text);

        const list = this.renderer.createElement('li');
        this.renderer.appendChild(orderedList, list);

        this.renderer.appendChild(list, anchorTag);
        this.renderer.appendChild(list, textTag);
      } else {
        const spanTag = this.renderer.createElement('span');
        spanTag.textContent = `${participant.accession} (${participant.name}, ${participant.stoichiometry} ${participant.stoichiometry > 1 ? 'copies' : 'copy'}) `;
        const list = this.renderer.createElement('li');
        this.renderer.appendChild(list, spanTag);
        this.renderer.appendChild(orderedList, list);
      }
    }
    this.orderedList = orderedList;
  }

  resetEnv(): void {
    if (this.orderedList) {
      this.renderer.removeChild(this.el.nativeElement, this.orderedList);
    }
  }
}
