import * as AssetActions from '../actions/asset.actions';
import { Asset } from '../../shared/interfaces/common.interface';

export interface State {
  activeAsset: Asset;
  loaded: boolean;
};

export const initialState: State = {
  activeAsset: { assetId: 0, name: '' },
  loaded: false
};

export function reducer(state: State = initialState, action: AssetActions.Any): State {
  switch (action.type) {
    case AssetActions.Load.Type: {
      return { ...JSON.parse(JSON.stringify(state)), loaded: false };
    }

    case AssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loaded: true };
    }

    default: {
      return state;
    }
  }
}
