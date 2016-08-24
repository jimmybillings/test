import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AssetData } from './services/asset.data.service';
import { UiConfig} from '../shared/services/ui.config';
import { Observable, Subscription} from 'rxjs/Rx';
import { CurrentUser} from '../shared/services/current-user.model';
import { Error } from '../shared/services/error.service';
import { SearchContext} from '../shared/services/search-context.service';
import { UiState } from '../shared/services/ui.state';
import { Collection, Collections, CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from '../+collection/services/collections.service';
import { ActiveCollectionService } from '../+collection/services/active-collection.service';
import { Store } from '@ngrx/store';
import { FilterService } from './services/filter.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
/**
 * Asset search page component - renders search page results
 */
@Component({
  moduleId: module.id,
  selector: 'search',
  templateUrl: 'search.html',
})

export class SearchComponent implements OnInit, OnDestroy {
  public config: Object;
  public errorMessage: string;
  public filterValues: Array<string> = new Array();
  public collections: Observable<Collections>;
  public activeCollectionStore: Observable<any>;
  public assets: Observable<any>;
  public counted: boolean;
  private assetsStoreSubscription: Subscription;
  private routeSubscription: Subscription;
  private configSubscription: Subscription;
  private preferencesSubscription: Subscription;

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
    public filter: FilterService,
    public userPreferences: UserPreferenceService,
    public uiState: UiState) { }

  ngOnInit(): void {
    this.preferencesSubscription = this.userPreferences.filterCounts.subscribe(d => {
      this.counted = d;
      this.filter.get(this.searchContext.state, this.counted).take(1).subscribe(() => this.uiState.loading(false));
    });
    this.assetsStoreSubscription = this.assetData.data.subscribe(data => this.assets = data);
    this.configSubscription = this.uiConfig.get('search').subscribe((config) => this.config = config.config);
    this.routeSubscription = this.route.params.subscribe(params => {
      if (this.counted) {
        this.filter.get(this.searchContext.state, this.counted).take(1).subscribe(() => this.uiState.loading(false));
      }
    });
  }

  ngOnDestroy(): void {
    this.assetData.clearAssets();
    this.assetsStoreSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.configSubscription.unsubscribe();
    this.preferencesSubscription.unsubscribe();
  }

  public countToggle(event: any): void {
    this.userPreferences.update({filterCounts: event.checked});
    if (this.counted) this.uiState.loading(true);
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
    if (uuid && params.asset.assetId) {
      this.activeCollection.removeAsset(collection.id, params.asset.assetId, uuid).take(1).subscribe();
    }
  }

  public showNewCollection(asset: any): void {
    let newCollectionButton = <HTMLFormElement>document.querySelector('button.open-collection-tray');
    (!this.currentUser.loggedIn()) ? this.router.navigate(['/user/login']) : newCollectionButton.click();
  }

  public changePage(page: any): void {
    this.searchContext.update = { i: page };
    this.searchContext.go();
  }

  public toggleFilter(filterId: any): void {
    this.filter.set(this.filter.toggle(filterId));
  }

  public applyFilter(filterId: number): void {
    if (this.counted) this.uiState.loading(true);
    this.toggleFilter(filterId);
    this.filterAssets();
  }

  public applyCustomValue(filter: any, value: any) {
    if (this.counted) this.uiState.loading(true);
    this.filter.set(this.filter.addCustomValue(filter, value));
    this.filterAssets();
  }

  public applyExclusiveFilter(subFilter: any): void {
    if (this.counted) this.uiState.loading(true);
    this.filter.set(this.filter.toggleExclusive(subFilter));
    this.filterAssets();
  }

  public clearFilters(): void {
    if (this.counted) this.uiState.loading(true);
    this.filter.set(this.filter.clear());
    this.filterAssets();
  }

  public filterAssets(): void {
    this.searchContext.update = { i: 1 };
    let active: any = [];
    this.filter.active(active);
    let activeIds: any = active.map((filter:any) => filter.filterId);
    let activeValues: any = active.filter((filter:any) => filter.filterValue)
      .map((filter: any) => `${filter.filterId}:${filter.filterValue}`);;
    if (activeIds.length > 0) {
      this.searchContext.update = { 'filterIds':  activeIds.join(',') };
    } else {
      this.searchContext.remove = 'filterIds';
    }
    if (activeIds.length > 0 && activeValues.length > 0) {
      this.searchContext.update = { 'filterValues': activeValues.join(',') };
    } else {
      this.searchContext.remove = 'filterValues';
    }
    this.searchContext.go();
  }
}
