import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Collection } from '../../interfaces/collection.interface';
import { Asset } from '../../interfaces/asset.interface';
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

  private assetsArr: Array<number> = [];
  private assetId: number;
  private hasComp: boolean;

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
    // console.log(asset);
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
}
