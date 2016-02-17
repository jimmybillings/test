import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {NgStyle, CORE_DIRECTIVES} from 'angular2/common';
import { AssetData } from '../../common/services/asset.data.service';
import { AssetList }  from './asset-list/asset-list.component';
import {Asset, SearchResult} from '../../common/interfaces/asset.interface';
import {UiConfig} from '../../common/config/ui.config';
// import 'rxjs/add/operator/map';


@Component({
  selector: 'search',
  templateUrl: 'components/search/search.html',
  directives: [NgStyle, CORE_DIRECTIVES, AssetList],
  viewProviders: [HTTP_PROVIDERS, AssetData]
})

export class Search {
  public ui: Object;
  public results: SearchResult;
  public assets: Asset[];
  public errorMessage: string;
  private _params: {[key: string]: string};

  constructor(
    private _router: Router,
    private routeParams: RouteParams,
    private _assetData: AssetData,
    public uiConfig: UiConfig) {
    this._params = routeParams.params;
    this.ui = this.uiConfig.ui();
    this.results = {
      currentPage: 0,
      totalCount: null,
      pageSize: 0
    };
  }

  ngOnInit(): void {
    this.searchAssets();
  }

  public searchAssets(): void {
    this._assetData.searchAssets(this._params)
      .subscribe(
      results => this.results = results,
      error => this.errorMessage = <any>error);
    // console.log(this.assets);
  }
}
