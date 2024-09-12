import { Pipe, PipeTransform } from '@angular/core';

export interface Participant {
  accession: string;
  stoichiometry: number;
}

@Pipe({
  name: 'participant',
  standalone: true,
})
export class ComplexParticipantsPipe implements PipeTransform {
  transform(value: Participant[]): string {
    const result = [];
    for (const participant of value) {
      result.push(`${participant.accession}(${participant.stoichiometry})`);
    }
    return result.join(', ');
  }
}
