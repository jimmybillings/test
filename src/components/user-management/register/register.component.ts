import { Component } from 'angular2/core';
import { Response } from 'angular2/http';
import { User } from '../../../common/services/user.data.service';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { ApiConfig } from '../../../common/config/api.config';
import { UiConfig } from '../../../common/config/ui.config';
import { IFormFields } from '../../../common/interfaces/forms.interface';
import { WzForm } from '../../../common/components/wz-form/wz.form.component';

/**
 * Registration page component - renders registration page and handles submiting registation form.
 */
@Component({
  selector: 'register',
  templateUrl: 'components/user-management/register/register.html',
  providers: [User],
  directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES, WzForm]
})

export class Register {
  public config: any;
  public fields: IFormFields[];
  
  constructor(
    public user: User,
    private _ApiConfig: ApiConfig,
    public uiConfig: UiConfig) {
      this.fields = [
        {'name': 'firstName', 'type': 'text', 'value': 'null', 'label': 'First Name', 'validation': 'REQUIRED'},
        {'name': 'lastName', 'type': 'text', 'value': 'null', 'label': 'Last Name', 'validation': 'REQUIRED'},
        {'name': 'emailAddress', 'type': 'email', 'value': 'null', 'label': 'Email', 'validation': 'EMAIL'},
        {'name': 'password', 'type': 'password', 'value': 'null', 'label': 'Password', 'validation': 'PASSWORD'}
    ];
  }
  
  ngOnInit(): void {
    this.config = this.uiConfig.get('register');
  }
  
  /**
   * Register a new user by subscribing to the user data services create method
   * @param user  Registration form field values sent to the user data service.
  */
  public onSubmit(user:any): void {
    user.siteName = this._ApiConfig.getPortal();
    this.user.create(user)
      .subscribe((res: Response) => {
        console.log(res);
      });
  }
}
