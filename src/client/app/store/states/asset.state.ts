import * as AssetActions from '../actions/asset.actions';
import { Asset } from '../../shared/interfaces/common.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  readonly hasDeliveryOptions: boolean;
};

export const initialState: State = {
  hasDeliveryOptions: false
};

export function reducer(state: State = initialState, action: AssetActions.Any): State {
  switch (action.type) {
    case AssetActions.SetDeliveryOptions.Type: {
      return { hasDeliveryOptions: action.flag };
    }

    default: {
      return state;
    }
  }
}
