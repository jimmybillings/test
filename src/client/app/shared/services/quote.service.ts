import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CartService } from '../../shared/services/cart.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Observable } from 'rxjs/Observable';
import { Quote, QuoteOptions, QuoteState, CheckoutState } from '../../shared/interfaces/commerce.interface';
import { QuoteStore } from '../../shared/stores/quote.store';
import { CheckoutStore } from '../../shared/stores/checkout.store';

@Injectable()
export class QuoteService {
  constructor(
    private api: ApiService,
    private cartService: CartService,
    private quoteStore: QuoteStore,
    private checkoutStore: CheckoutStore
  ) { }

  public get data(): Observable<QuoteState> {
    return this.quoteStore.data;
  }

  public get state(): QuoteState {
    return this.quoteStore.state;
  }

  public get checkoutData(): Observable<CheckoutState> {
    return this.checkoutStore.data;
  }

  public get checkoutState(): CheckoutState {
    return this.checkoutStore.state;
  }

  public get total(): Observable<number> {
    return this.data.map((state: QuoteState) => state.data.total);
  }

  public getQuote(quoteId: number): Observable<Quote> {
    return this.api.get(Api.Orders, `quote/${quoteId}`, { loading: true })
      .do((quote: Quote) => this.quoteStore.updateQuote(quote));
  }

  public updateOrderInProgress(type: string, data: any): void {
    this.checkoutStore.updateOrderInProgress(type, data);
  }

  public purchase(): Observable<any> {
    const stripe: any = {
      stripeToken: this.checkoutState.authorization.id,
      stripeTokenType: this.checkoutState.authorization.type
    };
    return this.api.post(Api.Orders, 'quote/stripe/process', { body: stripe, loading: true });
  }

  public purchaseOnCredit(): Observable<any> {
    return this.api.post(Api.Orders, 'quote/checkout/convertToOrder', { loading: true });
  }
}
