import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CartService } from '../../shared/services/cart.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Observable } from 'rxjs/Rx';
import { Quote, QuoteOptions } from '../../shared/interfaces/quote.interface';
import { Cart } from '../../shared/interfaces/cart.interface';
import { QuoteStore } from '../../shared/stores/quote.store';

@Injectable()
export class QuoteService {
  constructor(private api: ApiService,
    private cart: CartService,
    private store: QuoteStore) { }


  public get data(): Observable<Quote> {
    return this.store.data;
  }

  public get state(): Quote {
    return this.store.state;
  }

  public getQuote(quoteId: number): Observable<Quote> {
    return this.api.get(Api.Orders, `quote/${quoteId}`)
      .do((quote: Quote) => this.store.setQuote(quote));
  }

}
