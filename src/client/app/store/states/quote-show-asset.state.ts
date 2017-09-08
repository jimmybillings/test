import * as QuoteShowAssetActions from '../actions/quote-show-asset.actions';
import { Asset } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  readonly activeAsset: Asset;
  readonly loading: boolean;
  readonly loadingUuid: string;
};

export const initialState: State = {
  activeAsset: { assetId: 0, name: '' },
  loading: false,
  loadingUuid: null
};

export function reducer(state: State = initialState, action: QuoteShowAssetActions.Any): State {
  switch (action.type) {
    case QuoteShowAssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true, loadingUuid: action.assetUuid };
    }

    case QuoteShowAssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loading: false, loadingUuid: null };
    }

    case QuoteShowAssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false, loadingUuid: null };
    }

    default: {
      return state;
    }
  }
}
