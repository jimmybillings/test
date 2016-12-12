import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, ViewChild, Renderer } from '@angular/core';
import { Collection } from '../../interfaces/collection.interface';
import { CurrentUser } from '../../services/current-user.model';
import { MdMenuTrigger } from '@angular/material';
import { WzSpeedviewComponent } from '../wz-speedview/wz.speedview.component';
import { AssetService } from '../../services/asset.service';
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
  public activeAsset: any;
  @Input() public assets: Array<any>;
  @Input() public userCan: any;
  @Input() collection: Collection;
  @Input() currentUser: CurrentUser;
  @Input() assetService: AssetService;
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

  constructor(private renderer: Renderer) {
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
    this.renderer.listenGlobal('document', 'scroll', () => this.wzSpeedview.destroy());
  }

  public hidePreview(): void {
    this.wzSpeedview.destroy();
  }

  public setActiveAsset(asset: any): void {
    if (asset === this.activeAsset) return;
    this.activeAsset = asset;
    if (asset.price && asset.priceBookName) return;
    this.assetService.getPrice(asset.assetId).take(1).subscribe((data: any) => {
      asset.price = data.price;
      asset.priceBookName = data.priceBookName;
    });
  }

  public translationReady(field: any) {
    return 'assetmetadata.' + field.replace(/\./g, '_');
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
