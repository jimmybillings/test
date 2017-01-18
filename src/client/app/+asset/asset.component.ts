import { Component, OnInit } from '@angular/core';
import { CurrentUser } from '../shared/services/current-user.model';
import { AssetService } from '../shared/services/asset.service';
import { ActiveCollectionService } from '../shared/services/active-collection.service';
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

@Component({
  moduleId: module.id,
  selector: 'asset-component',
  templateUrl: 'asset.html'
})

export class AssetComponent implements OnInit {
  public pricingAttributes: Observable<any>;
  public calculatedPrice: Observable<number>;
  private pageSize: number = 50;

  constructor(
    public currentUser: CurrentUser,
    public userCan: Capabilities,
    public activeCollection: ActiveCollectionService,
    public searchContext: SearchContext,
    public uiState: UiState,
    public assetService: AssetService,
    public uiConfig: UiConfig,
    private userPreference: UserPreferenceService,
    private notification: WzNotificationService,
    private cart: CartService,
    private window: Window,
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
    this.activeCollection.addAsset(params.collection.id, params.asset).subscribe();
  }

  public removeFromCollection(params: any): void {
    this.userPreference.openCollectionTray();
    this.activeCollection.removeAsset(params).subscribe();
  }

  public downloadComp(params: any): void {
    this.assetService.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        this.window.location.href = res.url;
      } else {
        this.notification.create('COMPS.NO_COMP');
      }
    });
  }

  public addAssetToCart(asset: any): void {
    this.cart.addAssetToProjectInCart(asset.assetId, asset.selectedTranscodeTarget);
  }

  public calculatePrice(event: any): void {
    this.assetService.getPrice(event.assetId, event.attributes).take(1).subscribe((data: any) => {
      this.calculatedPrice = data;
    });
  }

  public getPricingAttributes(rightsReproduction: string): void {
    this.assetService.getPriceAttributes(rightsReproduction).subscribe((options: any) => {
      let dialogRef: MdDialogRef<any> = this.dialog.open(WzPricingComponent, { width: '500px' });
      dialogRef.componentInstance.dialog = dialogRef;
      dialogRef.componentInstance.options = options;
      dialogRef.afterClosed().subscribe(data => {
        if (data.attributes) {
          this.calculatePrice({ attributes: data.attributes, assetId: this.assetService.state.assetId });
        }
        if (data.error) this.notification.create('PRICING.ERROR');
      });
    });
  }
}
