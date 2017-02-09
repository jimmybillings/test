import { Component, Output, EventEmitter, Input, OnChanges, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { UiConfig } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { Capabilities } from '../../shared/services/capabilities.service';
import { MdMenuTrigger } from '@angular/material';
import { SubclipMarkers } from '../../shared/interfaces/asset.interface';
import { SearchContext } from '../../shared/services/search-context.service';
import { Observable } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'asset-detail',
  templateUrl: 'asset-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetailComponent implements OnChanges {
  @Input() public asset: any;
  @Input() public currentUser: CurrentUserService;
  @Input() public userCan: Capabilities;
  @Input() public uiConfig: UiConfig;
  @Input() public collection: Collection;
  @Input() public searchContext: SearchContext;
  @Input() public usagePrice: Observable<any>;
  @Input() public window: Window;
  @Output() onAddToCollection = new EventEmitter();
  @Output() onRemoveFromCollection = new EventEmitter();
  @Output() onDownloadComp = new EventEmitter();
  @Output() addToCart = new EventEmitter();
  @Output() getPriceAttributes = new EventEmitter();
  @Output() onShowSnackBar = new EventEmitter();
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
  public selectedTarget: string;
  public showAssetSaveSubclip: boolean = false;
  public subclipData: any;
  private assetsArr: Array<number> = [];

  ngOnChanges(changes: any): void {
    if (changes.asset) this.parseNewAsset(changes.asset);
    if (changes.collection) {
      this.assetsArr = changes.collection.currentValue.assets.items.map((x: any) => x.assetId);
    }
  }

  public alreadyInCollection(assetId: any): boolean {
    assetId = parseInt(assetId);
    return this.assetsArr.indexOf(assetId) > -1;
  }
  // rename this method to something more meaningful
  public subclip(params: SubclipMarkers): void {
    // console.log(`Asset details subclip markers: ${params.in} - ${params.out}`);
    this.onAddToCollection.emit({ 'collection': this.collection, 'asset': this.asset, 'markers': params });
  }

  public updateSubclipData(data: any): void {
    if (data) this.showAssetSaveSubclip = true;
    this.subclipData = data;
  }
  public toggleAssetSaveSubclip(): void {
    this.showAssetSaveSubclip = !this.showAssetSaveSubclip;
  }

  public addToCollection(collection: Collection, asset: any, markers: SubclipMarkers = null): void {
    asset.assetId = asset.value;
    this.onAddToCollection.emit({ 'collection': collection, 'asset': asset, 'markers': markers });
  }

  public removeFromCollection(collection: Collection, asset: any): void {
    asset.assetId = asset.value;
    this.onRemoveFromCollection.emit({ 'collection': collection, 'asset': asset });
  }

  public downloadComp(assetId: any, compType: any): void {
    this.onDownloadComp.emit({ 'compType': compType, 'assetId': assetId });
  }

  public addAssetToCart(assetId: any, markers: SubclipMarkers = null, pricingAttributes?: any): void {
    this.addToCart.emit({ assetId: assetId, markers: markers, selectedTranscodeTarget: this.selectedTarget });
  }

  public getPricingAttributes(): void {
    this.getPriceAttributes.emit(this.asset.primary[3].value);
  }

  public onSelectTarget(target: string): void {
    this.selectedTarget = target;
  }

  private parseNewAsset(asset: any) {
    this.usagePrice = null;
    if (Object.keys(asset.currentValue.detailTypeMap.common).length > 0) {
      this.asset = Object.assign({}, this.asset, asset.currentValue.detailTypeMap);
      delete this.asset.detailTypeMap;
    }
    this.selectedTarget = this.asset.transcodeTargets[0];
  }
}
