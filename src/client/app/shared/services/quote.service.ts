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

  public createQuote(options: QuoteOptions): Observable<any> {
    return this.store.data.flatMap((cartStore: any) => {
      let body: any = this.formatBody(cartStore.cart, options);
      return this.api.post(Api.Orders, 'quote', { body: body });
    });
  }

  private formatBody(cart: Cart, options: QuoteOptions): any {
    // We don't want to send 'standard' to the API, as it's not a valid option.
    // we leave it blank so the end user can decide later to pay with credit-card or purchase on credit
    if (options.purchaseType === 'standard') delete options.purchaseType;

    // find the userId of the user that this quote is for
    let ownerUserId: number = options.users ? options.users.filter((user: any) => {
      return user.emailAddress === options.emailAddress;
    })[0].id : null;

    // shove the extra quote params on to the current cart
    let body: any = Object.assign(
      cart,
      { quoteStatus: options.status, purchaseType: options.purchaseType, expirationDate: options.expirationDate }
    );

    // add the user id if it exists
    if (ownerUserId) Object.assign(body, { ownerUserId });

    // delete the fields leftover from the cart store
    delete body.id;
    delete body.createdOn;
    delete body.lastUpdated;

    return body;
  }

}
