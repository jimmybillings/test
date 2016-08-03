import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/common';
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
      newForm[field.name].push(this._getValidator(field.validation));
    });
    return newForm;

  }

  public updateForm(form: FormGroup, values: any): void {
    for (let controlName in form.controls) {
      if (values.hasOwnProperty(controlName))
        (<FormControl>form.controls[controlName]).updateValue(values[controlName]);
      (<FormControl>form.controls[controlName]).updateValue('');
    }
  }

  public markFormAsUntouched(form: FormGroup): void {
    form['_touched'] = false;
    form['_pristine'] = true;
    for (var i in form.controls) {
      (<any>form.controls[i])._touched = false;
      (<any>form.controls[i])._pristine = true;
    }
  }

  private _getValidator(type: any): Validators {
    switch (type) {
      case 'REQUIRED':
        return this._getRequiredValidator();
      case 'EMAIL':
        return this._getEmailValidator();
      case 'PASSWORD':
        return this._getPasswordValidator();
      default:
        return this._getOptionalValidator;
    }
  }

  private _getOptionalValidator(): Validators {
    return Validators.nullValidator;
  }

  private _getRequiredValidator(): Validators {
    return Validators.required;
  }

  private _getEmailValidator(): Validators {
    return Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('[a-z0-9!#$%&\'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*')
    ]);
  }

  private _getPasswordValidator(): Validators {
    return Validators.compose([
      Validators.required,
      Validators.minLength(8)
    ]);
  }
}
