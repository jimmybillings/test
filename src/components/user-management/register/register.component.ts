import { Component } from 'angular2/core';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup } from 'angular2/common';
import { Response } from 'angular2/http';
import { User } from '../../../common/services/user.data.service';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { ApiConfig } from '../../../common/config/api.config';
import {UiConfig} from '../../../common/config/ui.config';
import {Valid} from '../../../common/services/validator.form.service';
import { IFormFields } from '../../../common/interfaces/forms.interface';
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
  public config: any;
  public fields: IFormFields[];
  
  constructor(
    public fb: FormBuilder,
    public user: User,
    private _ApiConfig: ApiConfig,
    public uiConfig: UiConfig,
    private _valid: Valid) {
      this.fields = [
        {'name': 'firstName', 'type': 'text', 'value': 'null', 'label': 'First Name', 'validation': 'TEXT_INPUT'},
        {'name': 'lastName', 'type': 'text', 'value': 'null', 'label': 'Last Name', 'validation': 'TEXT_INPUT'},
        {'name': 'emailAddress', 'type': 'email', 'value': 'null', 'label': 'Email', 'validation': 'EMAIL'},
        {'name': 'password', 'type': 'password', 'value': 'null', 'label': 'Password', 'validation': 'PASSWORD'},
        {'name': 'siteName', 'type': 'hidden', 'value': 'core', 'label': 'CORE', 'validation': 'TEXT_INPUT'}
    ];
  }
  
  ngOnInit(): void {
    this.config = this.uiConfig.get('register');
    this.registerForm = this.fb.group(this._valid.createForm(this.fields));
  }

  /**
   * Register a new user by subscribing to the user data services create method
   * @param user  Registration form field values sent to the user data service.
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
}
