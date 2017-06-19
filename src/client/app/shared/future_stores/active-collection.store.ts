import { Action } from '@ngrx/store';

import { Collection, CollectionItems } from '../interfaces/collection.interface';
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
    case ActiveCollectionActions.UPDATE: {
      return {
        ...JSON.parse(JSON.stringify(state)),
        ...action.payload,
        assetsCount: (action.payload.assets && action.payload.assets.pagination) ? action.payload.assets.pagination.totalCount : 0
      };
    }

    case ActiveCollectionActions.RESET: {
      return JSON.parse(JSON.stringify(initialState));
    }

    case ActiveCollectionActions.ADD_ASSET: {
      if (!state.assets || !Array.isArray(state.assets.items) || !state.assets.pagination || !(state.assetsCount >= 0)) {
        throw new Error(`Unexpected state for action '${ActiveCollectionActions.ADD_ASSET}'`);
      }

      const stateClone: Collection = JSON.parse(JSON.stringify(state));
      const updatedItems: Asset[] = [action.payload, ...stateClone.assets.items];
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
      const stateClone: Collection = JSON.parse(JSON.stringify(state));

      if (!state.assets || !state.assets.items) return stateClone;

      const remainingItems: Asset[] = stateClone.assets.items.filter((item: Asset) => item.uuid !== action.payload.uuid);
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
      const stateClone: Collection = JSON.parse(JSON.stringify(state));

      if (!stateClone.assets || !stateClone.assets.items) return stateClone;

      const indexToUpdate: number = stateClone.assets.items.findIndex(item => item.uuid === action.payload.uuid);
      if (indexToUpdate < 0) return stateClone;

      return {
        ...stateClone,
        assets: {
          ...stateClone.assets,
          items: [
            ...stateClone.assets.items.slice(0, indexToUpdate),
            {
              ...stateClone.assets.items[indexToUpdate],
              timeStart: parseInt(action.payload.timeStart),
              timeEnd: parseInt(action.payload.timeEnd)
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
