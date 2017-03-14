import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { UserService } from '../../shared/services/user.service';
import { UiConfig } from '../../shared/services/ui.config';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { ServerErrors } from '../../shared/interfaces/forms.interface';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from 'ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'reset-password-component',
  templateUrl: 'reset-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ResetPasswordComponent implements OnInit, OnDestroy {
  public config: any;
  public serverErrors: ServerErrors = null;
  public shareKey: string;
  private configSubscription: Subscription;

  constructor(
    private user: UserService,
    private uiConfig: UiConfig,
    private route: ActivatedRoute,
    private router: Router,
    private currentUser: CurrentUserService,
    private translate: TranslateService,
    private snackbar: MdSnackBar,
    private ref: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.shareKey = this.route.snapshot.params['share_key'] || null;
    const configSegment: string = this.currentUser.loggedIn() ? 'changePassword' : 'resetPassword';
    this.configSubscription =
      this.uiConfig.get(configSegment)
        .subscribe((config: any) => this.config = config.config);
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public onSubmit(form: any): void {
    if (this.shareKey) {
      this.user.resetPassword(form, this.shareKey)
        .do((res: any) => this.currentUser.set(res.user, res.token.token))
        .subscribe(this.handleSuccess, this.handleError);
    } else {
      this.user.changePassword(form).subscribe(this.handleSuccess, this.handleError);
    }
  }

  private handleSuccess = () => {
    this.router.navigate(['/']);
    this.showSnackbar('RESETPASSWORD.PASSWORD_CHANGED');
    this.ref.markForCheck();
  }

  private handleError = (error: any) => {
    this.serverErrors = error.json();
    this.ref.markForCheck();
  }

  private showSnackbar(message: any): void {
    this.translate.get(message).subscribe((res) => {
      this.snackbar.open(res, '', { duration: 2000 });
    });
  }
}
