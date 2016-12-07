import {
  Component,
  OnDestroy,
  Directive,
  ViewContainerRef,
  TemplateRef,
  ViewEncapsulation,
  Input,
  ViewChild,
  Renderer
} from '@angular/core';
import { TemplatePortalDirective, OverlayState, OverlayRef, Overlay } from '@angular/material';

@Directive({ selector: '[wzSpeedviewPortal]' })
export class WzSpeedviewPortalDirective extends TemplatePortalDirective {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'wz-speedview',
  template: `<template wzSpeedviewPortal>
              <ng-content></ng-content>
             </template>`
})
export class WzSpeedviewComponent implements OnDestroy {
  public offsetX: number;
  public offsetY: number;
  public viewRef: any;
  @Input() config = new OverlayState();
  @ViewChild(WzSpeedviewPortalDirective) private portal: WzSpeedviewPortalDirective;
  private overlayRef: OverlayRef = null;

  constructor(private overlay: Overlay, private renderer: Renderer) { }

  ngOnDestroy(): any {
    return this.destroy();
  }

  public show(coordinates: any): Promise<WzSpeedviewComponent> {
    this.config.positionStrategy = this.overlay.position()
      .global()
      .fixed()
      .top(`${coordinates.y}px`)
      .left(`${coordinates.x}px`);
    return this.destroy()
      .then(() => this.overlay.create(this.config))
      .then((ref: OverlayRef) => {
        this.overlayRef = ref;
        return ref.attach(this.portal);
      })
      .then(() => {
        return this;
      });
  }

  public destroy(): Promise<any> {
    if (!this.overlayRef) {
      return Promise.resolve<any>(this);
    }
    return Promise.resolve()
      .then(() => this.overlayRef.detach())
      .then(() => {
        this.overlayRef.dispose();
        this.overlayRef = null;
        return this;
      });
  }
} 