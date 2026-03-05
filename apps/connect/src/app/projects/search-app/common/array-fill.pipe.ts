import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayFill',
})
export class ArrayFillPipe implements PipeTransform {
  transform(value: any): any[] {
    return new Array(value).fill(1);
  }
}
