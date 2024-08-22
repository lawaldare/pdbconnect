import { Pipe, PipeTransform } from '@angular/core';
import { Chain } from './data-models/structure.model';

@Pipe({
  name: 'ligandInteractingChainsNumber',
  standalone: true,
})
export class LigandInteractingChainsNumberPipe implements PipeTransform {
  transform(value: Chain[]): number {
    if (value === null || value.length === 0) {
      return 0;
    }

    const mappedValue = value.map((val) => val.pdb_id);

    return [...new Set(mappedValue)].length;
  }
}
