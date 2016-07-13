import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AssetData } from './services/asset.data.service';
import { WzAssetListComponent }  from '../shared/components/wz-asset-list/wz.asset-list.component';
import { UiConfig} from '../shared/services/ui.config';
import { Observable, Subscription} from 'rxjs/Rx';
import { CurrentUser} from '../shared/services/current-user.model';
import { Error } from '../shared/services/error.service';
import { WzPaginationComponent} from '../shared/components/wz-pagination/wz.pagination.component';
import { SearchContext} from '../shared/services/search-context.service';
import { FilterTree} from './filter-tree';
import { FilterTreeComponent} from './filter-tree.component';
import { Collection, Collections, CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from '../+collection/services/collections.service';
import { Store } from '@ngrx/store';


/**
 * Asset search page component - renders search page results
 */
@Component({
  moduleId: module.id,
  selector: 'search',
  templateUrl: 'search.html',
  directives: [WzAssetListComponent, WzPaginationComponent, FilterTreeComponent],
  providers: [AssetData]
})


export class SearchComponent implements OnInit, OnDestroy {
  public config: Object;
  public errorMessage: string;
  public rootFilter: FilterTree;
  public filterIds: Array<string> = new Array();
  public filterValues: Array<string> = new Array();
  public collections: Observable<Collections>;
  public focusedCollection: Observable<any>;
  public sub: any;
  public assets: Observable<any>;
  private assetsStoreSubscription: Subscription;
  private routeSubscription: Subscription;
  private configSubscription: Subscription;

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    public assetData: AssetData,
    public router: Router,
    public uiConfig: UiConfig,
    public currentUser: CurrentUser,
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    public error: Error,
    public searchContext: SearchContext) {
    this.assetsStoreSubscription = this.assetData.assets.subscribe(data => {
      this.assets = data;
    });
    this.rootFilter = new FilterTree('', '', [], 'None', -1);
  }

  ngOnInit(): void {
    this.configSubscription = this.uiConfig.get('search').subscribe((config) => this.config = config.config);
    this.searchContext.update = this.route.snapshot.params;
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.newSearch();
      this.getFilterTree();
    });
    this.focusedCollection = this.store.select('focusedCollection');
  }

  ngOnDestroy(): void {
    this.assetData.clearAssets();
    this.assetsStoreSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.configSubscription.unsubscribe();
  }

  public showAsset(asset: any): void {
    this.router.navigate(['/asset', asset.assetId]);
  }

  public addToCollection(params: any): void {
    let collection: Collection = params.collection;
    collection.assets ? collection.assets.items.push(params.asset) : collection.assets.items = [params.asset];
    this.collectionsService.addAssetsToCollection(collection.id, params.asset).first().subscribe(payload => {
      this.collectionsService.getCollectionItems(collection.id, 300).first().subscribe(search => {
        this.collectionsService.updateFocusedCollectionAssets(payload, search);
        this.collectionsService.updateCollectionInStore(payload, search);
      });
    });
  }

  public showNewCollection(asset: any): void {
    let newCollectionButton = <HTMLFormElement>document.querySelector('button.open-bin-tray');
    !this.currentUser.loggedIn() ?
      this.router.navigate(['/user/login']) :
      newCollectionButton.click();
    sessionStorage.setItem('assetForNewCollection', JSON.stringify(asset));
  }

  public addToCart(asset: any) {
    return asset;
  }

  public downloadComp(asset: any) {
    return asset;
  }

  public changePage(page: any): void {
    this.searchContext.update = { i: page };
    this.searchContext.go();
  }

  public keywordSearch(): void {
    this.route.params.first().subscribe(params => {
      this.searchContext.update = params;
      this.newSearch();
    });
  }

  public newSearch() {
    this.assetData.searchAssets(this.searchContext.state).first().subscribe(
      payload => this.assetData.storeAssets(payload),
      error => this.error.handle(error)
    );
  }

  public filterAssets(): void {
    this.searchContext.update = { i: 1 };
    if (this.filterIds.length > 0) {
      this.searchContext.update = { 'filterIds': this.filterIds.join(',') };
    } else {
      this.searchContext.update = { 'filterIds': null };
    }
    if (this.filterValues.length > 0 && this.filterIds.length > 0) {
      this.searchContext.update = { 'filterValues': this.filterValues.join(',') };
    } else {
      this.searchContext.update = { 'filterValues': null };
    }
    this.searchContext.go();
  }

  public getFilterTree(): void {
    let fids = this.searchContext.state['filterIds'];
    if (fids && fids !== null) {
      if (typeof fids === 'string') { fids.split(',').forEach(x => this.filterIds.push(x)); }
    }
    let v: Array<string> = this.filterIds;
    this.assetData.getFilterTree(this.searchContext.state).first().subscribe(
      payload => { this.rootFilter = new FilterTree('', '', [], '', -1).load(payload, null, v); },
      error => this.error.handle(error)
    );
  }

  public doFilter(filter: FilterTree): void {
    if (filter.checked === true) {
      if (filter.contains(this.filterIds, filter.filterId) === false) {
        this.filterIds.push(filter.filterId);
      }
    } else {
      for (let i = 0; i < this.filterIds.length; i++) {
        if (this.filterIds[i].toString() === filter.filterId.toString()) {
          this.filterIds.splice(i, 1);
        }
      }
    }
    this.filterAssets();
  }
}
