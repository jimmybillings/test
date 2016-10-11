import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Collection, CollectionStore } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../../shared/services/collections.service';
import { ActiveCollectionService } from '../../shared/services/active-collection.service';
import { Subscription } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute} from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { UiConfig } from '../../shared/services/ui.config';
import { UiState } from '../../shared/services/ui.state';
import { AssetService } from '../../shared/services/asset.service';
import { WzNotificationService } from '../../shared/components/wz-notification/wz.notification.service';
import { Capabilities } from '../../shared/services/capabilities.service';
import { CartSummaryService } from '../../shared/services/cart-summary.service';

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
  @ViewChild('target', { read: ViewContainerRef }) private target: any;
  private activeCollectionSubscription: Subscription;
  private routeSubscription: Subscription;
  public date(date: any): Date {
    return (date) ? new Date(date) : new Date();
  }

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
    public cartSummary: CartSummaryService) { }

  ngOnInit() {
    this.activeCollectionSubscription = this.activeCollection.data.subscribe(collection => {
      this.collection = collection;
    });
    this.routeSubscription = this.route.params.subscribe(params => this.buildRouteParams(params));
  }

  public buildRouteParams(params: any): void {
    this.routeParams = Object.assign({}, this.routeParams, params);
    delete(this.routeParams['id']);
  }

  ngOnDestroy() {
    this.activeCollectionSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  public removeFromCollection(params: any): void {
    let collection: any = params.collection;
    let uuid: any = params.collection.assets.items.find((item: any) => {
      return parseInt(item.assetId) === parseInt(params.asset.assetId);
    }).uuid;
    if(uuid && params.asset.assetId) {
      this.activeCollection.removeAsset(collection.id, params.asset.assetId, uuid)
        .take(1).subscribe();
    }
  }

  public changePage(i: any): void {
    this.buildRouteParams({i});
    this.router.navigate(['/collection/' + this.collection.id, this.routeParams ]);
  }

  public downloadComp(params: any): void {
    this.asset.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        window.location.href = res.url;
      } else {
        this.notification.create(this.target, {trString: 'COMPS.NO_COMP', theme: 'alert'});
      }
    });
  }

  public deleteCollection(id: number): void {
    this.collections.delete(id).take(1).subscribe(payload => {
      let collectionLength: number;
      this.collections.data
        .take(1).subscribe(collection => collectionLength = collection.items.length);

      // if we are deleting current active, we need to get the new active from the server.
      if (this.activeCollection.isActiveCollection(id) && collectionLength > 0) {
        this.activeCollection.get().take(1).subscribe((collection) => {
          this.activeCollection.getItems(collection.id, { n: 100 }).take(1).subscribe(d => {
            this.router.navigate(['/collection/' + collection.id, {i: 1, n: 100} ]);
          });
        });
      }
      // if we delete the last collection, reset the store to initial values (no active collection)
      if (collectionLength === 0) {
        this.collections.destroyAll();
        this.activeCollection.get().take(1).subscribe((collection) => {
          this.activeCollection.getItems(collection.id, { n: 100 }).take(1).subscribe();
          this.collections.load().take(1).subscribe(d => {
            this.router.navigate(['/collection/' + collection.id, {i: 1, n: 100} ]);
          });
        });
      }
    });
  }

  public addAssetToCart(asset: any): void {
    this.cartSummary.addAssetToProjectInCart(asset);
  }
}
