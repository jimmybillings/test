import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Frame, TimecodeFormat } from 'wazee-frame-formatter';

@Component({
  moduleId: module.id,
  selector: 'asset-thumbnail-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a [routerLink]="['/asset', asset.assetId, assetParams(asset)]">
      <div class="cart-asset-thb">
          <span *ngIf="isNotSubclipped" class="asset-duration">
            <span>{{ fullTimecode | timecode }}</span>
          </span>
          <span *ngIf="isSubclipped" class="asset-duration">
            <span>{{ subclipTimecode | timecode }}</span>
          </span>
          <span
            *ngIf="isImage" class="indicate-photo">
            <span class="{{ asset.metadata[6].value | lowercase }}"></span>
          </span>
          <img src="{{ asset.thumbnailUrl }}"/>
      </div>
    </a>
  `
})
export class AssetThumbnailComponent {
  @Input() asset: any;

  public get isNotSubclipped(): boolean {
    return this.asset.timeStart === -2 && this.asset.metadata[2].value;
  }

  public get isSubclipped(): boolean {
    return this.asset.timeStart !== -2;
  }

  public get isImage(): boolean {
    return this.asset.metadata[6] &&
      this.asset.metadata[6].name === 'Resource.Class' &&
      this.asset.metadata[6].value === 'Image';
  }

  public get fullTimecode(): Frame {
    return this.frame(
      this.asset.metadata[2].value,
      this.durationAsFrames(this.asset.metadata[2].value, this.asset.metadata[5].value / 1000.0)
    );
  }

  public get subclipTimecode(): Frame {
    return this.frame(
      this.asset.metadata[2].value,
      this.asset.timeEnd - this.asset.timeStart
    );
  }

  public assetParams(asset: any): any {
    return Object.assign({},
      asset.uuid ? { uuid: asset.uuid } : null,
      asset.timeStart && asset.timeStart >= 0 ? { timeStart: asset.timeStart } : null,
      asset.timeEnd && asset.timeEnd >= 0 ? { timeEnd: asset.timeEnd } : null
    );
  }

  public durationAsFrames(framesPerSecond: any, duration: any): number {
    return new Frame(
      framesPerSecond.split(' fps')[0])
      .setFromString(`${duration};00`, TimecodeFormat.SIMPLE_TIME_CONVERSION)
      .asFrameNumber();
  }

  public frame(framesPerSecond: any, frameNumber: number): Frame {
    return new Frame(framesPerSecond.split(' fps')[0]).setFromFrameNumber(frameNumber);
  }
}
