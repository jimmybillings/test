import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUser } from '../shared/services/current-user.model';
import { AssetService} from '../shared/services/asset.service';
import { Observable} from 'rxjs/Rx';
import { CollectionStore } from '../shared/interfaces/collection.interface';
import { ActiveCollectionService } from '../shared/services/active-collection.service';
import { Store } from '@ngrx/store';
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
  public asset: Observable<any>;
  public pageSize: string;

  constructor(
    private route: ActivatedRoute,
    public currentUser: CurrentUser,
    public uiConfig: UiConfig,
    public assetService: AssetService,
    public router: Router,
    public userCan: Capabilities,
    public activeCollection: ActiveCollectionService,
    public notification: WzNotificationService,
    public cartSummary: CartSummaryService,
    public userPreference: UserPreferenceService,
    public searchContext: SearchContext,
    public store: Store<CollectionStore>) {
  }

  ngOnInit(): void {
    this.asset = this.assetService.data;
    this.asset.take(1).subscribe(data => console.log(data));
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
    let uuid: any = params.collection.assets.items.find((item: any) => parseInt(item.assetId) === parseInt(params.asset.assetId)).uuid;
    if (uuid && params.asset.assetId) {
      this.userPreference.openCollectionTray();
      this.activeCollection.removeAsset(collection.id, params.asset.assetId, uuid).take(1).subscribe();
    }
  }

  public downloadComp(params: any): void {
    this.assetService.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        window.location.href = res.url;
      } else {
        this.notification.create('COMPS.NO_COMP');
      }
    });
  }

  public showNewCollection(assetId: any): void {
    let newCollectionButton = <HTMLFormElement>document.querySelector('button.open-collection-tray');
    (!this.currentUser.loggedIn()) ? this.router.navigate(['/user/login']) : newCollectionButton.click();
  }

  public addAssetToCart(asset: any): void {
    this.cartSummary.addAssetToProjectInCart(asset.assetId, asset.selectedTranscodeTarget);
  }

  public backToResults(): void {
    this.router.navigate(['search/', this.searchContext.state]);
  }
}
