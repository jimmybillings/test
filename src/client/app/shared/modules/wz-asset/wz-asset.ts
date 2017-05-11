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

export class WzAsset {
  public currentCollection: Collection;
  @Output() onAddToCollection = new EventEmitter();
  @Output() onRemoveFromCollection = new EventEmitter();
  @Output() onAddToCart = new EventEmitter();
  @Output() onDownloadComp = new EventEmitter();
  @Output() onShowSpeedview = new EventEmitter();
  @Output() onHideSpeedview = new EventEmitter();
  @Output() onEditAsset = new EventEmitter();
  @Input() public assets: Array<Asset>;
  @Input() public userCan: Capabilities;
  @Input() public assetType: string = 'search';
  @Input() set collection(value: Collection) {
    this.currentCollection = value;
    this.assetsArr = value.assets.items.map((x) => x.assetId);
  };

  public assetId: number;
  public hasComp: boolean;
  private assetsArr: Array<number> = [];

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
    return this.assetsArr.indexOf(asset.assetId) > -1;
  }

  public assetParams(asset: any) {
    return Object.assign({},
      asset.uuid ? { uuid: asset.uuid } : null,
      asset.timeStart ? { timeStart: asset.timeStart } : null,
      asset.timeEnd ? { timeEnd: asset.timeEnd } : null
    );
  }

  public frame(framesPerSecond: any, frameNumber: any) {
    return new Frame(framesPerSecond.split(' fps')[0]).setFromFrameNumber(frameNumber);
  }

  public durationAsFrames(framesPerSecond: any, duration: any) {
    return new Frame(
      framesPerSecond.split(' fps')[0])
      .setFromString(`${duration};00`, TimecodeFormat.SIMPLE_TIME_CONVERSION)
      .asFrameNumber();
  }
  public calcSegmentWidthPecentage(startFrame: number, totalFrames: number) {
    return startFrame * 100 / totalFrames;
  }

  public calcSubClipSegments(asset: any) {
    let totalFrames: number = this.durationAsFrames(asset.metaData[6].value, asset.metaData[3].value);
    let startPoint: number = this.calcSegmentWidthPecentage(asset.timeStart, totalFrames);
    let segmentWidth: number = this.calcSegmentWidthPecentage(asset.timeEnd - asset.timeStart, totalFrames);
    return { 'width.%': segmentWidth, 'margin-left.%': startPoint, 'min-width.px': 2 };
  }

  public formatType(format: string): string {
    switch (format) {
      case 'High Definition':
        return 'hd';
      case 'Standard Definition':
        return 'sd';
      case 'Digital Video':
        return 'dv';
      default:
        return 'hd';
    }
  }

  public nameOf(asset: Asset): string {
    return asset.name;
  }

  public routerLinkFor(asset: Asset): any[] {
    return ['/asset/', asset.assetId, this.assetParams(asset)];
  }

  public hasThumbnail(asset: Asset): boolean {
    return !!asset.thumbnail;
  }

  public thumbnailUrlFor(asset: Asset): string {
    return this.hasThumbnail(asset) ? asset.thumbnail.urls.https : '';
  }

  public hasTitle(asset: Asset): boolean {
    return !!asset.metaData[0];
  }

  public titleOf(asset: Asset): string {
    return asset.metaData[0].value;
  }

  public hasFormatType(asset: Asset): boolean {
    return asset.metaData[2] && asset.metaData[2].value != '';
  }

  public formatTypeOf(asset: Asset): string {
    return asset.metaData[2].value;
  }

  public formatClassNameFor(asset: Asset): string {
    return this.formatType(asset.metaData[2].value);
  }

  public hasFullDuration(asset: Asset): boolean {
    return !asset.timeStart && !!asset.metaData[3];
  }

  public fullDurationOf(asset: Asset): string {
    return asset.metaData[3].value;
  }

  public hasSubclipDuration(asset: Asset): boolean {
    return !!asset.timeStart;
  }

  public subclipDurationFrameFor(asset: Asset): Frame {
    return this.frame(asset.metaData[6].value, asset.timeEnd - asset.timeStart);
  }

  public isImage(asset: Asset): boolean {
    return asset.metaData[4] && asset.metaData[4].name === 'Resource.Class' && asset.metaData[4].value === 'Image';
  }

  public isSubclipped(asset: Asset): boolean {
    return !!asset.timeStart;
  }

  public hasDescription(asset: Asset): boolean {
    return !!asset.metaData[1];
  }

  public descriptionOf(asset: Asset): string {
    return asset.metaData[1].value;
  }
}
