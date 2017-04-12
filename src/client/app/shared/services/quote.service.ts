import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CartService } from '../../shared/services/cart.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Observable } from 'rxjs/Observable';
import { Quote, QuoteOptions, QuoteState } from '../../shared/interfaces/quote.interface';
import { QuoteStore } from '../../shared/stores/quote.store';

@Injectable()
export class QuoteService {
  constructor(
    private api: ApiService,
    private cartService: CartService,
    private store: QuoteStore
  ) { }

  public get data(): Observable<QuoteState> {
    return this.store.data;
  }

  public get state(): QuoteState {
    return this.store.state;
  }

  public get total(): Observable<number> {
    return this.data.map((state: QuoteState) => state.data.total);
  }

  public getQuote(quoteId: number): Observable<Quote> {
    return this.api.get(Api.Orders, `quote/${quoteId}`, { loading: true })
      .do((quote: Quote) => this.store.updateQuote(quote));
  }

  public updateOrderInProgress(type: string, data: any): void {
    this.store.updateOrderInProgress(type, data);
  }

  public purchase(): Observable<any> {
    const stripe: any = {
      stripeToken: this.state.orderInProgress.authorization.id,
      stripeTokenType: this.state.orderInProgress.authorization.type
    };
    return this.api.post(Api.Orders, 'quote/stripe/process', { body: stripe, loading: true });
  }

  public purchaseOnCredit(): Observable<any> {
    return this.api.post(Api.Orders, 'quote/checkout/convertToOrder', { loading: true });
  }
}
