import { Component, OnInit } from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { Authentication } from '../services/authentication.data.service';

import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { ApiConfig } from '../../shared/services/api.config';
import { User } from '../services/user.data.service';
import { CurrentUser } from '../../shared/services/current-user.model';
import { IFormFields } from '../../shared/interfaces/forms.interface';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';
import { UiConfig } from '../../shared/services/ui.config';

/**
 * Login page component - renders login page and handles login form submission
 */
@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.html',
  providers: [Authentication],
  directives: [
    ROUTER_DIRECTIVES,
    WzFormComponent
  ],
  pipes: [TranslatePipe]
})

export class LoginComponent implements OnInit {
  public config: any;
  public fields: IFormFields[];

  constructor(
    public _authentication: Authentication,
    public _user: User,
    public router: Router,
    public _ApiConfig: ApiConfig,
    public _currentUser: CurrentUser,
    public uiConfig: UiConfig) {
  }

  ngOnInit(): void {
    this.uiConfig.get('login').subscribe((config: any) => this.config = config.config);
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
      this.router.navigate(['/']);
    }, (err) => {
      console.log('trigger display that says incorrect email or password');
    });
  }
}


