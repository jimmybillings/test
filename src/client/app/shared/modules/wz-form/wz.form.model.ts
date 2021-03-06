import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormFields } from '../../interfaces/forms.interface';

/**
 * Service that creates a dynamic model to drive a form.
 */
@Injectable()
export class FormModel {

  create(form: FormFields[]): FormGroup {
    let newForm: any = {};
    form.forEach((field: FormFields) => {
      newForm[field.name] = [field.value];
      newForm[field.name].push(this._getValidator(field));
    });
    return newForm;
  }

  public updateForm(form: FormGroup, values: any): void {
    for (let controlName in form.controls) {
      if (values.hasOwnProperty(controlName))
        (<FormControl>form.controls[controlName]).setValue(values[controlName]);
      (<FormControl>form.controls[controlName]).setValue('');
    }
  }

  public markFormAsUntouched(form: FormGroup): void {
    form.markAsUntouched();
    form.markAsPristine();
    for (var controlName in form.controls) {
      (<FormControl>form.controls[controlName]).markAsUntouched();
      (<FormControl>form.controls[controlName]).markAsPristine();
    }
  }

  private _getValidator(field: FormFields): Validators {
    switch (field.validation) {
      case 'REQUIRED':
        return this._getRequiredValidator();
      case 'EMAIL':
        return this._getEmailValidator();
      case 'PASSWORD':
        return this._getPasswordValidator();
      case 'COLLECTION':
        return this._getCollectionValidator();
      case 'MULTIEMAIL':
        return this._getMultiEmailValidator();
      case 'TERMS':
        return this._getTermsValidator();
      case 'GREATER_THAN':
        return this._getGreaterThanValidator(field.min);
      case 'MIN_LENGTH':
        return this._getMinLengthValidator(field.min);
      case 'MAX_LENGTH':
        return this._getMaxLengthValidator(field.max);
      default:
        return this._getOptionalValidator;
    }
  }

  private _getOptionalValidator(): Validators {
    return Validators.nullValidator;
  }

  private _getRequiredValidator(): Validators {
    return Validators.compose([
      Validators.required,
      Validators.pattern(/\S/)
    ]);
  }

  private _getEmailValidator(): Validators {
    return Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.pattern('[a-zA-Z0-9!#$%&`*+\/=?^_`{|}~.-]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?' +
        '(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9]){1,}?)*')
    ]);
  }

  private _getMultiEmailValidator(): Validators {
    return Validators.compose([
      Validators.required,
      Validators.pattern(
        '\\s*(([a-z0-9!#$%&`*+\/=?^_`{|}~.-]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)' +
        '|(([a-zA-Z0-9\\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)(\\s*(;|,)\\s*|\\s*$))*')
    ]);
  }

  private _getPasswordValidator(): Validators {
    return Validators.compose([
      Validators.required,
      Validators.minLength(8)
    ]);
  }

  private _getCollectionValidator(): Validators {
    return Validators.required;
  }

  private _getTermsValidator(): Validators {
    return this.checkboxRequired;
  }

  private _getGreaterThanValidator(testValue: string): Validators {
    return (control: FormControl) => (parseFloat(control.value) <= parseFloat(testValue)) ? { tooLow: 'number too low' } : null;
  }

  private _getMinLengthValidator(length: string): Validators {
    return Validators.minLength(parseInt(length));
  }

  private _getMaxLengthValidator(length: string): Validators {
    return Validators.maxLength(parseInt(length));
  }

  private checkboxRequired(control: FormGroup) {
    if (!control.value) {
      return { mustBeCheckedError: 'Must be checked' };
    } else {
      return null;
    }
  }
}
