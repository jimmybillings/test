import { Injectable } from '@angular/core';
import { Collection, CollectionStore } from '../../shared/interfaces/collection.interface';
import { Http } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable} from 'rxjs/Rx';
import { Store, Reducer, Action} from '@ngrx/store';

/**
 * Focused Collection store -
 */

export function activeState(collection: any = {}): Collection {
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
    tags: collection.tags || []
  };
}

export const activeCollection: Reducer<any> = (state = activeState(), action: Action) => {
  switch (action.type) {
    case 'UPDATE_ACTIVE_COLLECTION':
      return Object.assign({}, state, action.payload);
    case 'RESET_ACTIVE_COLLECTION':
      return Object.assign({}, activeState());
    case 'ADD_ASSET_TO_COLLECTION':
      state.assets.pagination.totalCount++;
      return Object.assign({}, state, state.assets.items.unshift(action.payload));
    case 'REMOVE_ASSET_FROM_COLLECTION':
      let index = state.assets.items.map((item: any) => item.assetId).indexOf(action.payload.assetId);
      if (index > -1) state.assets.items.splice(index, 1);
      state.assets.pagination.totalCount--;
      return Object.assign({}, state);
    default:
      return state;
  }
};

@Injectable()
export class ActiveCollectionService {
  public data: Observable<any>;
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

  public get(): Observable<any> {
    return this.http.get(`${this.apiUrls.CollectionActive}/focused`,
      { headers: this.apiConfig.authHeaders(), body: '' })
      .map((res) => {
        this.updateActiveCollectionStore(res.json());
        return res.json();
      });
  }

  public set(collectionId: number): Observable<any> {
    return this.http.put(`${this.apiUrls.CollectionSetActive}/${collectionId}`,
      '', { headers: this.apiConfig.authHeaders() })
      .map((res) => {
        this.updateActiveCollectionStore(res.json());
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
      {'list': [{'assetId':assetId, 'uuid':uuid}]},
      { headers: this.apiConfig.authHeaders() })
      .map(res => {
        this.removeAssetFromStore(res.json().list[0]);
        return res.json();
      });
  }

  public getItems(collectionId: number, numberPerPg: number, pgIndex: number = 0): Observable<any> {
    return this.http.get(`${this.apiUrls.CollectionItemsBaseUrl}/${collectionId}?i=${pgIndex}&n=${numberPerPg}`,
      { headers: this.apiConfig.authHeaders(), body: '' })
      .map((res) => {
        this.updateActiveCollectionAssets(res.json());
        return res.json();
      });
  }

  public addAssetToStore(asset: any) {
    this.store.dispatch({ type: 'ADD_ASSET_TO_COLLECTION', payload: asset });
  }

  public removeAssetFromStore(asset: any) {
    this.store.dispatch({ type: 'REMOVE_ASSET_FROM_COLLECTION', payload: asset });
  }

  public updateActiveCollectionStore(collection: Collection): void {
    this.store.dispatch({ type: 'UPDATE_ACTIVE_COLLECTION', payload: activeState(collection) });
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

  public mergeCollectionData(item: any, search: any) {
    item.thumbnail = search.items[0].thumbnail;
    item.assets.items = item.assets;
    item.assets.pagination = {};
    item.assets.pagination.totalCount = search.totalCount;
    return item;
  }
}
