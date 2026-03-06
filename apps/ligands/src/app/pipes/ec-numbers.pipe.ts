import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ligandECNumber',
  standalone: true,
})
export class LigandECNumberPipe implements PipeTransform {
  transform(value: string[]): string {
    if (value === null || value.length === 0) {
      return '---';
    }

    return value.join(', ');
  }
}
