import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { Address } from '../interfaces/user.interface';
import { Cart, CartState } from '../interfaces/cart.interface';

const emptyCart: CartState = {
  cart: {
    userId: NaN,
    total: 0
  },
  orderInProgress: {
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
    }
  }
};

export const cart: ActionReducer<any> = (state: any = emptyCart, action: Action) => {
  switch (action.type) {
    case 'REPLACE_CART':
      return Object.assign({}, state, { cart: action.payload });
    case 'UPDATE_ORDER_IN_PROGRESS_ADDRESS':
      state.orderInProgress.selectedAddress = action.payload;
      return Object.assign({}, state);
    case 'UPDATE_ORDER_IN_PROGRESS_AUTHORIZATION':
      state.orderInProgress.authorization = action.payload;
      return Object.assign({}, state);
    case 'UPDATE_ORDER_IN_PROGRESS_ADDRESSES':
      state.orderInProgress.addresses = action.payload;
      return Object.assign({}, state);
    default:
      return state;
  }
};

@Injectable()
export class CartStore {
  constructor(private store: Store<any>) { }

  public get data(): Observable<any> {
    return this.store.select('cart');
  }

  public replaceCartWith(cart: any): void {
    this.store.dispatch({ type: 'REPLACE_CART', payload: cart });
  }

  public replaceOrderInProgressAddress(address: any): void {
    this.store.dispatch({ type: 'UPDATE_ORDER_IN_PROGRESS_ADDRESS', payload: address });
  }

  public replaceOrderInProgressAuthorization(authorization: any): void {
    this.store.dispatch({ type: 'UPDATE_ORDER_IN_PROGRESS_AUTHORIZATION', payload: authorization });
  }

  public setOrderInProgressAddresses(addresses: any): void {
    this.store.dispatch({ type: 'UPDATE_ORDER_IN_PROGRESS_ADDRESSES', payload: addresses });
  }

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe(cartData => state = cartData);
    return state;
  }
}
