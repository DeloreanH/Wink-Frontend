import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit?: number): string {
    const trail =  '...';
    const end = limit ? limit : 10;
    return value.length > end ? value.substring(0, end - 1) + trail : value;
   }
}
