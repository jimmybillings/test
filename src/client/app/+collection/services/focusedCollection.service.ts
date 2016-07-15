import { Injectable } from '@angular/core';
import { Collection, CollectionStore } from '../../shared/interfaces/collection.interface';
import { Http } from '@angular/http';
import { ApiConfig } from '../../shared/services/api.config';
import { Observable} from 'rxjs/Rx';
import { Store, Reducer, Action} from '@ngrx/store';

/**
 * Focused Collection store -
 */

function focusedState(collection:any = {}) : Collection {
    return {
        createdOn: collection.createdOn || '',
        lastUpdated: collection.lastUpdated || '',
        id: collection.id || null,
        siteName: collection.siteName || '',
        name: collection.name || '',
        owner: collection.owner || '',
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

export const focusedCollection: Reducer<any> = (state = focusedState(), action: Action) => {
  switch (action.type) {
    case 'FOCUSED_COLLECTION':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class FocusedCollectionService {
  public focusedCollection: Observable<any>;
  public apiUrls: {
    CollectionBaseUrl: string,
    CollectionItemsBaseUrl: string
  };

  constructor(
    public store: Store<CollectionStore>,
    public apiConfig: ApiConfig,
    public http: Http) {
    this.focusedCollection = this.store.select('focusedCollection');
    this.apiUrls = {
      CollectionBaseUrl: this.apiConfig.baseUrl() + 'api/identities/v1/collection',
      CollectionItemsBaseUrl: this.apiConfig.baseUrl() + 'api/assets/v1/search/collection'
    };
  }

  public getFocusedCollection(): Observable<any> {
    return this.http.get(`${this.apiUrls.CollectionBaseUrl}/focused`,
      { headers: this.apiConfig.authHeaders() })
      .map((res) => {
          this.updateFocusedCollection(res.json());
          return res.json();
      });
  }

  public setFocusedCollection(collectionId: number): Observable<any> {
    return this.http.put(`${this.apiUrls.CollectionBaseUrl}/focused/${collectionId}`,
      '', { headers: this.apiConfig.authHeaders() })
      .map((res) => {
          this.updateFocusedCollection(res.json());
          return res.json();
      });
  }

  public updateFocusedCollection(collection: Collection): void {
    this.store.dispatch({type: 'FOCUSED_COLLECTION', payload: focusedState(collection)});
  }

  public updateFocusedCollectionAssets(assets: any): void {
    assets.items = assets.items === undefined ? [] : assets.items;
    this.store.dispatch({
      type: 'FOCUSED_COLLECTION', payload: {
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
        },
        thumbnail: assets.items[assets.totalCount - 1].thumbnail
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
