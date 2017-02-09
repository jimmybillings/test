import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../shared/services/current-user.service';
import { AssetService } from '../shared/services/asset.service';
import { ActiveCollectionService } from '../shared/services/active-collection.service';
// import { SubclipMarkers } from '../shared/interfaces/asset.interface';
import { UiConfig } from '../shared/services/ui.config';
import { Capabilities } from '../shared/services/capabilities.service';
import { WzNotificationService } from '../shared/components/wz-notification/wz.notification.service';
import { CartService } from '../shared/services/cart.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { SearchContext } from '../shared/services/search-context.service';
import { UiState } from '../shared/services/ui.state';
import { Observable } from 'rxjs/Rx';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from 'ng2-translate';
import { MdDialog, MdDialogRef } from '@angular/material';
import { WzPricingComponent } from '../shared/components/wz-pricing/wz.pricing.component';
import { ErrorStore } from '../shared/stores/error.store';

@Component({
  moduleId: module.id,
  selector: 'asset-component',
  templateUrl: 'asset.html'
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
    public window: Window,
    private userPreference: UserPreferenceService,
    private error: ErrorStore,
    private cart: CartService,
    private snackBar: MdSnackBar,
    private translate: TranslateService,
    private dialog: MdDialog) {
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
        this.window.location.href = res.url;
      } else {
        this.error.dispatch({ status: 'COMPS.NO_COMP' });
      }
    });
  }

  public addAssetToCart(asset: any): void {
    this.usagePrice.take(1).subscribe((price: any) => {
      this.cart.addAssetToProjectInCart({
        lineItem: {
          selectedTranscodeTarget: asset.selectedTranscodeTarget,
          price: price ? price : undefined,
          asset: {
            assetId: asset.assetId,
            startTime: asset.markers ? asset.markers.markers.in : undefined,
            endTime: asset.markers ? asset.markers.markers.out : undefined
          }
        },
        attributes: this.selectedAttrbutes
      });
    });
    this.showSnackBar({
      key: 'ASSET.ADD_TO_CART_TOAST',
      value: { assetId: asset.assetId }
    });
  }

  public calculatePrice(attributes: any): Observable<number> {
    this.selectedAttrbutes = attributes;
    return this.assetService.getPrice(this.assetService.state.assetId, attributes).map((data: any) => { return data.price; });
  }

  public getPricingAttributes(rightsReproduction: string): void {
    if (this.rightsReproduction === rightsReproduction) {
      this.buildPricingDialog();
    } else {
      this.assetService.getPriceAttributes(rightsReproduction).subscribe((attributes: any) => {
        this.pricingAttributes = attributes;
        this.buildPricingDialog();
      });
    }
    this.rightsReproduction = rightsReproduction;
  }

  private buildPricingDialog(): void {
    let dialogRef: MdDialogRef<any> = this.dialog.open(WzPricingComponent);
    dialogRef.componentInstance.dialog = dialogRef;
    dialogRef.componentInstance.pricingPreferences = this.userPreference.state.pricingPreferences;
    dialogRef.componentInstance.attributes = this.pricingAttributes;
    dialogRef.componentInstance.calculatePrice.subscribe((form: any) => {
      this.usagePrice = this.calculatePrice(form);
      dialogRef.componentInstance.usagePrice = this.usagePrice;
    });
    dialogRef.afterClosed().subscribe(data => {
      if (!data) return;
      if (data.price) this.usagePrice = data.price;
      if (data.attributes) this.userPreference.updatePricingPreferences(data.attributes);
      if (data.error) this.error.dispatch({ status: 'PRICING.ERROR' });
    });
  }
}
