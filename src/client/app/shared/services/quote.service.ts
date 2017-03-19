import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CartService } from '../../shared/services/cart.service';
import { Api } from '../../shared/interfaces/api.interface';
import { Observable } from 'rxjs/Rx';
import { Quote } from '../../shared/interfaces/quote.interface';
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

  public createQuote(saveAsDraft: boolean, emailAddress?: string, matchingUsers?: any[]): Observable<any> {
    let quoteStatus: 'ACTIVE' | 'PENDING' = saveAsDraft ? 'PENDING' : 'ACTIVE';
    let ownerUserId: number = matchingUsers ? matchingUsers.filter((user: any) => {
      return user.emailAddress === emailAddress;
    })[0].id : null;
    return this.cart.data.flatMap((cartStore: any) => {
      let body: any = Object.assign(cartStore.cart, { quoteStatus });
      if (ownerUserId) Object.assign(body, { ownerUserId });
      delete body.id;
      return this.api.post(Api.Orders, 'quote', { body: body });
    });
  }

  public getQuote(quoteId: number): Observable<Quote> {
    return this.api.get(Api.Orders, `quote/${quoteId}`)
      .do((quote: Quote) => this.store.setQuote(quote));
  }
}
