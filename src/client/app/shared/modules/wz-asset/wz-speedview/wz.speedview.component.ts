import { Component, Directive, Input, ViewChild, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { OverlayState, OverlayRef, Overlay, GlobalPositionStrategy, ComponentPortal } from '@angular/material';
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
  private overlayRef: OverlayRef = null;
  @ViewChild('wzSpeedviewTemplate') private componentPortal: ComponentPortal<WzSpeedviewComponent>;

  constructor(private overlay: Overlay) { }

  ngOnDestroy() {
    this.destroy();
  }

  public show(position: Coords): void {
    let config: any = new OverlayState();
    config.positionStrategy = this.positionStrategy(position);
    this.overlayRef = this.overlay.create(config);
    this.overlayRef.attach(this.componentPortal);
  }

  public destroy(): void {
    if (this.overlayRef) this.overlayRef.detach();
  }

  public translationReady(field: any) {
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
