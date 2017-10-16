import * as SearchAssetActions from '../actions/search-asset.actions';
import { Asset, SearchAssetLoadParameters } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  readonly activeAsset: Asset;
  readonly loading: boolean;
  readonly loadParameters: SearchAssetLoadParameters;
  readonly hasDeliveryOptions: boolean;
};

export const initialState: State = {
  activeAsset: { assetId: 0, name: '' },
  loading: false,
  loadParameters: null,
  hasDeliveryOptions: false
};

export function reducer(state: State = initialState, action: SearchAssetActions.Any): State {
  switch (action.type) {
    case SearchAssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true, loadParameters: action.loadParameters, hasDeliveryOptions: false };
    }

    case SearchAssetActions.LoadSuccess.Type: {
      return { ...Common.clone(state), activeAsset: action.activeAsset, loading: false, loadParameters: null };
    }

    case SearchAssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false };
    }

    case SearchAssetActions.SetDeliveryOptions.Type: {
      return { ...Common.clone(state), hasDeliveryOptions: action.flag };
    }

    default: {
      return state;
    }
  }
}
