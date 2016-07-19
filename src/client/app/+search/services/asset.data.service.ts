import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable} from 'rxjs/Rx';
import { CurrentUser} from '../../shared/services/current-user.model';
import { Store, Reducer, Action} from '@ngrx/store';

const initAssets: any = {
  items: [],
  pagination: {
    hasNextPage: false,
    hasPreviousPage: false,
    numberOfPages: 0,
    pageSize: 100,
    totalCount: 0,
    currentPage: 1
  }
};

export const assets: Reducer<any> = (state: any = initAssets, action: Action) => {

  switch (action.type) {
    case 'SEARCH':
      return Object.assign({}, action.payload);
    case 'SEARCH.RESET':
      return Object.assign({}, initAssets);
    case 'SEARCH.CLEAR_ASSETS':
      return Object.assign({}, state, state.items = []);
    default:
      return state;
  }
};

/**
 * Service that provides access to the search api  
 * and returns search results
 */
@Injectable()
export class AssetData {
  public assets: Observable<any>;
  constructor(
    public currentUser: CurrentUser,
    public http: Http,
    public apiConfig: ApiConfig,
    public store: Store<any>) {
    this.assets = this.store.select('assets');
  }

  public searchAssetsUrl(loggedIn: boolean): string {
    return this.apiConfig.baseUrl() + this.getAssetSearchPath(loggedIn);
  }
  public filterTreeUrl(loggedIn:boolean): string {
    return this.apiConfig.baseUrl() + this.getFilterTreePath(loggedIn);
  }

  public searchAssets(params: any): Observable<any> {
    params['i'] = (parseFloat(params['i']) - 1).toString();
    let options = this.getAssetSearchOptions(params, this.currentUser.loggedIn());
    return this.http.get(this.searchAssetsUrl(this.currentUser.loggedIn()), options)
      .map((res: Response) => (res.json()));
  }
  
  public getFilterTree(params:any) :Observable<any> {
    params['counted']= 'true';
    let options = this.getAssetSearchOptions(params, this.currentUser.loggedIn());
    return this.http.get(this.filterTreeUrl(this.currentUser.loggedIn()), options).map((res: Response) => (res.json()));
  }

  public storeAssets(payload: any): void {
    this.store.dispatch({
      type: 'SEARCH', payload: {
        'items': payload.items,
        'pagination': {
          'totalCount': payload.totalCount,
          'currentPage': payload.currentPage + 1,
          'hasNextPage': payload.hasNextPage,
          'hasPreviousPage': payload.hasPreviousPage,
          'numberOfPages': payload.numberOfPages,
          'pageSize': payload.pageSize
        }
      }
    });
  }

  public reset(): void {
    this.store.dispatch({ type: 'SEARCH.RESET' });
  }

  public clearAssets(): void {
    this.store.dispatch({ type: 'SEARCH.CLEAR_ASSETS' });
  }

  public getAssetSearchPath(isUserLoggedIn: boolean): string {
    return (isUserLoggedIn) ? 'api/assets/v1/search' : 'api/assets/v1/search/anonymous';
  }

  public getAssetSearchOptions(params: any, isUserLoggedIn: boolean): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in params) search.set(param, params[param]);

    if (!isUserLoggedIn) search.set('siteName', this.apiConfig.getPortal());

    let headers = (isUserLoggedIn) ? this.apiConfig.authHeaders() : void null;
    let options = (isUserLoggedIn) ? { headers: headers, search: search } : { search: search };
    return new RequestOptions(options);
  }

  public getFilterTreePath(isUserLoggedIn:boolean): string {
    return (isUserLoggedIn) ? 'api/assets/v1/filter/filterTree' : 'api/assets/v1/filter/anonymous/filterTree';
  }
}
