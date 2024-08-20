import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moleculeType',
  standalone: true,
})
export class MoleculeTypePipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'polypeptide(L)' || value === 'polypeptide(R)') {
      return 'amino acids';
    } else {
      return 'nucleotides';
    }
  }
}
