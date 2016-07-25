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
import { UiState } from '../shared/services/ui.state';
import { Collection, Collections, CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from '../+collection/services/collections.service';
import { ActiveCollectionService } from '../+collection/services/active-collection.service';
import { Store } from '@ngrx/store';
import { FilterComponent } from './filter.component';
import { FilterService } from './services/filter.service';
/**
 * Asset search page component - renders search page results
 */
@Component({
  moduleId: module.id,
  selector: 'search',
  templateUrl: 'search.html',
  directives: [WzAssetListComponent, WzPaginationComponent, FilterComponent],
  providers: [FilterService]
})

export class SearchComponent implements OnInit, OnDestroy {
  public config: Object;
  public errorMessage: string;
  public filterIds: Array<string> = new Array();
  public filterValues: Array<string> = new Array();
  public collections: Observable<Collections>;
  public activeCollectionStore: Observable<any>;
  public assets: Observable<any>;
  public filtersStoreSubscription: Subscription;
  public filters: any;
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
    public activeCollection: ActiveCollectionService,
    public store: Store<CollectionStore>,
    public error: Error,
    public searchContext: SearchContext,
    public filterService: FilterService,
    public uiState: UiState) {}

  ngOnInit(): void {
    this.filtersStoreSubscription = this.filterService.filters.subscribe(data => this.filters = data);
    this.assetsStoreSubscription = this.assetData.assets.subscribe(data => this.assets = data);
    this.configSubscription = this.uiConfig.get('search').subscribe((config) => this.config = config.config);
    this.routeSubscription = this.route.params.subscribe(params => {
      this.filterService.getFilters(params).first().subscribe();
      this.getCurrentFilters(params);
    });
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
    this.uiState.openBinTray();
    this.activeCollection.addAsset(params.collection.id, params.asset).take(1).subscribe((asset) => {
      this.activeCollection.addAssetToStore(Object.assign(params.asset, asset.list[0]));
    });
  }

  public removeFromCollection(params: any): void {
    let collection: Collection = params.collection;
    let uuid: any = params.collection.assets.items.find((item: any) => item.assetId === params.asset.assetId).uuid;
    if(uuid && params.asset.assetId) {
      this.activeCollection.removeAsset(collection.id, params.asset.assetId, uuid).take(1).subscribe();
    }
  }

  public showNewCollection(asset: any): void {
    let newCollectionButton = <HTMLFormElement>document.querySelector('button.open-bin-tray');
    (!this.currentUser.loggedIn()) ? this.router.navigate(['/user/login']) : newCollectionButton.click();
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

  public getCurrentFilters(params: any): void {
    return params.filterIds ? this.filterIds = params.filterIds.split(',') : [];
  }

  public applyFilter(filter: any): void {
    if (this.filterIds.indexOf(filter.filterId.toString()) > -1) {
      this.removeFilter(filter);
    } else {
      this.filterIds.push(filter.filterId.toString());
    }
    this.filterAssets();
  }

  public removeFilter(filter: any): void {
    for (let i = 0; i < this.filterIds.length; i++) {
      if (this.filterIds[i].toString() === filter.filterId.toString()) {
        this.filterIds.splice(i, 1);
      }
    }
  }

  public filterAssets(): void {
    this.searchContext.update = { i: 1 };
    if (this.hasFilterIds) {
      this.updateSearchContext({ 'filterIds': this.filterIds.join(',') });
    } else {
      this.updateSearchContext({ 'filterIds': '' });
    }
    if (this.hasFilterIds && this.hasValues) {
      this.updateSearchContext({ 'filterValues': this.filterValues.join(',') });
    } else {
      this.updateSearchContext({ 'filterValues': '' });
    }
    this.searchContext.go();
  }

  public updateSearchContext(params: any): void {
    this.searchContext.update = params;
  }

  public get hasValues(): boolean {
    return this.filterIds.length > 0;
  }

  public get hasFilterIds(): boolean {
    return this.filterIds.length > 0;
  }
}
