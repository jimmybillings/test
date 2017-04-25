import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CheckoutState } from '../interfaces/commerce.interface';

const emptyCheckout: CheckoutState = {
  purchaseOptions: {
    purchaseOnCredit: false,
    creditExemption: false
  },
  addresses: [],
  selectedAddress: {
    type: '',
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
  selectedPurchaseType: 'CreditCard'
};

export function checkout(state: any = emptyCheckout, action: Action) {
  switch (action.type) {
    case 'UPDATE_ORDER_IN_PROGRESS':
      state[action.payload.key] = action.payload.data;
      return Object.assign({}, state);
    default:
      return state;
  }
};

@Injectable()
export class CheckoutStore {
  constructor(private store: Store<any>) { }

  public get data(): Observable<CheckoutState> {
    return this.store.select('checkout');
  }

  public get state(): CheckoutState {
    let state: any;
    this.data.take(1).subscribe(cartData => state = cartData);
    return state;
  }

  public updateOrderInProgress(key: string, data: any): void {
    this.store.dispatch({ type: 'UPDATE_ORDER_IN_PROGRESS', payload: { key, data } });
  }
}
