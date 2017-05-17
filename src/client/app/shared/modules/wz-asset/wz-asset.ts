import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Collection } from '../../interfaces/collection.interface';
import { Asset } from '../../interfaces/common.interface';
import { Capabilities } from '../../services/capabilities.service';
import { Frame, TimecodeFormat } from 'wazee-frame-formatter';
import { AssetService } from '../../../shared/services/asset.service';
import { EnhancedAsset } from '../../../shared/interfaces/enhanced-asset';

export class WzAsset {
  public currentCollection: Collection;
  @Output() onAddToCollection = new EventEmitter();
  @Output() onRemoveFromCollection = new EventEmitter();
  @Output() onAddToCart = new EventEmitter();
  @Output() onDownloadComp = new EventEmitter();
  @Output() onShowSpeedview = new EventEmitter();
  @Output() onHideSpeedview = new EventEmitter();
  @Output() onEditAsset = new EventEmitter();
  @Input() public set assets(assets: Asset[]) {
    this._assets = assets;
    for (const asset of assets) {
      this.enhancedAssets[asset.assetId] = this.assetService.enhance(asset);
    }
  }
  @Input() public userCan: Capabilities;
  @Input() public assetType: string = 'search';
  @Input() public set collection(value: Collection) {
    this.currentCollection = value;
    this.assetIdsInCurrentCollection = value.assets.items.map((x) => x.assetId);
  };

  public assetId: number;
  public hasComp: boolean;
  private _assets: Asset[];
  private assetIdsInCurrentCollection: number[] = [];
  private enhancedAssets: { [assetId: string]: EnhancedAsset } = {};

  constructor(private assetService: AssetService) { }

  public get assets(): Asset[] {
    return this._assets;
  }

  public addToCollection(collection: Collection, asset: Asset) {
    this.onAddToCollection.emit({
      'collection': collection, 'asset': asset
    });
  }

  public removeFromCollection(collection: Collection, asset: Asset) {
    this.onRemoveFromCollection.emit({
      'collection': collection, 'asset': asset
    });
  }

  public addAssetToCart(asset: Asset) {
    this.setAssetActiveId(asset);
    this.onAddToCart.emit(asset);
  }

  public setAssetActiveId(asset: Asset) {
    this.assetId = asset.assetId;
    this.hasComp = asset.hasDownloadableComp;
  }

  public downloadComp(compType: string) {
    this.onDownloadComp.emit({
      'assetId': this.assetId, 'compType': compType
    });
  }

  public editAsset(asset: Asset) {
    this.onEditAsset.emit(asset);
  }

  public inCollection(asset: any): boolean {
    return this.assetIdsInCurrentCollection.indexOf(asset.assetId) > -1;
  }

  public nameOf(asset: Asset): string {
    return this.enhancedAssetFor(asset).name;
  }

  public routerLinkFor(asset: Asset): any[] {
    return ['/asset/', asset.assetId, this.routerParametersFor(this.enhancedAssetFor(asset))];
  }

  public hasThumbnail(asset: Asset): boolean {
    return !!this.thumbnailUrlFor(asset);
  }

  public thumbnailUrlFor(asset: Asset): string {
    return this.enhancedAssetFor(asset).thumbnailUrl;
  }

  public hasTitle(asset: Asset): boolean {
    return !!this.titleOf(asset);
  }

  public titleOf(asset: Asset): string {
    return this.enhancedAssetFor(asset).title;
  }

  public hasFormatType(asset: Asset): boolean {
    return !!this.formatTypeOf(asset);
  }

  public formatTypeOf(asset: Asset): string {
    return this.enhancedAssetFor(asset).formatType;
  }

  public formatClassNameFor(asset: Asset): string {
    switch (this.formatTypeOf(asset)) {
      case 'High Definition': return 'hd';
      case 'Standard Definition': return 'sd';
      case 'Digital Video': return 'dv';
      default: return 'hd';
    }
  }

  public hasDuration(asset: Asset): boolean {
    return !!this.subclipDurationFrameFor(asset);
  }

  public subclipDurationFrameFor(asset: Asset): Frame {
    return this.enhancedAssetFor(asset).subclipDurationFrame;
  }

  public isImage(asset: Asset): boolean {
    return this.enhancedAssetFor(asset).isImage;
  }

  public isSubclipped(asset: Asset): boolean {
    return this.enhancedAssetFor(asset).isSubclipped;
  }

  public subclipSegmentStylesFor(asset: Asset): object {
    const enhancedAsset: EnhancedAsset = this.enhancedAssetFor(asset);

    return {
      'margin-left.%': enhancedAsset.inMarkerPercentage,
      'width.%': enhancedAsset.subclipDurationPercentage,
      'min-width.px': 2
    };
  }

  public hasDescription(asset: Asset): boolean {
    return !!this.descriptionOf(asset);
  }

  public descriptionOf(asset: Asset): string {
    return this.enhancedAssetFor(asset).description;
  }

  public inMarkerFrameFor(asset: Asset): Frame {
    return this.enhancedAssetFor(asset).inMarkerFrame;
  }

  public outMarkerFrameFor(asset: Asset): Frame {
    return this.enhancedAssetFor(asset).outMarkerFrame;
  }

  private enhancedAssetFor(asset: Asset): EnhancedAsset {
    return this.enhancedAssets[asset.assetId];
  }

  private routerParametersFor(enhancedAsset: EnhancedAsset): object {
    return Object.assign({},
      enhancedAsset.uuid ? { uuid: enhancedAsset.uuid } : null,
      enhancedAsset.timeStart ? { timeStart: enhancedAsset.timeStart } : null,
      enhancedAsset.timeEnd ? { timeEnd: enhancedAsset.timeEnd } : null
    );
  }
}
