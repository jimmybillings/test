import {
  Injectable,
  ComponentRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ErrorStore } from '../../stores/error.store';

@Component({
  moduleId: module.id,
  selector: 'wz-notification',
  template:
  `<div class="notification">
      <p>{{notice | translate}}</p>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzNotificationComponent {
  @Output() onDestroy = new EventEmitter();
  @Input() notice: string;
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: any) {
    this.onDestroy.emit();
  }
}

@Injectable()
export class WzNotificationService {
  private target: ViewContainerRef;
  private callInProgress: boolean = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private error: ErrorStore) {
    error.data.subscribe(this.handle.bind(this));
  }

  public initialize(target: ViewContainerRef) {
    this.target = target;
  }

  private handle(error: any): void {
    try { return error.json(); } catch (exception) {
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
        default:
          if (isNaN(error.status)) this.customError(error.status);
          break;
      }
    }
  }

  private create(notice: any) {
    const componentFactory = this.resolver.resolveComponentFactory(WzNotificationComponent);
    const cmpRef: ComponentRef<WzNotificationComponent> = this.target.createComponent(componentFactory);
    cmpRef.instance.notice = notice;
    const onClick: Subscription = cmpRef.instance.onDestroy.subscribe((_: any) => {
      this.destroy(cmpRef, null, onClick);
    });
    const timer: any = setTimeout(() => this.destroy(cmpRef, timer, onClick), 4900);
  }

  private destroy(cmpRef: ComponentRef<WzNotificationComponent>, timer: any = null, onClick: Subscription) {
    cmpRef.destroy();
    clearTimeout(timer);
    onClick.unsubscribe();
    this.callInProgress = false;
  }

  private unAuthorized(): void {
    this.router.navigate(['/user/login']).then(_ => {
      this.create('NOTIFICATION.INVALID_CREDENTIALS');
    });
  }

  private forbidden(): void {
    this.create('NOTIFICATION.NEED_PERMISSION');
  }

  private expiredSession(): void {
    this.router.navigate(['/user/login']).then(_ => {
      this.create('NOTIFICATION.EXPIRED_SESSION');
    });
  }

  private customError(errorMessage: number) {
    this.create(errorMessage);
  }
}
