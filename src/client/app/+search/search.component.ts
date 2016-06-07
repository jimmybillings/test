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
import {FilterTree} from './filter-tree';
import {FilterTreeComponent} from './filter-tree.component';

/**
 * Asset search page component - renders search page results
 */
@Component({
  moduleId: module.id,
  selector: 'search',
  templateUrl: 'search.html',
  directives: [AssetListComponent, PaginationComponent,FilterTreeComponent],
  providers: [AssetData],
  pipes: [TranslatePipe]

})


export class SearchComponent implements OnInit, OnDestroy {
  public config: Object;
  public assets: Observable<any>;
  public errorMessage: string;
  public rootFilter: FilterTree;
  public filterIds: Array<string> = new Array();
  public filterValues: Array<string> = new Array();

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
    this.rootFilter = new FilterTree('','',[],'None',-1);
  }

  ngOnInit(): void {
    this.uiConfig.get('search').subscribe((config) => this.config = config.config);
    this.searchAssets();
    this.getFilterTree();
  }

  ngOnDestroy(): void {
    this.assetData.clearAssets();
  }

  showAsset(asset: any): void {
    this.router.navigate(['/asset', asset.assetId]);
  }

  addToCollection(asset: any): void {
    if (!this.currentUser.loggedIn()) this.router.navigate(['/user/login']);

    console.log(asset.assetId);
  }
  addToCart(asset: any): void {
    console.log(asset);
  }

  downloadComp(asset: any): void {
    console.log(asset);
  }

  changePage(page: any): void {
    var v = this.searchContext.get();
    v.i = page;
    this.searchContext.go(v);
    this.assetData.searchAssets(v).subscribe(
      payload => this.assetData.storeAssets(payload),
      error => this.error.handle(error)
    );
  }
  public searchAssets(): void {
    this.searchContext.set(this.routeSegment.parameters);
    this.assetData.searchAssets(this.searchContext.get()).subscribe(
      payload => this.assetData.storeAssets(payload),
      error => this.error.handle(error)
    );
  }
  public filterAssets(): void {
    this.searchContext.set(this.routeSegment.parameters);
    let v = this.searchContext.get();
    v['i'] = 1;
    if(this.filterIds.length > 0) {
      v['filterIds']=this.filterIds;
    } else {
      delete v.filterIds;
    }
    if (this.filterValues.length > 0 && this.filterIds.length > 0) {
      v['filterValues'] = this.filterValues;
    } else {
      delete v.filterValues;
    }
     this.searchContext.go(v);
    this.assetData.searchAssets(v).subscribe(
      payload => this.assetData.storeAssets(payload),
      error => this.error.handle(error)
    );
  }
  public getFilterTree():void {
    var fids:string = this.routeSegment.getParam('filterIds');
    if (fids && fids !== null) {
      fids.split(',').forEach(x => this.filterIds.push(x));
    }
    var v:Array<string> = this.filterIds;
    this.assetData.getFilterTree(this.searchContext.get()).subscribe(
      payload => {this.rootFilter = new FilterTree('','',[],'',-1).load(payload,null,v);},
      error => this.error.handle(error)
    );
  }
  doFilter (filter:FilterTree): void {
    //console.log('do event filter. Is filter checked:' + filter.checked +' filter id: '+filter.filterId);
    //i do not know why this.filterIds.indexOf(filter.filterId) doesn't work. Anyone?
    //something with the type that === comparison keeps failing (but == works)
    if(filter.checked === true) {
      if(filter.contains(this.filterIds,filter.filterId) === false) {
        this.filterIds.push(filter.filterId);
      }
    } else {
      for(var i = 0; i < this.filterIds.length; i++) {
        if(this.filterIds[i].toString() === filter.filterId.toString()) {
          this.filterIds.splice(i,1);
        }
      }
    }
    this.filterAssets();
  }
}
