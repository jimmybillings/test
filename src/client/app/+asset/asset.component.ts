import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '../shared/services/current-user.service';
import { AddAssetParameters, PriceAttribute, Cart } from '../shared/interfaces/commerce.interface';
import { WzEvent, SelectedPriceAttributes } from '../shared/interfaces/common.interface';
import { Capabilities } from '../shared/services/capabilities.service';
import { CartService } from '../shared/services/cart.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { Observable } from 'rxjs/Observable';
import { MatDialogRef } from '@angular/material';
import { WzDialogService } from '../shared/modules/wz-dialog/services/wz.dialog.service';
import { WzPricingComponent } from '../shared/components/wz-pricing/wz.pricing.component';
import { WindowRef } from '../shared/services/window-ref.service';
import { QuoteEditService } from '../shared/services/quote-edit.service';
import { Subscription } from 'rxjs/Subscription';
import { EnhancedAsset, enhanceAsset, AssetType } from '../shared/interfaces/enhanced-asset';
import * as CommonInterface from '../shared/interfaces/common.interface';
import * as SubclipMarkersInterface from '../shared/interfaces/subclip-markers';
import { AppStore, StateMapper, PricingState } from '../app.store';
import { Collection } from '../shared/interfaces/collection.interface';
import { CommentParentObject, ObjectType } from '../shared/interfaces/comment.interface';
import { FormFields } from '../shared/interfaces/forms.interface';
import { Common } from '../shared/utilities/common.functions';
import { SearchContext, SearchState } from '../shared/services/search-context.service';

@Component({
  moduleId: module.id,
  selector: 'asset-component',
  templateUrl: 'asset.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetComponent implements OnInit, OnDestroy {
  @Input() assetType: AssetType;
  @Input() commentFormConfig: FormFields;
  public rightsReproduction: string = '';
  public asset: EnhancedAsset;
  public commentParentObject: CommentParentObject;
  private assetSubscription: Subscription;
  private routeSubscription: Subscription;
  private selectedAttributes: CommonInterface.Pojo;
  private appliedAttributes: CommonInterface.Pojo;
  private subclipMarkers: SubclipMarkersInterface.SubclipMarkers = null;
  private cartAsset: EnhancedAsset;
  private cartAssetPriceAttributes: SelectedPriceAttributes[];

  constructor(
    public currentUser: CurrentUserService,
    public userCan: Capabilities,
    public window: WindowRef,
    private router: Router,
    private route: ActivatedRoute,
    private store: AppStore,
    private userPreference: UserPreferenceService,
    private cartService: CartService,
    private dialogService: WzDialogService,
    private quoteEditService: QuoteEditService,
    private searchContext: SearchContext
  ) { }

  public ngOnInit(): void {
    this.assetSubscription = this.store.select(state => state.asset.activeAsset)
      .map(asset => {
        const clonedAsset = Common.clone(asset);
        return enhanceAsset(clonedAsset, this.assetType, this.parentIdIn(this.route.snapshot.params));
      }).subscribe(asset => {
        this.asset = asset;
        this.store.dispatch(factory => factory.pricing.setPriceForDetails(this.asset.price));
        this.selectedAttributes = this.store.snapshot(state => state.pricing.selectedAttributes);
        this.appliedAttributes = this.store.snapshot(state => state.pricing.appliedAttributes);
        this.loadCorrespondingCartAsset();
      });

    this.routeSubscription = this.route.params.subscribe((params: any) => {
      this.commentParentObject = this.commentParentObjectFromRoute(params);
    });
  }

  public ngOnDestroy(): void {
    if (this.assetSubscription) this.assetSubscription.unsubscribe();
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
  }

  public previousPage(): void {
    this.window.nativeWindow.history.back();
  }

  public get activeCollection(): Observable<Collection> {
    return this.store.select(state => state.activeCollection.collection);
  }

  public get userEmail(): Observable<string> {
    return this.currentUser.data.map(user => user.emailAddress);
  }

  public get priceForDetails(): Observable<number> {
    return this.store.select(state => state.pricing.priceForDetails);
  }

  public get searchContextState(): SearchState {
    return this.searchContext.state;
  }

  public addAssetToCart(parameters: any): void {
    this.store.select(state => state.pricing).take(1).subscribe((state: PricingState) => {
      let options: AddAssetParameters = {
        lineItem: {
          selectedTranscodeTarget: parameters.selectedTranscodeTarget,
          price: state.priceForDetails ? state.priceForDetails : undefined,
          asset: { assetId: parameters.assetId }
        },
        markers: parameters.markers,
        attributes: state.priceForDetails ? this.selectedAttributes : null
      };
      this.userCan.administerQuotes() ?
        this.quoteEditService.addAssetToProjectInQuote(options) :
        this.cartService.addAssetToProjectInCart(options);
    });
  }

  public getPricingAttributes(rightsReproduction: string): void {
    if (this.rightsReproduction === rightsReproduction) {
      this.store.dispatch(factory => factory.pricing.openPricingDialog());
    } else {
      this.store.dispatch(factory => factory.pricing.getAttributes(rightsReproduction));
    }
    this.rightsReproduction = rightsReproduction;
  }

  public onMarkersChange(markers: SubclipMarkersInterface.SubclipMarkers): void {
    const updatePrice: boolean =
      !!this.selectedAttributes && (
        SubclipMarkersInterface.bothMarkersAreSet(markers) ||
        SubclipMarkersInterface.neitherMarkersAreSet(markers)
      );

    this.subclipMarkers = SubclipMarkersInterface.bothMarkersAreSet(markers) ? markers : null;

    if (updatePrice) {
      this.store.dispatch(factory => factory.pricing.calculatePriceFor(this.selectedAttributes));
    }
  }

  public get assetMatchesCartAsset(): boolean {
    return this.cartAsset
      ? this.subclipMarkersMatchCartAsset && this.pricingAttributesMatchCartAsset
      : true; // We populate this.cartAsset for 'cartAsset' and 'quoteEditAsset' types only.
  }

  public onUpdateAssetLineItem(): void {
    this.userCan.administerQuotes() ?
      this.store.dispatch(factory => factory.quoteEdit.editLineItemFromDetails(
        this.asset.uuid,
        this.subclipMarkers,
        this.appliedAttributes
      )) :
      this.store.dispatch(factory => factory.cart.editLineItemFromDetails(
        this.asset.uuid,
        this.subclipMarkers,
        this.appliedAttributes
      ));
  }

  private loadCorrespondingCartAsset(): void {
    this.cartAsset = null;
    this.cartAssetPriceAttributes = null;

    let service: CartService | QuoteEditService;

    switch (this.assetType) {
      case 'cartAsset': service = this.cartService; break;
      case 'quoteEditAsset': service = this.quoteEditService; break;
      default: return;
    }

    const lineItem = service.state.data.projects
      .reduce((lineItems, project) => lineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === this.asset.uuid);

    if (!lineItem) return;  // Could happen during initialization.

    this.cartAsset = lineItem.asset ? enhanceAsset(lineItem.asset, this.assetType) : null;
    this.cartAssetPriceAttributes = lineItem.attributes || [];
  }

  private get subclipMarkersMatchCartAsset(): boolean {
    return SubclipMarkersInterface.matches(this.cartAsset.timeStart, this.cartAsset.timeEnd, this.subclipMarkers);
  }

  private get pricingAttributesMatchCartAsset(): boolean {
    if (!this.appliedAttributes) return true;  // We know the user hasn't changed attributes if this.appliedAttributes isn't set.
    if (this.cartAssetPriceAttributes.length !== Object.keys(this.appliedAttributes).length) return false;

    return this.cartAssetPriceAttributes.every((cartAttribute: SelectedPriceAttributes) => {
      return cartAttribute.selectedAttributeValue === this.appliedAttributes[cartAttribute.priceAttributeName];
    });
  }

  private commentParentObjectFromRoute(routeParams: any): CommentParentObject {
    return {
      objectId: this.parentIdIn(routeParams),
      objectType: this.commentObjectTypeFrom(this.assetType),
      nestedObjectId: routeParams.uuid,
      nestedObjectType: 'lineItem'
    };
  }

  private parentIdIn(routeParams: CommonInterface.Pojo): number {
    return (this.assetType === 'quoteEditAsset') ?
      this.store.snapshot(state => state.quoteEdit.data.id) :
      Number(routeParams.id) || 0;
  }

  private commentObjectTypeFrom(assetType: AssetType): ObjectType {
    switch (assetType) {
      case 'collectionAsset': {
        return 'collection';
      }

      case 'quoteEditAsset':
      case 'quoteShowAsset': {
        return 'quote';
      }

      default: {
        return 'cart';
      }
    }
  }
}
