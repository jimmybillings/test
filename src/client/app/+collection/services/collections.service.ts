import { Injectable } from '@angular/core';
import { Collection, Collections, CollectionStore } from '../../shared/interfaces/collection.interface';
import { Http } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable} from 'rxjs/Rx';
import { Store, Reducer, Action} from '@ngrx/store';
import { ActiveCollectionService } from './active-collection.service';
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
      return Object.assign({}, action.payload);
    case 'CREATE_COLLECTION':
      return Object.assign({}, state, state.items.push(action.payload));
    case 'UPDATE_COLLECTION':
      state.items = state.items.map((collection: Collection) => {
        return collection.id === action.payload.id ? action.payload : collection;
      });
      return Object.assign({}, state);
    case 'DELETE_COLLECTION':
      let index = state.items.map((collection: Collection) => collection.id).indexOf(action.payload);
      if (index > -1) state.items.splice(index, 1);
      return Object.assign({}, state);
    case 'RESET_COLLECTIONS':
      return Object.assign({}, collectionsState);
    default:
      return state;
  }
};


@Injectable()
export class CollectionsService {
  public data: Observable<any>;
  public apiUrls: {
    CollectionBaseUrl: string,
    CollectionItemsBaseUrl: string,
    CollectionSummaryBaseUrl: string
  };

  constructor(
    public store: Store<CollectionStore>,
    public apiConfig: ApiConfig,
    public http: Http,
    private activeCollection: ActiveCollectionService) {
    this.data = store.select('collections');
    this.apiUrls = {
      CollectionBaseUrl: this.apiConfig.baseUrl() + 'api/identities/v1/collection',
      CollectionSummaryBaseUrl: this.apiConfig.baseUrl() + 'api/assets/v1/collectionSummary',
      CollectionItemsBaseUrl: this.apiConfig.baseUrl() + 'api/assets/v1/collection'
    };
  }

  public loadCollections(access:string='all',numberPerPg:number=400): Observable<any> {
    return this.http.get(`${this.apiUrls.CollectionSummaryBaseUrl}/fetchBy?access-level=${access}&i=0&n=${numberPerPg}`,
      { headers: this.apiConfig.authHeaders(), body: '' }).map(res => {
        this.storeCollections(res.json());
        return res.json();
      });
  }

  public createCollection(collection: Collection): Observable<any> {
    return this.http.post(this.apiUrls.CollectionBaseUrl,
      JSON.stringify(collection), { headers: this.apiConfig.authHeaders() })
      .map(res => {
        this.createCollectionInStore(res.json());
        this.activeCollection.updateActiveCollectionStore(res.json());
        return res.json();
      });
  }

  public deleteCollection(collectionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrls.CollectionBaseUrl}/${collectionId}`,
      { headers: this.apiConfig.authHeaders() })
      .map(() => this.deleteCollectionFromStore(collectionId));
  }

  public destroyCollections(): void {
    this.store.dispatch({ type: 'RESET_COLLECTIONS' });
    this.activeCollection.resetStore();
  }

  public deleteCollectionFromStore(collectionId: number): void {
    this.store.dispatch({ type: 'DELETE_COLLECTION', payload: collectionId });
  }

  public createCollectionInStore(payload: Collection): void {
    this.store.dispatch({ type: 'CREATE_COLLECTION', payload });
  }

  public updateCollectionInStore(collection: Collection): void {
    this.store.dispatch({ type: 'UPDATE_COLLECTION', payload: collection });
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

  public mergeCollectionData(item: any, search: any) {
    item.thumbnail = search.items[0].thumbnail;
    item.assets.items = item.assets;
    item.assets.pagination = {};
    item.assets.pagination.totalCount = search.totalCount;
    return item;
  }

}
