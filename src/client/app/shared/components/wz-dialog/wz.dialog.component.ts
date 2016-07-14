import { Component, Input, Directive, ViewContainerRef, TemplateRef, ViewChild, ViewEncapsulation, Renderer } from '@angular/core';
import {Overlay, OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
import {OverlayState} from '@angular2-material/core/overlay/overlay-state';
import {OverlayRef} from '@angular2-material/core/overlay/overlay-ref';
import {TemplatePortalDirective} from '@angular2-material/core';

@Directive({ selector: '[wzDialogPortalDirective]' })
export class WzDialogPortalDirective extends TemplatePortalDirective {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}

@Component({
  moduleId: module.id,
  selector: 'wz-dialog',
  directives: [WzDialogPortalDirective],
  providers: [Overlay, OVERLAY_PROVIDERS],
  encapsulation: ViewEncapsulation.None,
  template: `
  <template wzDialogPortalDirective>
    <ng-content></ng-content>
  </template>`
})

export class WzDialogComponent {
  @Input() config = new OverlayState();
  @Input() message: string;
  @ViewChild(WzDialogPortalDirective) public portal: WzDialogPortalDirective;
  public active: boolean = false;
  public viewRef: any;
  private overlayRef: OverlayRef = null;

  constructor(private overlay: Overlay, private renderer: Renderer) { }

  public show(event: any): Promise<WzDialogComponent> {
    return this.close()
      .then(() => this.overlay.create(this.config))
      .then((ref: OverlayRef) => {
        this.overlayRef = ref;
        return ref.attach(this.portal);
      })
      .then(() => {
        setTimeout(() => this.closeListener(), 200);
        this.active = true;
        return this;
      });
  }

  public close(): Promise<any> {
    if (!this.overlayRef) {
      return Promise.resolve(this);
    } else {
      return Promise.resolve(() => {
        this.overlayRef.detach();
      }).then(() => {
        this.overlayRef.dispose();
        this.overlayRef = null;
        this.viewRef();
      });
    }
  }

  private closeListener() {
    this.viewRef = this.renderer.listenGlobal('body', 'click', () => this.close());
  }
}
