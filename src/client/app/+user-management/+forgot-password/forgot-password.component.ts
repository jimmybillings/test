import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../../shared/services/user.service';
import { UiConfig } from '../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'forgot-password-component',
  templateUrl: 'forgot-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ForgotPasswordComponent implements OnInit, OnDestroy {
  public config: any;
  public successfullySubmitted: boolean = false;
  public serverErrors: any;
  private configSubscription: Subscription;

  constructor(
    public user: UserService,
    public uiConfig: UiConfig,
    private ref: ChangeDetectorRef) {
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
    this.ref.markForCheck();
  }
}
