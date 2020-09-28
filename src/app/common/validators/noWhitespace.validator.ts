import { FormControl } from '@angular/forms';

export class NoWhiteSpace {

  public Validator(control: FormControl) {

    if (control && control.value && control.value !== null && control.value !== '') {
      const isWhitespace = (control.value.toString() || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    } else {
      return null;
    }
  }


  public RemoveWhiteSpace(value): string {
    let newValue = '';
    if (value && value !== '') {
      newValue = ((value.toString()).replace(/\s+/g, ' ')).trim();
    }
    return newValue;
  }
}
