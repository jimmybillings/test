import { Injectable } from '@angular/core';
import { Collection, CollectionStore } from '../../shared/interfaces/collection.interface';
// import { Http, Response } from '@angular/http';
import { Http } from '@angular/http';
// import { RequestOptions, URLSearchParams } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable} from 'rxjs/Rx';
import { CurrentUser} from '../../shared/services/current-user.model';
import { Store, Reducer, Action} from '@ngrx/store';


/**
 * Collections store - 
 */

export const collections: Reducer<any> = (state: any = [], action: Action) => {
  switch (action.type) {
    case 'ADD_COLLECTIONS':
      return action.payload;
    case 'CREATE_COLLECTION':
      return [...state, action.payload];
    case 'UPDATE_COLLECTION':
      return state.map((collection: Collection) => {
        return collection.id === action.payload.id ? Object.assign({}, collection, action.payload) : collection;
      });
    case 'DELETE_COLLECTION':
      return state.filter((collection: Collection) => {
        return collection.id !== action.payload.id;
      });
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
export const focusedCollection = (state = focusedState, action: Action) => {
  switch (action.type) {
    case 'FOCUSED_COLLECTION':
      return action.payload;
    default:
      return state;
  }
};


@Injectable()
export class CollectionsService {
  // public collections: Observable<Collection[]>;
  public collections: Observable<any>;
  public focusedCollection: Observable<any>;
  public currentUser: CurrentUser;
  public apiUrls: {
    CollectionBaseUrl: string
  };

  constructor(
    public store: Store<CollectionStore>,
    public apiConfig: ApiConfig,
    public http: Http) {
    this.collections = store.select('collections');
    // this.focusedCollection = store.select('focusedCollections');
    this.apiUrls = {
      CollectionBaseUrl: this.apiConfig.baseUrl() + 'api/identities/v1/collection'
    };
  }

  public loadCollections() {
    this.http.get(this.apiUrls.CollectionBaseUrl,
      { headers: this.apiConfig.authHeaders() })
      .map(res => res.json())
      .map(payload => ({ type: 'ADD_COLLECTIONS', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  public getFocusedCollection() {
    this.http.get(`${this.apiUrls.CollectionBaseUrl}/focused`,
      { headers: this.apiConfig.authHeaders() })
      .map(res => res.json())
      .map(payload => ({ type: 'FOCUSED_COLLECTION', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  public saveCollection(collection: Collection) {
    (collection.id) ? this.updateColleciton(collection) : this.createCollection(collection);
  }

  public createCollection(collection: Collection) {
    this.http.post(this.apiUrls.CollectionBaseUrl,
      JSON.stringify(collection), { headers: this.apiConfig.authHeaders() })
      .map(res => res.json())
      .map(payload => ({ type: 'CREATE_COLLECTION', payload }))
      .subscribe(action => this.store.dispatch(action));
  }

  public updateColleciton(collection: Collection) {
    this.http.put(`${this.apiUrls.CollectionBaseUrl}${collection.id}`,
      JSON.stringify(collection), { headers: this.apiConfig.headers() })
      .subscribe(action => this.store.dispatch({ type: 'UPDATE_COLLECTION', payload: collection }));
  }

  public deleteCollection(collection: Collection) {
    this.http.delete(`${this.apiUrls.CollectionBaseUrl}${collection.id}`)
      .subscribe(action => this.store.dispatch({ type: 'DELETE_COLLECTION', payload: collection }));
  }

  public resetFocused(): void {
    this.store.dispatch({ type: 'FOCUSED_COLLECTION', payload: focusedState });
  }
}
