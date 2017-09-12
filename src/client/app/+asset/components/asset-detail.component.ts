import { Component, Output, EventEmitter, Input, OnChanges, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { UiConfig } from '../../shared/services/ui.config';
import { Capabilities } from '../../shared/services/capabilities.service';
import { MdMenuTrigger } from '@angular/material';
import { SubclipMarkers, durationFrom } from '../../shared/interfaces/subclip-markers';
import { Observable } from 'rxjs/Observable';
import { Frame } from 'wazee-frame-formatter';
import { AppStore, ActionFactoryMapper } from '../../app.store';
import { EnhancedAsset } from '../../shared/interfaces/enhanced-asset';
import { SearchState } from '../../shared/services/search-context.service';

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
  @Input() public searchContext: SearchState;
  @Input() public pageSize: number;
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
  private assetsArr: Array<string> = [];

  constructor(private store: AppStore) { }

  ngOnChanges(changes: any): void {
    if (changes.asset) this.parseNewAsset(changes.asset);
    if (changes.activeCollection) {
      this.assetsArr = changes.activeCollection.currentValue.assets.items.map((asset: any) =>
        this.hashUniqueAsset(asset)
      );
    };
  }

  public get hasPageHistory() {
    return this.window.history.length > 2;
  }

  public previousPage() {
    this.onPreviousPage.emit();
  }

  public get routerLinkForAssetParent(): any[] {
    switch (this.asset.type) {
      case 'collectionAsset': {
        return ['/collections', this.asset.parentId, { i: 1, n: this.pageSize }];
      }

      case 'searchAsset': {
        return ['/search', this.searchContext];
      }

      case 'quoteEditAsset': {
        return ['/active-quote'];
      }

      case 'quoteShowAsset': {
        return ['/quotes', this.asset.parentId];
      }

      case 'orderAsset': {
        return ['/orders', this.asset.parentId];
      }

      case 'cartAsset': {
        return ['/cart'];
      }
    }
  }

  public get breadcrumbLabel(): Array<string> {
    switch (this.asset.type) {
      case 'collectionAsset': {
        return [this.activeCollection.name, ''];
      }

      case 'orderAsset':
      case 'quoteShowAsset': {
        return [`asset.detail.breadcrumb_${this.asset.type}`, String(this.asset.parentId)];
      }

      default: {
        return [`asset.detail.breadcrumb_${this.asset.type}`, ''];
      }
    }
  }

  public uniqueInCollection(asset: EnhancedAsset): boolean {
    return this.assetsArr.indexOf(this.hashUniqueAsset(asset, this.subclipMarkers)) > -1;
  }

  public inCollection(asset: EnhancedAsset): boolean {
    return this.assetsArr.map((hash) => hash.split('|')[0]).includes(asset.assetId.toString());
  }

  public canBeAddedToCollection(asset: EnhancedAsset): boolean {
    return !this.uniqueInCollection(asset) && !this.inCollection(asset)
      && ['collectionAsset', 'searchAsset'].includes(asset.type);
  }

  public canBeAddedAgainToCollection(asset: EnhancedAsset): boolean {
    return !this.uniqueInCollection(asset) && this.inCollection(asset)
      && ['collectionAsset', 'searchAsset'].includes(asset.type);
  }

  public canBeRemovedFromCollection(asset: EnhancedAsset): boolean {
    return this.uniqueInCollection(asset)
      && ['collectionAsset', 'searchAsset'].includes(asset.type);
  }

  public onPlayerMarkersInitialization(initialMarkers: SubclipMarkers): void {
    this.subclipMarkers = initialMarkers;
    this.showAssetSaveSubclip = false;
    this.markersChange.emit(initialMarkers);
  }

  public onPlayerMarkerChange(newMarkers: SubclipMarkers): void {
    this.subclipMarkers = newMarkers;
    this.showAssetSaveSubclip = this.markersAreDefined;
    if (this.markersAreDefined && this.asset.type === 'searchAsset') {
      this.store.dispatch((factory) => factory.searchAsset.updateMarkersInUrl(this.subclipMarkers, this.asset.assetId));
    }
    this.markersChange.emit(newMarkers);
  }

  public toggleAssetSaveSubclip(): void {
    this.showAssetSaveSubclip = !this.showAssetSaveSubclip;
  }

  public addAssetToActiveCollection(): void {
    this.store.dispatch(factory => factory.activeCollection.addAsset(this.asset, this.subclipMarkers ? this.subclipMarkers : null));
    this.showAssetSaveSubclip = false;
  }

  public removeAssetFromActiveCollection(): void {
    const timeStamps = this.subclipMarkers ? durationFrom(this.subclipMarkers) : null;
    const assetToRemove = timeStamps ? this.activeCollection.assets.items.find((asset: EnhancedAsset) =>
      asset.assetId === this.asset.assetId &&
      asset.timeStart === timeStamps.timeStart &&
      asset.timeEnd === timeStamps.timeEnd
    ) : this.asset;
    this.store.dispatch(factory => factory.activeCollection.removeAsset(assetToRemove));
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

  public canCommentOn(asset: EnhancedAsset) {
    return ['cartAsset', 'collectionAsset', 'orderAsset', 'quoteEditAsset', 'quoteShowAsset'].includes(asset.type);
  }

  public canShare(asset: EnhancedAsset) {
    return ['collectionAsset', 'searchAsset'].includes(asset.type) && this.userCan.createAccessInfo();
  }

  public get shareButtonLabelKey(): string {
    return this.markersAreDefined ? 'ASSET.DETAIL.SHARING_SUBCLIP_BTN_TITLE' : 'ASSET.DETAIL.SHARING_BTN_TITLE';
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

  private hashUniqueAsset(asset: EnhancedAsset, subclipMarkers?: SubclipMarkers) {
    let timeStart = subclipMarkers ? durationFrom(subclipMarkers).timeStart : asset.timeStart;
    let timeEnd = subclipMarkers ? durationFrom(subclipMarkers).timeEnd : asset.timeEnd;
    return [asset.assetId, timeStart || -1, timeEnd || -2].join('|');
  }
}
