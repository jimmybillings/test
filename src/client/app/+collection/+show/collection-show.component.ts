import { Component, OnInit, OnDestroy } from '@angular/core';
import { Collections, CollectionStore } from '../../shared/interfaces/collection.interface';
import { CollectionsService } from '../services/collections.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { WzAssetListComponent }  from '../../shared/components/wz-asset-list/wz.asset-list.component';
import { WzPaginationComponent} from '../../shared/components/wz-pagination/wz.pagination.component';
import { Store } from '@ngrx/store';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Error } from '../../shared/services/error.service';
import { UiConfig } from '../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'collection-show',
  templateUrl: 'collection-show.html',
  providers: [CollectionsService],
  directives: [
    WzAssetListComponent,
    WzPaginationComponent,
    ROUTER_DIRECTIVES
  ]
})

export class CollectionShowComponent implements OnInit, OnDestroy {
  public collections: Observable<Collections>;
  public focusedCollection: any;
  public collection: any;
  public assets: any;
  public errorMessage: string;
  public config: Object;
  private focusedCollectionStoreSubscription: Subscription;
  private routeSubscription: Subscription;
  public date(date: any): Date {
    if (date) {
      return new Date(date);
    } else {
      return new Date();
    };
  }

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    public currentUser: CurrentUser,
    public error: Error,
    public uiConfig: UiConfig) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.collectionsService.setFocusedCollection(params['id']).first().subscribe(collection => {
        this.collectionsService.updateFocusedCollection(collection);
        if (collection.assets) {
          this.collectionsService.getCollectionItems(collection.id, 300).first().subscribe(assets => {
            this.collectionsService.updateFocusedCollectionAssets(assets);
          });
        }
      });

      this.focusedCollectionStoreSubscription = this.store.select('focusedCollection').subscribe(focusedCollection => {
        this.focusedCollection = focusedCollection;
        this.collection = this.focusedCollection;
        this.assets = this.collection.assets;
      });

    });

  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.focusedCollectionStoreSubscription.unsubscribe();
  }

  public showAsset(asset: any): void {
    this.router.navigate(['/asset', asset.assetId]);
  }
}
