import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Collection } from '../../../shared/interfaces/collection.interface';
import { WzToastComponent } from '../../../shared/components/wz-toast/wz.toast.component';

/**
 * Directive that renders a list of assets
 */
@Component({
  moduleId: module.id,
  selector: 'wz-asset-list',
  templateUrl: 'wz.asset-list.html',
  directives: [WzToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzAssetListComponent {
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
    sessionStorage.setItem('assetForNewCollection', JSON.stringify(asset));
  }
  addToCollection(collection: Collection, asset: any): void {
    this.onAddToCollection.emit({'collection':collection, 'asset':asset});
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
