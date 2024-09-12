import { Pipe, PipeTransform } from '@angular/core';

export interface Symmetry {
  symbol: string;
  type: number;
}

@Pipe({
  name: 'symmetry',
  standalone: true,
})
export class ComplexSymmetryPipe implements PipeTransform {
  transform(value: Symmetry): string {
    return `${value.type}(${value.symbol}).`;
  }
}
