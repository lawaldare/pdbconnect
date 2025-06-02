import { Pipe, PipeTransform } from '@angular/core';
import { Symmetry } from '../models/complex-structure.model';

@Pipe({
  name: 'symmetry',
  standalone: true,
})
export class ComplexSymmetryPipe implements PipeTransform {
  transform(value: Symmetry | undefined): string {
    if (value === undefined) {
      return '---';
    }

    return `${value.type} (${value.symbol})`;
  }
}
