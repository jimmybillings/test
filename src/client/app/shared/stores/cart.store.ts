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
        street: '',
        state: '',
        city: '',
        country: '',
        zipcode: '',
        phone: '',
        suburb: ''
      }
    }
  }
};

export const cart: ActionReducer<any> = (state: any = emptyCart, action: Action) => {
  switch (action.type) {
    case 'REPLACE_CART':
      // payload = the whole cart
      return Object.assign({}, state, { cart: action.payload });
    case 'REPLACE_ORDER_IN_PROGRESS':
      return Object.assign({}, state, { orderInProgress: { address: action.payload } });
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
    this.store.dispatch({ type: 'REPLACE_ORDER_IN_PROGRESS', payload: address });
  }

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe(cartData => state = cartData);
    return state;
  }
}
