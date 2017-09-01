import * as CartAssetActions from '../actions/cart-asset.actions';
import { Asset, CartAssetUrlLoadParameters } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  readonly activeAsset: Asset;
  readonly loading: boolean;
  readonly loadParameters: CartAssetUrlLoadParameters;
};

export const initialState: State = {
  activeAsset: { assetId: 0, name: '' },
  loading: false,
  loadParameters: null
};

export function reducer(state: State = initialState, action: CartAssetActions.Any): State {
  switch (action.type) {
    case CartAssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true, loadParameters: action.loadParameters };
    }

    case CartAssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loading: false, loadParameters: null };
    }

    case CartAssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false, loadParameters: null };
    }

    default: {
      return state;
    }
  }
}
