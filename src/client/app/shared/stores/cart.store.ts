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
    address: {
      type: '',
      name: '',
      address: {
        address: '',
        state: '',
        city: '',
        country: '',
        zipcode: '',
        phone: '',
        suburb: ''
      }
    },
    authorization: {}
  }
};

export const cart: ActionReducer<any> = (state: any = emptyCart, action: Action) => {
  switch (action.type) {
    case 'REPLACE_CART':
      return Object.assign({}, state, { cart: action.payload });
    case 'UPDATE_ORDER_IN_PROGRESS_ADDRESS':
      state.orderInProgress.address = action.payload;
      return Object.assign({}, state);
    case 'UPDATE_ORDER_IN_PROGRESS_AUTHORIZATION':
      state.orderInProgress.authorization = action.payload;
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

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe(cartData => state = cartData);
    return state;
  }
}
