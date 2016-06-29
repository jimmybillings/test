import { Injectable, ComponentRef, ComponentResolver, Renderer } from '@angular/core';
import { ToastComponent } from './toast.component';

@Injectable()
export class ToastService {
  public cmpRef: ComponentRef<any>;

  constructor(private renderer: Renderer,
    private resolver: ComponentResolver) { }

  public createToast(message: string, type: string, duration: number, target: any): void {
    if (this.cmpRef) this.cmpRef.destroy();
    this.resolver.resolveComponent(ToastComponent).then((factory: any) => {
      this.cmpRef = target.createComponent(factory);
      this.cmpRef.instance.message = message;
      this.cmpRef.instance.type = type;
      setTimeout(() => {
        this.cmpRef.destroy();
      }, duration);
    });
  }
}
