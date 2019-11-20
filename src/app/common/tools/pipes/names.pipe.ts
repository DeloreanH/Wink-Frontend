import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'names'
})
export class NamesPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    if (value && value.length > 0) {
      if (value.length <= 10) {
        return value;
      } else {
        const values = value.split(' ');
        if (values.length > 1) {
          let ready = false;
          let resp = '';
          let text;
          for (text of values) {
            resp = resp + (resp.length === 0  ? '' : ' ' ) + text ;
            if (resp.length >= 10) {
              ready = true;
              break;
            }
          }
          if (ready) {
            if (resp.length === 10) {
              return resp;
            } else {
              return resp.indexOf(' ') === -1 ? resp.substr(0, 9) + '...' :  resp.replace(text, '');
            }
          }

        } else {
          return value.substr(0, 9) + '...';
        }
      }
    } else {
      return value;
    }
  }

}
