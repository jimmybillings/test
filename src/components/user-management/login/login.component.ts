import { Component } from 'angular2/core';
import { FORM_DIRECTIVES, Validators, FormBuilder, ControlGroup } from 'angular2/common';
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
  public errorMessage: string;

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
    if (this.loginForm.valid) {
      this._authentication.create(user).subscribe((res) => {
        localStorage.setItem('token', res.token.token);
        this._currentUser.set(res.user);
      },(err) => {
        // console.log('we are in the error');
        // console.log(err.status);
        // console.log(err.statusText);
        console.log('trigger display that says incorrect email or password');
      },() => {
        console.log('Call this when done');
        this.router.navigate(['/Home']);
      });
    } else {
      console.log('trigger display of invalid fields');
    }
  }

/**
 * setup the login form inputs
 */  
  public setForm(): void {
    this.loginForm = this._fb.group({
      'userId': ['', Validators.required],
      'password': ['', Validators.required],
      'siteName': this._ApiConfig.getPortal()
    });
  }
}


