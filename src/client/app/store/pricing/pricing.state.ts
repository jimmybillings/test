import * as PricingActions from './pricing.actions';
import { PriceAttribute } from '../../shared/interfaces/commerce.interface';
import { Common } from '../../shared/utilities/common.functions';
import { Pojo } from '../../shared/interfaces/common.interface';

export interface State {
  priceForDetails: number;
  priceForDialog: number;
  attributes: PriceAttribute[];
  appliedAttributes: Pojo;
  selectedAttributes: Pojo;
}

export const initialState: State = {
  priceForDetails: NaN,
  priceForDialog: NaN,
  attributes: null,
  appliedAttributes: null,
  selectedAttributes: null
};

export function reducer(state: State = initialState, action: PricingActions.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {

    case PricingActions.CalculatePrice.Type: {
      return { ...Common.clone(state), selectedAttributes: action.selectedAttributes };
    }

    case PricingActions.SetAppliedAttributes.Type: {
      return { ...Common.clone(state), appliedAttributes: action.appliedAttributes };
    }

    case PricingActions.GetAttributesSuccess.Type: {
      return { ...Common.clone(state), attributes: action.attributes };
    }

    case PricingActions.SetPriceForDetails.Type: {
      return { ...Common.clone(state), priceForDetails: action.price };
    }

    case PricingActions.SetPriceForDialog.Type: {
      return { ...Common.clone(state), priceForDialog: action.price };
    }

    default: {
      return state;
    }

  }
}
