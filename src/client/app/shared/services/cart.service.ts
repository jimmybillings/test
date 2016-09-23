import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { ApiConfig } from './api.config';
import { ApiService } from './api.service';
import { Cart } from '../interfaces/cart.interface';

const emptyCart: Cart = {
  total: 0
};

export const cart: ActionReducer<any> = (state: Cart = emptyCart, action: Action) => {
  switch (action.type) {
    case 'UPDATE_CART':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

// Part of an idea for ApiService updates.  See apiServiceGet() method below.
enum RequiredUserState { LoggedIn, Anonymous };

@Injectable()
export class CartService {
  public data: Observable<any>;

  constructor(private store: Store<any>, private apiConfig: ApiConfig, private apiService: ApiService) {
    this.data = this.store.select('cart');
  }

  public loadCart(): void {
    this.apiServiceGet('orders', 'cart').subscribe(cartData => this.updateStoreWith(cartData));
  }

  private updateStoreWith(cartData: any): void {
    this.store.dispatch({ type: 'UPDATE_CART', payload: cartData });
  }

  // Idea for ApiService enhancement (along with RequiredUserState enum defined above).
  // If/when the ApiService abstracts away ApiConfig for us, then this method will no longer be needed.
  private apiServiceGet(apiSection: string,
                        urlEnding: string,
                        body: string = '',
                        userState: RequiredUserState = RequiredUserState.LoggedIn): Observable<any> {
    return this.apiService.get(`${this.apiConfig.baseUrl()}api/${apiSection}/v1/${urlEnding}`,
                            { headers: userState === RequiredUserState.LoggedIn ?
                                       this.apiConfig.authHeaders() :
                                       this.apiConfig.userHeaders(),
                              body: body
                            })
      .map(response => response.json());
  }
}
