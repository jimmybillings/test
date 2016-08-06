import {Component, Input, ViewChild, ViewEncapsulation, OnDestroy} from '@angular/core';
import {Overlay, OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
import {OverlayState} from '@angular2-material/core/overlay/overlay-state';
import {OverlayRef} from '@angular2-material/core/overlay/overlay-ref';
import {Directive, ViewContainerRef, TemplateRef} from '@angular/core';
import {TemplatePortalDirective} from '@angular2-material/core';

@Directive({selector: '[wzDialogPortal]'})
export class WzDialogPortalDirective extends TemplatePortalDirective {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}

@Component({
  selector: 'wz-dialog',
  directives: [WzDialogPortalDirective],
  providers: [Overlay, OVERLAY_PROVIDERS],
  encapsulation: ViewEncapsulation.None,
  template: `
    <template wzDialogPortal>
      <div class="wz-dialog" style="width: 100%">
        <ng-content></ng-content>
      </div>
    </template>
    `
})

export class WzDialogComponent implements OnDestroy {
  @Input() config = new OverlayState();
  @ViewChild(WzDialogPortalDirective) private portal: WzDialogPortalDirective;
  private overlayRef: OverlayRef = null;

  constructor(private overlay: Overlay) {
    this.config.positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();
  }

  ngOnDestroy(): any {
    return this.close();
  }

  public show(): Promise<WzDialogComponent> {
    return this.close()
      .then(() => this.overlay.create(this.config))
      .then((ref: OverlayRef) => {
        this.overlayRef = ref;
        return ref.attach(this.portal);
      })
      .then(() => {
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
      });
    }
  }
}
