import { Component } from 'angular2/core';
import { FormBuilder, ControlGroup, FORM_DIRECTIVES, Validators } from 'angular2/common';
import { Response } from 'angular2/http';
import { Authentication } from '../../../common/services/authentication.data.service';
import { MATERIAL_DIRECTIVES } from 'ng2-material/all';
import { ROUTER_DIRECTIVES, Router } from 'angular2/router';
import { ApiConfig } from '../../../common/config/api.config';
import { User } from '../../../common/services/user.data.service';
import { CurrentUser } from '../../../common/models/current-user.model';

/**
 * Login page component - renders login page and handles login form submission
 */  
@Component({
  selector: 'login',
  templateUrl: 'components/user-management/login/login.html',
  providers: [Authentication],
  directives: [MATERIAL_DIRECTIVES, ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})

export class Login {

  public loginForm: ControlGroup;

  constructor(
    public _fb: FormBuilder,
    public _authentication: Authentication,
    public _user: User,
    public router: Router,
    private _ApiConfig: ApiConfig,
    private _currentUser: CurrentUser) {
  }

  ngOnInit(): void {
    this.setForm();
  }

  /**
   * Logs in a user - stores returned token value in local storage.
   * Also sets current user with response values, and navigates to the home page.
   * @param user  Login form fields sent to the authentication service.
  */
  public onSubmit(user: Object): void {
    console.log(this.loginForm.value);
    this._authentication.create(user).subscribe((res: Response) => {
      localStorage.setItem('token', res.json().token.token);
      this._currentUser.set(res.json().user);
      this.router.navigate(['/Home']);
    });
  }

/**
 * setup the login form inputs
 */  
  public setForm(): void {
    this.loginForm = this._fb.group({
      'userId': null,
      'password': ['', Validators.required],
      'siteName': this._ApiConfig.getPortal()
    });
  }
}


