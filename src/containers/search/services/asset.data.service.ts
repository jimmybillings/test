import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import { ApiConfig } from '../../../common/config/api.config';
import { Observable} from 'rxjs/Rx';
import { CurrentUser} from '../../../common/models/current-user.model';
import { Store, Reducer, Action} from '@ngrx/store';
import { RequestOptions, URLSearchParams } from 'angular2/http';

const initAssets = {
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
    private http: Http,
    private apiConfig: ApiConfig,
    private store: Store<any>) {
    this.assets = this.store.select('assets');
  }

  /**
   * @param loggedIn  Current user is logged in if localStorage token exists otherwise current user is not logged in.
   *                  This is needed to return URL from getAssetSearchPath()
   * @returns         URL for search api  concatenates the root URL with the search URL. Examples:
   *                  http://dev.crux.t3sandbox.xyz.:8080/api/assets/v1/clip/user/search if you're logged in
   *                  http://dev.crux.t3sandbox.xyz.:8080/api/assets/v1/clip/anonymous/search if you're logged out
   */
  public searchAssetsUrl(loggedIn: boolean): string {
    return this.apiConfig.baseUrl() + this.getAssetSearchPath(loggedIn);
  }

  /**
   * Ajax get request to search api to return matching assets and pagination information.
   * @param params    These are the url params when accessing search like q=goats (query string in search), n=25 (assets per page)
   * @returns         Response from search api. This includes information for pagination and assets for the search query.
   *                  Example: {items: Array[25], totalCount: 122, currentPage: 1, pageSize: 25, hasNextPage: true}
   */
  public searchAssets(params: { [key: string]: string }): Observable<any> {
    params['i'] = (parseFloat(params['i']) - 1).toString();
    let options = this.getAssetSearchOptions(params, this.currentUser.loggedIn());
    return this.http.get(this.searchAssetsUrl(this.currentUser.loggedIn()), options)
      .map((res: Response) => (res.json()));
  }
  
  
  public storeAssets(payload): void {
    this.store.dispatch({type: 'SEARCH', payload: {
      'items': payload.items,
      'pagination': {
        'totalCount': payload.totalCount,
        'currentPage': payload.currentPage + 1,
        'hasNextPage': payload.hasNextPage,
        'hasPreviousPage': payload.hasPreviousPage,
        'numberOfPages': payload.numberOfPages,
        'pageSize': payload.pageSize
      }
    }});
  }
  
  public reset(): void {
    this.store.dispatch({ type: 'SEARCH.RESET' });
  }
  
  public clearAssets(): void {
    this.store.dispatch({ type: 'SEARCH.CLEAR_ASSETS' });
  }

  /**
   * The search api requires a different URL depending if you are a logged in user or not.
   * @param isUserLoggedIn  True if current user is logged in and has localStorage information
   * @returns               appropriate api search path based on whether or not user is logged in
  */  
  public getAssetSearchPath(isUserLoggedIn: boolean): string {
    return (isUserLoggedIn) ? 'api/assets/v1/search/solrcloud' : 'api/assets/v1/search/anonymous/solrcloud';
  }

  /**
   * @param isUserLoggedIn  True if current user is logged in and has localStorage information, and is
   *                        used to set api header information. 
   * @param params          These are the url params when accessing search like q=goats (query string in search), n=25 (assets per page)
   * @returns               If user is not logged you get Query String Parameters that look like
   *                        (q:derby n:25 siteName: core) if the user is logged in additional info is 
   *                        passed into the Request Header like (Authorization:Bearer 48a0ecaa46e2770a7a82810daed4272 
   *                        Content-Type:application/json) and Query String Parameters would be like (q:derby n:25)
   *                        
  */
  public getAssetSearchOptions(params: { [key: string]: string }, isUserLoggedIn: boolean): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in params) search.set(param, params[param]);

    if (!isUserLoggedIn) search.set('siteName', this.apiConfig.getPortal());

    let headers = (isUserLoggedIn) ? this.apiConfig.authHeaders() : void null;
    let options = (isUserLoggedIn) ? { headers: headers, search: search } : { search: search };
    return new RequestOptions(options);
  }
}
