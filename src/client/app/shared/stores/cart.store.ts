import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { Address } from '../interfaces/user.interface';
import { Cart, CartState } from '../interfaces/cart.interface';

const emptyCart: CartState = {
  cart: {
    userId: NaN,
    total: 0
  },
  orderInProgress: {
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
    selectedPurchaseType: ''
  }
};

export function cart(state: any = emptyCart, action: Action) {
  switch (action.type) {
    case 'REPLACE_CART':
      return Object.assign({}, state, { cart: action.payload });
    case 'UPDATE_CART':
      let newCart: any = Object.assign({}, state.cart, { total: action.payload.total, itemCount: action.payload.itemCount });
      return Object.assign({}, state, { cart: newCart });
    case 'UPDATE_ORDER_IN_PROGRESS':
      state.orderInProgress[action.payload.key] = action.payload.data;
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

  public updateCartWith(cartSummary: any) {
    this.store.dispatch({ type: 'UPDATE_CART', payload: cartSummary });
  }

  public updateOrderInProgress(key: string, data: any): void {
    this.store.dispatch({ type: 'UPDATE_ORDER_IN_PROGRESS', payload: { key, data } });
  }

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe(cartData => state = cartData);
    return state;
  }
}
