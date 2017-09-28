import { Component, OnDestroy, ViewChild, Renderer, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { SearchService } from '../shared/services/search.service';
import { UiConfig } from '../shared/services/ui.config';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SearchContext } from '../shared/services/search-context.service';
import { FilterService } from '../shared/services/filter.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { SortDefinitionsService } from '../shared/services/sort-definitions.service';
import { Capabilities } from '../shared/services/capabilities.service';
import { CartService } from '../shared/services/cart.service';
import { WzSpeedviewComponent } from '../shared/modules/wz-asset/wz-speedview/wz.speedview.component';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { WindowRef } from '../shared/services/window-ref.service';
import { UiState } from '../shared/services/ui.state';
import { ActivatedRoute, Router } from '@angular/router';
import { QuoteEditService } from '../shared/services/quote-edit.service';
import { AddAssetParameters } from '../shared/interfaces/commerce.interface';
import { AppStore } from '../app.store';
import { Collection } from '../shared/interfaces/collection.interface';
import { EnhancedAsset } from '../shared/interfaces/enhanced-asset';
/**
 * Asset search page component - renders search page results
 */
@Component({
  moduleId: module.id,
  selector: 'search-component',
  templateUrl: 'search.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchComponent implements OnDestroy {
  public screenWidth: number;
  public path: any;
  public userPreferences: UserPreferenceService;
  public search: SearchService;
  public sortDefinition: SortDefinitionsService;
  public enhancedAssets: EnhancedAsset[];
  public enhancedAssetsSubScription: Subscription;
  @ViewChild(WzSpeedviewComponent) public wzSpeedview: WzSpeedviewComponent;

  constructor(
    public uiState: UiState,
    public userCan: Capabilities,
    public filter: FilterService,
    private cart: CartService,
    private sortDefinitionService: SortDefinitionsService,
    private searchContext: SearchContext,
    private uiConfig: UiConfig,
    private searchService: SearchService,
    private userPreferencesService: UserPreferenceService,
    private window: WindowRef,
    private snackBar: MdSnackBar,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private detector: ChangeDetectorRef,
    private quoteEditService: QuoteEditService,
    private store: AppStore
  ) {
    this.screenWidth = this.window.nativeWindow.innerWidth;
    this.window.nativeWindow.onresize = () => this.screenWidth = this.window.nativeWindow.innerWidth;
    this.userPreferences = userPreferencesService;
    this.search = searchService;
    this.enhancedAssetsSubScription = this.search.enhancedAssets
      .subscribe(enhancedAssets => this.enhancedAssets = enhancedAssets);
    this.sortDefinition = sortDefinitionService;
    this.router.events.subscribe(route => {
      this.path = (this.route.snapshot.params['gq']) ? JSON.parse(this.route.snapshot.params['gq']) : '';
      this.detector.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.search.clearAssets();
    this.enhancedAssetsSubScription.unsubscribe();
  }

  public get activeCollection(): Observable<Collection> {
    return this.store.select(state => state.activeCollection.collection);
  }

  public showSnackBar(message: any) {
    this.translate.get(message.key, message.value)
      .subscribe((res: string) => {
        this.snackBar.open(res, '', { duration: 2000 });
      });
  }

  public countToggle(): void {
    this.filter.load(this.searchContext.state, !this.userPreferences.state.displayFilterCounts)
      .subscribe((_) => { return _; });
    this.userPreferences.toggleFilterCount();
  }

  public addAssetToCart(asset: any): void {
    let params: AddAssetParameters = { lineItem: { asset: asset } };
    if (this.userCan.administerQuotes()) {
      this.quoteEditService.addAssetToProjectInQuote(params);
    } else {
      this.cart.addAssetToProjectInCart(params);
    }
    this.showSnackBar({
      key: this.userCan.administerQuotes() ? 'ASSET.ADD_TO_QUOTE_TOAST' : 'ASSET.ADD_TO_CART_TOAST',
      value: { assetId: asset.assetId }
    });
  }

  public downloadComp(params: any): void {
    this.search.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        this.window.nativeWindow.location.href = res.url;
      } else {
        this.store.dispatch(factory => factory.error.handleCustomError('COMPS.NO_COMP'));
      }
    });
  }

  public changePage(page: any): void {
    this.searchContext.update = { i: page };
    this.searchContext.go();
  }

  public sortResults(sortDefinition: any): void {
    this.userPreferences.updateSortPreference(sortDefinition.id);
    this.sortDefinition.update({ currentSort: sortDefinition });
    this.searchContext.update = { 'i': 1, 'sortId': sortDefinition.id };
    this.searchContext.go();
  }

  public changeAssetView(viewType: string): void {
    this.userPreferences.updateAssetViewPreference(viewType);
  }

  public filterEvent(event: any) {
    switch (event.event) {
      case 'toggleFilter':
        this.filter.toggle(event.filter.filterId);
        this.filterAssets();
        break;
      case 'toggleFilterGroup':
        this.filter.toggleFilterGroup(event.filter);
        break;
      case 'applyExclusiveFilter':
        this.filter.toggleExclusive(event.filter);
        this.filterAssets();
        break;
      case 'applyCustomValue':
        this.filter.addCustom(event.filter, event.customValue);
        this.filterAssets();
        break;
      case 'clearFilters':
        this.filter.clear();
        this.filterAssets();
        break;
    }
  }

  public onClickBreadcrumb(index: number): void {
    const route: any[] = index === 0 ? ['/'] : ['/gallery-view'];
    let pathSegment: any = this.path.slice(0, index);
    if (pathSegment && pathSegment.length > 0) route.push({ path: JSON.stringify(pathSegment) });
    this.router.navigate(route);
  }

  private filterAssets(): void {
    this.searchContext.update = { i: 1 };
    let activeFilters: any = this.filter.getActive();

    let filterIds = (activeFilters.ids.length > 0) ? { 'filterIds': activeFilters.ids.join(',') } : null;
    let filterValues = (activeFilters.values.length > 0) ? { 'filterValues': activeFilters.values.join(',') } : null;

    (filterIds) ? this.searchContext.update = filterIds : this.searchContext.remove = 'filterIds';
    (filterValues) ? this.searchContext.update = filterValues : this.searchContext.remove = 'filterValues';

    this.searchContext.go();
  }
}
