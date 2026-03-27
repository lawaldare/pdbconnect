import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectKeys',
})
export class ObjectKeysPipe implements PipeTransform {
  transform(value: any): any {
    const keys = [];
    for (const key in value) {
      keys.push({ key: key, value: value[key] });
    }
    return keys;
  }
}
