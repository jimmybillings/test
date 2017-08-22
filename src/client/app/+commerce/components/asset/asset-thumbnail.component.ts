import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { Frame } from 'wazee-frame-formatter';
import { Asset } from '../../../shared/interfaces/commerce.interface';
import { enhanceAsset, EnhancedAsset } from '../../../shared/interfaces/enhanced-asset';

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

  @Input() public set asset(asset: Asset) {
    this.enhancedAsset = enhanceAsset(asset);
  }

  public get routerLink(): any[] {
    return this.enhancedAsset.routerLink;
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
}
