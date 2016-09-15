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
  ChangeDetectionStrategy} from '@angular/core';
import {Overlay} from '@angular2-material/core';
import {OverlayState} from '@angular2-material/core';
import {OverlayRef} from '@angular2-material/core';
import {Directive, ViewContainerRef, TemplateRef} from '@angular/core';
import {TemplatePortalDirective} from '@angular2-material/core';



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
      state('in', style({ marginTop: '0' })),
      state('void, out', style({ marginTop: '-260%' })),
      transition('void => *, out => in', [
        // style({ marginTop: '-240%' }),
        animate('400ms ease-in-out')
      ]),
      transition('in => void, * => void, in => out', [
        animate('600ms ease-in-out', style({ marginTop: '-260%' }))
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
  public animationState: string = 'out';
  @ViewChild(WzDialogPortalDirective) private portal: WzDialogPortalDirective;
  private overlayRef: OverlayRef = null;

  constructor(
    private overlay: Overlay,
    private renderer: Renderer) {
    this.config.positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();
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
