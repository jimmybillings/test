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
  switch (action.type) {
    case 'GET_COLLECTIONS':
      return action.payload;
    case 'CREATE_COLLECTION':
      return Object.assign({}, state, state.items.push(action.payload));
    case 'UPDATE_COLLECTION':
      state.items = state.items.map((collection: Collection) => {
        return collection.id === action.payload.id ? action.payload : collection;
      });
      return Object.assign({}, state);
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
  assets: {
    items: [],
    pagination: {
      totalCount: 0,
      currentPage: 1,
      pageSize: 100,
      hasNextPage: false,
      hasPreviousPage: false,
      numberOfPages: 0
    },
  },
  tags: []
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
    CollectionBaseUrl: string,
    CollectionItemsBaseUrl: string
  };

  constructor(
    public store: Store<CollectionStore>,
    public apiConfig: ApiConfig,
    public http: Http) {
    this.collections = store.select('collections');
    this.apiUrls = {
      CollectionBaseUrl: this.apiConfig.baseUrl() + 'api/identities/v1/collection',
      CollectionItemsBaseUrl: this.apiConfig.baseUrl() + 'api/assets/v1/search/collection'
    };
  }

  public loadCollections(): Observable<any> {
    return this.http.get(`${this.apiUrls.CollectionBaseUrl}/fetchBy?access-level=owner`,
      { headers: this.apiConfig.authHeaders() }).map(res => res.json());
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

  public setFocusedCollection(collectionId: number): Observable<any> {
    return this.http.put(`${this.apiUrls.CollectionBaseUrl}/focused/${collectionId}`,
      '', { headers: this.apiConfig.authHeaders() })
      .map(res => res.json());
  }

  public getCollectionItems(collectionId: number, numberPerPg: number, pgIndex: number = 0): Observable<any> {
    return this.http.get(`${this.apiUrls.CollectionItemsBaseUrl}/${collectionId}?i=${pgIndex}&n=${numberPerPg}`,
      { headers: this.apiConfig.authHeaders() })
      .map(res => res.json());
  }

  /**
   * Ajax post request to identities api to add assets to a collection.
   * @param collection    collection object
   * @param assets-ids    comma separated list of asset.ids {35637550} or {35637550,15548547,29935259}
   * @returns Observable
   */
  public addAssetsToCollection(collectionId: any, asset: any): Observable<any> {
    return this.http.post(`${this.apiUrls.CollectionBaseUrl}/${collectionId}/addAssets`,
      `{"list": [{"assetId":${asset.assetId}}]}`,
      { headers: this.apiConfig.authHeaders() })
      .map(res => res.json());
  }

  public deleteCollection(collectionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrls.CollectionBaseUrl}/${collectionId}`,
      { headers: this.apiConfig.authHeaders() });
  }

  public destroyCollections(): void {
    this.store.dispatch({ type: 'GET_COLLECTIONS', payload: collectionsState });
    this.store.dispatch({ type: 'FOCUSED_COLLECTION', payload: focusedState });
  }

  public deleteCollectionFromStore(payload: Collection): void {
    this.store.dispatch({ type: 'DELETE_COLLECTION', payload });
  }

  public createCollectionInStore(payload: Collection): void {
    this.store.dispatch({ type: 'CREATE_COLLECTION', payload });
  }

  public updateFocusedCollectionAssets(collection: Collection, search: any): void {
    search.items = search.items === undefined ? [] : search.items;
    this.store.dispatch({
      type: 'FOCUSED_COLLECTION', payload: {
        createdOn: collection.createdOn,
        lastUpdated: collection.lastUpdated,
        id: collection.id,
        siteName: collection.siteName,
        name: collection.name,
        owner: collection.owner,
        assets: {
          'items': search.items,
          'pagination': {
            'totalCount': search.totalCount,
            'currentPage': search.currentPage + 1,
            'pageSize': search.pageSize,
            'hasNextPage': search.hasNextPage,
            'hasPreviousPage': search.hasPreviousPage,
            'numberOfPages': search.numberOfPages
          }
        },
        tags: collection.tags,
        thumbnail: search.items[search.totalCount - 1].thumbnail
      }
    });
  }
  public updateCollectionInStore(collection: Collection, search: any): void {
    search.items = search.items === undefined ? [] : search.items;
    let thumbnail = collection.thumbnail ? collection.thumbnail : search.items[search.totalCount - 1].thumbnail;
    this.store.dispatch({
      type: 'UPDATE_COLLECTION', payload: {
        createdOn: collection.createdOn,
        lastUpdated: collection.lastUpdated,
        id: collection.id,
        siteName: collection.siteName,
        name: collection.name,
        owner: collection.owner,
        assets: {
          'items': search.items,
          'pagination': {
            'totalCount': search.totalCount,
          }
        },
        thumbnail: thumbnail,
        tags: collection.tags
      }
    });
  }

  public updateFocusedCollection(collection: Collection): void {
    this.store.dispatch({
      type: 'FOCUSED_COLLECTION', payload: {
        createdOn: collection.createdOn,
        lastUpdated: collection.lastUpdated,
        id: collection.id,
        siteName: collection.siteName,
        name: collection.name,
        owner: collection.owner,
        assets: {
          'items': [],
          'pagination': {
            'totalCount': 0,
            'currentPage': 1,
            'pageSize': 100,
            'hasNextPage': false,
            'hasPreviousPage': false,
            'numberOfPages': 0
          }
        },
        tags: collection.tags
      }
    });
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
