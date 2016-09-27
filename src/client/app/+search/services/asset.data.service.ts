import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { Observable} from 'rxjs/Rx';
import { CurrentUser} from '../../shared/services/current-user.model';
import { Store, ActionReducer, Action} from '@ngrx/store';
import { ApiService } from '../../shared/services/api.service';

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

export const assets: ActionReducer<any> = (state: any = initAssets, action: Action) => {

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
  public data: Observable<any>;
  constructor(
    public currentUser: CurrentUser,
    public api: ApiService,
    public store: Store<any>) {
    this.data = this.store.select('assets');
  }

  public searchAssetsUrl(loggedIn: boolean): string {
    return this.getAssetSearchPath(loggedIn);
  }

  public searchAssets(params: any): Observable<any> {
    params['i'] = (parseFloat(params['i']) - 1).toString();
    let options = this.getAssetSearchOptions(params, this.currentUser.loggedIn());
    return this.api.get(this.searchAssetsUrl(this.currentUser.loggedIn()), options, true)
      .map((res: Response) => {
        this.storeAssets(res.json());
        return res.json();
      });
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
    let options = { search: search };
    return new RequestOptions(options);
  }

  public downloadComp(id: any, compType: any): Observable<any> {
    return this.api.get('api/assets/v1/renditionType/downloadUrl/' + id + '?type=' + compType)
      .map((res) => { return res.json(); });
  }
}
