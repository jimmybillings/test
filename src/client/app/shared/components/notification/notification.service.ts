import { Injectable, ComponentRef, ComponentResolver, Renderer } from '@angular/core';
import { NotificationComponent } from './notification.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

export const notficationStrategy: any = {
  NEW_USER: 'confirmed=true',
  EXPIRED_SESSION: 'loggedOut=true'
};

@Injectable()
export class NotificationService {
  public cmpRef: ComponentRef<any>;
  public viewRef: any;
  
  constructor(private renderer: Renderer,
    private resolver: ComponentResolver,
    public router: Router,
    public location: Location) { }

  public check(state: string, target: any) {
    for (let notification in notficationStrategy) {
      if (state.indexOf(notficationStrategy[notification]) > 0) {
        this.createNotfication(target, 'NOTIFICATION.' + notification);
      }
    }
  }

  public createNotfication(target: any, notice: any) {
    this.resolver.resolveComponent(NotificationComponent).then((factory: any) => {
      this.cmpRef = target.createComponent(factory);
      this.cmpRef.instance.notice = notice;
      this.viewRef = this.renderer.listenGlobal('body', 'click', () => this.destroyNotification());
    });
  }

  public destroyNotification() {
    this.cmpRef.destroy();
    this.viewRef();
  }
}
