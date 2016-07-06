import { Injectable, ComponentRef, ComponentResolver, Renderer } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { Router } from '@angular/router';
import { UiConfig} from '../../services/ui.config';

@Injectable()
export class NotificationService {
  public cmpRef: ComponentRef<any>;
  public viewRef: any;
  public setDestroyTimer: any;
  public notficationStrategy: any;

  constructor(private renderer: Renderer,
    private resolver: ComponentResolver,
    public router: Router,
    public uiConfig: UiConfig) {
    this.uiConfig.get('notifications').subscribe((config: any) => this.notficationStrategy = config.items || []);
  }

  public check(state: string, target: any) {
    let activeNotification = this.notficationStrategy.filter((notification: any) => (state.indexOf(notification.type) > 0));
    if (activeNotification.length > 0) this.createNotfication(target, activeNotification[0]);
  }

  public createNotfication(target: any, notice: any) {
    this.resolver.resolveComponent(NotificationComponent).then((factory: any) => {
      this.cmpRef = target.createComponent(factory);
      this.cmpRef.instance.notice = notice.trString;
      this.cmpRef.instance.theme = notice.theme;
      this.viewRef = this.renderer.listenGlobal('body', 'click', () => this.destroyNotification());
    });
    this.setDestroyTimer = setTimeout(() => this.destroyNotification(), 5000);
  }

  public destroyNotification() {
    this.cmpRef.destroy();
    this.viewRef();
    clearTimeout(this.setDestroyTimer);
  }
}
