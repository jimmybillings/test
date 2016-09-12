import { Injectable, ComponentRef, ComponentFactoryResolver, Renderer, OnDestroy, ViewContainerRef } from '@angular/core';
import { WzNotificationComponent } from './wz.notification.component';
import { Router } from '@angular/router';
import { UiConfig} from '../../services/ui.config';
import { Subscription } from 'rxjs/Rx';

@Injectable()
export class WzNotificationService implements OnDestroy {
  public cmpRef: ComponentRef<any>;
  public viewRef: any;
  public setDestroyTimer: any;
  public notficationStrategy: any;
  private configSubscription: Subscription;

  constructor(private renderer: Renderer,
    private resolver: ComponentFactoryResolver,
    public router: Router,
    public uiConfig: UiConfig) {
    this.configSubscription = this.uiConfig.get('global').subscribe((config: any) => {
      if (config.config) this.notficationStrategy = config.config.notifications.items || [];
    });
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public check(state: string, target: ViewContainerRef) {
    let activeNotification = this.notficationStrategy.filter((notification: any) => (state.indexOf(notification.type) > 0));
    if (activeNotification.length > 0) this.createNotfication(target, activeNotification[0]);
  }

  public createNotfication(target: ViewContainerRef, notice: any) {
    let componentFactory = this.resolver.resolveComponentFactory(WzNotificationComponent);
    this.cmpRef = target.createComponent(componentFactory);
    this.cmpRef.instance.notice = notice.trString;
    this.cmpRef.instance.theme = notice.theme;
    this.viewRef = this.renderer.listenGlobal('body', 'click', () => this.destroyNotification());
    this.setDestroyTimer = setTimeout(() => this.destroyNotification(), 4500);
  }

  public destroyNotification() {
    this.cmpRef.destroy();
    this.viewRef();
    clearTimeout(this.setDestroyTimer);
  }
}
