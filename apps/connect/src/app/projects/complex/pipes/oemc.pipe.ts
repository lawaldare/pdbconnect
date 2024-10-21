import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'oemc',
  standalone: true,
})
export class OEMCPipe implements PipeTransform {
  transform(value: Record<string, number>): string {
    const result = Object.entries(value).reduce((acc: string[], [method, count]: [string, number]) => {
      const element = `${method} (${count})`;
      acc.push(element);
      return acc;
    }, []);

    return result.join(', ');
  }
}
