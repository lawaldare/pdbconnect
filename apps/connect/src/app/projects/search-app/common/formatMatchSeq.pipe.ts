import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMatchSeq',
})
export class FormatSpacingPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/ /g, '&nbsp;');
  }
}
