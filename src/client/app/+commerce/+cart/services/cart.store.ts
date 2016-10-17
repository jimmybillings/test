import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { Cart } from '../cart.interface';

const emptyCart: Cart = {
  userId: NaN,
  total: 0
};

export const cart: ActionReducer<any> = (state: Cart = emptyCart, action: Action) => {
  switch (action.type) {
    case 'REPLACE_CART':
      // payload = the whole cart
      return Object.assign({}, action.payload);

    default:
      return state;
  }
};

@Injectable()
export class CartStore {
  constructor(private store: Store<any>) {}

  public get data(): Observable<any> {
    return this.store.select('cart');
  }

  public replaceWith(cart: any): void {
    this.store.dispatch({ type: 'REPLACE_CART', payload: cart });
  }

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe(cartData => state = cartData);
    return state;
  }
}
