import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, ViewChild } from '@angular/core';
import { Collection } from '../../../shared/interfaces/collection.interface';
import { CurrentUser } from '../../../shared/services/current-user.model';
import { MdMenuTrigger } from '@angular/material';
import { WzSpeedviewComponent } from '../../../shared/components/wz-speedview/wz-speedview.component';
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
  @Input() currentUser: CurrentUser;
  @Output() onAddToCollection = new EventEmitter();
  @Output() onRemoveFromCollection = new EventEmitter();
  @Output() addToCart = new EventEmitter();
  @Output() onDownloadComp = new EventEmitter();
  @Output() onShowNewCollection = new EventEmitter();
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
  @ViewChild(WzSpeedviewComponent) wzSpeedview: WzSpeedviewComponent;
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

  public showPreview(position: any): void {
    this.wzSpeedview.show(position);
  }

  public hidePreview(): void {
    this.wzSpeedview.destroy();
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
