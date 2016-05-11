import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {NgStyle, CORE_DIRECTIVES} from 'angular2/common';
import { AssetData } from './services/asset.data.service';
import { AssetList }  from '../../components/asset-list/asset-list.component';
import {UiConfig} from '../../common/config/ui.config';
import {Observable} from 'rxjs/Rx';
import {CurrentUser} from '../../common/models/current-user.model';
import { Error } from '../../common/services/error.service';
import {Pagination} from '../../components/pagination/pagination.component';
import {SearchContext} from '../../common/services/search-context.service';
/**
 * Asset search page component - renders search page results
 */
@Component({
  selector: 'search',
  templateUrl: 'containers/search/search.html',
  directives: [NgStyle, CORE_DIRECTIVES, AssetList, Pagination],
  viewProviders: [HTTP_PROVIDERS, AssetData],
  pipes: [TranslatePipe]

})

export class Search {
  public config: Object;
  public assets: Observable<any>;
  public errorMessage: string;

  constructor(
    private _router: Router,
    private routeParams: RouteParams,
    public assetData: AssetData,
    public router: Router,
    public uiConfig: UiConfig,
    public currentUser: CurrentUser,
    public error: Error,
    public searchContext: SearchContext) {
    this.assets = this.assetData.assets;
    this.assets.subscribe(data => {
      this.assets = data;
    });
  }

  ngOnInit(): void {
    this.uiConfig.get('search').subscribe((config) => this.config = config.config);
    this.searchAssets();
  }
  
  ngOnDestroy(): void {
    this.assetData.clearAssets();
  }

  showAsset(asset): void {
    this.router.navigate(['/Asset', { name: asset.assetId }]);
  }
  
  changePage(page): void {
    this.searchContext.new({i: page});
  }

  public searchAssets(): void {
    this.searchContext.set(this.routeParams.params);
    this.assetData.searchAssets(this.searchContext.get()).subscribe(
      payload => this.assetData.storeAssets(payload),
      error => this.error.handle(error)
    );
  }
}
