import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {NgStyle, CORE_DIRECTIVES} from 'angular2/common';
import { AssetData } from '../../common/services/asset.data.service';
import { AssetList }  from './asset-list/asset-list.component';
import {Asset} from '../../common/interfaces/asset.interface';
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
  public assets: Asset[];
  public errorMessage: string;
  private _params: Object;

  constructor(
    private _router: Router,
    public routeParams: RouteParams,
    public _assetData: AssetData,
    public uiConfig: UiConfig) {
    this._params = routeParams.params;
    this.ui = this.uiConfig.ui();
    console.log(this.ui);
  }
  
  ngOnInit(): void {
    this.searchAssets();
  }
  
  public searchAssets(): void {
    this._assetData.getAssets(this._params)
      .subscribe(
        assets => this.assets = assets,
        error =>  this.errorMessage = <any>error);
  }
}
