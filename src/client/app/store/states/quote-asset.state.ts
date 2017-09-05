import * as QuoteAssetActions from '../actions/quote-asset.actions';
import { Asset, QuoteAssetUrlLoadParameters } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  activeAsset: Asset;
  loading: boolean;
  loadParameters: QuoteAssetUrlLoadParameters;
};

export const initialState: State = {
  activeAsset: { assetId: 0, name: '' },
  loading: false,
  loadParameters: null
};

export function reducer(state: State = initialState, action: QuoteAssetActions.Any): State {
  switch (action.type) {
    case QuoteAssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true, loadParameters: action.loadParameters };
    }

    case QuoteAssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loading: false, loadParameters: null };
    }

    case QuoteAssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false, loadParameters: null };
    }

    default: {
      return state;
    }
  }
}
