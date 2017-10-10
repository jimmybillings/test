import * as CartAssetActions from './cart-asset.actions';
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

export function reducer(state: State = initialState, action: CartAssetActions.Any): State {
  switch (action.type) {
    case CartAssetActions.Load.Type: {
      return { ...Common.clone(state), loading: true, loadingUuid: action.assetUuid };
    }

    case CartAssetActions.LoadSuccess.Type: {
      return { activeAsset: action.activeAsset, loading: false, loadingUuid: null };
    }

    case CartAssetActions.LoadFailure.Type: {
      return { ...Common.clone(state), loading: false, loadingUuid: null };
    }

    default: {
      return state;
    }
  }
}
