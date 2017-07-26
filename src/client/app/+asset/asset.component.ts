import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CurrentUserService } from '../shared/services/current-user.service';
import { AssetService } from '../shared/services/asset.service';
import { AddAssetParameters } from '../shared/interfaces/commerce.interface';
import { WzEvent } from '../shared/interfaces/common.interface';
import { UiConfig } from '../shared/services/ui.config';
import { Capabilities } from '../shared/services/capabilities.service';
import { WzNotificationService } from '../shared/services/wz.notification.service';
import { CartService } from '../shared/services/cart.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { UiState } from '../shared/services/ui.state';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { MdDialogRef } from '@angular/material';
import { WzDialogService } from '../shared/modules/wz-dialog/services/wz.dialog.service';
import { WzPricingComponent } from '../shared/components/wz-pricing/wz.pricing.component';
import { ErrorStore } from '../shared/stores/error.store';
import { WindowRef } from '../shared/services/window-ref.service';
import { QuoteEditService } from '../shared/services/quote-edit.service';
import { PricingStore } from '../shared/stores/pricing.store';
import { Subscription } from 'rxjs/Subscription';
import { Asset } from '../shared/interfaces/common.interface';
import { AppStore } from '../app.store';
import { Collection } from '../shared/interfaces/collection.interface';

@Component({
  moduleId: module.id,
  selector: 'asset-component',
  templateUrl: 'asset.html',
})

export class AssetComponent implements OnInit, OnDestroy {
  public pricingAttributes: any;
  public rightsReproduction: string = '';
  public asset: Asset;
  private assetSubscription: Subscription;
  private selectedAttrbutes: any;
  private pageSize: number = 50;

  constructor(
    public currentUser: CurrentUserService,
    public userCan: Capabilities,
    public uiState: UiState,
    public assetService: AssetService,
    public uiConfig: UiConfig,
    public window: WindowRef,
    private store: AppStore,
    private userPreference: UserPreferenceService,
    private error: ErrorStore,
    private cart: CartService,
    private snackBar: MdSnackBar,
    private translate: TranslateService,
    private dialogService: WzDialogService,
    private quoteEditService: QuoteEditService,
    private pricingStore: PricingStore) {
  }

  public ngOnInit(): void {
    this.uiConfig.get('global').take(1).subscribe(config => {
      this.pageSize = config.config.pageSize.value;
    });

    // Hopefully temporary:  Maintaining a subscription instead of an Observable<Asset> because we need the current asset's
    // assetId in calculatePrice() below.
    this.assetSubscription = this.store.select(state => state.asset.currentAsset).subscribe(asset => this.asset = asset);
  }

  public ngOnDestroy(): void {
    if (this.assetSubscription) this.assetSubscription.unsubscribe();
  }

  public previousPage() {
    this.window.nativeWindow.history.back();
  }

  public get activeCollection(): Observable<Collection> {
    return this.store.select(state => state.activeCollection.collection);
  }

  public get userEmail(): Observable<any> {
    return this.currentUser.data.map(user => user.emailAddress);
  }

  public get priceForDetails(): Observable<number> {
    return this.pricingStore.priceForDetails;
  }

  public showSnackBar(message: any) {
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
        this.error.dispatch({ status: 'COMPS.NO_COMP' });
      }
    });
  }

  public addAssetToCart(parameters: any): void {
    this.pricingStore.priceForDetails.take(1).subscribe((price: any) => {
      let options: AddAssetParameters = {
        lineItem: {
          selectedTranscodeTarget: parameters.selectedTranscodeTarget,
          price: price ? price : undefined,
          asset: { assetId: parameters.assetId }
        },
        markers: parameters.markers,
        attributes: this.pricingStore.state.priceForDetails ? this.selectedAttrbutes : null
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
      this.assetService.getPriceAttributes(rightsReproduction).subscribe((attributes: any) => {
        this.pricingAttributes = attributes;
        this.openPricingDialog();
      });
    }
    this.rightsReproduction = rightsReproduction;
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
        this.error.dispatch({ status: event.payload });
        break;
      default:
        break;
    }
  }

  private calculatePrice(attributes: any): Observable<number> {
    this.selectedAttrbutes = attributes;
    return this.assetService.getPrice(this.asset.assetId, attributes);
  }
}
