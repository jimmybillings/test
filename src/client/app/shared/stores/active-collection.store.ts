import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { Collection, CollectionStore, Items, Assets } from '../interfaces/collection.interface';

export const activeCollection: ActionReducer<any> = (state: Collection = initialState(), action: Action) => {
  if (state === null) state = initialState();

  let updatedAssets: Items;

  switch (action.type) {
    case 'UPDATE_ACTIVE_COLLECTION':
      return Object.assign({}, state, action.payload, {
        assetsCount: (action.payload.assets && action.payload.assets.items) ? action.payload.assets.items.length : 0
      });

    case 'RESET_ACTIVE_COLLECTION':
      return Object.assign({}, initialState());

    case 'ADD_ASSET_TO_COLLECTION':
      if (state.assets) {
        updatedAssets = JSON.parse(JSON.stringify(state.assets));
        if (!updatedAssets.items) updatedAssets.items = [];
        updatedAssets.items.unshift(action.payload);
      } else {
        updatedAssets = { items: [action.payload] };
      }

      return Object.assign({}, state, { assets: updatedAssets, assetsCount: updatedAssets.items.length });

    case 'REMOVE_ASSET_FROM_COLLECTION':
      if (!state.assets || !state.assets.items) return state;

      updatedAssets = JSON.parse(JSON.stringify(state.assets));
      updatedAssets.items = updatedAssets.items.filter((item: Assets) => item.uuid !== action.payload);

      return Object.assign({}, state, { assets: updatedAssets, assetsCount: updatedAssets.items.length });

    default:
      return state;
  }
};

@Injectable()
export class ActiveCollectionStore {
  constructor(private store: Store<CollectionStore>) { }

  public get data(): Observable<any> {
    return this.store.select('activeCollection');
  }

  public add(asset: any): void {
    this.store.dispatch({ type: 'ADD_ASSET_TO_COLLECTION', payload: asset });
  }

  public remove(uuid: string): void {
    this.store.dispatch({ type: 'REMOVE_ASSET_FROM_COLLECTION', payload: uuid });
  }

  public updateTo(collection: Collection): void {
    this.store.dispatch({ type: 'UPDATE_ACTIVE_COLLECTION', payload: collectionSummary(collection) });
  }

  public reset(): void {
    this.store.dispatch({ type: 'RESET_ACTIVE_COLLECTION' });
  }

  public updateAssetsTo(assets: any): void {
    if (!assets) assets = {};

    this.store.dispatch({
      type: 'UPDATE_ACTIVE_COLLECTION', payload: {
        assets: {
          items: assets.items || [],
          pagination: {
            totalCount: assets.totalCount,
            currentPage: assets.currentPage + 1,
            pageSize: assets.pageSize,
            hasNextPage: assets.hasNextPage,
            hasPreviousPage: assets.hasPreviousPage,
            numberOfPages: assets.numberOfPages
          }
        }
      }
    });
  }

  public get state(): any {
    let s: any;
    this.data.take(1).subscribe(state => s = state);
    return s;
  }
}

function initialState(): Collection {
  return {
    createdOn: '',
    lastUpdated: '',
    id: null,
    siteName: '',
    name: '',
    owner: 0,
    email: '',
    userRole: '',
    editors: [],
    collectionThumbnail: {} as { name: string, urls: { https: string } },
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
    tags: [],
    assetsCount: 0
  };
}

function collectionSummary(collection: any): Collection {
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
