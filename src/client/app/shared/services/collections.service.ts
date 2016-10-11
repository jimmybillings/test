import { Injectable } from '@angular/core';
import { Collection, Collections, CollectionStore } from '../../shared/interfaces/collection.interface';
import { URLSearchParams, RequestOptions } from '@angular/http';
import { Observable} from 'rxjs/Rx';
import { Store, ActionReducer, Action} from '@ngrx/store';
import { ActiveCollectionService } from './active-collection.service';
import { ApiService } from '../../shared/services/api.service';

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

export const collections: ActionReducer<any> = (state: Collections = collectionsState, action: Action) => {
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
    CollectionSummaryBaseUrl: string;
    CollectionBaseUrl: string;
  };
  private params: any;

  constructor(
    public store: Store<CollectionStore>,
    public api: ApiService,
    private activeCollection: ActiveCollectionService) {
    this.data = store.select('collections');
    this.apiUrls = {
      CollectionBaseUrl: 'api/identities/v1/collection',
      CollectionSummaryBaseUrl: 'api/assets/v1/collectionSummary',
    };
    this.setSearchParams();
    this.syncActiveCollection();
  }

  public get state(): any {
    let s: any;
    this.data.take(1).subscribe(state => s = state);
    return s;
  }

  public load(params: any = {}, loading: boolean = false): Observable<any> {
    this.params = Object.assign({}, this.params, params);
    return this.api.get(`${this.apiUrls.CollectionSummaryBaseUrl}/search`,
      this.getSearchOptions(this.params), loading)
      .map(res => {
        this.storeCollections(res.json());
        return res.json();
      });
  }

  public create(collection: Collection): Observable<any> {
    return this.api.post(this.apiUrls.CollectionSummaryBaseUrl,
      JSON.stringify(collection))
      .map(res => {
        this.createCollectionInStore(res.json());
        this.activeCollection.updateActiveCollectionStore(res.json());
        return res.json();
      });
  }

  public update(collection: Collection): Observable<any> {
    return this.api.put(`${this.apiUrls.CollectionSummaryBaseUrl}/${collection.id}`,
      JSON.stringify(collection));
  }

  public delete(collectionId: number): Observable<any> {
    return this.api.delete(`${this.apiUrls.CollectionBaseUrl}/${collectionId}`)
      .map(() => this.deleteCollectionFromStore(collectionId));
  }

  public destroyAll(): void {
    this.store.dispatch({ type: 'RESET_COLLECTIONS' });
    this.activeCollection.resetStore();
  }

  public getSearchOptions(params: any): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in params) search.set(param, params[param]);
    let options = { search: search };
    return new RequestOptions(options);
  }

  public syncActiveCollection() {
    this.activeCollection.data.subscribe((collection: Collection) => {
      if (this.state.items && this.state.items.length > 0) this.updateCollectionInStore(collection);
    });
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

  public setSearchParams() {
    this.params = { 'q': '', 'accessLevel': 'all', 's': '', 'd': '', 'i': 0, 'n': 200 };
  }
}
