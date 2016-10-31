import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Authentication } from '../../shared/services/authentication.data.service';
import { Router } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
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
  private configSubscription: Subscription;

  constructor(
    public authentication: Authentication,
    public router: Router,
    public currentUser: CurrentUser,
    public userPreference: UserPreferenceService,
    public uiConfig: UiConfig) {
  }

  ngOnInit(): void {
    this.configSubscription =
      this.uiConfig.get('login').subscribe((config: any) =>
        this.config = config.config);
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public onSubmit(user: any): void {
    this.authentication.create(user).take(1).subscribe((res) => {
      this.currentUser.set(res.user, res.token.token);
      this.router.navigate(['/']);
    });
  }
}
