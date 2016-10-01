import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';

import { ApiService } from '../../shared/services/api.service';
import { Cart, Project } from '../cart.interface';
import { CartUtilities } from './cart.utilities';
import { CartSummaryService } from '../../shared/services/cart-summary.service';

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
export class CartService {
  public data: Observable<any>;

  constructor(
    private store: Store<any>,
    private apiService: ApiService,
    private cartSummaryService: CartSummaryService) {
    this.data = this.store.select('cart');
  }

  public initializeData(): Observable<any> {
    return this.apiServiceGet('orders', 'cart')
      .do(wholeCartResponse => this.replaceStoreWith(wholeCartResponse))
      .map(() => { return {}; })
      .share();
  }

  public addProject(): void {
    this.apiServicePost('orders', 'cart/project', this.createAddProjectRequestBody())
      .subscribe(wholeCartResponse => {
        this.replaceStoreWith(wholeCartResponse);
        this.cartSummaryService.loadCartSummary();
      });
  }

  public removeProject(project: Project): void {
    this.apiServiceDelete('orders', `cart/project/${project.id}`)
      .subscribe(wholeCartResponse => {
        this.replaceStoreWith(wholeCartResponse);
        this.cartSummaryService.loadCartSummary();
      });
  }

  public get state(): any {
    let state: any;
    this.data.take(1).subscribe(cartData => state = cartData);
    return state;
  }

  private replaceStoreWith(cart: any): void {
    this.store.dispatch({ type: 'REPLACE_CART', payload: cart });
  }

  // Idea for ApiService enhancement.
  // If/when the ApiService abstracts away URL construction and JSON responses for us,
  // these methods will no longer be needed.
  private apiServiceGet(apiService: string, urlEnding: string): Observable<any> {
    return this.apiService.get(`/api/${apiService}/v1/${urlEnding}`, {}, true)
      .map(response => response.json());
  }

  private apiServicePost(apiService: string, urlEnding: string, body: string): Observable<any> {
    return this.apiService.post(`/api/${apiService}/v1/${urlEnding}`, body, {}, true)
      .map(response => response.json());
  }

  private apiServiceDelete(apiService: string, urlEnding: string): Observable<any> {
    return this.apiService.delete(`/api/${apiService}/v1/${urlEnding}`)
      .map(response => response.json());
  }
  // END of ApiService abstractions.

  private createAddProjectRequestBody(): string {
    let existingNames: Array<string> = (this.state.projects || []).map((project: any) => project.name);

    return JSON.stringify({
      name: CartUtilities.nextNewProjectNameGiven(existingNames)
    });
  }
}
