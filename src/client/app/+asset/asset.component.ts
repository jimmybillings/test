import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CurrentUserService } from '../shared/services/current-user.service';
import { AssetService } from '../shared/services/asset.service';
import { ActiveCollectionService } from '../shared/services/active-collection.service';
import { AddAssetParameters } from '../shared/interfaces/commerce.interface';
import { WzEvent } from '../shared/interfaces/common.interface';
import { UiConfig } from '../shared/services/ui.config';
import { Capabilities } from '../shared/services/capabilities.service';
import { WzNotificationService } from '../shared/services/wz.notification.service';
import { CartService } from '../shared/services/cart.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { SearchContext } from '../shared/services/search-context.service';
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

@Component({
  moduleId: module.id,
  selector: 'asset-component',
  templateUrl: 'asset.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class AssetComponent implements OnInit {
  public pricingAttributes: any;
  public rightsReproduction: string = '';
  public usagePrice: Observable<any> = Observable.of(null);
  private selectedAttrbutes: any;
  private pageSize: number = 50;

  constructor(
    public currentUser: CurrentUserService,
    public userCan: Capabilities,
    public activeCollection: ActiveCollectionService,
    public searchContext: SearchContext,
    public uiState: UiState,
    public assetService: AssetService,
    public uiConfig: UiConfig,
    public window: WindowRef,
    private userPreference: UserPreferenceService,
    private error: ErrorStore,
    private cart: CartService,
    private snackBar: MdSnackBar,
    private translate: TranslateService,
    private dialogService: WzDialogService,
    private quoteEditService: QuoteEditService) {
    this.window = this.window;
  }

  ngOnInit(): void {
    this.uiConfig.get('global').take(1).subscribe(config => {
      this.pageSize = config.config.pageSize.value;
    });
  }

  public showSnackBar(message: any) {
    this.translate.get(message.key, message.value)
      .subscribe((res: string) => {
        this.snackBar.open(res, '', { duration: 2000 });
      });
  }

  public addToCollection(params: any): void {
    this.userPreference.openCollectionTray();
    if (params.markers) {
      this.activeCollection.addAsset(params.collection.id, params.asset, params.markers).subscribe();
    } else {
      this.activeCollection.addAsset(params.collection.id, params.asset).subscribe();
    };
    this.showSnackBar({
      key: 'COLLECTION.ADD_TO_COLLECTION_TOAST',
      value: { collectionName: params.collection.name }
    });
  }

  public removeFromCollection(params: any): void {
    this.userPreference.openCollectionTray();
    this.activeCollection.removeAsset(params).subscribe();
    this.showSnackBar({
      key: 'COLLECTION.REMOVE_FROM_COLLECTION_TOAST',
      value: { collectionName: params.collection.name }
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

  public addAssetToCart(asset: any): void {
    this.usagePrice.take(1).subscribe((price: any) => {
      let options: AddAssetParameters = {
        lineItem: {
          selectedTranscodeTarget: asset.selectedTranscodeTarget,
          price: price ? price : undefined,
          asset: {
            assetId: asset.assetId,
            timeStart: asset.markers ? asset.markers.markers.in : undefined,
            timeEnd: asset.markers ? asset.markers.markers.out : undefined
          }
        },
        attributes: this.selectedAttrbutes
      };
      this.userCan.administerQuotes() ?
        this.quoteEditService.addAssetToProjectInQuote(options) :
        this.cart.addAssetToProjectInCart(options);
    });
    this.showSnackBar({
      key: this.userCan.administerQuotes() ? 'ASSET.ADD_TO_QUOTE_TOAST' : 'ASSET.ADD_TO_CART_TOAST',
      value: { assetId: asset.assetId }
    });
  }

  public calculatePrice(attributes: any): Observable<number> {
    this.selectedAttrbutes = attributes;
    return this.assetService.getPrice(this.assetService.state.assetId, attributes)
      .map((data: any) => { return data.price; })
      .share();
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
          usagePrice: null
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
        this.calculatePrice(event.payload).subscribe(usagePrice => {
          dialogRef.componentInstance.usagePrice = Observable.of(usagePrice);
          this.usagePrice = Observable.of(usagePrice);
        });
        break;
      case 'UPDATE_PREFERENCES':
        this.userPreference.updatePricingPreferences(event.payload);
        dialogRef.close();
        break;
      case 'ERROR':
        this.error.dispatch({ status: event.payload });
        break;
      default:
        break;
    }
  }
}
