import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SpeedviewData } from '../../../interfaces/asset.interface';
import {
  style,
  trigger,
  state,
  transition,
  animate,
  AnimationEvent,
} from '@angular/animations';

export type SpeedPreviewVisibility = 'initial' | 'visible' | 'hidden';

@Component({
  moduleId: module.id,
  selector: 'wz-speedview',
  templateUrl: 'wz.speedview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('state', [
      state('hidden', style({
        opacity: '0',
        transform: 'scale(0)'
      })),
      state('visible', style({
        opacity: '1',
        transform: 'scale(1)'
      })),
      transition('hidden => visible', animate('250ms cubic-bezier(0.0, 0.0, 0.2, 1)')),
      transition('visible => hidden', animate('250ms cubic-bezier(0.4, 0.0, 1, 1)'))
    ])
  ],
})

export class WzSpeedviewComponent {
  public speedviewAssetInfo: SpeedviewData = { values: [], url: '', pricingType: '', price: 0, imageQuickView: false };
  public previewUrl: string;
  public visibility: SpeedPreviewVisibility = 'hidden';


  constructor(private detector: ChangeDetectorRef) { }

  public translationReady(field: string) {
    return 'assetmetadata.' + field.replace(/\./g, '_');
  }

  public setSpeedviewAssetInfo(data: any) {
    this.speedviewAssetInfo = Object.assign(this.speedviewAssetInfo, data);
    this.detector.markForCheck();
  }

  public setSpeedViewPostUrl(posterUrl: string) {
    this.speedviewAssetInfo.posterUrl = posterUrl;
    this.detector.markForCheck();
  }

  public show() {
    setTimeout(() => {
      this.visibility = 'visible';
      this.detector.markForCheck();
    }, 300);
  }

}
