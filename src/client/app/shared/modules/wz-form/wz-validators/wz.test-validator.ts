import { FormControl } from '@angular/forms';

export interface ValidationResult {
  [key: string]: boolean;
}

export class WzTestValidator {
  static startsWithNumber(control: FormControl): ValidationResult {
    return control.value !== '' && !isNaN(control.value.charAt(0)) ? { 'startsWithNumber': true } : null;
  }

  static validEmail(control: FormControl): ValidationResult {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return EMAIL_REGEXP.test(control.value) ? null : {
      'notValidEmail': true
    };
  };
}
