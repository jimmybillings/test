import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Frame } from 'wazee-frame-formatter';
import { Asset, Metadatum } from '../../../shared/interfaces/commerce.interface';

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
  @Input() public set asset(asset: Asset) {
    this._asset = asset;

    this.resourceClass = this.getMetadataAtIndex(6, 'Resource.Class');
    this.framesPerSecond = parseFloat(this.getMetadataAtIndex(2, 'Format.FrameRate'));
    this.durationInMilliseconds = parseFloat(this.getMetadataAtIndex(5, 'Format.Duration'));
  }

  private _asset: Asset = {};
  private framesPerSecond: number = undefined;
  private resourceClass: string = '';
  private durationInMilliseconds: number = undefined;

  public get asset(): Asset {
    return this._asset;
  }

  public get routerLink(): any[] {
    return ['/asset', this._asset.assetId, this.routerParameters];
  }

  public get durationAsFrame(): Frame {
    if (!this.framesPerSecond) return undefined;

    return this.isSubclipped ? this.subclipDurationAsFrame : this.assetDurationAsFrame;
  }

  public get isImage(): boolean {
    return this.resourceClass === 'Image';
  }

  public get thumbnailUrl(): string {
    return this._asset.thumbnailUrl;
  }

  private getMetadataAtIndex(index: number, expectedName: string): string {
    if (!this._asset.metadata) return '';

    const metadatum: Metadatum = this._asset.metadata[index];

    return metadatum && metadatum.name === expectedName ? metadatum.value : '';
  }

  private get isSubclipped(): boolean {
    return this._asset.timeStart !== -2;
  }

  private get assetDurationAsFrame(): Frame {
    if (!this.durationInMilliseconds) return undefined;

    return new Frame(this.framesPerSecond).setFromSeconds(this.durationInMilliseconds / 1000.0);
  }

  private get subclipDurationAsFrame(): Frame {
    if (!this._asset.timeEnd) return undefined;

    return new Frame(this.framesPerSecond).setFromFrameNumber(this._asset.timeEnd - this._asset.timeStart)
  }

  private get routerParameters(): any {
    return Object.assign({},
      this._asset.uuid ? { uuid: this._asset.uuid } : null,
      this._asset.timeStart >= 0 ? { timeStart: this._asset.timeStart } : null,
      this._asset.timeEnd >= 0 ? { timeEnd: this._asset.timeEnd } : null
    );
  }
}
