import { Injectable } from '@angular/core';
import { Collection, Collections, CollectionStore } from '../../shared/interfaces/collection.interface';
import { Http } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable} from 'rxjs/Rx';
import { Store, Reducer, Action} from '@ngrx/store';

/**
 * Collections store -
 */
const collectionsState: Collections = {
  items: [],
  pagination: {
    totalCount: 0,
    currentPage: 1,
    pageSize: 100,
    hasNextPage: false,
    hasPreviousPage: false,
    numberOfPages: 0
  }
};

export const collections: Reducer<any> = (state: Collections = collectionsState, action: Action) => {
  console.log(state);
  switch (action.type) {
    case 'GET_COLLECTIONS':
      return action.payload;
    case 'CREATE_COLLECTION':
      return Object.assign({}, state, state.items.push(action.payload));
    case 'UPDATE_COLLECTION':
      return state.items.map((collection: Collection) => {
        return collection.id === action.payload.id ? Object.assign({}, collection, action.payload) : collection;
      });
    case 'DELETE_COLLECTION':
      return Object.assign({}, state, state.items = state.items.filter((collection: Collection) => {
        return collection.id !== action.payload.id;
      }));
    default:
      return state;
  }
};

/**
 * Focused Collection store -
 */
const focusedState: Collection = {
  createdOn: '',
  lastUpdated: '',
  id: null,
  siteName: '',
  name: '',
  owner: '',
  assets: [],
  tags: [],
};

export const focusedCollection: Reducer<any> = (state = focusedState, action: Action) => {
  switch (action.type) {
    case 'FOCUSED_COLLECTION':
      return action.payload;
    default:
      return state;
  }
};

@Injectable()
export class CollectionsService {
  public collections: Observable<any>;
  public focusedCollection: Observable<any>;
  public apiUrls: {
    CollectionBaseUrl: string
  };

  constructor(
    public store: Store<CollectionStore>,
    public apiConfig: ApiConfig,
    public http: Http) {
    this.collections = store.select('collections');
    this.apiUrls = {
      CollectionBaseUrl: this.apiConfig.baseUrl() + 'api/identities/v1/collection'
    };
  }

  public loadCollections(): Observable<any> {
    return this.http.get(`${this.apiUrls.CollectionBaseUrl}/fetchBy?access-level=owner`,
      {headers: this.apiConfig.authHeaders()}).map(res => res.json());
  }

  public createCollection(collection: Collection): Observable<any> {
    return this.http.post(this.apiUrls.CollectionBaseUrl,
      JSON.stringify(collection), { headers: this.apiConfig.authHeaders() })
      .map(res => res.json());
  }

  public getFocusedCollection(): Observable<any> {
    return this.http.get(`${this.apiUrls.CollectionBaseUrl}/focused`,
      { headers: this.apiConfig.authHeaders() })
      .map(res => res.json());
  }

  public setFocusedCollection(collection: Collection): Observable<any> {
    return this.http.put(`${this.apiUrls.CollectionBaseUrl}/focused/${collection.id}`,
      '', { headers: this.apiConfig.authHeaders() });
  }

  /**
   * Ajax post request to identities api to add assets to a collection.
   * @param collection    collection object
   * @param assets-ids    comma separated list of asset.ids {35637550} or {35637550,15548547,29935259}
   * @returns Observable
   */
  public addAssetsToCollection(collection: Collection, assetIds: any): Observable<any> {
    return this.http.post(`${this.apiUrls.CollectionBaseUrl}/${collection.id}/addAssets?asset-ids=${assetIds}`,
      '', { headers: this.apiConfig.authHeaders() })
      .map(res => res.json());
  }

  public deleteCollection(collection: Collection): Observable<any> {
    return this.http.delete(`${this.apiUrls.CollectionBaseUrl}/${collection.id}`,
      { headers: this.apiConfig.authHeaders() });
  }

  public clearCollections(): void {
    this.store.dispatch({ type: 'GET_COLLECTIONS', payload: collectionsState });
    this.store.dispatch({ type: 'FOCUSED_COLLECTION', payload: focusedState });
  }

  public updateFocusedCollection(payload: Collection) {
    this.store.dispatch({ type: 'FOCUSED_COLLECTION', payload: payload });
  }

  public storeCollections(payload: any): void {
    payload.items = payload.items === undefined ? [] : payload.items;
    this.store.dispatch({
      type: 'GET_COLLECTIONS', payload: {
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
