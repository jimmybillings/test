import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '../shared/services/current-user.service';
import { AssetService } from '../store/services/asset.service';
import { AddAssetParameters, PriceAttribute } from '../shared/interfaces/commerce.interface';
import { WzEvent } from '../shared/interfaces/common.interface';
import { UiConfig } from '../shared/services/ui.config';
import { Capabilities } from '../shared/services/capabilities.service';
import { CartService } from '../shared/services/cart.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { UiState } from '../shared/services/ui.state';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { MdDialogRef } from '@angular/material';
import { WzDialogService } from '../shared/modules/wz-dialog/services/wz.dialog.service';
import { WzPricingComponent } from '../shared/components/wz-pricing/wz.pricing.component';
import { WindowRef } from '../shared/services/window-ref.service';
import { QuoteEditService } from '../shared/services/quote-edit.service';
import { PricingStore } from '../shared/stores/pricing.store';
import { Subscription } from 'rxjs/Subscription';
import { EnhancedAsset, enhanceAsset, AssetType } from '../shared/interfaces/enhanced-asset';
import { Asset, Pojo } from '../shared/interfaces/common.interface';
import * as SubclipMarkersInterface from '../shared/interfaces/subclip-markers';
import { AppStore, StateMapper } from '../app.store';
import { Collection } from '../shared/interfaces/collection.interface';
import { PricingService } from '../shared/services/pricing.service';
import { Common } from '../shared/utilities/common.functions';

@Component({
  moduleId: module.id,
  selector: 'asset-component',
  templateUrl: 'asset.html',
})
export class AssetComponent implements OnInit, OnDestroy {
  @Input() assetType: AssetType;
  @Input()
  set stateMapper(stateMapper: StateMapper<Asset>) {
    this.assetSubscription = this.store.select(stateMapper)
      .map(asset => {
        const clonedAsset: Asset = Common.clone(asset);
        return enhanceAsset(clonedAsset, this.assetType, this.parentIdIn(this.route.snapshot.params));
      }).subscribe(asset => {
        this.asset = asset;
        this.pricingStore.setPriceForDetails(this.asset.price);
        this.selectedAttributes = null;
      });
  }
  public pricingAttributes: Array<PriceAttribute>;
  public rightsReproduction: string = '';
  public asset: EnhancedAsset;
  private assetSubscription: Subscription;
  private routeSubscription: Subscription;
  private selectedAttributes: Pojo;
  private pageSize: number = 50;
  private subclipMarkers: SubclipMarkersInterface.SubclipMarkers = null;

  constructor(
    public currentUser: CurrentUserService,
    public userCan: Capabilities,
    public uiState: UiState,
    public assetService: AssetService,
    public uiConfig: UiConfig,
    public window: WindowRef,
    private router: Router,
    private route: ActivatedRoute,
    private store: AppStore,
    private userPreference: UserPreferenceService,
    private cart: CartService,
    private snackBar: MdSnackBar,
    private translate: TranslateService,
    private dialogService: WzDialogService,
    private quoteEditService: QuoteEditService,
    private pricingStore: PricingStore,
    private pricingService: PricingService
  ) { }

  public ngOnInit(): void {
    this.uiConfig.get('global').take(1).subscribe(config => {
      this.pageSize = config.config.pageSize.value;
    });
  }

  public ngOnDestroy(): void {
    if (this.assetSubscription) this.assetSubscription.unsubscribe();
  }

  public previousPage(): void {
    this.window.nativeWindow.history.back();
  }

  public get activeCollection(): Observable<Collection> {
    return this.store.select(state => state.activeCollection.collection);
  }

  public onBreadcrumbClick(): void {
    switch (this.asset.type) {
      case 'collectionAsset': {
        this.router.navigate(['collections', this.asset.parentId, { i: 1, n: this.pageSize }]);
        break;
      }
      case 'searchAsset': {
        this.previousPage();
        break;
      }
      case 'quoteEditAsset': {
        this.router.navigate(['active-quote']);
        break;
      }
      case 'quoteShowAsset': {
        this.router.navigate(['quotes', this.asset.parentId]);
        break;
      }
      case 'orderAsset': {
        this.router.navigate(['orders', this.asset.parentId]);
        break;
      }
      case 'cartAsset': {
        this.router.navigate(['cart']);
        break;
      }
    }
  }

  public get userEmail(): Observable<string> {
    return this.currentUser.data.map(user => user.emailAddress);
  }

  public get priceForDetails(): Observable<number> {
    return this.pricingStore.priceForDetails;
  }

  public showSnackBar(message: any): void {
    this.translate.get(message.key, message.value)
      .subscribe((res: string) => {
        this.snackBar.open(res, '', { duration: 2000 });
      });
  }

  public downloadComp(params: any): void {
    this.assetService.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        this.window.nativeWindow.location.href = res.url;
      } else {
        this.store.dispatch(factory => factory.error.handleCustomError('COMPS.NO_COMP'));
      }
    });
  }

  public addAssetToCart(parameters: any): void {
    this.pricingStore.priceForDetails.take(1).subscribe((price: number) => {
      let options: AddAssetParameters = {
        lineItem: {
          selectedTranscodeTarget: parameters.selectedTranscodeTarget,
          price: price ? price : undefined,
          asset: { assetId: parameters.assetId }
        },
        markers: parameters.markers,
        attributes: this.pricingStore.state.priceForDetails ? this.selectedAttributes : null
      };
      this.userCan.administerQuotes() ?
        this.quoteEditService.addAssetToProjectInQuote(options) :
        this.cart.addAssetToProjectInCart(options);
    });
    this.showSnackBar({
      key: this.userCan.administerQuotes() ? 'ASSET.ADD_TO_QUOTE_TOAST' : 'ASSET.ADD_TO_CART_TOAST',
      value: { assetId: parameters.assetId }
    });
  }

  public getPricingAttributes(rightsReproduction: string): void {
    if (this.rightsReproduction === rightsReproduction) {
      this.openPricingDialog();
    } else {
      this.pricingService.getPriceAttributes(rightsReproduction).subscribe((attributes: Array<PriceAttribute>) => {
        this.pricingAttributes = attributes;
        this.openPricingDialog();
      });
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
      this.calculatePrice(this.selectedAttributes).subscribe((price: number) => {
        this.pricingStore.setPriceForDetails(price);
        this.pricingStore.setPriceForDialog(price);
      });
    }
  }

  private openPricingDialog(): void {
    this.dialogService.openComponentInDialog(
      {
        componentType: WzPricingComponent,
        inputOptions: {
          attributes: this.pricingAttributes,
          pricingPreferences: this.userPreference.state.pricingPreferences,
          usagePrice: this.pricingStore.priceForDialog
        },
        outputOptions: [
          {
            event: 'pricingEvent',
            callback: this.applyPricing
          }
        ]
      }
    );
  }

  private applyPricing = (event: WzEvent, dialogRef: MdDialogRef<WzPricingComponent>) => {
    switch (event.type) {
      case 'CALCULATE_PRICE':
        this.calculatePrice(event.payload).subscribe((price: number) => {
          this.pricingStore.setPriceForDialog(price);
        });
        break;
      case 'APPLY_PRICE':
        this.pricingStore.setPriceForDetails(event.payload.price);
        this.userPreference.updatePricingPreferences(event.payload.attributes);
        dialogRef.close();
        break;
      case 'ERROR':
        this.store.dispatch(factory => factory.error.handleCustomError(event.payload));
        break;
      default:
        break;
    }
  }

  private calculatePrice(attributes: Pojo): Observable<number> {
    this.selectedAttributes = attributes;
    return this.pricingService.getPriceFor(this.asset, attributes, this.subclipMarkers);
  }

  // I'd like to eliminate this, but we set up the dynamic parts of our routes too specifically
  private parentIdIn(routeParams: Pojo): number {
    switch (this.assetType) {
      case 'collectionAsset': {
        return Number(routeParams.id);
      }

      case 'orderAsset': {
        return Number(routeParams.orderId);
      }

      case 'quoteShowAsset': {
        return Number(routeParams.quoteId);
      }

      default: {
        return NaN;
      }
    }
  }
}
