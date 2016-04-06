import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {NgStyle, CORE_DIRECTIVES} from 'angular2/common';
import { AssetData } from './services/asset.data.service';
import { AssetList }  from '../../components/asset-list/asset-list.component';
import {UiConfig} from '../../common/config/ui.config';
import {Observable} from 'rxjs/Observable';

/**
 * Asset search page component - renders search page results
 */  
@Component({
  selector: 'search',
  templateUrl: 'containers/search/search.html',
  directives: [NgStyle, CORE_DIRECTIVES, AssetList],
  viewProviders: [HTTP_PROVIDERS, AssetData],
  pipes: [TranslatePipe]
  
})

export class Search {
  public config: Object;
  public components: Object;
  public assets: Observable<any>;
  public errorMessage: string;

  constructor(
    private _router: Router,
    private routeParams: RouteParams,
    public assetData: AssetData,
    public router: Router,
    public uiConfig: UiConfig) {
      this.assets = this.assetData.assets;
  }

  ngOnInit(): void {
    this.uiConfig.get('search').subscribe((config) => {
      this.config = config.config;
      this.components = config.components;
    });
    this.searchAssets();
  }
  
  showAsset(asset): void {
    this.router.navigate(['/Asset', {name: asset.assetId}]);
  }
  
  /**
   * Subscribes to an api search for assets, and sends the search parameters from the URL 
  */
  public searchAssets(): void {
    this.assetData.searchAssets(this.routeParams.params);
  }
}
