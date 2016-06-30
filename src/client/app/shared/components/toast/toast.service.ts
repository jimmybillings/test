import { Injectable, ComponentRef, ComponentResolver, Renderer, ViewContainerRef } from '@angular/core';
import { ViewContainerService } from '../../services/view-container.service';
import { ToastComponent } from './toast.component';

@Injectable()
export class ToastService {
  public vcRef: ViewContainerRef;
  public cmpRef: ComponentRef<any>;

  constructor(private renderer: Renderer,
    private viewContainerService: ViewContainerService,
    private resolver: ComponentResolver) {
      this.vcRef = this.viewContainerService.getRef();
    }

  public createToast(message: string, type: string, duration: number): void {
    if (this.cmpRef) this.cmpRef.destroy();
    this.resolver.resolveComponent(ToastComponent).then((factory: any) => {
      this.cmpRef = this.vcRef.createComponent(factory);
      this.cmpRef.instance.message = message;
      this.cmpRef.instance.type = type;
      setTimeout(() => {
        this.cmpRef.destroy();
      }, duration);
    });
  }
}
