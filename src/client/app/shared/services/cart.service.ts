import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { ApiConfig } from './api.config';
import { ApiService } from './api.service';
import { Cart } from '../interfaces/cart.interface';

const emptyCart: Cart = {
  userId: NaN,
  total: 0
};

export const cart: ActionReducer<any> = (state: Cart = emptyCart, action: Action) => {
  switch (action.type) {
    case 'REPLACE_CART':
      return Object.assign({}, action.payload);
    case 'DESTROY_CART':
      return Object.assign({}, emptyCart);
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

  public initializeData(): void {
    if (isNaN(this.state.userId)) {
      this.apiServiceGet('orders', 'cart').subscribe(cartData => this.replaceStoreWith(cartData));
    }
  }

  public destroyData(): void {
    this.destroyStore();
  }

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe(cartData => state = cartData);
    return state;
  }

  public addAssetToProjectInCart(asset: any): Observable<any> {
    let url: string = `api/orders/v1/cart/asset/lineItem?region=AAA`;
    let body: any = this.formatAsset(asset);
    return this.apiService.put(url, body).map(res => {
      this.replaceStoreWith(res.json());
    });
  }

  public get size(): Observable<number> {
    return this.data.map(data => {
      if (data.projects) {
        return data.projects.reduce((prev: any, curr: any) => {
          return prev += curr.lineItems.length;
        }, 0);
      }
    });
  }

  private replaceStoreWith(cartData: any): void {
    this.store.dispatch({ type: 'REPLACE_CART', payload: cartData });
  }

  private destroyStore(): void {
    this.store.dispatch({ type: 'DESTROY_CART' });
  }

  // Idea for ApiService enhancement (along with RequiredUserState enum defined above).
  // If/when the ApiService abstracts away ApiConfig for us, then this method will no longer be needed.
  private apiServiceGet(apiSection: string,
    urlEnding: string): Observable<any> {
    return this.apiService.get(`/api/${apiSection}/v1/${urlEnding}`)
      .map(response => response.json());
  }

  private formatAsset(asset: any): any {
    return {
      'lineItem': {
        'asset': {
          'assetId': asset.assetId
        }
      }
    };
  }
}
