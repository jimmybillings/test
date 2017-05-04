import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Frame, TimecodeFormat } from 'wazee-frame-formatter';
import { Asset } from '../../../shared/interfaces/commerce.interface';

@Component({
  moduleId: module.id,
  selector: 'asset-thumbnail-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a [routerLink]="routerLink">
      <div class="cart-asset-thb">
        <span class="asset-duration">
          <span>{{ durationAsFrame | timecode }}</span>
        </span>
        <span *ngIf="isImage" class="indicate-photo">
          <span class="image"></span>
        </span>
        <img src="{{ thumbnailUrl }}"/>
      </div>
    </a>
  `
})
export class AssetThumbnailComponent {
  @Input() asset: any;

  public get routerLink(): any[] {
    return ['/asset', this.asset.assetId, this.assetParams(this.asset)];
  }

  public get durationAsFrame(): Frame {
    if (this.isSubclipped) return this.subclipTimecode;
    if (this.isNotSubclipped) return this.fullTimecode;

    return undefined;
  }

  public get isImage(): boolean {
    return this.asset.metadata[6] &&
      this.asset.metadata[6].name === 'Resource.Class' &&
      this.asset.metadata[6].value === 'Image';
  }

  public get thumbnailUrl(): string {
    return this.asset.thumbnailUrl;
  }

  private get isNotSubclipped(): boolean {
    return this.asset.timeStart === -2 && this.asset.metadata[2].value;
  }

  private get isSubclipped(): boolean {
    return this.asset.timeStart !== -2;
  }

  private get fullTimecode(): Frame {
    return this.frame(
      this.asset.metadata[2].value,
      this.durationAsFrames(this.asset.metadata[2].value, this.asset.metadata[5].value / 1000.0)
    );
  }

  private get subclipTimecode(): Frame {
    return this.frame(
      this.asset.metadata[2].value,
      this.asset.timeEnd - this.asset.timeStart
    );
  }

  private assetParams(asset: any): any {
    return Object.assign({},
      asset.uuid ? { uuid: asset.uuid } : null,
      asset.timeStart && asset.timeStart >= 0 ? { timeStart: asset.timeStart } : null,
      asset.timeEnd && asset.timeEnd >= 0 ? { timeEnd: asset.timeEnd } : null
    );
  }

  private durationAsFrames(framesPerSecond: any, duration: any): number {
    return new Frame(
      framesPerSecond.split(' fps')[0])
      .setFromString(`${duration};00`, TimecodeFormat.SIMPLE_TIME_CONVERSION)
      .asFrameNumber();
  }

  private frame(framesPerSecond: any, frameNumber: number): Frame {
    return new Frame(framesPerSecond.split(' fps')[0]).setFromFrameNumber(frameNumber);
  }
}
