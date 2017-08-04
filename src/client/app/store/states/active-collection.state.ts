import * as ActiveCollectionActions from '../actions/active-collection.actions';
import {
  Collection, CollectionItems, CollectionItemsResponse, CollectionItemMarkersUpdater
} from '../../shared/interfaces/collection.interface';
import { Asset, Comments } from '../../shared/interfaces/common.interface';
import { SerializedSubclipMarkers, serialize } from '../../shared/interfaces/subclip-markers.interface';

export interface State {
  loaded: boolean;
  collection: Collection;
  latestAddition: {
    asset: Asset;
    markers: SerializedSubclipMarkers
  };
  latestRemoval: Asset;
};

export const initialState: State = {
  loaded: false,
  collection: {
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
    comments: {
      items: [],
      pagination: {
        totalCount: 0,
        currentPage: 1,
        pageSize: 20,
        hasNextPage: false,
        hasPreviousPage: false,
        numberOfPages: 0
      }
    },
    tags: [],
    assetsCount: 0
  },
  latestAddition: {
    asset: null,
    markers: {}
  },
  latestRemoval: null
};

export function reducer(state: State = initialState, action: ActiveCollectionActions.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {
    case ActiveCollectionActions.Load.Type:
    case ActiveCollectionActions.Set.Type:
    case ActiveCollectionActions.LoadPage.Type:
    case ActiveCollectionActions.AddComment.Type:
    case ActiveCollectionActions.UpdateAssetMarkers.Type: {
      return {
        ...JSON.parse(JSON.stringify(state)),
        loaded: false
      };
    }

    case ActiveCollectionActions.LoadSuccess.Type:
    case ActiveCollectionActions.SetSuccess.Type: {
      const collection: Collection = action.activeCollection;

      return {
        ...JSON.parse(JSON.stringify(initialState)),
        collection: collection,
        loaded: true
      };
    }

    case ActiveCollectionActions.LoadPageSuccess.Type:
    case ActiveCollectionActions.UpdateAssetMarkersSuccess.Type: {
      const newAssets: CollectionItems = action.currentPageItems;
      const stateClone: State = JSON.parse(JSON.stringify(state));

      return {
        ...stateClone,
        collection: {
          ...stateClone.collection,
          assets: newAssets
        },
        loaded: true
      };
    }

    case ActiveCollectionActions.AddAsset.Type: {
      return {
        ...JSON.parse(JSON.stringify(state)),
        loaded: false,
        latestAddition: action.markers
          ? { asset: action.asset, markers: serialize(action.markers) }
          : { asset: action.asset }
      };
    }

    case ActiveCollectionActions.AddAssetSuccess.Type: {
      const newAssets: CollectionItems = action.currentPageItems;
      const stateClone: State = JSON.parse(JSON.stringify(state));

      return {
        ...stateClone,
        collection: {
          ...stateClone.collection,
          assets: newAssets,
          assetsCount: stateClone.collection.assetsCount + 1
        },
        loaded: true
      };
    }

    case ActiveCollectionActions.RemoveAsset.Type: {
      return {
        ...JSON.parse(JSON.stringify(state)),
        loaded: false,
        latestRemoval: action.asset
      };
    }

    case ActiveCollectionActions.RemoveAssetSuccess.Type: {
      const newAssets: CollectionItems = action.currentPageItems;
      const stateClone: State = JSON.parse(JSON.stringify(state));

      return {
        ...stateClone,
        collection: {
          ...stateClone.collection,
          assets: newAssets,
          assetsCount: stateClone.collection.assetsCount - 1
        },
        loaded: true
      };
    }

    case ActiveCollectionActions.AddCommentSuccess.Type: {
      const newComments: Comments = action.activeCollectionComments;
      const stateClone: State = JSON.parse(JSON.stringify(state));

      return {
        ...stateClone,
        collection: {
          ...stateClone.collection,
          comments: newComments
        },
        loaded: true
      };
    }

    case ActiveCollectionActions.Reset.Type: {
      return JSON.parse(JSON.stringify(initialState));
    }

    default: {
      return state;
    }
  }
}
