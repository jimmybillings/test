import { Component, Input, Directive, ViewContainerRef, TemplateRef, ViewChild, ViewEncapsulation, Renderer, ChangeDetectionStrategy } from '@angular/core';
import {Overlay} from '@angular/material';
import {OverlayState} from '@angular/material';
import {OverlayRef} from '@angular/material';
import {TemplatePortalDirective} from '@angular/material';

@Directive({ selector: '[wzToastPortalDirective]' })
export class WzToastPortalDirective extends TemplatePortalDirective {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}

@Component({
  moduleId: module.id,
  selector: 'wz-toast',
  encapsulation: ViewEncapsulation.None,
  template: `
  <template  wzToastPortalDirective>
    <ng-content></ng-content>
  </template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WzToastComponent {
  @Input() config = new OverlayState();
  @ViewChild(WzToastPortalDirective) public portal: WzToastPortalDirective;
  public active: boolean = false;
  public viewRef: any;
  public closeAction: any;
  private overlayRef: OverlayRef = null;

  constructor(private overlay: Overlay, private renderer: Renderer) { }

  public show(): Promise<WzToastComponent> {
    return this.close()
      .then(() => this.overlay.create(this.config))
      .then((ref: OverlayRef) => {
        this.overlayRef = ref;
        return ref.attach(this.portal);
      })
      .then(() => {
        this.closeAction = setTimeout(() => this.close(), 2750);
        this.active = true;
        return this;
      });
  }

  public close(): Promise<any> {
    clearTimeout(this.closeAction);
    if (!this.overlayRef) {
      return Promise.resolve(this);
    } else {
      return Promise.resolve(() => {
        this.overlayRef.detach();
      }).then(() => {
        this.overlayRef.dispose();
        this.overlayRef = null;
      });
    }
  }

}
