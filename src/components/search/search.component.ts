import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {NgStyle, CORE_DIRECTIVES} from 'angular2/common';
import { AssetData } from '../../common/services/asset.data.service';
import { AssetList }  from './asset-list/asset-list.component';
import {SearchResult} from '../../common/interfaces/asset.interface';
import {UiConfig} from '../../common/config/ui.config';

/**
 * Asset search page component - renders search page results
 */  
@Component({
  selector: 'search',
  templateUrl: 'components/search/search.html',
  directives: [NgStyle, CORE_DIRECTIVES, AssetList],
  viewProviders: [HTTP_PROVIDERS, AssetData]
  
})

export class Search {
  public config: Object;
  public results: SearchResult;
  public errorMessage: string;

  constructor(
    private _router: Router,
    private routeParams: RouteParams,
    private _assetData: AssetData,
    public uiConfig: UiConfig) {
    this.config = this.uiConfig.ui().search;
    this.results = {
      currentPage: 0,
      totalCount: null,
      pageSize: 0
    };
  }

  ngOnInit(): void {
    this.searchAssets();
  }
  
  /**
   * Subscribes to an api search for assets, and sends the search parameters from the URL 
  */
  public searchAssets(): void {
    this._assetData.searchAssets(this.routeParams.params)
      .subscribe(
      results => this.results = results,
      error => this.errorMessage = <any>error);
  }
}
