import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CartState } from '../interfaces/commerce.interface';

const emptyCart: CartState = {
  data: {
    userId: NaN,
    total: 0
  }
};

export function cart(state: any = emptyCart, action: Action) {
  switch (action.type) {
    case 'REPLACE_CART':
      return Object.assign({}, state, { data: action.payload });
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

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe(cartData => state = cartData);
    return state;
  }
}
