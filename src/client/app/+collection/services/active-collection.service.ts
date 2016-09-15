import { Injectable, OnInit } from '@angular/core';
import { Collection, CollectionStore } from '../../shared/interfaces/collection.interface';
import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable} from 'rxjs/Rx';
import { Store, ActionReducer, Action} from '@ngrx/store';

/**
 * Focused Collection store -
 */
export const activeCollection: ActionReducer<any> = (state = initState(), action: Action) => {
  switch (action.type) {
    case 'UPDATE_ACTIVE_COLLECTION':
      return Object.assign({}, state, action.payload);
    case 'RESET_ACTIVE_COLLECTION':
      return Object.assign({}, initState());
    case 'ADD_ASSET_TO_COLLECTION':
      return Object.assign({}, state, state.assets.items.unshift(action.payload), { assetsCount: state.assetsCount + 1 });
    case 'REMOVE_ASSET_FROM_COLLECTION':
      let index = state.assets.items.map((item: any) => item.assetId).indexOf(action.payload.assetId);
      if (index > -1) state.assets.items.splice(index, 1);
      return Object.assign({}, state, { assetsCount: state.assetsCount - 1 });

    default:
      return state;
  }
};

@Injectable()
export class ActiveCollectionService implements OnInit {
  public data: Observable<any>;
  public params: any;
  public apiUrls: {
    CollectionBaseUrl: string,
    CollectionItemsBaseUrl: string,
    CollectionActive: string,
    CollectionSetActive: string
  };

  constructor(
    public store: Store<CollectionStore>,
    public apiConfig: ApiConfig,
    public http: Http) {
    this.data = this.store.select('activeCollection');

    this.apiUrls = {
      CollectionBaseUrl: this.apiConfig.baseUrl() + 'api/identities/v1/collection',
      CollectionItemsBaseUrl: this.apiConfig.baseUrl() + 'api/assets/v1/collectionSummary/assets',
      CollectionActive: this.apiConfig.baseUrl() + 'api/assets/v1/collectionSummary',
      CollectionSetActive: this.apiConfig.baseUrl() + 'api/assets/v1/collectionSummary/setFocused'
    };

  }

  ngOnInit(): void {
    this.setSearchParams();
  }

  public get(): Observable<any> {
    return this.http.get(`${this.apiUrls.CollectionActive}/focused`,
      { headers: this.apiConfig.authHeaders(), body: '' })
      .map((res) => {
        this.updateActiveCollectionStore(res.json());
        return res.json();
      });
  }

  public set(collectionId: number, set: boolean = true): Observable<any> {
    return this.http.put(`${this.apiUrls.CollectionSetActive}/${collectionId}`,
      '', { headers: this.apiConfig.authHeaders() })
      .map((res) => {
        if (set) this.updateActiveCollectionStore(res.json());
        return res.json();
      });
  }

  public addAsset(collectionId: any, asset: any): Observable<any> {
    return this.http.post(`${this.apiUrls.CollectionBaseUrl}/${collectionId}/addAssets`,
      `{"list": [{"assetId":${asset.assetId}}]}`,
      { headers: this.apiConfig.authHeaders() })
      .map((res) => {
        return res.json();
      });
  }

  public removeAsset(collectionId: any, assetId: any, uuid: any): Observable<any> {
    return this.http.post(`${this.apiUrls.CollectionBaseUrl}/${collectionId}/removeAssets`,
      { 'list': [{ 'assetId': assetId, 'uuid': uuid }] },
      { headers: this.apiConfig.authHeaders() })
      .map(res => {
        this.removeAssetFromStore(res.json().list[0]);
        return res.json();
      });
  }

  public getItems(collectionId: number, collectionParams: any, set: boolean = true): Observable<any> {
    if (collectionParams['i']) collectionParams['i'] -= 1;
    this.params = Object.assign({}, this.params, collectionParams);
    return this.http.get(`${this.apiUrls.CollectionItemsBaseUrl}/${collectionId}`,
      this.getSearchOptions(this.params))
      .map((res) => {
        if (set) this.updateActiveCollectionAssets(res.json());
        return res.json();
      });
  }

  public getSearchOptions(params: any): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    for (var param in params) search.set(param, params[param]);
    let options = { headers: this.apiConfig.authHeaders(), search: search, body: '' };
    return new RequestOptions(options);
  }

  public get state(): any {
    let s: any;
    this.data.take(1).subscribe(state => s = state);
    return s;
  }

  public addAssetToStore(asset: any) {
    this.store.dispatch({ type: 'ADD_ASSET_TO_COLLECTION', payload: asset });
  }

  public removeAssetFromStore(asset: any) {
    this.store.dispatch({ type: 'REMOVE_ASSET_FROM_COLLECTION', payload: asset });
  }

  public updateActiveCollectionStore(collection: Collection): void {
    this.store.dispatch({ type: 'UPDATE_ACTIVE_COLLECTION', payload: collectionSummary(collection) });
  }

  public resetStore() {
    this.store.dispatch({ type: 'RESET_ACTIVE_COLLECTION' });
  }

  public updateActiveCollectionAssets(assets: any): void {
    assets.items = assets.items === undefined ? [] : assets.items;
    this.store.dispatch({
      type: 'UPDATE_ACTIVE_COLLECTION', payload: {
        assets: {
          'items': assets.items,
          'pagination': {
            'totalCount': assets.totalCount,
            'currentPage': assets.currentPage + 1,
            'pageSize': assets.pageSize,
            'hasNextPage': assets.hasNextPage,
            'hasPreviousPage': assets.hasPreviousPage,
            'numberOfPages': assets.numberOfPages
          }
        }
      }
    });
  }

  public setSearchParams() {
    this.params = { 's': '', 'd': '', 'i': '0', 'n': '50' };
  }

  public mergeCollectionData(item: any, search: any) {
    item.thumbnail = search.items[0].thumbnail;
    item.assets.items = item.assets;
    item.assets.pagination = {};
    item.assets.pagination.totalCount = search.totalCount;
    return item;
  }

  public isActiveCollection(collectionId: number): boolean {
    let isMatch: boolean;
    this.data.take(1)
      .map(activeCollection => activeCollection.id)
      .subscribe(id => isMatch = id === collectionId);
    return isMatch;
  }
}

export function initState(collection: any = {}): Collection {
  return {
    createdOn: collection.createdOn || '',
    lastUpdated: collection.lastUpdated || '',
    id: collection.id || null,
    siteName: collection.siteName || '',
    name: collection.name || '',
    owner: collection.owner || 0,
    email: collection.email || '',
    userRole: collection.userRole || '',
    editors: collection.editors || [],
    collectionThumbnail: collection.collectionThumbnail || {},
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
    tags: collection.tags || [],
    assetsCount: collection.assetCount || 0
  };
}

export function collectionSummary(collection: any = {}): Collection {
  return {
    createdOn: collection.createdOn || '',
    lastUpdated: collection.lastUpdated || '',
    id: collection.id || null,
    siteName: collection.siteName || '',
    name: collection.name || '',
    owner: collection.owner || 0,
    email: collection.email || '',
    userRole: collection.userRole || '',
    editors: collection.editors || [],
    collectionThumbnail: collection.collectionThumbnail || {},
    tags: collection.tags || [],
    assetsCount: collection.assetsCount || 0
  };
}
