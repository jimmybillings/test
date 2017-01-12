import { Component, OnInit, OnDestroy, ViewChild, Renderer, ChangeDetectionStrategy } from '@angular/core';
import { AssetData } from './services/asset.data.service';
import { UiConfig } from '../shared/services/ui.config';
import { Observable, Subscription } from 'rxjs/Rx';
import { SearchContext } from '../shared/services/search-context.service';
import { ActiveCollectionService } from '../shared/services/active-collection.service';
import { FilterService } from '../shared/services/filter.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { SortDefinitionsService } from '../shared/services/sort-definitions.service';
import { Capabilities } from '../shared/services/capabilities.service';
import { WzNotificationService } from '../shared/components/wz-notification/wz.notification.service';
import { CartSummaryService } from '../shared/services/cart-summary.service';
import { AssetService } from '../shared/services/asset.service';
import { WzSpeedviewComponent } from '../shared/components/wz-speedview/wz.speedview.component';

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
  public speedviewData: any;
  @ViewChild('searchFilter') public sidenav: any;
  @ViewChild(WzSpeedviewComponent) public wzSpeedview: any;

  constructor(
    public userCan: Capabilities,
    public activeCollection: ActiveCollectionService,
    public filter: FilterService,
    private assetService: AssetService,
    private cartSummary: CartSummaryService,
    private sortDefinition: SortDefinitionsService,
    private notification: WzNotificationService,
    private searchContext: SearchContext,
    private uiConfig: UiConfig,
    private assetData: AssetData,
    private userPreferences: UserPreferenceService,
    private renderer: Renderer,
    private window: Window) { }

  ngOnInit(): void {
    if (this.userPreferences.state.displayFilterTree) this.sidenav.open();
  }

  ngOnDestroy(): void {
    this.assetData.clearAssets();
  }

  public countToggle(): void {
    this.filter.load(this.searchContext.state, !this.userPreferences.state.displayFilterCounts)
      .subscribe();
    this.userPreferences.toggleFilterCount();
  }

  public addToCollection(params: any): void {
    this.userPreferences.openCollectionTray();
    this.activeCollection.addAsset(params.collection.id, params.asset).subscribe();
  }

  public removeFromCollection(params: any): void {
    this.userPreferences.openCollectionTray();
    this.activeCollection.removeAsset(params).subscribe();
  }

  public changePage(page: any): void {
    this.searchContext.update = { i: page };
    this.searchContext.go();
  }

  public toggleFilter(filterId: any): void {
    this.filter.toggle(filterId);
  }

  public applyFilter(filterId: number): void {
    this.filter.toggle(filterId);
    this.filterAssets();
  }

  public applyCustomValue(filter: any, value: any) {
    this.filter.addCustom(filter, value);
    this.filterAssets();
  }

  public applyExclusiveFilter(subFilter: any): void {
    this.filter.toggleExclusive(subFilter);
    this.filterAssets();
  }

  public clearFilters(): void {
    this.filter.clear();
    this.filterAssets();
  }

  public downloadComp(params: any): void {
    this.assetData.downloadComp(params.assetId, params.compType).subscribe((res) => {
      if (res.url && res.url !== '') {
        this.window.location.href = res.url;
      } else {
        this.notification.create('COMPS.NO_COMP');
      }
    });
  }

  public onSortResults(sortDefinition: any): void {
    this.userPreferences.updateSortPreference(sortDefinition.id);
    this.sortDefinition.update({ currentSort: sortDefinition });
    this.searchContext.update = { 'i': 1, 'sortId': sortDefinition.id };
    this.searchContext.go();
  }

  public addAssetToCart(asset: any): void {
    this.cartSummary.addAssetToProjectInCart(asset);
  }

  public showSpeedview(event: { asset: any, position: any }): void {
    if (event.asset.speedviewData) {
      this.speedviewData = Observable.of(event.asset.speedviewData);
      this.wzSpeedview.show(event.position);
    } else {
      this.speedviewData = this.assetService.getSpeedviewData(event.asset.assetId)
        .do((data: any) => {
          event.asset.speedviewData = data;
          this.wzSpeedview.show(event.position);
        });
    }
    this.renderer.listenGlobal('document', 'scroll', () => this.wzSpeedview.destroy());
  }

  public hideSpeedview(): void {
    this.speedviewData = null;
    this.wzSpeedview.destroy();
  }

  private filterAssets(): void {
    this.searchContext.update = { i: 1 };
    let activeFilters: any = this.filter.getActive();

    if (activeFilters.ids.length > 0) {
      this.searchContext.update = { 'filterIds': activeFilters.ids.join(',') };
    } else {
      this.searchContext.remove = 'filterIds';
    }

    if (activeFilters.values.length > 0) {
      this.searchContext.update = { 'filterValues': activeFilters.values.join(',') };
    } else {
      this.searchContext.remove = 'filterValues';
    }

    this.searchContext.go();
  }
}
