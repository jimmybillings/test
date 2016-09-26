import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AssetData } from './services/asset.data.service';
import { UiConfig} from '../shared/services/ui.config';
import { Observable, Subscription} from 'rxjs/Rx';
import { CurrentUser} from '../shared/services/current-user.model';
import { SearchContext} from '../shared/services/search-context.service';
import { UiState } from '../shared/services/ui.state';
import { Collection, Collections } from '../shared/interfaces/collection.interface';
import { CollectionsService } from '../+collection/services/collections.service';
import { ActiveCollectionService } from '../+collection/services/active-collection.service';
import { FilterService } from './services/filter.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { SortDefinitionsService } from '../shared/services/sort-definitions.service';
import { UserPermission } from '../shared/services/permission.service';
import { WzNotificationService } from '../shared/components/wz-notification/wz.notification.service';

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
  public collections: Observable<Collections>;
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
    private _router: Router,
    private route: ActivatedRoute,
    public assetData: AssetData,
    public router: Router,
    public uiConfig: UiConfig,
    public currentUser: CurrentUser,
    public collectionsService: CollectionsService,
    public permission: UserPermission,
    public activeCollection: ActiveCollectionService,
    public searchContext: SearchContext,
    public filter: FilterService,
    public userPreferences: UserPreferenceService,
    public notification: WzNotificationService,
    public uiState: UiState,
    public sortDefinitions: SortDefinitionsService) { }

  ngOnInit(): void {
    this.sortSubscription = this.sortDefinitions.data.subscribe((data: any) => {
      this.sortOptions = data;
    });
    this.preferencesSubscription = this.userPreferences.data.subscribe((data: any) => {
      this.preferences = data;
      this.filter.get(this.searchContext.state, this.preferences.counted).take(1).subscribe(() => this.uiState.loading(false));
    });
    this.assetsStoreSubscription = this.assetData.data.subscribe(data => this.assets = data);
    this.configSubscription = this.uiConfig.get('search').subscribe((config) => this.config = config.config);
    this.routeSubscription = this.route.params.subscribe(params => {
      this.getSortPreferences(params['sortId']);
      if (this.preferences.counted) {
        this.filter.get(this.searchContext.state, this.preferences.counted).take(1).subscribe(() => this.uiState.loading(false));
      }
    });
  }

  ngOnDestroy(): void {
    this.assetData.clearAssets();
    this.assetsStoreSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.configSubscription.unsubscribe();
    this.preferencesSubscription.unsubscribe();
    this.sortSubscription.unsubscribe();
  }

  public countToggle(event: any): void {
    this.userPreferences.update({ filterCounts: event.checked });
    if (this.preferences.counted) this.uiState.loading(true);
  }

  public showAsset(asset: any): void {
    this.router.navigate(['/asset', asset.assetId]);
  }

  public addToCollection(params: any): void {
    this.preferences.openBinTray();
    this.activeCollection.addAsset(params.collection.id, params.asset).take(1).subscribe((asset) => {
      this.activeCollection.addAssetToStore(Object.assign({}, params.asset, asset.list[0]));
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
    this.toggleFilter(filterId);
    this.filterAssets();
  }

  public applyCustomValue(filter: any, value: any) {
    this.filter.set(this.filter.addCustomValue(filter, value));
    this.filterAssets();
  }

  public applyExclusiveFilter(subFilter: any): void {
    if (this.preferences.counted) this.uiState.loading(true);
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
        this.notification.createNotfication(this.target, { trString: 'COMPS.NO_COMP', theme: 'alert' });
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

  public getSortPreferences(sortId: any): void {
    let currentSort: any;
    let sorts: any;
    this.sortDefinitions.getSortOptions().take(1).subscribe((data) => {
      for (let group of data.list) {
        for (let definition in group) {
          if (group[definition].id === parseInt(sortId)) {
            currentSort = group[definition];
          }
        }
      };
      sorts = data.list ? data.list : this.mockSorts.list;
      currentSort = currentSort ? currentSort : sorts[0].first;
      this.sortDefinitions.update({ sorts: sorts, currentSort: currentSort });
    }, (error) => {
      sorts = this.mockSorts.list;
      currentSort = sorts[0].first;
      this.sortDefinitions.update({ sorts: sorts, currentSort: currentSort });
    });
  }

  public onSortResults(sortDefinition: any): void {
    for (let group of this.preferences.sorts) {
      for (let definition in group) {
        if (group[definition].id === sortDefinition.id) {
          this.sortDefinitions.update({ currentSort: group[definition] });
        }
      }
    };
    this.updateSearchContext(sortDefinition.id);
  }

  public updateSearchContext(sortDefinitionId: number): void {
    this.searchContext.update = { 'i': 1, 'sortId': sortDefinitionId };
    this.searchContext.go();
  }

  public get mockSorts(): any {
    return {
      'list': [
        {
          'first': {'lastUpdated': '2016-09-21T15:06:40Z','createdOn': '2016-08-18T18:01:44Z','id': 2,'siteName': 'core','name': 'Relevance (most relevant first)','isDefault': false,'pairId': 'testPair','association': 'user:1','sorts': [{'field': 'score','descending': true}]}
        },
        {
          'first': {'lastUpdated': '2016-09-21T14:50:51Z','createdOn': '2016-09-16T20:13:22Z','id': 4,'siteName': 'core','name': 'Date Added (oldest first)','isDefault': false,'pairId': 'date','association': 'user:25','sorts': [{'field': 'ingested','descending': false}]},
          'second': {'lastUpdated': '2016-09-21T14:51:18Z','createdOn': '2016-09-16T20:23:26Z','id': 5,'siteName': 'core','name': 'Date Added (newest first)','isDefault': false,'pairId': 'date','association': 'user:25','sorts': [{'field': 'ingested','descending': true}]}
        }
      ]
    };
  }
}
