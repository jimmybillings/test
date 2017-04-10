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

  public getQuotes(getFocused: boolean, params: any): Observable<any> {
    if (getFocused) {
      return this.getFocused().switchMap((focusedQuote: Quote) => {
        return this.quotesList(params)
          .map((res: QuoteList) => { res.items = res.items ? res.items : []; return res; })
          .do((res: QuoteList) => this.findNewFocused(res.items, focusedQuote.id))
          .do(this.setQuotesInStore);
      });
    } else {
      return this.quotesList(params).do(this.setQuotesInStore);
    }
  }

  public getFocused(): Observable<Quote> {
    return this.api.get(Api.Orders, 'quote/focused');
  }

  public setFocused(quoteId: number): Observable<Quote> {
    return this.api.put(Api.Orders, `quote/focused/${quoteId}`).do((quote: Quote) => {
      this.updateNewFocusedQuote(quote.id);
    });
  }

  private findNewFocused(quotes: Quote[], focusedQuoteId: number): Quote[] {
    return quotes.map((quote: Quote) => {
      quote.focused = quote.id === focusedQuoteId ? true : false;
      return quote;
    });
  }

  private quotesList(params: any): Observable<any> {
    return this.api.get(Api.Orders, 'quote/myQuotes', { parameters: this.buildSearchParams(params), loading: true });
  }

  private updateNewFocusedQuote(quoteId: number): void {
    this.data.do((data: QuoteList) => {
      data.items.map((quote: Quote) => {
        quote.focused = false;
        if (quote.id === quoteId) quote.focused = true;
        return quote;
      });
    }).do(this.updateQuotesInStore).take(1).subscribe();
  }

  private buildSearchParams(params: any) {
    params['i'] = (params['i'] && params['i'] > 0) ? params['i'] - 1 : 0;
    return Object.assign({}, { q: '', i: 0, n: 20, s: '', d: '' }, params);
  }

  private updateQuotesInStore = (quotes: QuoteList): void => {
    this.store.updateQuotes({ items: quotes.items });
  }

  private setQuotesInStore = (quotes: QuoteList): void => {
    this.store.setQuotes(quotes);
  }
}
