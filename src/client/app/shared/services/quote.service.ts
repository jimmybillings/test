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
    return this.api.post(Api.Orders, 'quote/checkout/purchaseOnCredit', { loading: true });
  }


  // private formatBody(cart: Cart, options: QuoteOptions): any {
  //   // We don't want to send 'standard' to the API, as it's not a valid option.
  //   // we leave it blank so the end user can decide later to pay with credit-card or purchase on credit
  //   if (options.purchaseType === 'standard') delete options.purchaseType;

  //   // find the userId of the user that this quote is for
  //   let ownerUserId: number = options.users ? options.users.filter((user: any) => {
  //     return user.emailAddress === options.emailAddress;
  //   })[0].id : null;

  //   // shove the extra quote params on to the current cart
  //   let body: any = Object.assign(
  //     cart,
  //     { quoteStatus: options.status, purchaseType: options.purchaseType, expirationDate: options.expirationDate }
  //   );

  //   // add the user id if it exists
  //   if (ownerUserId) Object.assign(body, { ownerUserId });

  //   // delete the fields leftover from the cart store
  //   delete body.id;
  //   delete body.createdOn;
  //   delete body.lastUpdated;

  //   return body;
  // }

}
