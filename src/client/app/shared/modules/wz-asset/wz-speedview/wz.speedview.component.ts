import { Component, Directive, Input, ViewChild, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { OverlayState, OverlayRef, Overlay, GlobalPositionStrategy, TemplatePortalDirective } from '@angular/material';
import { Coords } from '../../../interfaces/common.interface';
import { SpeedviewData } from '../../../interfaces/asset.interface';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'wz-speedview',
  templateUrl: 'wz.speedview.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzSpeedviewComponent implements OnDestroy {
  public speedviewAssetInfo: SpeedviewData;
  public previewUrl: string;
  private config: OverlayState = new OverlayState();
  private overlayRef: OverlayRef = null;
  @ViewChild('wzSpeedviewTemplate') private componentPortal: TemplatePortalDirective;

  constructor(private overlay: Overlay) { }

  ngOnDestroy() {
    this.destroy();
  }

  public show(position: Coords): Promise<WzSpeedviewComponent> {
    this.config.positionStrategy = this.positionStrategy(position);
    return this.destroy()
      .then(() => {
        return this.overlay.create(this.config);
      }).then((overlayRef: OverlayRef) => {
        this.overlayRef = overlayRef;
        this.overlayRef.attach(this.componentPortal);
      }).then(() => {
        return this;
      });
  }

  public destroy(): Promise<WzSpeedviewComponent> {
    if (!this.overlayRef) {
      return Promise.resolve(this);
    } else {
      return Promise.resolve()
        .then(() => {
          return this.overlayRef.detach();
        })
        .then(() => {
          this.overlayRef.dispose();
          this.overlayRef = null;
          return this;
        });
    }
  }

  public translationReady(field: string) {
    return 'assetmetadata.' + field.replace(/\./g, '_');
  }

  private positionStrategy(coordinates: Coords): GlobalPositionStrategy {
    return this.overlay
      .position()
      .global()
      .top(`${coordinates.y}px`)
      .left(`${coordinates.x}px`);
  }
}
