import { Pipe, PipeTransform } from '@angular/core';

export interface Smile {
  name: string;
  program: string;
  version: string;
}

@Pipe({
  name: 'ligandSmiles',
  standalone: true,
})
export class LigandSmilesPipe implements PipeTransform {
  transform(value: Smile[], isMainLigand = true): string | null {
    if (isMainLigand) {
      for (const smile of value) {
        if (smile.program === 'OpenEye OEToolkits') {
          return smile.name;
        }
      }
      return null;
    } else {
      return value[0].name;
    }
  }
}
