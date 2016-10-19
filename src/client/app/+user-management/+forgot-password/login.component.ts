import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Authentication } from '../../shared/services/authentication.data.service';
import { Router } from '@angular/router';
import { User } from '../services/user.data.service';
import { CurrentUser } from '../../shared/services/current-user.model';
import { FormFields } from '../../shared/interfaces/forms.interface';
import { UiConfig } from '../../shared/services/ui.config';
import { UserPreferenceService } from '../../shared/services/user-preference.service';

/**
 * Login page component - renders login page and handles login form submission
 */
@Component({
  moduleId: module.id,
  selector: 'login-component',
  templateUrl: 'login.html',
})

export class LoginComponent implements OnInit, OnDestroy {
  public config: any;
  public fields: FormFields[];
  private configSubscription: Subscription;

  constructor(
    public _authentication: Authentication,
    public _user: User,
    public router: Router,
    public _currentUser: CurrentUser,
    public userPreference: UserPreferenceService,
    public uiConfig: UiConfig) {
  }

  ngOnInit(): void {
    this.configSubscription = this.uiConfig.get('login').subscribe((config: any) => this.config = config.config);
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public onSubmit(user: any): void {
    this._authentication.create(user).take(1).subscribe((res) => {
      localStorage.setItem('token', res.token.token);
      this._currentUser.set(res.user);
      let prefs: any = this.userPreference.formatResponse(res.userPreferences);
      this.userPreference.set(prefs);
      this.router.navigate(['/']);
    });
  }
}
