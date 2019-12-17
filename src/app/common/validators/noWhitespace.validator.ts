import { FormControl } from '@angular/forms';

export class NoWhiteSpace {

  public noWhitespaceValidator(control: FormControl) {

    if (control.value !== null && control.value !== '') {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    } else {
      return null;
    }
  }
}
