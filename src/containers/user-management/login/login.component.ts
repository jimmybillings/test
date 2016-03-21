import { Component } from 'angular2/core';
import { Authentication } from '../authentication.data.service';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';
import { ApiConfig } from '../../../common/config/api.config';
import { User } from '../user.data.service';
import { CurrentUser } from '../../../common/models/current-user.model';
import { IFormFields } from '../../../common/interfaces/forms.interface';
import { WzForm } from '../../../components/wz-form/wz.form.component';
import { UiConfig } from '../../../common/config/ui.config';

/**
 * Login page component - renders login page and handles login form submission
 */  
@Component({
  selector: 'login',
  templateUrl: 'containers/user-management/login/login.html',
  providers: [Authentication],
  directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES, WzForm]
})

export class Login {
  public config: any;
  public fields: IFormFields[];

  constructor(
    public _authentication: Authentication,
    public _user: User,
    public router: Router,
    private _ApiConfig: ApiConfig,
    private _currentUser: CurrentUser,
    public uiConfig: UiConfig) {
  }
  
  ngOnInit(): void {
    this.uiConfig.get('login').subscribe( config => this.config = config.config);
    this.fields = this.config.form.items;
  }

  /**
   * Logs in a user - stores returned token value in local storage.
   * Also sets current user with response values, and navigates to the home page.
   * @param user  Login form fields sent to the authentication service.
  */
  public onSubmit(user: any): void {
    user.siteName = this._ApiConfig.getPortal();
    this._authentication.create(user).subscribe((res) => {
      localStorage.setItem('token', res.token.token);
      this._currentUser.set(res.user);
      this.router.navigate(['/Home']);
    },(err) => {
      console.log('trigger display that says incorrect email or password');
    });
  }
}


