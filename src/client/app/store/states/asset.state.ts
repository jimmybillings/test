import * as AssetActions from '../actions/asset.actions';
import { Asset } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  readonly activeAsset: Asset;
  readonly loading: boolean;
};

export const initialState: State = {
  activeAsset: { assetId: 0, name: '' },
  loading: false
};

export function reducer(state: State = initialState, action: AssetActions.Any): State {
  switch (action.type) {
    case AssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true };
    }

    case AssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loading: false };
    }

    case AssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false };
    }

    default: {
      return state;
    }
  }
}
