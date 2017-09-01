import * as ActiveCollectionAssetActions from '../actions/active-collection-asset.actions';
import { Asset, CollectionAssetUrlLoadParameters } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  readonly activeAsset: Asset;
  readonly loading: boolean;
  readonly loadParameters: CollectionAssetUrlLoadParameters;
};

export const initialState: State = {
  activeAsset: { assetId: 0, name: '' },
  loading: false,
  loadParameters: null
};

export function reducer(state: State = initialState, action: ActiveCollectionAssetActions.Any): State {
  switch (action.type) {
    case ActiveCollectionAssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true, loadParameters: action.loadParameters };
    }

    case ActiveCollectionAssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loading: false, loadParameters: null };
    }

    case ActiveCollectionAssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false, loadParameters: null };
    }

    default: {
      return state;
    }
  }
}
