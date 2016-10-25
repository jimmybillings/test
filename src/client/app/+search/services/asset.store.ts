import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

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

@Injectable()
export class AssetStore {

  constructor(private store: Store<any>) { }

  public get data(): Observable<any> {
    return this.store.select('assets');
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
}