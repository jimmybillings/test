import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorStore } from '../stores/error.store';
import { WzDialogService } from '../modules/wz-dialog/services/wz.dialog.service';

@Injectable()
export class WzNotificationService {
  private callInProgress: boolean = false;

  constructor(
    private router: Router,
    private error: ErrorStore,
    private dialog: WzDialogService) {
    error.data.subscribe(this.handle.bind(this));
  }

  private handle(error: any): void {
    if (!error.status || this.callInProgress) return;
    this.callInProgress = true;
    switch (error.status) {
      case 400:
        this.BadRequest();
        break;
      case 401:
        this.unAuthorized();
        break;
      case 403:
        this.forbidden();
        break;
      case 419:
        this.expiredSession();
        break;
      case 451:
        this.cantRegister();
        break;
      default:
        this.callInProgress = false;
        if (isNaN(error.status)) this.customError(error.status);
        break;
    }
  }

  private create(strings: any) {
    this.dialog.openNotificationDialog(strings).subscribe(_ => this.callInProgress = false);
  }

  // I think this is only being used when "disableAnonymousSearch": true is in the site config.
  // a 400 error is return when someone not logged in attempts a search.
  private BadRequest(): void {
    this.router.navigate(['/user/login']).then(_ => {
      this.create({
        title: 'NOTIFICATION.REQUIRE_LOGIN',
        message: 'NOTIFICATION.REQUIRE_LOGIN_MESSAGE',
        prompt: 'NOTIFICATION.CLOSE'
      });
    });
  }

  private cantRegister(): void {
    this.create({
      title: 'REGISTER.DISALLOWED.TITLE',
      message: 'REGISTER.DISALLOWED.MESSAGE',
      prompt: 'REGISTER.DISALLOWED.PROMPT'
    });
  }

  private unAuthorized(): void {
    this.router.navigate(['/user/login']).then(_ => {
      this.create({
        title: 'NOTIFICATION.ERROR',
        message: 'NOTIFICATION.INVALID_CREDENTIALS',
        prompt: 'NOTIFICATION.CLOSE'
      });
    });
  }

  private forbidden(): void {
    this.create({
      title: 'NOTIFICATION.ERROR',
      message: 'NOTIFICATION.NEED_PERMISSION',
      prompt: 'NOTIFICATION.CLOSE'
    });
  }

  private expiredSession(): void {
    this.router.navigate(['/user/login']).then(_ => {
      this.create({
        title: 'NOTIFICATION.ERROR',
        message: 'NOTIFICATION.EXPIRED_SESSION',
        prompt: 'NOTIFICATION.CLOSE'
      });
    });
  }

  private customError(error: number | string) {
    this.create({
      title: error,
      prompt: 'NOTIFICATION.CLOSE'
    });
  }
}
