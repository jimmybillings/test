import * as AssetActions from './asset.actions';
import * as SearchAssetActions from '../search-asset/search-asset.actions';
import * as QuoteEditAssetActions from '../quote-edit-asset/quote-edit-asset.actions';
import * as QuoteShowAssetActions from '../quote-show-asset/quote-show-asset.actions';
import * as CartAssetActions from '../cart-asset/cart-asset.actions';
import * as ActiveCollectionAssetActions from '../active-collection-asset/active-collection-asset.actions';

import { DeliveryOptions } from '../../shared/interfaces/asset.interface';

export type AllowableActions =
  SearchAssetActions.Load |
  QuoteEditAssetActions.Load |
  QuoteShowAssetActions.Load |
  CartAssetActions.Load |
  ActiveCollectionAssetActions.Load |
  AssetActions.Any;

export interface State {
  loading: boolean;
  hasDeliveryOptions: boolean;
  options: DeliveryOptions;
};

export const initialState: State = {
  loading: false,
  hasDeliveryOptions: false,
  options: []
};

export function reducer(state: State = initialState, action: AllowableActions): State {
  switch (action.type) {
    case AssetActions.LoadDeliveryOptions.Type: {
      return { ...state, options: [], loading: true };
    }

    case AssetActions.LoadDeliveryOptionsSuccess.Type: {
      const hasDeliveryOptions: boolean = action.options.length > 0;
      return { loading: false, hasDeliveryOptions, options: action.options };
    }

    case SearchAssetActions.Load.Type:
    case QuoteEditAssetActions.Load.Type:
    case QuoteShowAssetActions.Load.Type:
    case CartAssetActions.Load.Type:
    case ActiveCollectionAssetActions.Load.Type: {
      return { ...initialState, options: [] };
    }

    default: {
      return state;
    }
  }
}
