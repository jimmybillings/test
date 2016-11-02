import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { User } from '../services/user.data.service';
import { UiConfig } from '../../shared/services/ui.config';
import { CurrentUser } from '../../shared/services/current-user.model';
import { WzNotificationService } from '../../shared/components/wz-notification/wz.notification.service';
import { ServerErrors } from '../../shared/interfaces/forms.interface';

@Component({
  moduleId: module.id,
  selector: 'reset-password-component',
  templateUrl: 'reset-password.html',
})

export class ResetPasswordComponent implements OnInit, OnDestroy {
  public config: any;
  public serverErrors: ServerErrors = null;
  private configSubscription: Subscription;
  
  constructor(
    private user: User,
    private uiConfig: UiConfig,
    private route: ActivatedRoute,
    private router: Router,
    private currentUser: CurrentUser,
    private notification: WzNotificationService) {
      
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
    this.user.resetPassword({ newPassword: user.newPassword }, this.route.snapshot.queryParams['shareKey'])
      .subscribe(
        (res: any) => {
          this.currentUser.set(res.user, res.token.token);
          this.router.navigate(['/']);
          this.notification.create('RESETPASSWORD.PASSWORD_CHANGED');
        }, (error) => {
          this.serverErrors = error.json();
        });
  }
}
