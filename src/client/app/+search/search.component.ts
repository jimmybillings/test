import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AssetData } from './services/asset.data.service';
import { UiConfig} from '../shared/services/ui.config';
import { Observable, Subscription} from 'rxjs/Rx';
import { CurrentUser} from '../shared/services/current-user.model';
import { SearchContext} from '../shared/services/search-context.service';
import { UiState } from '../shared/services/ui.state';
import { Collection } from '../shared/interfaces/collection.interface';
import { ActiveCollectionService } from '../shared/services/active-collection.service';
import { FilterService } from '../shared/services/filter.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { SortDefinitionsService } from '../shared/services/sort-definitions.service';
import { Capabilities } from '../shared/services/capabilities.service';
import { WzNotificationService } from '../shared/components/wz-notification/wz.notification.service';
import { CartSummaryService } from '../shared/services/cart-summary.service';

/**
 * Asset search page component - renders search page results
 */
@Component({
  moduleId: module.id,
  selector: 'search-component',
  templateUrl: 'search.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchComponent implements OnInit, OnDestroy {
  public config: Object;
  public errorMessage: string;
  public filterValues: Array<string> = new Array();
  public activeCollectionStore: Observable<any>;
  public assets: Observable<any>;
  public preferences: any;
  public sortOptions: any;
  @ViewChild('target', { read: ViewContainerRef }) private target: any;
  private assetsStoreSubscription: Subscription;
  private routeSubscription: Subscription;
  private configSubscription: Subscription;
  private preferencesSubscription: Subscription;
  private sortSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    public assetData: AssetData,
    public router: Router,
    public uiConfig: UiConfig,
    public currentUser: CurrentUser,
    public userCan: Capabilities,
    public activeCollection: ActiveCollectionService,
    public searchContext: SearchContext,
    public filter: FilterService,
    public userPreferences: UserPreferenceService,
    public notification: WzNotificationService,
    public uiState: UiState,
    public sortDefinitions: SortDefinitionsService,
    public cartSummary: CartSummaryService) { }

  ngOnInit(): void {
    this.sortDefinitions.getSortOptions().take(1).subscribe(data => {
      let stickySort: any = this.findStickySort(data.list) || data.list[0].first;
      this.sortDefinitions.update({ sorts: data.list, currentSort: stickySort });
    });
    this.preferencesSubscription = this.userPreferences.data.subscribe((data: any) => {
      this.preferences = data;
      this.filter.get(this.searchContext.state, this.preferences.displayFilterCounts).take(1).subscribe();
    });
    this.sortSubscription = this.sortDefinitions.data.subscribe((data: any) => this.sortOptions = data);
    this.assetsStoreSubscription = this.assetData.data.subscribe(data => this.assets = data);
    this.configSubscription = this.uiConfig.get('search').subscribe((config) => this.config = config.config);
  }

  ngOnDestroy(): void {
    this.assetData.clearAssets();
    this.assetsStoreSubscription.unsubscribe();
    this.configSubscription.unsubscribe();
    this.preferencesSubscription.unsubscribe();
    this.sortSubscription.unsubscribe();
  }

  public countToggle(event: any): void {
    this.userPreferences.toggleFilterCount();
  }

  public showAsset(asset: any): void {
    this.router.navigate(['/asset', asset.assetId]);
  }

  public addToCollection(params: any): void {
    this.userPreferences.openCollectionTray();
    this.activeCollection.addAsset(params.collection.id, params.asset).take(1).subscribe((asset) => {
      this.activeCollection.addAssetToStore(Object.assign({}, params.asset, asset.list[0]));
    });
  }

  public removeFromCollection(params: any): void {
    let collection: Collection = params.collection;
    let uuid: any = params.collection.assets.items.find((item: any) => item.assetId === params.asset.assetId).uuid;
    if (uuid && params.asset.assetId) {
      this.userPreferences.openCollectionTray();
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
    this.toggleFilter(filterId);
    this.filterAssets();
  }

  public applyCustomValue(filter: any, value: any) {
    this.filter.set(this.filter.addCustomValue(filter, value));
    this.filterAssets();
  }

  public applyExclusiveFilter(subFilter: any): void {
    this.filter.set(this.filter.toggleExclusive(subFilter));
    this.filterAssets();
  }

  public clearFilters(): void {
    this.filter.set(this.filter.clear());
    this.filterAssets();
  }

  public downloadComp(params: any): void {
    this.assetData.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        window.location.href = res.url;
      } else {
        this.notification.create(this.target, { trString: 'COMPS.NO_COMP', theme: 'alert' });
      }
    });
  }

  public filterAssets(): void {
    this.searchContext.update = { i: 1 };
    let active: any = [];
    this.filter.active(active);
    let activeIds: any = active.map((filter: any) => filter.filterId);
    let activeValues: any = active.filter((filter: any) => filter.filterValue)
      .map((filter: any) => `${filter.filterId}:${filter.filterValue}`);;
    if (activeIds.length > 0) {
      this.searchContext.update = { 'filterIds': activeIds.join(',') };
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

  public onSortResults(sortDefinition: any): void {
    this.userPreferences.updateSortPreference(sortDefinition.id);
    this.sortDefinitions.update({ currentSort: sortDefinition });
    this.updateSearchContext(sortDefinition.id);
  }

  public updateSearchContext(sortDefinitionId: number): void {
    this.searchContext.update = { 'i': 1, 'sortId': sortDefinitionId };
    this.searchContext.go();
  }

  public addAssetToCart(asset: any): void {
    this.cartSummary.addAssetToProjectInCart(asset);
  }

  private filterCountsChanged(prev: boolean, current: boolean): boolean {
    return prev !== current;
  }

  private findStickySort(sorts: Array<any>): any {
    for (let group of sorts) {
      for (let definition in group) {
        if (group[definition].id === parseInt(this.userPreferences.state.searchSortOptionId)) {
          return group[definition];
        };
      };
    };
  }
}
