import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
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
import { Collection, Collections, CollectionStore } from '../shared/interfaces/collection.interface';
import { CollectionsService } from '../+collections/services/collections.service';
import { Store } from '@ngrx/store';


/**
 * Asset search page component - renders search page results
 */
@Component({
  moduleId: module.id,
  selector: 'search',
  templateUrl: 'search.html',
  directives: [AssetListComponent, PaginationComponent, FilterTreeComponent],
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
  public collections: Observable<Collections>;
  public focusedCollection: Observable<any>;
  public sub: any;

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    public assetData: AssetData,
    public router: Router,
    public uiConfig: UiConfig,
    public currentUser: CurrentUser,
    public collectionsService: CollectionsService,
    public store: Store<CollectionStore>,
    public error: Error,
    public searchContext: SearchContext) {
    this.assets = this.assetData.assets;
    this.assets.subscribe(data => {
      this.assets = data;
    });
    this.rootFilter = new FilterTree('', '', [], 'None', -1);
  }

  ngOnInit(): void {
    this.uiConfig.get('search').subscribe((config) => this.config = config.config);

    this.sub = this.route.params.subscribe(() => {
      this.newSearch();
      this.getFilterTree();
    });
    this.focusedCollection = this.store.select('focusedCollection');
  }

  ngOnDestroy(): void {
    this.assetData.clearAssets();
    this.sub.unsubscribe();
  }

  public showAsset(asset: any): void {
    this.router.navigate(['/asset', asset.assetId]);
  }

  public addToCollection(params: any): void {
    let collection: Collection = params.collection;
    collection.assets ? collection.assets.items.push(params.asset) : collection.assets.items = [params.asset];
    this.collectionsService.addAssetsToCollection(collection.id, params.asset).subscribe(payload => {
      this.collectionsService.getCollectionItems(collection.id, 300).subscribe(search => {
        this.collectionsService.updateFocusedCollectionAssets(payload, search);
        this.collectionsService.updateCollectionInStore(payload, search);
      });
    });
  }

  public showNewCollection(asset: any): void {
    let newCollectionButton = <HTMLFormElement>document.querySelector('button.open-bin-tray');
    !this.currentUser.loggedIn() ?
      this.router.navigate(['/user/login']) :
      newCollectionButton.click();
    sessionStorage.setItem('assetForNewCollection', JSON.stringify(asset));
  }

  public addToCart(asset: any): void {
    console.log(asset);
  }

  public downloadComp(asset: any): void {
    console.log(asset);
  }

  public changePage(page: any): void {
    this.searchContext.set({ i: page });
    this.searchContext.go();
  }

  public keywordSearch(): void {
    this.route.params.subscribe(params => {
      this.searchContext.set(params);
      this.newSearch();
    }).unsubscribe();
  }

  public newSearch() {
    this.assetData.searchAssets(this.searchContext.get()).subscribe(
      payload => this.assetData.storeAssets(payload),
      error => this.error.handle(error)
    );
  }

  public filterAssets(): void {
    this.searchContext.set({ i: 1 });
    if (this.filterIds.length > 0) {
      this.searchContext.set({ 'filterIds': this.filterIds.join(',') });
    } else {
      this.searchContext.set({ 'filterIds': null });
    }
    if (this.filterValues.length > 0 && this.filterIds.length > 0) {
      this.searchContext.set({ 'filterValues': this.filterValues.join(',') });
    } else {
      this.searchContext.set({ 'filterValues': null });
    }
    this.searchContext.go();
  }

  public getFilterTree(): void {
    let fids = this.searchContext.get()['filterIds'];
    if (fids && fids !== null) {
      if (typeof fids === 'string') { fids.split(',').forEach(x => this.filterIds.push(x)); }
    }
    let v: Array<string> = this.filterIds;
    this.assetData.getFilterTree(this.searchContext.get()).subscribe(
      payload => { this.rootFilter = new FilterTree('', '', [], '', -1).load(payload, null, v); },
      error => this.error.handle(error)
    );
  }

  public doFilter(filter: FilterTree): void {
    //console.log('do event filter. Is filter checked:' + filter.checked +' filter id: '+filter.filterId);
    //i do not know why this.filterIds.indexOf(filter.filterId) doesn't work. Anyone?
    //something with the type that === comparison keeps failing (but == works)
    if (filter.checked === true) {
      if (filter.contains(this.filterIds, filter.filterId) === false) {
        this.filterIds.push(filter.filterId);
      }
    } else {
      for (let i = 0; i < this.filterIds.length; i++) {
        if (this.filterIds[i].toString() === filter.filterId.toString()) {
          this.filterIds.splice(i, 1);
        }
      }
    }
    this.filterAssets();
  }
}
