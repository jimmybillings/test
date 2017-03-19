import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CartService } from '../../shared/services/cart.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Observable } from 'rxjs/Rx';
import { Quote } from '../../shared/interfaces/quote.interface';
import { QuotesStore } from '../../shared/stores/quotes.store';

@Injectable()
export class QuotesService {
  constructor(private api: ApiService,
    private cart: CartService,
    private store: QuotesStore) { }


  public get data(): Observable<Quote[]> {
    return this.store.data;
  }

  public get state(): Quote[] {
    return this.store.state;
  }

  public getQuotes(): Observable<Quote[]> {
    return this.api.get(Api.Orders, 'quote/myQuotes', { parameters: { i: '0', n: '20', s: 'createdOn', d: 'true' } })
      .do((quotes: Quote[]) => this.store.setQuotes(quotes));
  }
}
