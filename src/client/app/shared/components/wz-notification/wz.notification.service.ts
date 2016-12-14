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
  public notficationStrategy: any = [];
  public destroyOnClick: any;
  private configSubscription: Subscription;
  private target: ViewContainerRef;
  constructor(
    private renderer: Renderer,
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

  public initialize(target: ViewContainerRef) {
    this.target = target;
  }

  public check(state: string) {
    let activeNotification = this.notficationStrategy.filter((notification: any) => (state.indexOf(notification.type) > 0));
    if (activeNotification.length > 0) this.create(activeNotification[0].trString);
  }

  public create(notice: any, target: ViewContainerRef = this.target) {
    let componentFactory = this.resolver.resolveComponentFactory(WzNotificationComponent);
    this.cmpRef = target.createComponent(componentFactory);
    this.cmpRef.instance.notice = notice;
    this.destroyOnClick = setTimeout(() => {
      this.viewRef = this.renderer.listenGlobal('body', 'click', () => this.destroy());
    }, 200);
    this.setDestroyTimer = setTimeout(() => this.destroy(), 4900);
  }

  public destroy() {
    this.cmpRef.destroy();
    this.viewRef();
    clearTimeout(this.setDestroyTimer);
    clearTimeout(this.destroyOnClick);
  }
}
