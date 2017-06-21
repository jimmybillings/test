import { Action } from '@ngrx/store';

import {
  Collection, CollectionItems, CollectionItemsResponse, CollectionItemMarkersUpdater
} from '../interfaces/collection.interface';
import { Asset } from '../interfaces/common.interface';
import * as ActiveCollectionActions from '../actions/active-collection.actions';

export type State = Collection;

export const initialState: State = {
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

export function reducer(state: Collection = initialState, action: ActiveCollectionActions.All) {
  if (state === null) state = initialState;

  switch (action.type) {
    case ActiveCollectionActions.UPDATE_SUMMARY: {
      const collectionSummary: Collection = action.payload;

      return {
        ...JSON.parse(JSON.stringify(initialState)),
        ...collectionSummary
      };
    }

    case ActiveCollectionActions.UPDATE_ASSETS: {
      const assets: CollectionItemsResponse = action.payload;

      return {
        ...JSON.parse(JSON.stringify(state)),
        assets: {
          items: assets.items || [],
          pagination: {
            totalCount: assets.totalCount || 0,
            currentPage: (assets.currentPage || 0) + 1,
            pageSize: assets.pageSize || 0,
            hasNextPage: assets.hasNextPage || false,
            hasPreviousPage: assets.hasPreviousPage || false,
            numberOfPages: assets.numberOfPages || 0
          },
        },
        assetsCount: assets.totalCount
      };
    }

    case ActiveCollectionActions.RESET: {
      return JSON.parse(JSON.stringify(initialState));
    }

    case ActiveCollectionActions.ADD_ASSET: {
      const newAsset: Asset = action.payload;

      if (!state.assets || !Array.isArray(state.assets.items) || !state.assets.pagination || !(state.assetsCount >= 0)) {
        throw new Error(`Unexpected state for action '${ActiveCollectionActions.ADD_ASSET}'`);
      }

      const stateClone: Collection = JSON.parse(JSON.stringify(state));
      const updatedItems: Asset[] = [newAsset, ...stateClone.assets.items];
      const updatedItemsCount: number = updatedItems.length;

      return {
        ...stateClone,
        assets: {
          items: updatedItems,
          pagination: {
            ...stateClone.assets.pagination,
            totalCount: updatedItemsCount
          }
        },
        assetsCount: updatedItemsCount
      }
    }

    case ActiveCollectionActions.REMOVE_ASSET: {
      const assetToRemove: Asset = action.payload;
      const stateClone: Collection = JSON.parse(JSON.stringify(state));

      if (!state.assets || !state.assets.items) return stateClone;

      const remainingItems: Asset[] = stateClone.assets.items.filter((item: Asset) => item.uuid !== assetToRemove.uuid);
      const remainingItemsCount: number = remainingItems.length;
      if (remainingItemsCount === stateClone.assets.items.length) return stateClone;

      return {
        ...stateClone,
        assets: {
          items: remainingItems,
          pagination: {
            ...stateClone.assets.pagination,
            totalCount: remainingItemsCount
          }
        },
        assetsCount: remainingItemsCount
      };
    }

    case ActiveCollectionActions.UPDATE_ASSET_MARKERS: {
      const updater: CollectionItemMarkersUpdater = action.payload;
      const stateClone: Collection = JSON.parse(JSON.stringify(state));

      if (!stateClone.assets || !stateClone.assets.items) return stateClone;

      const indexToUpdate: number = stateClone.assets.items.findIndex(item => item.uuid === updater.uuid);
      if (indexToUpdate < 0) return stateClone;

      return {
        ...stateClone,
        assets: {
          ...stateClone.assets,
          items: [
            ...stateClone.assets.items.slice(0, indexToUpdate),
            {
              ...stateClone.assets.items[indexToUpdate],
              timeStart: parseInt(updater.timeStart),
              timeEnd: parseInt(updater.timeEnd)
            },
            ...stateClone.assets.items.slice(indexToUpdate + 1)
          ]
        }
      };
    }

    default: {
      return state;
    }
  }
}
