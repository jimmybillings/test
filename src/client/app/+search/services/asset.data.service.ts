import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';

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
    private api: ApiService,
    public store: Store<any>) {
    this.data = this.store.select('assets');
  }

  public searchAssets(params: any): Observable<any> {
    params['i'] = (parseFloat(params['i']) - 1).toString();

    return this.api.get2(
      Api.Assets,
      this.currentUser.loggedIn() ? 'search' : 'search/anonymous',
      { parameters: params, loading: true }
    ).do(response => this.storeAssets(response));
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

  public downloadComp(id: any, compType: any): Observable<any> {
    return this.api.get2(Api.Assets, `renditionType/downloadUrl/${id}`, { parameters: { type: compType } });
  }
}
