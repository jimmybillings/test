import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '../shared/services/current-user.service';
import { AddAssetParameters, Cart, PriceAttribute, Project } from '../shared/interfaces/commerce.interface';
import { WzEvent, SelectedPriceAttribute } from '../shared/interfaces/common.interface';
import { Capabilities } from '../shared/services/capabilities.service';
import { CartService } from '../shared/services/cart.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { Observable } from 'rxjs/Observable';
import { MatDialogRef } from '@angular/material';
import { WzDialogService } from '../shared/modules/wz-dialog/services/wz.dialog.service';
import { DefaultComponentOptions } from '../shared/modules/wz-dialog/interfaces/wz.dialog.interface';
import { WzPricingComponent } from '../shared/components/wz-pricing/wz.pricing.component';
import { WindowRef } from '../shared/services/window-ref.service';
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
  public asset: EnhancedAsset;
  public commentParentObject: CommentParentObject;
  private assetSubscription: Subscription;
  private routeSubscription: Subscription;
  private pricingSubscription: Subscription;
  private selectedAttributes: CommonInterface.Pojo;
  private appliedAttributes: SelectedPriceAttribute[];
  private subclipMarkers: SubclipMarkersInterface.SubclipMarkers = null;
  private cartAsset: EnhancedAsset;
  private cartAssetPriceAttributes: SelectedPriceAttribute[];
  private isShared: boolean;

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
    private searchContext: SearchContext
  ) { }

  public ngOnInit(): void {
    this.store.select(state => state.pricing).subscribe((state: PricingState) => {
      this.appliedAttributes = state.appliedAttributes;
      this.selectedAttributes = state.selectedAttributes;
    });

    this.assetSubscription = this.store.select(state => state.asset.activeAsset)
      .map(asset => {
        const clonedAsset = Common.clone(asset);
        return enhanceAsset(clonedAsset, this.assetType, this.parentIdIn(this.route.snapshot.params));
      }).subscribe(asset => {
        this.asset = asset;
        this.store.dispatch(factory => factory.pricing.setPriceForDetails(this.asset.price));
        this.loadCorrespondingCartAsset();
      });

    this.routeSubscription = this.route.params.subscribe((params: any) => {
      this.isShared = !!params.share_key;
      this.commentParentObject = this.commentParentObjectFromRoute(params);
    });
  }

  public ngOnDestroy(): void {
    if (this.assetSubscription) this.assetSubscription.unsubscribe();
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
    if (this.pricingSubscription) this.pricingSubscription.unsubscribe();
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
          price: state.priceForDetails ? state.priceForDetails : null,
          asset: { assetId: parameters.assetId }
        },
        markers: parameters.markers,
        attributes: this.appliedAttributes ? this.appliedAttributes : null
      };

      this.userCan.administerQuotes() ?
        this.store.dispatch(factory => factory.quoteEdit.addAssetToProjectInQuote(options)) :
        this.cartService.addAssetToProjectInCart(options);
    });
  }

  public getPricingAttributes(rightsReproduction: string): void {
    this.store.dispatch(factory => factory.pricing.initializePricing(
      rightsReproduction,
      this.pricingDialogOptions
    ));
  }

  public onMarkersChange(markers: SubclipMarkersInterface.SubclipMarkers): void {
    const updatePrice: boolean =
      !!this.selectedAttributes && (
        SubclipMarkersInterface.bothMarkersAreSet(markers) ||
        SubclipMarkersInterface.neitherMarkersAreSet(markers)
      );

    this.subclipMarkers = SubclipMarkersInterface.bothMarkersAreSet(markers) ? markers : null;

    if (updatePrice) {
      this.store.dispatch(factory => factory.pricing.calculatePrice(
        this.selectedAttributes,
        this.asset.assetId,
        this.subclipMarkers
      ));
    }
  }

  public get assetMatchesCartAsset(): boolean {
    return this.cartAsset
      ? this.subclipMarkersMatchCartAsset
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

  private get pricingDialogOptions(): DefaultComponentOptions {
    return {
      componentType: WzPricingComponent,
      inputOptions: {
        pricingPreferences: this.userPreference.state.pricingPreferences,
        userCanCustomizeRights: this.userCan.administerQuotes() && this.assetType === 'quoteEditAsset'
      },
      outputOptions: [
        {
          event: 'pricingEvent',
          callback: (event: WzEvent, dialogRef: MatDialogRef<WzPricingComponent>) => {
            this.dispatchActionForPricingEvent(event, dialogRef);
          }
        }
      ]
    };
  }

  private dispatchActionForPricingEvent(event: WzEvent, dialogRef: MatDialogRef<WzPricingComponent>): void {
    switch (event.type) {
      case 'CALCULATE_PRICE':
        this.store.dispatch(factory => factory.pricing.calculatePrice(
          event.payload,
          this.asset.assetId,
          this.subclipMarkers
        ));
        break;
      case 'APPLY_PRICE':
        if (event.payload.updatePrefs) {
          this.userPreference.updatePricingPreferences(event.payload.preferences);
        }
        dialogRef.close();
        this.store.dispatch(factory => factory.pricing.setPriceForDetails(event.payload.price));
        this.store.dispatch(factory => factory.pricing.setAppliedAttributes(event.payload.attributes));
        if (this.assetType === 'quoteEditAsset') {
          this.store.dispatch(factory => factory.quoteEdit.editLineItemFromDetails(
            this.asset.uuid,
            this.subclipMarkers,
            event.payload.attributes
          ));
        }
        if (this.assetType === 'cartAsset') {
          this.store.dispatch(factory => factory.cart.editLineItemFromDetails(
            this.asset.uuid,
            this.subclipMarkers,
            event.payload.attributes
          ));
        }
        break;
      case 'ERROR':
        this.store.dispatch(factory => factory.error.handleCustomError(event.payload));
        break;
    }
  }

  private loadCorrespondingCartAsset(): void {
    this.cartAsset = null;
    this.cartAssetPriceAttributes = null;

    let projects: Project[];

    switch (this.assetType) {
      case 'cartAsset':
        projects = this.store.snapshotCloned(state => state.cart.data.projects);
        break;
      case 'quoteEditAsset':
        projects = this.store.snapshotCloned(state => state.quoteEdit.data.projects);
        break;
      default: return;
    }

    const lineItem = projects
      .filter(project => project.lineItems)
      .reduce((lineItems, project) => lineItems.concat(project.lineItems), [])
      .find(lineItem => lineItem.id === this.asset.uuid);

    if (!lineItem) return;  // Could happen during initialization.

    this.cartAsset = lineItem.asset ? enhanceAsset(lineItem.asset, this.assetType) : null;
    this.cartAssetPriceAttributes = lineItem.attributes || [];
  }

  private get subclipMarkersMatchCartAsset(): boolean {
    return SubclipMarkersInterface.matches(this.cartAsset.timeStart, this.cartAsset.timeEnd, this.subclipMarkers);
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
