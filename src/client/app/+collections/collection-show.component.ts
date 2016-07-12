import { Component, OnInit, OnDestroy } from '@angular/core';
import { Collections, CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from './services/collections.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { AssetListComponent }  from '../shared/components/asset-list/asset-list.component';
import {PaginationComponent} from '../shared/components/pagination/pagination.component';
import { Store } from '@ngrx/store';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';
import { CurrentUser } from '../shared/services/current-user.model';
import { Error } from '../shared/services/error.service';
import { UiConfig } from '../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'collection-show',
  templateUrl: 'collection-show.html',
  providers: [CollectionsService],
  directives: [
    AssetListComponent,
    PaginationComponent,
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
      this.collectionsService.setFocusedCollection(params['id']).first().subscribe(fc => {
        if (fc.assets) {
          // need to make 20 dynamic - should reflect user pref (items per page)
          this.collectionsService.getCollectionItems(fc.id, 20).subscribe(search => {
            // I want to use this second search to get only the thumbnail, and then pass it to the store (updateFc)
            // Only issue is race condition when loading page for the first time
            // throws undefined but renders just fine
            // also if we change this to pass in the thumbnail for focused, we need to change it everywhere updateFc is called
            this.collectionsService.getCollectionItems(fc.id, 1, search.totalCount - 1).subscribe(thumbnail => {
              this.collectionsService.updateFocusedCollectionAssets(fc, search, thumbnail);
              // this.collectionsService.updateFocusedCollectionAssets(fc, search);
            });
          });
        } else {
          this.collectionsService.updateFocusedCollection(fc);
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
