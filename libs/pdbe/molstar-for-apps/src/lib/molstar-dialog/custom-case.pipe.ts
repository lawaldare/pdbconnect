import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCase',
  standalone: true,
})
export class CustomCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
