import { Component, OnInit } from '@angular/core';
import { CurrentUser } from '../shared/services/current-user.model';
import { AssetService} from '../shared/services/asset.service';
import { ActiveCollectionService } from '../shared/services/active-collection.service';
import { UiConfig } from '../shared/services/ui.config';
import { Capabilities } from '../shared/services/capabilities.service';
import { WzNotificationService } from '../shared/components/wz-notification/wz.notification.service';
import { CartSummaryService } from '../shared/services/cart-summary.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { SearchContext } from '../shared/services/search-context.service';

/**
 * Asset page component - renders an asset show page
 */
@Component({
  moduleId: module.id,
  selector: 'asset-component',
  templateUrl: 'asset.html'
})

export class AssetComponent implements OnInit {
  private pageSize: number = 50;

  constructor(
    public currentUser: CurrentUser,
    public userCan: Capabilities,
    public activeCollection: ActiveCollectionService,
    public searchContext: SearchContext,
    private userPreference: UserPreferenceService,
    private assetService: AssetService,
    private uiConfig: UiConfig,
    private notification: WzNotificationService,
    private cartSummary: CartSummaryService,
    private window: Window) {
  }

  ngOnInit(): void {
    this.uiConfig.get('global').take(1).subscribe(config => {
      this.pageSize = config.config.pageSize.value;
    });
  }

  public addToCollection(params: any): void {
    this.userPreference.openCollectionTray();
    this.activeCollection.addAsset(params.collection.id, params.asset).take(1).subscribe(() => {
      this.activeCollection.getItems(params.collection.id, { n: this.pageSize }).take(1).subscribe();
    });
  }

  public removeFromCollection(params: any): void {
    let collection: any = params.collection;
    let asset: any = params.collection.assets.items.find((item: any) => parseInt(item.assetId) === parseInt(params.asset.assetId));
    if (asset && asset.uuid && params.asset.assetId) {
      this.userPreference.openCollectionTray();
      this.activeCollection.removeAsset(collection.id, params.asset.assetId, asset.uuid).take(1).subscribe();
    }
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
    this.cartSummary.addAssetToProjectInCart(asset.assetId, asset.selectedTranscodeTarget);
  }

}
