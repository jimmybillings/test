import * as CheckoutActions from './checkout.actions';
import { PaymentOptions, PaymentOption, CreditCardAuthorization } from '../../shared/interfaces/commerce.interface';
import { ViewAddress } from '../../shared/interfaces/user.interface';
import { Common } from '../../shared/utilities/common.functions';

export interface State {
  paymentOptions: PaymentOptions;
  selectedPaymentType: PaymentOption;
  addresses: ViewAddress[];
  selectedAddress: ViewAddress;
  authorization: CreditCardAuthorization;
}

export const initialState: State = {
  paymentOptions: null,
  addresses: [],
  selectedAddress: {
    type: null,
    name: '',
    defaultAddress: undefined,
    addressEntityId: undefined,
    address: {
      address: '',
      state: '',
      city: '',
      country: '',
      zipcode: '',
      phone: ''
    }
  },
  authorization: {
    card: {
      brand: '',
      last4: '',
      exp_month: '',
      exp_year: ''
    }
  },
  selectedPaymentType: null
};

export function reducer(state: State = initialState, action: CheckoutActions.Any): State {
  if (state === null) state = initialState;

  switch (action.type) {

    case CheckoutActions.SetAvailablePaymentOptions.Type: {
      return { ...Common.clone(state), paymentOptions: action.paymentOptions };
    }

    case CheckoutActions.SetSelectedPaymentType.Type: {
      return { ...Common.clone(state), selectedPaymentType: action.selectedPaymentType };
    }

    case CheckoutActions.SetSelectedAddress.Type: {
      return { ...Common.clone(state), selectedAddress: action.selectedAddress };
    }

    case CheckoutActions.SetAvailableAddresses.Type: {
      return { ...Common.clone(state), addresses: action.addresses };
    }

    case CheckoutActions.SetCreditCardAuthorization.Type: {
      return { ...Common.clone(state), authorization: action.authorization };
    }

    default: {
      return state;
    }

  }
}
