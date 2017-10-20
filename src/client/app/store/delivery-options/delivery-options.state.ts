import * as DeliveryOptionsActions from './delivery-options.actions';
import { DeliveryOptions } from '../../shared/interfaces/asset.interface';

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


export function reducer(state: State = initialState, action: DeliveryOptionsActions.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {

    case DeliveryOptionsActions.Load.Type: {
      return { ...state, options: [], loading: true };
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
