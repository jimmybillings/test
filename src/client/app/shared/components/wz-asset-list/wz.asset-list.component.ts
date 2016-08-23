import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Collection } from '../../../shared/interfaces/collection.interface';

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
  @Input() public currentUser: any;
  @Input() collection: Collection;
  @Output() onAddToCollection = new EventEmitter();
  @Output() onRemoveFromCollection = new EventEmitter();
  @Output() onAddToCart = new EventEmitter();
  @Output() onDownloadComp = new EventEmitter();
  @Output() onShowNewCollection = new EventEmitter();
  private assetsArr: Array<number>;

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
    this.onRemoveFromCollection.emit({'collection':collection, 'asset':asset});
  }

  public showNewCollection(asset: any): void {
    this.onShowNewCollection.emit(asset);
  }

  public addToCart(asset: any): void {
    this.onAddToCart.emit(asset);
  }

  public downloadComp(asset: any): void {
    this.onDownloadComp.emit(asset);
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
