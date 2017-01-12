import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Collection, CollectionStore } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../../shared/services/collections.service';
import { ActiveCollectionService } from '../../shared/services/active-collection.service';
import { Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiConfig } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { AssetService } from '../../shared/services/asset.service';
import { WzNotificationService } from '../../shared/components/wz-notification/wz.notification.service';
import { WzToastComponent } from '../../shared/components/wz-toast/wz.toast.component';
import { Capabilities } from '../../shared/services/capabilities.service';
import { CartService } from '../../shared/services/cart.service';
import { UserPreferenceService } from '../../shared/services/user-preference.service';

@Component({
  moduleId: module.id,
  selector: 'collection-show',
  templateUrl: 'collection-show.html',
})


export class CollectionShowComponent implements OnInit, OnDestroy {
  public focusedCollection: Collection;
  public collection: Collection;
  public assets: any;
  public routeParams: any;
  public errorMessage: string;
  public config: Object;
  private activeCollectionSubscription: Subscription;
  private routeSubscription: Subscription;
  @ViewChild(WzToastComponent) private wzToast: WzToastComponent;

  constructor(
    private route: ActivatedRoute,
    public userCan: Capabilities,
    public router: Router,
    public collections: CollectionsService,
    public asset: AssetService,
    public activeCollection: ActiveCollectionService,
    public store: Store<CollectionStore>,
    public currentUser: CurrentUser,
    public uiState: UiState,
    public notification: WzNotificationService,
    public uiConfig: UiConfig,
    public cart: CartService,
    public userPreference: UserPreferenceService) { }

  ngOnInit() {
    this.activeCollectionSubscription = this.activeCollection.data.subscribe(collection => {
      this.collection = collection;
    });
    this.routeSubscription = this.route.params.subscribe(params => this.buildRouteParams(params));
  }

  ngOnDestroy() {
    this.activeCollectionSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  public resetCollection() {
    this.collection = Object.assign({}, this.collection);
  }

  public buildRouteParams(params: any): void {
    this.routeParams = Object.assign({}, this.routeParams, params);
    delete (this.routeParams['id']);
  }

  public removeFromCollection(params: any): void {
    this.userPreference.openCollectionTray();
    this.activeCollection.removeAsset(params).subscribe();
  }

  public changePage(i: any): void {
    this.buildRouteParams({ i });
    this.router.navigate(['/collection/' + this.collection.id, this.routeParams]);
  }

  public downloadComp(params: any): void {
    this.asset.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        window.location.href = res.url;
      } else {
        this.notification.create('COMPS.NO_COMP');
      }
    });
  }

  public deleteCollection(id: number): void {
    this.collections.delete(id).subscribe(response => {
      this.router.navigate(['/collections']).then(() => {
        this.wzToast.show();
      });
    });
  }

  public addAssetToCart(asset: any): void {
    this.cart.addAssetToProjectInCart(asset);
  }
}
