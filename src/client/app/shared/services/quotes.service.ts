import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CartService } from '../../shared/services/cart.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Observable } from 'rxjs/Observable';
import { Quote, Quotes, QuotesApiResponse } from '../../shared/interfaces/commerce.interface';
import { QuotesStore } from '../../shared/stores/quotes.store';
import { ActiveQuoteStore } from '../../shared/stores/active-quote.store';

@Injectable()
export class QuotesService {
  constructor(private api: ApiService,
    private cart: CartService,
    private store: QuotesStore,
    private activeQuoteStore: ActiveQuoteStore) { }


  public get data(): Observable<Quotes> {
    return this.store.data;
  }

  public get state(): Quotes {
    return this.store.state;
  }

  public getQuotes(getFocused: boolean = false, params: any = {}): Observable<any> {
    if (getFocused) {
      return this.getFocused().switchMap((activeQuote: Quote) => {
        return this.quotesList(params)
          .map((res: QuotesApiResponse) => { res.items = res.items ? res.items : []; return res; })
          .do((res: QuotesApiResponse) => this.findNewFocused(res.items, activeQuote.id))
          .do(this.setQuotesInStore);
      });
    } else {
      return this.quotesList(params).do(this.setQuotesInStore);
    }
  }

  public getFocused(): Observable<Quote> {
    return this.api.get(Api.Orders, 'quote/focused') as Observable<Quote>;
  }

  public setFocused(quoteId: number): Observable<Quote> {
    return this.api.put(Api.Orders, `quote/focused/${quoteId}`).do((quote: Quote) => {
      this.updateNewFocusedQuote(quote.id);
      this.activeQuoteStore.replaceQuote(quote);
    }) as Observable<Quote>;
  }

  public rejectQuote(quoteId: number): Observable<Quote> {
    return this.api.put(Api.Orders, `quote/reject/${quoteId}`) as Observable<Quote>;
  }

  public createEmpty(): Observable<Quote> {
    return this.api.post(Api.Orders, 'quote') as Observable<Quote>;
  }

  private findNewFocused(quotes: Quote[], activeQuoteId: number): Quote[] {
    return quotes.map((quote: Quote) => {
      quote.focused = quote.id === activeQuoteId ? true : false;
      return quote;
    });
  }

  private quotesList(params: any = {}): Observable<any> {
    return this.api.get(Api.Orders, 'quote/myQuotes', { parameters: this.buildSearchParams(params), loadingIndicator: true });
  }

  private updateNewFocusedQuote(quoteId: number): void {
    this.data.do((data: Quotes) => {
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

  private updateQuotesInStore = (quotes: Quotes): void => {
    this.store.updateQuotes({ items: quotes.items });
  }

  private setQuotesInStore = (quotes: QuotesApiResponse): void => {
    this.store.setQuotes(quotes);
  }
}
