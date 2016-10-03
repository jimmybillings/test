import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, ViewChild } from '@angular/core';
import { Collection } from '../../../shared/interfaces/collection.interface';
import { MdMenuTrigger } from '@angular2-material/menu';
/**
 * Directive that renders a list of assets
 */
@Component({
  moduleId: module.id,
  selector: 'wz-asset-list',
  templateUrl: 'wz.asset-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzAssetListComponent implements OnChanges {
  @Input() public assets: Array<any>;
  @Input() public userCan: any;
  @Input() collection: Collection;
  @Output() onAddToCollection = new EventEmitter();
  @Output() onRemoveFromCollection = new EventEmitter();
  @Output() addToCart = new EventEmitter();
  @Output() onDownloadComp = new EventEmitter();
  @Output() onShowNewCollection = new EventEmitter();
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
  private assetsArr: Array<number>;
  private assetId: any;
  private hasComp: any;

  constructor() {
    this.assetsArr = [];
  }

  ngOnChanges(changes: any) {
    if (changes.collection && changes.collection.currentValue) {
      this.assetsArr = this.collection.assets.items.map(function (x) { return x.assetId; });
    }
  }

  public addToCollection(collection: Collection, asset: any): void {
    this.onAddToCollection.emit({ 'collection': collection, 'asset': asset });
  }

  public removeFromCollection(collection: Collection, asset: any): void {
    this.onRemoveFromCollection.emit({ 'collection': collection, 'asset': asset });
  }

  public showNewCollection(asset: any): void {
    this.onShowNewCollection.emit(asset);
  }

  public addAssetToCart(asset: any): void {
    this.setAssetActiveId(asset.assetId);
    this.addToCart.emit(asset);
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
