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
    </template>
    <div class="wz-dialog-click-catcher" *ngIf="showClickCatcher" (click)="_emitCloseEvent()"></div>
    `
})

export class WzDialogComponent implements OnDestroy {
  @Input() config = new OverlayState();
  // public viewRef: any;
  public animationState: string = 'out';
  // public active: boolean = false;
  private showClickCatcher: boolean = false;
  @ViewChild(WzDialogPortalDirective) private portal: WzDialogPortalDirective;
  private overlayRef: OverlayRef = null;

  constructor(
    private overlay: Overlay,
    private renderer: Renderer) {
    this.config.positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .fixed()
      .top('9%');
  }

  ngOnDestroy(): any {
    return this.close();
  }

  public setClickCatcher(bool: boolean): void {
    this.showClickCatcher = bool;
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
        // setTimeout(() => this.closeListener(), 200);
        this.renderer.setElementClass(document.querySelector('div.md-overlay-container'), 'active', true);
        // this.active = true;
        this.setClickCatcher(true);
        return this;
      });
  }

  public close(): Promise<any> {
    // this.animationState = 'out';
    if (!this.overlayRef) {
      return Promise.resolve(this);
    } else {
      return Promise.resolve(() => {
        this.overlayRef.detach();
      }).then(() => {
        this.overlayRef.dispose();
        this.overlayRef = null;
        this.renderer.setElementClass(document.querySelector('div.md-overlay-container'), 'active', false);
        this.setClickCatcher(false);
        // this.viewRef();
      });
    }
  }
  // private closeListener() {
  // this.viewRef = this.renderer.listenGlobal('body', 'click', () => this.close());
  // }
}
