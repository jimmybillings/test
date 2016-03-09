import { Component } from 'angular2/core';
import { Authentication } from '../../../common/services/authentication.data.service';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';
import { ApiConfig } from '../../../common/config/api.config';
import { User } from '../../../common/services/user.data.service';
import { CurrentUser } from '../../../common/models/current-user.model';
import { IFormFields } from '../../../common/interfaces/forms.interface';
import { WzForm } from '../../../common/components/wz-form/wz.form.component';

/**
 * Login page component - renders login page and handles login form submission
 */  
@Component({
  selector: 'login',
  templateUrl: 'components/user-management/login/login.html',
  providers: [Authentication],
  directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES, WzForm]
})

export class Login {

  public fields: IFormFields[];

  constructor(
    public _authentication: Authentication,
    public _user: User,
    public router: Router,
    private _ApiConfig: ApiConfig,
    private _currentUser: CurrentUser) {
      this.fields = [
        {'name': 'userId', 'type': 'text', 'value': 'null', 'label': 'Email', 'validation': 'REQUIRED'},
        {'name': 'password', 'type': 'password', 'value': 'null', 'label': 'Password', 'validation': 'REQUIRED'}
    ];
  }

  /**
   * Logs in a user - stores returned token value in local storage.
   * Also sets current user with response values, and navigates to the home page.
   * @param user  Login form fields sent to the authentication service.
  */
  public onSubmit(user: Object): void {
    this._authentication.create(user).subscribe((res) => {
      localStorage.setItem('token', res.token.token);
      this._currentUser.set(res.user);
    },(err) => {
      console.log('trigger display that says incorrect email or password');
    },() => {
      this.router.navigate(['/Home']);
    });
  }
}


