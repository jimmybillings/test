import { Component, Output, EventEmitter, Input, OnChanges, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { Cart, Project } from '../../shared/interfaces/commerce.interface';
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
  @Input() public usagePrice: number;
  @Input() public window: Window;
  @Input() public searchContext: SearchState;
  @Input() public pageSize: number;
  @Input() public assetMatchesCartAsset: boolean;
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
  private assets: Array<number> = [];
  private uuids: Array<string> = [];

  constructor(private store: AppStore) { }

  ngOnChanges(changes: any): void {
    if (changes.asset) this.parseNewAsset(changes.asset);
    if (changes.activeCollection) {
      this.assets = changes.activeCollection.currentValue.assets.items.map((asset: EnhancedAsset) => asset.assetId);
      this.uuids = changes.activeCollection.currentValue.assets.items.map((asset: EnhancedAsset) => asset.uuid);
    }
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
    return this.uuids.indexOf(asset.uuid) > -1;
  }

  public inCollection(asset: EnhancedAsset): boolean {
    return this.assets.indexOf(asset.assetId) > -1;
  }

  public canBeAddedToCollection(asset: EnhancedAsset): boolean {
    return !this.inCollection(asset) && ['collectionAsset', 'searchAsset'].includes(asset.type);
  }

  public canBeRemovedFromCollection(asset: EnhancedAsset): boolean {
    return asset.type === 'collectionAsset' && this.uniqueInCollection(asset);
  }

  public canBeAddedAgainToCollection(asset: EnhancedAsset): boolean {
    return (asset.type === 'searchAsset' && this.inCollection(asset)) ||
      (asset.type === 'collectionAsset' && (this.inCollection(asset) || this.showAssetSaveSubclip));
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

  public getPricingAttributes(): void {
    this.getPriceAttributes.emit(this.rights);
  }

  public onSelectTarget(target: any): void {
    this.selectedTarget = target.value;
  }

  public get canComment(): boolean {
    return ['cartAsset', 'collectionAsset', 'orderAsset', 'quoteEditAsset', 'quoteShowAsset'].includes(this.asset.type);
  }

  public get canShare(): boolean {
    return ['collectionAsset', 'searchAsset'].includes(this.asset.type) && this.userCan.createAccessInfo();
  }

  public get shareButtonLabelKey(): string {
    return this.markersAreDefined ? 'ASSET.DETAIL.SHARING_SUBCLIP_BTN_TITLE' : 'ASSET.DETAIL.SHARING_BTN_TITLE';
  }

  public get rights(): string {
    return this.asset.getMetadataValueFor('Rights.Reproduction');
  }

  public get canShowPricingAndCartActions(): boolean {
    return this.isRoyaltyFree || this.isRightsManaged;
  }

  public get priceIsStartingPrice(): boolean {
    return !!this.asset.price && !this.usagePrice && this.isRightsManaged;
  }

  public get price(): number {
    if (!this.isRightsManaged && !this.isRoyaltyFree) return null;
    if (this.isRightsManaged && !!this.usagePrice) return this.usagePrice;
    if (this.asset.price) return this.asset.price;

    return null;
  }

  public get hasPrice(): boolean {
    return !!this.price;
  }

  public get hasNoPrice(): boolean {
    return !this.asset.price;
  }

  public get canPerformCartActions(): boolean {
    return this.userCan.haveCart() && (this.isRoyaltyFree || (this.isRightsManaged && !!this.asset.price));
  }

  public get canSelectTranscodeTarget(): boolean {
    return this.isRoyaltyFree && this.userCan.addToCart() && !!this.asset.transcodeTargets;
  }

  public get canCalculatePrice(): boolean {
    return this.isRightsManaged && this.userCan.calculatePrice();
  }

  public get canUpdateCartAsset(): boolean {
    return ['cartAsset', 'quoteEditAsset'].includes(this.asset.type);
  }

  public get updateCartAssetButtonLabelKey(): string {
    const subclipOrAsset: string = this.markersAreDefined ? 'SUBCLIP' : 'ASSET';
    const quoteOrCart: string = this.isQuoteUser ? 'QUOTE' : 'CART';

    return `ASSET.DETAIL.BUTTON.UPDATE.${subclipOrAsset}.${quoteOrCart}`;
  }

  public updateCartAsset(): void {
    this.store.dispatch(factory => factory.notifier.notify({
      title: 'COMING SOON!',
      message: 'Asset updating is not yet implemented.'
    }));
  }

  public get canAddToCart(): boolean {
    return this.userCan.addToCart();
  }

  public get addToCartButtonLabelKey(): string {
    const onMatchingPage: boolean = this.isQuoteUser ? this.asset.type === 'quoteEditAsset' : this.asset.type === 'cartAsset';
    const operation: string = onMatchingPage ? 'ADD_NEW' : 'ADD';
    const subclipOrAsset: string = this.markersAreDefined ? 'SUBCLIP' : 'ASSET';
    const quoteOrCart: string = this.isQuoteUser ? 'QUOTE' : 'CART';

    return `ASSET.DETAIL.BUTTON.${operation}.${subclipOrAsset}.${quoteOrCart}`;
  }

  public get canGoToSearchAssetDetails(): boolean {
    return ['cartAsset', 'collectionAsset', 'orderAsset', 'quoteEditAsset', 'quoteShowAsset'].includes(this.asset.type);
  }

  public goToSearchAssetDetails(): void {
    this.store.dispatch(factory => factory.router.goToSearchAssetDetails(this.asset.assetId, this.subclipMarkers));
  }

  private get isQuoteUser(): boolean {
    return this.userCan.administerQuotes();
  }

  private get isRoyaltyFree(): boolean {
    return this.rights === 'Royalty Free';
  }

  private get isRightsManaged(): boolean {
    return this.rights === 'Rights Managed';
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
}
