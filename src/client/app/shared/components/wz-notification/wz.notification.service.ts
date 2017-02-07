import { Injectable, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { WzNotificationComponent } from './wz.notification.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ErrorStore } from '../../stores/error.store';
import { CurrentUser } from '../../services/current-user.model';

@Injectable()
export class WzNotificationService {
  public cmpRef: ComponentRef<WzNotificationComponent>;
  public setDestroyTimer: any;
  public destroyOnClick: Subscription;
  private target: ViewContainerRef;
  private callInProgress: boolean = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    public router: Router,
    private error: ErrorStore,
    private currentUser: CurrentUser
  ) {
    this.error.data.subscribe(this.handle.bind(this));
  }

  public initialize(target: ViewContainerRef) {
    this.target = target;
  }

  private create(notice: any, target: ViewContainerRef = this.target) {
    let componentFactory = this.resolver.resolveComponentFactory(WzNotificationComponent);
    this.cmpRef = target.createComponent(componentFactory);
    this.cmpRef.instance.notice = notice;
    this.destroyOnClick = this.cmpRef.instance.onDestroy.subscribe((_: any) => {
      this.destroy();
    });
    this.setDestroyTimer = setTimeout(() => this.destroy(), 4900);
  }

  private handle(error: any): void {
    if (!error.status) return;
    if (this.callInProgress) return;
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
      default:
        this.customError(error.status);
        break;
    }
  }

  private destroy() {
    this.cmpRef.destroy();
    clearTimeout(this.setDestroyTimer);
    this.destroyOnClick.unsubscribe();
    this.callInProgress = false;
  }

  private unAuthorized(): void {
    this.currentUser.destroy();
    this.router.navigate(['/user/login']).then(_ => {
      this.create('NOTIFICATION.INVALID_CREDENTIALS');
    });
  }

  private forbidden(): void {
    this.create('NOTIFICATION.NEED_PERMISSION');
  }

  private expiredSession(): void {
    this.currentUser.destroy();
    this.router.navigate(['/user/login']).then(_ => {
      this.create('NOTIFICATION.EXPIRED_SESSION');
    });
  }

  private customError(errorMessage: string) {
    this.create(errorMessage);
  }
}
