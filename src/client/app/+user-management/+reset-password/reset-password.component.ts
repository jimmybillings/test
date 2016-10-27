import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { User } from '../services/user.data.service';
import { UiConfig } from '../../shared/services/ui.config';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UserPreferenceService } from '../../shared/services/user-preference.service';

@Component({
  moduleId: module.id,
  selector: 'reset-password-component',
  templateUrl: 'reset-password.html',
})

export class ResetPasswordComponent implements OnInit, OnDestroy {
  public config: any;
  private configSubscription: Subscription;

  constructor(
    private user: User,
    private uiConfig: UiConfig,
    private route: ActivatedRoute,
    private router: Router,
    private currentUser: CurrentUser,
    private userPreference: UserPreferenceService) {
  }

  ngOnInit(): void {
    this.configSubscription =
      this.uiConfig.get('resetPassword').subscribe((config: any) =>
        this.config = config.config);
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public onSubmit(user: any): void {
    this.user.resetPassword(user, this.route.snapshot.queryParams['shareKey'])
      .subscribe((res:any) =>{
        this.currentUser.set(res.user, res.token.token);
        this.userPreference.set(res.userPreferences);
        this.router.navigate(['/']);
      });
  }
}
