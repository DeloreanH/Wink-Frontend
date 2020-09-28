import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {

    if (isNaN(value)) {
      return value;
    }
    const distance = Math.round(parseFloat(value));
    if (distance >= 1000) {
      return Math.round((distance / 1000)) + ' Km';
    } else {
      return distance + ' m';
    }
  }

}
