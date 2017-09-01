import * as SearchAssetActions from '../actions/search-asset.actions';
import { Asset, SearchAssetUrlLoadParameters } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  readonly activeAsset: Asset;
  readonly loading: boolean;
  readonly loadParameters: SearchAssetUrlLoadParameters;
};

export const initialState: State = {
  activeAsset: { assetId: 0, name: '' },
  loading: false,
  loadParameters: null
};

export function reducer(state: State = initialState, action: SearchAssetActions.Any): State {
  switch (action.type) {
    case SearchAssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true, loadParameters: action.loadParameters };
    }

    case SearchAssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loading: false, loadParameters: null };
    }

    case SearchAssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false };
    }

    default: {
      return state;
    }
  }
}
