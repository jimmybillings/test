import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, RouteSegment} from '@angular/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { AssetData } from './services/asset.data.service';
import { AssetListComponent }  from '../shared/components/asset-list/asset-list.component';
import {UiConfig} from '../shared/services/ui.config';
import {Observable} from 'rxjs/Rx';
import {CurrentUser} from '../shared/services/current-user.model';
import { Error } from '../shared/services/error.service';
import {PaginationComponent} from '../shared/components/pagination/pagination.component';
import {SearchContext} from '../shared/services/search-context.service';
import { Collection, Collections, CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from '../+collections/services/collections.service';
import { Store } from '@ngrx/store';

/**
 * Asset search page component - renders search page results
 */
@Component({
  moduleId: module.id,
  selector: 'search',
  templateUrl: 'search.html',
  directives: [AssetListComponent, PaginationComponent],
  providers: [AssetData],
  pipes: [TranslatePipe]

})

export class SearchComponent implements OnInit, OnDestroy {
  public config: Object;
  public assets: Observable<any>;
  public errorMessage: string;
  public collections: Observable<Collections>;
  public focusedCollection: Observable<any>;

  constructor(
    private _router: Router,
    private routeSegment: RouteSegment,
    public assetData: AssetData,
    public router: Router,
    public uiConfig: UiConfig,
    public currentUser: CurrentUser,
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    public error: Error,
    public searchContext: SearchContext) {
    this.assets = this.assetData.assets;
    this.assets.subscribe(data => {
      this.assets = data;
    });
  }

  ngOnInit(): void {
    this.uiConfig.get('search').subscribe((config) => this.config = config.config);
    this.searchAssets();
    // this.collectionsService.loadCollections();
    // this.collections = this.collectionsService.collections;
    this.focusedCollection = this.store.select('focusedCollection');
    // this.focusedCollection.subscribe(f => console.log(f));
    // this.collections.subscribe(c => console.log(c));
  }

  ngOnDestroy(): void {
    this.assetData.clearAssets();
  }

  showAsset(asset: any): void {
    this.router.navigate(['/asset', asset.assetId]);
  }

  addToCollection(params: any): void {
    let collection: Collection = params.collection;
    collection.assets ? collection.assets.push(params.assetId) : collection.assets = [params.assetId];
    this.collectionsService.addAssetsToCollection(collection, params.assetId);
  }

  // NOT available yet
  // selectFocusedCollection(collection: Collection) {
  //   this.collectionsService.setFocusedCollection(collection);
  // }

  showNewCollection(asset: any): void {
    !this.currentUser.loggedIn() ? this.router.navigate(['/user/login']) : this.router.navigate(['/collection', { 'asset': asset.assetId }]);
  }

  addToCart(asset: any): void {
    console.log(asset);
  }

  downloadComp(asset: any): void {
    console.log(asset);
  }

  changePage(page: any): void {
    this.searchContext.new({ i: page });
  }

  public searchAssets(): void {
    this.searchContext.set(this.routeSegment.parameters);
    this.assetData.searchAssets(this.searchContext.get()).subscribe(
      payload => this.assetData.storeAssets(payload),
      error => this.error.handle(error)
    );
  }
}
