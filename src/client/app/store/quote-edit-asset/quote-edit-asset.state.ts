import * as QuoteEditAssetActions from './quote-edit-asset.actions';
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

export function reducer(state: State = initialState, action: QuoteEditAssetActions.Any): State {
  switch (action.type) {
    case QuoteEditAssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true, loadingUuid: action.assetUuid };
    }

    case QuoteEditAssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loading: false, loadingUuid: null };
    }

    case QuoteEditAssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false, loadingUuid: null };
    }

    default: {
      return state;
    }
  }
}
