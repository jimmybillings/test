import { Injectable } from '@angular/core';
import { Collection, Collections, CollectionStore } from '../../shared/interfaces/collection.interface';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { ActiveCollectionService } from './active-collection.service';
import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';

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
  private params: any;

  constructor(
    public store: Store<CollectionStore>,
    private api: ApiService,
    private activeCollection: ActiveCollectionService) {
    this.data = store.select('collections');
    this.setSearchParams();
    this.syncActiveCollection();
  }

  public get state(): any {
    let s: any;
    this.data.take(1).subscribe(state => s = state);
    return s;
  }

  public load(params: any = {}, loading: boolean = false): Observable<any> {
    //TODO:  Do we really want to update this.params every time load() is called?
    this.params = Object.assign({}, this.params, params);

    return this.api.get(Api.Assets, `collectionSummary/search`, { parameters: this.params, loading: loading })
      .do(response => this.storeCollections(response));
  }

  public create(collection: Collection): Observable<any> {
    return this.api.post(Api.Assets, 'collectionSummary', { body: collection })
      .do(response => {
        const collection: Collection = response as Collection;
        this.createCollectionInStore(collection);
      });
  }

  public update(collection: Collection): Observable<any> {
    return this.api.put(Api.Assets, `collectionSummary/${collection.id}`, { body: collection });
  }

  public delete(collectionId: number): Observable<any> {
    return this.api.delete(Api.Identities, `collection/${collectionId}`)
      .do(_ => this.deleteCollectionFromStore(collectionId));
  }

  public destroyAll(): void {
    this.store.dispatch({ type: 'RESET_COLLECTIONS' });
    this.activeCollection.resetStore();
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
    this.params = { q: '', accessLevel: 'all', s: '', d: '', i: 0, n: 200 };
  }
}
