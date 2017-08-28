import * as ActiveCollectionActions from '../actions/active-collection.actions';
import {
  Collection, CollectionItems, CollectionItemsResponse, CollectionItemMarkersUpdater
} from '../../shared/interfaces/collection.interface';
import { Asset } from '../../shared/interfaces/common.interface';
import { SerializedSubclipMarkers, serialize } from '../../shared/interfaces/subclip-markers';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  readonly loading: boolean;
  readonly collection: Collection;
  readonly latestAddition: {
    readonly asset: Asset;
    readonly markers?: SerializedSubclipMarkers
  };
  readonly latestRemoval: Asset;
};

export const initialState: State = {
  loading: false,
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
    case ActiveCollectionActions.UpdateAssetMarkers.Type: {
      return {
        ...Common.clone(state),
        loading: true
      };
    }

    case ActiveCollectionActions.LoadSuccess.Type:
    case ActiveCollectionActions.SetSuccess.Type: {
      return {
        ...Common.clone(initialState),
        collection: action.activeCollection,
        loading: false
      };
    }

    case ActiveCollectionActions.LoadPageSuccess.Type:
    case ActiveCollectionActions.UpdateAssetMarkersSuccess.Type: {
      const stateClone: State = Common.clone(state);

      return {
        ...stateClone,
        collection: {
          ...stateClone.collection,
          assets: action.currentPageItems
        },
        loading: false
      };
    }

    case ActiveCollectionActions.AddAsset.Type: {
      return {
        ...Common.clone(state),
        loading: true,
        latestAddition: action.markers ? { asset: action.asset, markers: serialize(action.markers) } : { asset: action.asset }
      };
    }

    case ActiveCollectionActions.AddAssetSuccess.Type: {
      const stateClone: State = Common.clone(state);

      return {
        ...stateClone,
        collection: {
          ...stateClone.collection,
          assets: action.currentPageItems,
          assetsCount: stateClone.collection.assetsCount + 1
        },
        loading: false
      };
    }

    case ActiveCollectionActions.RemoveAsset.Type: {
      return {
        ...Common.clone(state),
        loading: true,
        latestRemoval: action.asset
      };
    }

    case ActiveCollectionActions.RemoveAssetSuccess.Type: {
      const stateClone: State = Common.clone(state);

      return {
        ...stateClone,
        collection: {
          ...stateClone.collection,
          assets: action.currentPageItems,
          assetsCount: stateClone.collection.assetsCount - 1
        },
        loading: false
      };
    }

    case ActiveCollectionActions.LoadFailure.Type:
    case ActiveCollectionActions.SetFailure.Type:
    case ActiveCollectionActions.LoadPageFailure.Type:
    case ActiveCollectionActions.RemoveAssetFailure.Type:
    case ActiveCollectionActions.AddAssetFailure.Type:
    case ActiveCollectionActions.RemoveAssetFailure.Type:
    case ActiveCollectionActions.UpdateAssetMarkersFailure.Type: {
      return {
        ...Common.clone(state),
        loading: false
      };
    }

    case ActiveCollectionActions.Reset.Type: {
      return Common.clone(initialState);
    }

    default: {
      return state;
    }
  }
}
