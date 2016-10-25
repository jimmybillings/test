import {
  Component,
  Input,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
  Renderer,
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  ChangeDetectionStrategy} from '@angular/core';
import {Overlay} from '@angular/material';
import {OverlayState} from '@angular/material';
import {OverlayRef} from '@angular/material';
import {Directive, ViewContainerRef, TemplateRef} from '@angular/core';
import {TemplatePortalDirective} from '@angular/material';



@Directive({ selector: '[wzDialogPortal]' })
export class WzDialogPortalDirective extends TemplatePortalDirective {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}


@Component({
  selector: 'wz-dialog',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideInOut', [
      state('shown', style({ marginTop: '0' })),
      state('void, hidden', style({ marginTop: '-260%' })),
      transition('void => *, hidden => shown', [
        animate('400ms 10ms ease-in-out', keyframes([
          style({ marginTop: '-260%', offset: 0 }),
          style({ marginTop: '0' , offset: 1.0})
        ]))
      ]),
      transition('shown => void, * => void, shown => hidden', [
        animate('400ms 10ms ease-in-out', keyframes([
          style({ marginTop: '0', offset: 0 }),
          style({ marginTop: '-260%', offset: 1.0 })
        ]))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <template wzDialogPortal>
      <div [@slideInOut]="animationState" class="wz-dialog">
        <ng-content></ng-content>
      </div>
      <div class="wz-dialog-click-catcher"></div>
    </template>
    `
})

export class WzDialogComponent implements OnDestroy {
  @Input() config = new OverlayState();
  @Input() clickCatcher: boolean = true;
  public viewRef: any;
  public animationState: string = 'hidden';
  @ViewChild(WzDialogPortalDirective) private portal: WzDialogPortalDirective;
  private overlayRef: OverlayRef = null;

  constructor(
    private overlay: Overlay,
    private renderer: Renderer) {
    this.config.positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .fixed()
      .top('12%');
      // .centerVertically();
  }

  ngOnDestroy(): any {
    return this.close();
  }

  public show(): Promise<WzDialogComponent> {
    this.animationState = 'in';
    return this.close()
      .then(() => this.overlay.create(this.config))
      .then((ref: OverlayRef) => {
        this.overlayRef = ref;
        return ref.attach(this.portal);
      })
      .then(() => {
        if (this.clickCatcher) setTimeout(() => this.closeListener(), 500);
        this.renderer.setElementClass(document.querySelector('div.md-overlay-container'), 'active', true);
        return this;
      });
  }

   public close(): Promise<any> {
    if (!this.overlayRef) {
      return Promise.resolve<any>(this);
    }
    return Promise.resolve()
      .then(() => this.overlayRef.detach())
      .then(() => {
        this.overlayRef.dispose();
        this.overlayRef = null;
        this.renderer.setElementClass(document.querySelector('div.md-overlay-container'), 'active', false);
        if (this.clickCatcher) this.viewRef();
        return this;
      });
  }

  private closeListener() {
    this.viewRef = this.renderer.listen(document.querySelector('div.wz-dialog-click-catcher'), 'click', () => this.close());
  }
}
