import * as QuoteEditAssetActions from '../actions/quote-edit-asset.actions';
import { Asset, QuoteAssetUrlLoadParameters } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  readonly activeAsset: Asset;
  readonly loading: boolean;
  readonly loadParameters: QuoteAssetUrlLoadParameters;
};

export const initialState: State = {
  activeAsset: { assetId: 0, name: '' },
  loading: false,
  loadParameters: null
};

export function reducer(state: State = initialState, action: QuoteEditAssetActions.Any): State {
  switch (action.type) {
    case QuoteEditAssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true, loadParameters: action.loadParameters };
    }

    case QuoteEditAssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loading: false, loadParameters: null };
    }

    case QuoteEditAssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false, loadParameters: null };
    }

    default: {
      return state;
    }
  }
}
