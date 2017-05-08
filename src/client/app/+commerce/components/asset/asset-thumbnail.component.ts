import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Frame } from 'wazee-frame-formatter';
import { Asset } from '../../../shared/interfaces/commerce.interface';
import { EnhancedAsset } from '../../../shared/interfaces/enhanced-asset';
import { AssetService } from '../../../shared/services/asset.service';

@Component({
  moduleId: module.id,
  selector: 'asset-thumbnail-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a [routerLink]="routerLink">
      <div class="cart-asset-thb">
        <span class="asset-duration">
          <span>{{ durationFrame | timecode }}</span>
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
  private enhancedAsset: EnhancedAsset;

  constructor(private assetService: AssetService) { }

  @Input() public set asset(asset: Asset) {
    this.enhancedAsset = this.assetService.enhance(asset);
  }

  public get routerLink(): any[] {
    return ['/asset', this.enhancedAsset.assetId, this.routerParameters];
  }

  public get durationFrame(): Frame {
    return this.enhancedAsset.subclipDurationFrame;
  }

  public get isImage(): boolean {
    return this.enhancedAsset.isImage;
  }

  public get thumbnailUrl(): string {
    return this.enhancedAsset.thumbnailUrl;
  }

  private get routerParameters(): any {
    return Object.assign(
      {},
      this.enhancedAsset.uuid ? { uuid: this.enhancedAsset.uuid } : null,
      this.enhancedAsset.timeStart >= 0 ? { timeStart: this.enhancedAsset.timeStart } : null,
      this.enhancedAsset.timeEnd >= 0 ? { timeEnd: this.enhancedAsset.timeEnd } : null
    );
  }
}
