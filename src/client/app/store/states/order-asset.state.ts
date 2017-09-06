import * as OrderAssetActions from '../actions/order-asset.actions';
import { Asset, OrderAssetUrlLoadParameters } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  readonly activeAsset: Asset;
  readonly loading: boolean;
  readonly loadParameters: OrderAssetUrlLoadParameters;
};

export const initialState: State = {
  activeAsset: { assetId: 0, name: '' },
  loading: false,
  loadParameters: null
};

export function reducer(state: State = initialState, action: OrderAssetActions.Any): State {
  switch (action.type) {
    case OrderAssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true, loadParameters: action.loadParameters };
    }

    case OrderAssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loading: false, loadParameters: null };
    }

    case OrderAssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false, loadParameters: null };
    }

    default: {
      return state;
    }
  }
}
