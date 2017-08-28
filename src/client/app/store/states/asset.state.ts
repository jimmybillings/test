import * as AssetActions from '../actions/asset.actions';
import { Asset, AssetLoadParameters } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  readonly activeAsset: Asset;
  readonly loading: boolean;
  readonly loadParameters: AssetLoadParameters;
};

export const initialState: State = {
  activeAsset: { assetId: 0, name: '' },
  loading: false,
  loadParameters: null
};

export function reducer(state: State = initialState, action: AssetActions.Any): State {
  switch (action.type) {
    case AssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true };
    }

    case AssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loading: false, loadParameters: null };
    }

    case AssetActions.LoadCollectionAsset.Type: {
      return { ...Common.clone(state), loadParameters: action.loadParameters };
    }

    case AssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false };
    }

    default: {
      return state;
    }
  }
}
