import { Component, Input, Directive, ViewContainerRef, TemplateRef, ViewChild, ViewEncapsulation, Renderer } from '@angular/core';
import {Overlay} from '@angular2-material/core/overlay/overlay';
import {OverlayState} from '@angular2-material/core/overlay/overlay-state';
import {OverlayRef} from '@angular2-material/core/overlay/overlay-ref';
import {TemplatePortalDirective} from '@angular2-material/core';

@Directive({ selector: '[wzDropdownPortalDirective]' })
export class WzDropdownPortalDirective extends TemplatePortalDirective {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}

@Component({
  moduleId: module.id,
  selector: 'wz-dropdown',
  encapsulation: ViewEncapsulation.None,
  template: `
  <template wzDropdownPortalDirective>
    <ng-content></ng-content>
  </template>`
})

export class WzDropdownComponent {
  @Input() config = new OverlayState();
  @Input() message: string;
  @ViewChild(WzDropdownPortalDirective) public portal: WzDropdownPortalDirective;
  public active: boolean = false;
  public viewRef: any;
  private overlayRef: OverlayRef = null;

  constructor(private overlay: Overlay, private renderer: Renderer) { }

  public show(event: any): Promise<WzDropdownComponent> {
    this.positionElement(event);
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

  private positionElement(event: any) {
    let offset: number = 30;
    let layoutBreakpointXs: boolean = event.view.screen.width < 600;
    if (layoutBreakpointXs) {
      this.config.positionStrategy =
        this.overlay.position().global().fixed().right('0').top('0');
    } else {
      this.config.positionStrategy =
        this.overlay.position().global().fixed().right(window.outerWidth - event.clientX - offset + 'px').top(event.clientY - offset + 'px');
    }
  }

  private closeListener() {
    this.viewRef = this.renderer.listenGlobal('body', 'click', () => this.close());
  }
}
