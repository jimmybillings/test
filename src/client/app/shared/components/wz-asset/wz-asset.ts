import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  ViewChild,
  Renderer
} from '@angular/core';
import { Collection } from '../../interfaces/collection.interface';
import { MdMenuTrigger } from '@angular/material';


export class WzAsset {
  public currentCollection: Collection;
  @Output() onAddToCollection = new EventEmitter();
  @Output() onRemoveFromCollection = new EventEmitter();
  @Output() addToCart = new EventEmitter();
  @Output() onDownloadComp = new EventEmitter();
  @Output() showSpeedview = new EventEmitter();
  @Output() hideSpeedview = new EventEmitter();
  @Output() onShowSnackBar = new EventEmitter();
  @Input() public assets: Array<any>;
  @Input() public userCan: any;
  @Input()
  set collection(value: Collection) {
    this.currentCollection = value;
    this.assetsArr = this.currentCollection.assets.items.map(function (x) { return x.assetId; });
  };
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;

  private assetsArr: Array<number> = [];
  private assetId: any;
  private hasComp: any;

  public addToCollection(collection: Collection, asset: any): void {
    this.onAddToCollection.emit({ 'collection': collection, 'asset': asset });
  }

  public removeFromCollection(collection: Collection, asset: any): void {
    this.onRemoveFromCollection.emit({ 'collection': collection, 'asset': asset });
    this.onShowSnackBar.emit(
      {
        key: 'COLLECTION.REMOVE_FROM_COLLECTION_TOAST',
        value: { collectionName: this.currentCollection.name }
      }
    );
  }

  public addAssetToCart(asset: any): void {
    this.setAssetActiveId(asset);
    this.addToCart.emit(asset.assetId);
  }

  public setAssetActiveId(asset: any) {
    this.assetId = asset.assetId;
    this.hasComp = asset.hasDownloadableComp;
  }

  public downloadComp(compType: any): void {
    this.onDownloadComp.emit({ 'assetId': this.assetId, 'compType': compType });
  }

  public alreadyInCollection(asset: any): boolean {
    return this.assetsArr.indexOf(asset.assetId) > -1;
  }

  public formatType(format: any): string {
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
