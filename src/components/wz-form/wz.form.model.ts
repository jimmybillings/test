import { Injectable } from 'angular2/core';
import { Validators } from 'angular2/common';
import { IFormFields } from '../../common/interfaces/forms.interface';

/**
 * Service that creates a dynamic model to drive a form. 
 */  
@Injectable()
export class Form {
  
  create(form:IFormFields[]): Object {
    let newForm = {};
    form.forEach((field) => {
      newForm[field.name] = [field.value];
      newForm[field.name].push(this._getValidator(field.validation));
    });
    return newForm;
  }
  
  private _getValidator(type): Validators {
    switch (type) {
      case 'REQUIRED':
        return this._getRequiredValidator();
      case 'EMAIL':
        return this._getEmailValidator();
      case 'PASSWORD':
        return this._getPasswordValidator();
      default:
        this._getOptionalValidator();
        break;
    }
  }
  
  private _getOptionalValidator(): string {
    return '';
  }
  
  private _getRequiredValidator(): Validators {
    return Validators.required;
  }
  
  private _getEmailValidator(): Validators {
    return Validators.compose([
      Validators.minLength(8),
      Validators.maxLength(50)
    ]);
  }
  
  private _getPasswordValidator(): Validators {
    return Validators.compose([
      Validators.required,
      Validators.minLength(8)
    ]);
  }

}
