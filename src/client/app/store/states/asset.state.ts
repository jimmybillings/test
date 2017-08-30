import * as AssetActions from '../actions/asset.actions';
import * as CartActions from '../actions/cart.actions';
import * as ActiveCollectionActions from '../actions/active-collection.actions';
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

export type AllowedActions = AssetActions.Any | CartActions.LoadAsset | ActiveCollectionActions.LoadAsset;

export function reducer(state: State = initialState, action: AllowedActions): State {
  switch (action.type) {
    case AssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true };
    }

    case AssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loading: false, loadParameters: null };
    }

    case CartActions.LoadAsset.Type:
    case ActiveCollectionActions.LoadAsset.Type: {
      return { ...Common.clone(state), loading: true, loadParameters: action.loadParameters };
    }

    case AssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false };
    }

    default: {
      return state;
    }
  }
}
