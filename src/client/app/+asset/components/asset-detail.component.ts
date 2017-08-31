import { Component, Output, EventEmitter, Input, OnChanges, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { UiConfig } from '../../shared/services/ui.config';
import { Capabilities } from '../../shared/services/capabilities.service';
import { MdMenuTrigger } from '@angular/material';
import { SubclipMarkers } from '../../shared/interfaces/subclip-markers';
import { Observable } from 'rxjs/Observable';
import { Frame } from 'wazee-frame-formatter';
import { AppStore, ActionFactoryMapper } from '../../app.store';
import { EnhancedAsset } from '../../shared/interfaces/enhanced-asset';

@Component({
  moduleId: module.id,
  selector: 'asset-detail',
  templateUrl: 'asset-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetailComponent implements OnChanges {
  @Input() public asset: EnhancedAsset;
  @Input() public userEmail: Observable<string>;
  @Input() public userCan: Capabilities;
  @Input() public uiConfig: UiConfig;
  @Input() public activeCollection: Collection;
  @Input() public usagePrice: Observable<number>;
  @Input() public window: Window;
  @Output() onDownloadComp = new EventEmitter();
  @Output() addToCart = new EventEmitter();
  @Output() getPriceAttributes = new EventEmitter();
  @Output() onShowSnackBar = new EventEmitter();
  @Output() onPreviousPage = new EventEmitter();
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
  public selectedTarget: string;
  public showAssetSaveSubclip: boolean = false;
  public subclipMarkers: SubclipMarkers;
  @Output() private markersChange: EventEmitter<SubclipMarkers> = new EventEmitter();
  private assetsArr: Array<number> = [];

  constructor(private store: AppStore) { }

  ngOnChanges(changes: any): void {
    if (changes.asset) this.parseNewAsset(changes.asset);
    if (changes.activeCollection) {
      this.assetsArr = changes.activeCollection.currentValue.assets.items.map((x: any) => x.assetId);
    }
  }

  public get hasPageHistory() {
    return this.window.history.length > 2;
  }

  public previousPage() {
    this.onPreviousPage.emit();
  }

  public alreadyInCollection(assetId: any): boolean {
    assetId = parseInt(assetId);
    return this.assetsArr.indexOf(assetId) > -1;
  }

  public onPlayerMarkersInitialization(initialMarkers: SubclipMarkers): void {
    this.subclipMarkers = initialMarkers;
    this.showAssetSaveSubclip = false;
    this.markersChange.emit(initialMarkers);
  }

  public onPlayerMarkerChange(newMarkers: SubclipMarkers): void {
    this.subclipMarkers = newMarkers;
    // temporarily turn off the subclip pop-up. It will be going away eventually
    this.showAssetSaveSubclip = false;
    // this.showAssetSaveSubclip = this.markersAreDefined;
    if (this.markersAreDefined) {
      this.store.dispatch(this.updateMarkersActionMapper);
    }
    this.markersChange.emit(newMarkers);
  }

  public toggleAssetSaveSubclip(): void {
    this.showAssetSaveSubclip = !this.showAssetSaveSubclip;
  }

  public addAssetToActiveCollection(): void {
    this.store.dispatch(factory => factory.activeCollection.addAsset(this.asset));
  }

  public removeAssetFromActiveCollection(): void {
    this.store.dispatch(factory => factory.activeCollection.removeAsset(this.asset));
  }

  public downloadComp(assetId: any, compType: any): void {
    this.onDownloadComp.emit({ 'compType': compType, 'assetId': assetId });
  }

  public addAssetToCart(): void {
    this.addToCart.emit({
      assetId: this.asset.assetId,
      markers: this.markersAreDefined ? this.subclipMarkers : null,
      selectedTranscodeTarget: this.selectedTarget
    });
  }

  public addSubclipToCart(): void {
    this.addToCart.emit({
      assetId: this.asset.assetId,
      markers: this.subclipMarkers,
      selectedTranscodeTarget: this.selectedTarget
    });
  }

  public getPricingAttributes(): void {
    this.getPriceAttributes.emit(this.asset.primary[3].value);
  }

  public onSelectTarget(target: any): void {
    this.selectedTarget = target.value;
  }

  public get addToCartBtnLabel(): string {
    return this.userCan.administerQuotes()
      ? (this.markersAreDefined ? 'ASSET.SAVE_SUBCLIP.SAVE_TO_QUOTE_BTN_TITLE' : 'ASSET.DETAIL.ADD_TO_QUOTE_BTN_LABEL')
      : (this.markersAreDefined ? 'ASSET.SAVE_SUBCLIP.SAVE_TO_CART_BTN_TITLE' : 'ASSET.DETAIL.ADD_TO_CART_BTN_LABEL');
  }

  private get markersAreDefined(): boolean {
    return !!this.subclipMarkers && !!this.subclipMarkers.in && !!this.subclipMarkers.out;
  }

  private parseNewAsset(asset: any) {
    this.usagePrice = null;
    if (this.asset.transcodeTargets) {
      this.selectedTarget = this.asset.transcodeTargets[0];
    }
  }

  private get updateMarkersActionMapper(): ActionFactoryMapper {
    switch (this.asset.assetTypeAndParent.type) {
      case 'collectionAsset': {
        return (factory) => factory.activeCollectionAsset.updateMarkersInUrl(this.subclipMarkers, this.asset.assetId);
      }

      case 'searchAsset': {
        return (factory) => factory.searchAsset.updateMarkersInUrl(this.subclipMarkers, this.asset.assetId);
      }

      default:
        return (factory) => factory.cartAsset.updateMarkersInUrl(this.subclipMarkers, this.asset.assetId);
    }
  }
}
