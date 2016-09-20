import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { AssetData } from './services/asset.data.service';
import { UiConfig} from '../shared/services/ui.config';
import { Observable, Subscription} from 'rxjs/Rx';
import { CurrentUser} from '../shared/services/current-user.model';
import { Error } from '../shared/services/error.service';
import { SearchContext} from '../shared/services/search-context.service';
import { UiState } from '../shared/services/ui.state';
import { Collection, Collections } from '../shared/interfaces/collection.interface';
import { CollectionsService } from '../+collection/services/collections.service';
import { ActiveCollectionService } from '../+collection/services/active-collection.service';
import { FilterService } from './services/filter.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
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
  @ViewChild('target', { read: ViewContainerRef }) private target: any;
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
    public permission: UserPermission,
    public activeCollection: ActiveCollectionService,
    public error: Error,
    public searchContext: SearchContext,
    public filter: FilterService,
    public userPreferences: UserPreferenceService,
    public notification: WzNotificationService,
    public uiState: UiState) { }

  ngOnInit(): void {
    this.preferencesSubscription = this.userPreferences.prefs.subscribe((data: any) => {
      this.preferences = data;
      this.filter.get(this.searchContext.state, this.preferences.counted).take(1).subscribe(() => this.uiState.loading(false));
    });
    this.assetsStoreSubscription = this.assetData.data.subscribe(data => this.assets = data);
    this.configSubscription = this.uiConfig.get('search').subscribe((config) => this.config = config.config);
    this.routeSubscription = this.route.params.subscribe(params => {
      this.getSortPreferences(params['sort-id']);
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
  }

  public countToggle(event: any): void {
    this.userPreferences.update({ filterCounts: event.checked });
    if (this.preferences.counted) this.uiState.loading(true);
  }

  public showAsset(asset: any): void {
    this.router.navigate(['/asset', asset.assetId]);
  }

  public addToCollection(params: any): void {
    this.uiState.openBinTray();
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
    this.userPreferences.getSortOptions().take(1).subscribe((data) => {
      // This is a temporary hack until the API returns a default sort object
      data.list.push({ first: { id: 0, name: 'Sort By Relevance' } });
      for (let group of data.list) {
        for (let definition in group) {
          if (group[definition].id === parseInt(sortId)) {
            this.userPreferences.update({ currentSort: group[definition] });
          }
        }
      };
      this.userPreferences.update({ sorts: data.list });
    });
  }

  public onSortResults(sortDefinition: any): void {
    for (let group of this.preferences.sorts) {
      for (let definition in group) {
        if (group[definition].id === sortDefinition.id) {
          this.preferences.currentSort = group[definition];
        }
      }
    };
    this.userPreferences.update({ currentSort: this.preferences.currentSort });
    this.updateSearchContext(sortDefinition.id);
  }

  public updateSearchContext(sortDefinitionId: number): void {
    this.searchContext.update = { 'i': 1, 'sort-id': sortDefinitionId };
    this.searchContext.go();
  }
}
