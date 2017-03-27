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
    this.dialog.openNotification(strings).subscribe(_ => this.callInProgress = false);
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
