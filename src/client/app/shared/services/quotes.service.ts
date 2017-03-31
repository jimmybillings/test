import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CartService } from '../../shared/services/cart.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Observable } from 'rxjs/Rx';
import { Quote, QuoteList } from '../../shared/interfaces/quote.interface';
import { QuotesStore } from '../../shared/stores/quotes.store';

@Injectable()
export class QuotesService {
  constructor(private api: ApiService,
    private cart: CartService,
    private store: QuotesStore) { }


  public get data(): Observable<QuoteList> {
    return this.store.data;
  }

  public get state(): QuoteList {
    return this.store.state;
  }

  public getQuotes(params: any): Observable<any> {
    return this.api.get(Api.Orders, 'quote/myQuotes', { parameters: this.buildSearchParams(params), loading: true })
      .do((quotes: any) => this.store.setQuotes(quotes));
  }

  private buildSearchParams(params: any) {
    params['i'] = (params['i'] && params['i'] > 0) ? params['i'] - 1 : 0;
    return Object.assign({}, { q: '', i: 0, n: 20, s: '', d: '' }, params);
  }
}
