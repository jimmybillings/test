import * as DeliveryOptionsActions from './delivery-options.actions';
import * as AssetActions from '../asset/asset.actions';
import { DeliveryOptions } from '../../shared/interfaces/asset.interface';
import { Common } from '../../shared/utilities/common.functions';

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

export type AllowedActions = AssetActions.LoadActiveCollectionAsset | AssetActions.LoadCartAsset |
  AssetActions.LoadQuoteEditAsset | AssetActions.LoadQuoteShowAsset | AssetActions.LoadSearchAsset |
  DeliveryOptionsActions.Any;

export function reducer(state: State = initialState, action: AllowedActions): State {
  if (state === null) state = initialState;

  switch (action.type) {
    case AssetActions.LoadActiveCollectionAsset.Type:
    case AssetActions.LoadCartAsset.Type:
    case AssetActions.LoadQuoteEditAsset.Type:
    case AssetActions.LoadQuoteShowAsset.Type:
    case AssetActions.LoadSearchAsset.Type:
    case DeliveryOptionsActions.Load.Type: {
      return { ...Common.clone(initialState), loading: true };
    }

    case DeliveryOptionsActions.LoadSuccess.Type: {
      const hasDeliveryOptions: boolean = action.options.length > 0;
      return { loading: false, hasDeliveryOptions, options: action.options };
    }

    default: {
      return state;
    }
  }
}
