import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Frame, TimecodeFormat } from 'wazee-frame-formatter';
import { Asset } from '../../../shared/interfaces/commerce.interface';
import { EnhancedAsset } from '../../../shared/interfaces/enhanced-asset';
import { AssetService } from '../../../shared/services/asset.service';

@Component({
  moduleId: module.id,
  selector: 'asset-subclip-display-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isSubclipped" class="asset-sub-clip md-caption">
      <strong>{{ 'COLLECTION.SHOW.SUB_CLIPPING_LABEL' | translate }}</strong>
      <div class="subclip-timeline">
        <span class="subclip-segment" [ngStyle]="subclipSegmentStyles"></span>
      </div>
      <ul class="subclip-data" layout="row" hide-sm>
        <li flex-gt-sm="30" flex-gt-md="25" flex="35">
          <strong>{{ 'COLLECTION.SHOW.START_TIME_LABEL' | translate }}</strong>
          {{ inMarkerFrame | timecode }}
        </li>
        <li flex="none">
          <strong>{{ 'COLLECTION.SHOW.END_TIME_LABEL' | translate }} </strong>
          {{ outMarkerFrame | timecode }}
        </li>
        <li flex="" layout-align="end center">
          <strong>{{ 'COLLECTION.SHOW.SUB_CLIP_LENGTH_LABEL' | translate }}</strong>
          {{ subclipDurationFrame | timecode }}
        </li>
      </ul>
    </div>
  `
})
export class AssetSubclipDisplayComponent {
  private enhancedAsset: EnhancedAsset;

  constructor(private assetService: AssetService) { }

  @Input() public set asset(asset: Asset) {
    this.enhancedAsset = this.assetService.enhance(asset);
  }

  public get isSubclipped(): boolean {
    return this.enhancedAsset.timeStart !== -2;
  }

  public get inMarkerFrame(): Frame {
    return this.frame(this.enhancedAsset.metadata[2].value, this.enhancedAsset.timeStart - 0);
  }

  public get outMarkerFrame(): Frame {
    return this.frame(this.enhancedAsset.metadata[2].value, this.enhancedAsset.timeEnd - 0);
  }

  public get subclipDurationFrame(): Frame {
    return this.frame(this.enhancedAsset.metadata[2].value, this.enhancedAsset.timeEnd - this.enhancedAsset.timeStart);
  }

  public frame(framesPerSecond: any, frameNumber: any) {
    return new Frame(framesPerSecond.split(' fps')[0]).setFromFrameNumber(frameNumber);
  }

  public get subclipSegmentStyles(): object {
    let lengthAsSeconds: number = parseInt(this.enhancedAsset.metadata[5].value) / 1000.0;
    let totalFrames: number = this.durationAsFrames(this.enhancedAsset.metadata[2].value, lengthAsSeconds);
    let startPoint: number = this.calcSegmentWidthPecentage(this.enhancedAsset.timeStart, totalFrames);
    let segmentWidth: number = this.calcSegmentWidthPecentage(this.enhancedAsset.timeEnd - this.enhancedAsset.timeStart, totalFrames);
    return { 'width.%': segmentWidth, 'margin-left.%': startPoint, 'min-width.px': 2 };
  }

  private durationAsFrames(framesPerSecond: any, duration: any) {
    return new Frame(
      framesPerSecond.split(' fps')[0])
      .setFromString(`${duration};00`, TimecodeFormat.SIMPLE_TIME_CONVERSION)
      .asFrameNumber();
  }

  private calcSegmentWidthPecentage(startFrame: number, totalFrames: number) {
    return startFrame * 100 / totalFrames;
  }
}
