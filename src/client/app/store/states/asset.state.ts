import * as AssetActions from '../actions/asset.actions';
import { Asset, AssetLoadParameters } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  readonly activeAsset: Asset;
  readonly loaded: boolean;
  readonly loadParameters: AssetLoadParameters;
};

export const initialState: State = {
  activeAsset: { assetId: 0, name: '' },
  loaded: false,
  loadParameters: null
};

export function reducer(state: State = initialState, action: AssetActions.Any): State {
  switch (action.type) {
    case AssetActions.Load.Type: {
      return { ...Common.clone(state), loaded: false };
    }

    case AssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loaded: true, loadParameters: null };
    }

    case AssetActions.LoadCollectionAsset.Type: {
      return { ...Common.clone(state), loadParameters: action.loadParameters };
    }

    default: {
      return state;
    }
  }
}
