import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { Collection, CollectionsStoreI, CollectionItems } from '../interfaces/collection.interface';
import { Asset } from '../interfaces/common.interface';

export function activeCollection(state: Collection = initialState(), action: Action) {
  if (state === null) state = initialState();

  let updatedAssets: CollectionItems;

  switch (action.type) {
    case 'UPDATE_ACTIVE_COLLECTION':
      return Object.assign({}, state, action.payload, {
        assetsCount: (action.payload.assets && action.payload.assets.pagination) ? action.payload.assets.pagination.totalCount : 0
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
      const countWithNewAsset: number = (state.assetsCount) ? state.assetsCount + 1 : 1;
      return Object.assign({}, state, { assets: updatedAssets, assetsCount: countWithNewAsset });

    case 'REMOVE_ASSET_FROM_COLLECTION':
      if (!state.assets || !state.assets.items) return state;
      updatedAssets = JSON.parse(JSON.stringify(state.assets));
      updatedAssets.items = updatedAssets.items.filter((item: Asset) => item.uuid !== action.payload);
      updatedAssets.pagination.totalCount = updatedAssets.pagination.totalCount - 1;
      if (updatedAssets.pagination.totalCount < 0) updatedAssets.pagination.totalCount = 0;
      const countWithAssetRemoved: number = (state.assetsCount > 0) ? state.assetsCount - 1 : 0;
      return Object.assign({}, state, { assets: updatedAssets, assetsCount: countWithAssetRemoved });

    case 'UPDATE_ASSET_IN_COLLECTION':
      state.assets.items = state.assets.items.map((item: any) => {
        if (item.uuid === action.payload.uuid) {
          return Object.assign({}, item, { timeStart: action.payload.timeStart, timeEnd: action.payload.timeEnd });
        } else {
          return item;
        }
      });
      return Object.assign({}, state);
    default:
      return state;
  }
};

@Injectable()
export class ActiveCollectionStore {
  constructor(private store: Store<CollectionsStoreI>) { }

  public get data(): Observable<any> {
    return this.store.select('activeCollection');
  }

  public add(asset: any): void {
    this.store.dispatch({ type: 'ADD_ASSET_TO_COLLECTION', payload: asset });
  }

  public remove(uuid: string): void {
    this.store.dispatch({ type: 'REMOVE_ASSET_FROM_COLLECTION', payload: uuid });
  }

  public updateAsset(asset: any) {
    this.store.dispatch({ type: 'UPDATE_ASSET_IN_COLLECTION', payload: asset });
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
    createdOn: null,
    lastUpdated: null,
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
    createdOn: collection.createdOn || null,
    lastUpdated: collection.lastUpdated || null,
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
