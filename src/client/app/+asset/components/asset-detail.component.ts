import { Component, Output, EventEmitter, Input, OnChanges, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { UiConfig } from '../../shared/services/ui.config';
import { Capabilities } from '../../shared/services/capabilities.service';
import { MdMenuTrigger } from '@angular/material';
import { SubclipMarkers, SubclipMarkerFrames } from '../../shared/interfaces/asset.interface';
import { SearchContext } from '../../shared/services/search-context.service';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'asset-detail',
  templateUrl: 'asset-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetailComponent implements OnChanges {
  @Input() public asset: any;
  @Input() public userEmail: Observable<string>;
  @Input() public userCan: Capabilities;
  @Input() public uiConfig: UiConfig;
  @Input() public collection: Collection;
  @Input() public searchContext: SearchContext;
  @Input() public usagePrice: Observable<number>;
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
  public subclipData: SubclipMarkerFrames;
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
  public subclip(markers: SubclipMarkers): void {
    this.onAddToCollection.emit({ 'collection': this.collection, 'asset': this.asset, 'markers': markers });
  }

  public onPlayerMarkersInitialization(initialMarkers: SubclipMarkerFrames): void {
    this.subclipData = initialMarkers;
    this.showAssetSaveSubclip = false;
  }

  public onPlayerMarkerChange(newMarkers: SubclipMarkerFrames): void {
    this.subclipData = newMarkers;
    this.showAssetSaveSubclip = !!newMarkers.in && !!newMarkers.out;
  }

  public get markersSaveButtonEnabled(): boolean {
    return !this.showAssetSaveSubclip && this.subclipData && !!this.subclipData.in && !!this.subclipData.out;
  }

  public onPlayerMarkerSaveButtonClick(): void {
    this.showAssetSaveSubclip = true;
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

  public onSelectTarget(target: any): void {
    this.selectedTarget = target.value;
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
