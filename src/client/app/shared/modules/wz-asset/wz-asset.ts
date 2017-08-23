import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Collection } from '../../interfaces/collection.interface';
import { Asset } from '../../interfaces/common.interface';
import { Capabilities } from '../../services/capabilities.service';
import { Frame } from 'wazee-frame-formatter';
import { EnhancedAsset, enhanceAsset } from '../../../shared/interfaces/enhanced-asset';
import { AppStore } from '../../../app.store';
import { Metadatum } from '../../../shared/interfaces/commerce.interface';

export class WzAsset {
  @Output() onAddToCart = new EventEmitter();
  @Output() onDownloadComp = new EventEmitter();
  @Output() onShowSpeedview = new EventEmitter();
  @Output() onHideSpeedview = new EventEmitter();
  @Output() onEditAsset = new EventEmitter();

  @Input() public set assets(assets: Asset[]) {
    this._assets = [];

    for (const asset of (assets || [])) {
      const bestId: string | number = asset.uuid || asset.assetId;

      if (bestId) {
        this.enhancedAssets[bestId] = enhanceAsset(asset);
        this._assets.push(asset);
      }
    }
  }

  @Input() public userCan: Capabilities;
  @Input() public assetType: string = 'search';
  @Input() public set activeCollection(value: Collection) {
    this._activeCollection = value;
    this.assetIdsInActiveCollection = value.assets.items.map((x) => x.assetId);
  };

  public get activeCollection(): Collection {
    return this._activeCollection;
  }

  public assetId: number;
  public hasComp: boolean;
  private _assets: Asset[];
  private assetIdsInActiveCollection: number[] = [];
  private enhancedAssets: { [lookupId: string]: EnhancedAsset } = {};
  private _activeCollection: Collection;

  constructor(private store: AppStore) { }

  public get assets(): Asset[] {
    return this._assets;
  }

  public addToActiveCollection(asset: Asset) {
    this.store.dispatch(factory => factory.activeCollection.addAsset(asset));
  }

  public removeFromActiveCollection(asset: Asset) {
    this.store.dispatch(factory => factory.activeCollection.removeAsset(asset));
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
    return this.assetIdsInActiveCollection.indexOf(asset.assetId) > -1;
  }

  public nameOf(asset: Asset): string {
    return this.enhancedAssetFor(asset).name;
  }

  public routerLinkFor(asset: Asset): any[] {
    return this.enhancedAssetFor(asset).routerLink;
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

  public canBePurchased(asset: Asset): boolean {
    const rights: Metadatum = asset.metaData.find((metadatum: Metadatum) => metadatum.name === 'Rights.Reproduction');
    if (!rights) return false;
    return ['Rights Managed', 'Royalty Free'].includes(rights.value);
  }

  public commentCountFor(asset: Asset): Observable<number> {
    return this.store.select(factory => factory.comment.counts[asset.uuid]);
  }

  private enhancedAssetFor(asset: Asset): EnhancedAsset {
    return this.enhancedAssets[asset.uuid || asset.assetId];
  }
}
