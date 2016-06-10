import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import { Collection } from '../../../shared/interfaces/collection.interface';

/**
 * Directive that renders a list of assets
 */
@Component({
  moduleId: module.id,
  selector: 'asset-list',
  templateUrl: 'asset-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetListComponent {
  @Input() public assets: Array<any>;
  @Input() public currentUser: any;
  @Input() collection: Collection;
  @Output() onShowAsset = new EventEmitter();
  @Output() onAddToCollection = new EventEmitter();
  @Output() onAddToCart = new EventEmitter();
  @Output() onDownloadComp = new EventEmitter();
  @Output() onShowNewCollection = new EventEmitter();

  showAsset(asset: any): void {
    this.onShowAsset.emit(asset);
  }
  addToCollection(collection: Collection, assetId: any): void {
    // let params = {'collection':collection, 'assetId':assetId};
    // this.onAddToCollection.emit(params);
    // console.log(collection);
    // console.log(assetId);
    this.onAddToCollection.emit({'collection':collection, 'assetId':assetId});
  }
  showNewCollection(asset: any): void {
    this.onShowNewCollection.emit(asset);
  }
  addToCart(asset: any): void {
    this.onAddToCart.emit(asset);
  }
  downloadComp(asset: any): void {
    this.onDownloadComp.emit(asset);
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
