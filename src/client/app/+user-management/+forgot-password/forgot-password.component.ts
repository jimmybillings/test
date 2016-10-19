import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { User } from '../services/user.data.service';
import { UiConfig } from '../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'forgot-password-component',
  templateUrl: 'forgot-password.html',
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {
  public config: any;
  public successfullySubmitted: boolean = false;
  public serverErrors: any;
  private configSubscription: Subscription;

  constructor(
    public user: User,
    public uiConfig: UiConfig) {
  }

  ngOnInit(): void {
    this.configSubscription =
      this.uiConfig.get('forgotPassword').subscribe((config: any) =>
        this.config = config.config);
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public onSubmit(user: Object): void {
    this.user.forgotPassword(user).subscribe();
    this.successfullySubmitted = true;
  }
}
