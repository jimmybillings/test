import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { Cart, Project } from '../../shared/interfaces/commerce.interface';
import { Asset, Pojo, UiConfigComponents } from '../../shared/interfaces/common.interface';
import { Capabilities } from '../../shared/services/capabilities.service';
import { MatMenuTrigger } from '@angular/material';
import { SubclipMarkers, durationFrom } from '../../shared/interfaces/subclip-markers';
import { Observable } from 'rxjs/Observable';
import { Frame } from '../../shared/modules/wazee-frame-formatter/index';
import { AppStore, ActionFactoryMapper } from '../../app.store';
import { EnhancedAsset, AssetType } from '../../shared/interfaces/enhanced-asset';
import { CommentParentObject } from '../../shared/interfaces/comment.interface';
import { FormFields } from '../../shared/interfaces/forms.interface';
import { SearchState } from '../../shared/services/search-context.service';

@Component({
  moduleId: module.id,
  selector: 'asset-detail',
  templateUrl: 'asset-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetDetailComponent implements OnInit {
  @Input() public set asset(asset: EnhancedAsset) {
    this._asset = asset;
    this.usagePrice = null;
    if (asset.transcodeTargets) this.selectedTarget = asset.transcodeTargets[0];  // Is this what we want for all asset types?
    this.setAssetCollectionMembershipFlags();
  }

  @Input() public set activeCollection(collection: Collection) {
    this._activeCollection = collection;
    this.activeCollectionName = collection.name;
    this.setAssetCollectionMembershipFlags();
  }

  @Input() public userEmail: Observable<string>;
  @Input() public userCan: Capabilities;
  @Input() public usagePrice: number;
  @Input() public window: Window;
  @Input() public searchContext: SearchState;
  @Input() public assetMatchesCartAsset: boolean;
  @Input() public commentParentObject: CommentParentObject;
  @Input() public commentFormConfig: FormFields;
  @Output() onDownloadComp = new EventEmitter();
  @Output() addToCart = new EventEmitter();
  @Output() getPriceAttributes = new EventEmitter();
  @Output() onPreviousPage = new EventEmitter();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  public shareComponentConfig: Pojo;
  public selectedTarget: string;
  public showAssetSaveSubclip: boolean = false;
  public subclipMarkers: SubclipMarkers;
  public activeCollectionName: string;
  public showComments: boolean;
  public hasDeliveryOptions: Observable<boolean>;
  @Output() public updateAssetLineItem: EventEmitter<null> = new EventEmitter();
  @Output() private markersChange: EventEmitter<SubclipMarkers> = new EventEmitter();
  private _asset: EnhancedAsset;
  private _activeCollection: Collection;
  private activeCollectionContainsAssetId: boolean = false;
  private activeCollectionContainsAssetUuid: boolean = false;
  private pageSize: number;

  constructor(
    private store: AppStore) { }

  ngOnInit() {
    const config: UiConfigComponents = this.store.snapshotCloned(state => state.uiConfig.components);
    this.pageSize = parseInt(config.global.config.pageSize.value);
    this.shareComponentConfig = config.assetSharing.config;
    this.setDeliveryOptionsFlag();
  }

  public get asset(): EnhancedAsset {
    return this._asset;
  }

  public get hasPageHistory() {
    return this.window.history.length > 2;
  }

  public previousPage() {
    this.onPreviousPage.emit();
  }

  public get routerLinkForAssetParent(): any[] {
    switch (this._asset.type) {
      case 'collectionAsset': {
        return ['/collections', this._asset.parentId, { i: 1, n: this.pageSize }];
      }

      case 'searchAsset': {
        return ['/search', this.searchContext];
      }

      case 'quoteEditAsset': {
        return ['/active-quote'];
      }

      case 'quoteShowAsset': {
        return ['/quotes', this._asset.parentId];
      }

      case 'orderAsset': {
        return ['/orders', this._asset.parentId];
      }

      case 'cartAsset': {
        return ['/cart'];
      }
    }
  }

  public get breadcrumbLabel(): Array<string> {
    switch (this._asset.type) {
      case 'collectionAsset': {
        return [this.activeCollectionName, ''];
      }

      case 'orderAsset':
      case 'quoteShowAsset': {
        return [`asset.detail.breadcrumb_${this._asset.type}`, String(this._asset.parentId)];
      }

      default: {
        return [`asset.detail.breadcrumb_${this._asset.type}`, ''];
      }
    }
  }

  public get canAddToActiveCollection(): boolean {
    return !this.activeCollectionContainsAssetId && this.assetTypeIsOneOf('collectionAsset', 'searchAsset');
  }

  public get canRemoveFromActiveCollection(): boolean {
    return this._asset.type === 'collectionAsset' && this.activeCollectionContainsAssetUuid;
  }

  public get canAddAgainToActiveCollection(): boolean {
    return (this._asset.type === 'searchAsset' && this.activeCollectionContainsAssetId) ||
      (this._asset.type === 'collectionAsset' && (this.activeCollectionContainsAssetId || this.showAssetSaveSubclip));
  }

  public get canUpdateInActiveCollection(): boolean {
    return this._asset.type === 'collectionAsset' && this.showAssetSaveSubclip && this.activeCollectionContainsAssetUuid &&
      !this._activeCollection.assets.items.some((collectionAsset: Asset) => {
        const duration = durationFrom(this.subclipMarkers);
        return collectionAsset.timeStart === duration.timeStart && collectionAsset.timeEnd === duration.timeEnd;
      });
  }

  public onPlayerMarkersInitialization(initialMarkers: SubclipMarkers): void {
    this.subclipMarkers = initialMarkers;
    this.showAssetSaveSubclip = false;
    this.markersChange.emit(initialMarkers);
  }

  public onPlayerMarkerChange(newMarkers: SubclipMarkers): void {
    this.subclipMarkers = newMarkers;
    this.showAssetSaveSubclip = this.markersAreDefined;
    if (this.markersAreDefined && this._asset.type === 'searchAsset') {
      this.store.dispatch((factory) => factory.asset.updateMarkersInUrl(this.subclipMarkers, this._asset.assetId));
    }
    this.markersChange.emit(newMarkers);
  }

  public toggleAssetSaveSubclip(): void {
    this.showAssetSaveSubclip = !this.showAssetSaveSubclip;
  }

  public addAssetToActiveCollection(): void {
    this.store.dispatch(
      factory => factory.activeCollection.addAsset(this._asset, this.subclipMarkers ? this.subclipMarkers : null)
    );
    this.showAssetSaveSubclip = false;
  }

  public removeAssetFromActiveCollection(): void {
    this.store.dispatch(factory => factory.dialog.showConfirmation(
      {
        title: 'COLLECTION.REMOVE_ASSET.TITLE',
        message: 'COLLECTION.REMOVE_ASSET.MESSAGE',
        accept: 'COLLECTION.REMOVE_ASSET.ACCEPT',
        decline: 'COLLECTION.REMOVE_ASSET.DECLINE'
      },
      () => this.store.dispatch(factory => factory.activeCollection.removeAsset(this._asset))
    ));
  }

  public updateAssetInActiveCollection(): void {
    this.store.dispatch(factory => factory.activeCollection.updateAssetMarkers(this._asset, this.subclipMarkers));
  }

  public downloadComp(assetId: any, compType: any): void {
    this.onDownloadComp.emit({ 'compType': compType, 'assetId': assetId });
  }

  public addAssetToCart(): void {
    this.addToCart.emit({
      assetId: this._asset.assetId,
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
    return !!this.commentFormConfig;
  }

  public get canShare(): boolean {
    return this.assetTypeIsOneOf('searchAsset') && this.userCan.createAccessInfo();
  }

  public get shareButtonLabelKey(): string {
    return this.markersAreDefined ? 'ASSET.DETAIL.SHARING_SUBCLIP_BTN_TITLE' : 'ASSET.DETAIL.SHARING_BTN_TITLE';
  }

  public get rights(): string {
    return this._asset.getMetadataValueFor('Rights.Reproduction');
  }

  public get canShowPricingAndCartActions(): boolean {
    return this.isRoyaltyFree || this.isRightsManaged;
  }

  public get priceIsStartingPrice(): boolean {
    return !!this._asset.price && !this.usagePrice && this.isRightsManaged;
  }

  public get price(): number {
    if (!this.isRightsManaged && !this.isRoyaltyFree) return null;
    if (this.isRightsManaged && !!this.usagePrice) return this.usagePrice;
    if (this._asset.price) return this._asset.price;

    return null;
  }

  public get hasPrice(): boolean {
    return !!this.price;
  }

  public get hasNoPrice(): boolean {
    return !this._asset.price;
  }

  public get canPerformCartActions(): boolean {
    return this.userCan.haveCart() && (this.isRoyaltyFree || (this.isRightsManaged && !!this._asset.price));
  }

  public get canSelectTranscodeTarget(): boolean {
    return this.isRoyaltyFree && this.userCan.addToCart() && !!this._asset.transcodeTargets;
  }

  public get canCalculatePrice(): boolean {
    return this.isRightsManaged && this.userCan.calculatePrice();
  }

  public get canUpdateCartAsset(): boolean {
    return this.assetTypeIsOneOf('cartAsset', 'quoteEditAsset');
  }

  public get updateCartAssetButtonLabelKey(): string {
    const subclipOrAsset: string = this.markersAreDefined ? 'SUBCLIP' : 'ASSET';
    const quoteOrCart: string = this.isQuoteUser ? 'QUOTE' : 'CART';

    return `ASSET.DETAIL.BUTTON.UPDATE.${subclipOrAsset}.${quoteOrCart}`;
  }

  public updateCartAsset(): void {
    this.updateAssetLineItem.emit();
  }

  public get canAddToCart(): boolean {
    return this.userCan.addToCart();
  }

  public get addToCartOrQuoteButtonLabelKey(): string {
    const onMatchingPage: boolean = this.isQuoteUser ? this._asset.type === 'quoteEditAsset' : this._asset.type === 'cartAsset';
    const operation: string = onMatchingPage ? 'ADD_NEW' : 'ADD';
    const subclipOrAsset: string = this.markersAreDefined ? 'SUBCLIP' : 'ASSET';
    const quoteOrCart: string = this.isQuoteUser ? 'QUOTE' : 'CART';

    return `ASSET.DETAIL.BUTTON.${operation}.${subclipOrAsset}.${quoteOrCart}`;
  }

  public get removeFromCartOrQuoteButtonLabelKey(): string {
    const subclipOrAsset: string = this._asset.isSubclipped ? 'SUBCLIP' : 'ASSET';
    const quoteOrCart: string = this.isQuoteUser ? 'QUOTE' : 'CART';

    return `ASSET.DETAIL.BUTTON.REMOVE.${subclipOrAsset}.${quoteOrCart}`;
  }

  public get canGoToSearchAssetDetails(): boolean {
    return this.assetTypeIsOneOf('cartAsset', 'collectionAsset', 'orderAsset', 'quoteEditAsset', 'quoteShowAsset');
  }

  public goToSearchAssetDetails(): void {
    this.store.dispatch(factory => factory.router.goToSearchAssetDetails(this._asset.assetId, this.subclipMarkers));
  }

  public get canGetHelp(): boolean {
    return this.assetTypeIsOneOf('searchAsset');
  }

  public showHelpRequest() {
    this.store.dispatch(factory => factory.helpRequest.showHelpRequest(this._asset.getMetadataValueFor('name')));
  }

  public toggleCommentsVisibility(): void {
    this.showComments = !this.showComments;
  }

  public get userCanAddComments(): Observable<boolean> {
    switch (this.commentParentObject.objectType) {
      case 'collection':
        return this.userCan.editCollection(this._activeCollection);
      default:
        return Observable.of(true);
    }
  }

  public get commentCount(): Observable<number> {
    return this.store.select(state => state.comment[state.comment.activeObjectType].pagination.totalCount);
  }

  public removeAssetFromCartOrQuote(): void {
    const type: string = this._asset.type === 'quoteEditAsset' ? 'QUOTE' : 'CART';
    this.store.dispatch(factory => factory.dialog.showConfirmation({
      title: `${type}.REMOVE_ASSET.TITLE`,
      message: `${type}.REMOVE_ASSET.MESSAGE`,
      accept: `${type}.REMOVE_ASSET.ACCEPT`,
      decline: `${type}.REMOVE_ASSET.DECLINE`
    }, () => this.store.dispatch(factory => this._asset.type === 'quoteEditAsset'
      ? factory.quoteEdit.removeAsset(this._asset)
      : factory.cart.removeAsset(this._asset))
    ));
  }

  public get showDownloadButton(): boolean {
    return this.asset.type !== 'orderAsset';
  }

  private assetTypeIsOneOf(...assetTypes: AssetType[]) {
    return assetTypes.includes(this._asset.type);
  }

  private setAssetCollectionMembershipFlags(): void {
    if (!this._activeCollection || !this._asset) {
      this.activeCollectionContainsAssetId = this.activeCollectionContainsAssetUuid = false;
      return;
    }

    const collectionItems: Asset[] = this._activeCollection.assets.items;

    this.activeCollectionContainsAssetId =
      collectionItems.some((collectionAsset: Asset) => collectionAsset.assetId === this._asset.assetId);

    this.activeCollectionContainsAssetUuid =
      !!this._asset.uuid && collectionItems.some((collectionAsset: Asset) => collectionAsset.uuid === this._asset.uuid);
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

  private setDeliveryOptionsFlag(): void {
    this.hasDeliveryOptions = this.store.select(state => state.deliveryOptions.hasDeliveryOptions);
  }
}
