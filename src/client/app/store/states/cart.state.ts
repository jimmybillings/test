import * as CartActions from '../actions/cart.actions';
import { Common } from '../../shared/utilities/common.functions';
import { Cart } from '../../shared/interfaces/commerce.interface';

export interface State {
  data: Cart;
  loading: boolean;
}

export const initialState: State = {
  data: {
    id: null,
    userId: null,
    total: null
  },
  loading: false
};

export function reducer(state: State = initialState, action: CartActions.Any) {
  if (state === null) state = initialState;

  switch (action.type) {
    case CartActions.Load.Type: {
      return {
        ...Common.clone(state),
        loading: true
      };
    }

    case CartActions.LoadSuccess.Type: {
      return {
        loading: false,
        data: {
          ...action.cart
        }
      };
    }

    default: {
      return state;
    }

  }
}
