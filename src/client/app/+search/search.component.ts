import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, RouteSegment} from '@angular/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { AssetData } from './services/asset.data.service';
import { AssetListComponent }  from '../shared/components/asset-list/asset-list.component';
import {UiConfig} from '../shared/services/ui.config';
import {Observable} from 'rxjs/Rx';
import {CurrentUser} from '../shared/services/current-user.model';
import { Error } from '../shared/services/error.service';
import {PaginationComponent} from '../shared/components/pagination/pagination.component';
import {SearchContext} from '../shared/services/search-context.service';
/**
 * Asset search page component - renders search page results
 */
@Component({
  moduleId: module.id,
  selector: 'search',
  templateUrl: 'search.html',
  directives: [AssetListComponent, PaginationComponent],
  providers: [AssetData],
  pipes: [TranslatePipe]

})

export class SearchComponent implements OnInit, OnDestroy {
  public config: Object;
  public assets: Observable<any>;
  public errorMessage: string;

  constructor(
    private _router: Router,
    private routeSegment: RouteSegment,
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

  showAsset(asset: any): void {
    this.router.navigate(['/asset', asset.assetId]);
  }

  addToCollection(asset: any): void {

    console.log(this.currentUser.loggedIn());
    console.log(asset);
  }

  addToCart(asset: any): void {
    console.log(asset);
  }

  downloadComp(asset: any): void {
    console.log(asset);
  }

  changePage(page: any): void {
    this.searchContext.new({ i: page });
  }

  public searchAssets(): void {
    this.searchContext.set(this.routeSegment.parameters);
    this.assetData.searchAssets(this.searchContext.get()).subscribe(
      payload => this.assetData.storeAssets(payload),
      error => this.error.handle(error)
    );
  }
}
