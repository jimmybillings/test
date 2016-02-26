import { Component } from 'angular2/core';
import { FORM_DIRECTIVES, Validators, FormBuilder, ControlGroup } from 'angular2/common';
import { Response } from 'angular2/http';
import { User } from '../../../common/services/user.data.service';
import { MATERIAL_DIRECTIVES, MdPatternValidator } from 'ng2-material/all';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { ApiConfig } from '../../../common/config/api.config';

/**
 * Registration page component - renders registration page and handles submiting registation form.
 */  
@Component({
  selector: 'register',
  templateUrl: 'components/user-management/register/register.html',
  providers: [User],
  directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})

export class Register {
  public registerForm: ControlGroup;

  constructor(
    public fb: FormBuilder,
    public user: User,
    private _ApiConfig: ApiConfig) {
    this._setForm(fb);
  }

  /**
   * Register a new user by subscribing to the user data services create method
   * @param user  Regiatration form field values sent to the user data service.
  */
  public onSubmit(user: Object): void {
    if (this.registerForm.valid) {
      this.user.create(user)
        .subscribe((res: Response) => {
          console.log(res);
      });

    } else {
      console.log('if failing fields are not showing error, display errors');
    }
  }

  /**
   * setup the registration form inputs and validation requirements
   * @param fb  FormBuilder is needed to set setup the form group
   */  
  private _setForm(fb: FormBuilder): void {
    this.registerForm = fb.group({
      'firstName': [null, Validators.required],
      'lastName': [null, Validators.required],
      'emailAddress': [null, Validators.compose([
        MdPatternValidator.inline('^.+@.+\..+$'),
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)
      ])],
      'password': [null, Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])],
      'siteName': this._ApiConfig.getPortal()
    });
  }
}
