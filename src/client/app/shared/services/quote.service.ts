import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CartService } from '../../shared/services/cart.service';
import { Api, ApiResponse } from '../../shared/interfaces/api.interface';
import { Observable } from 'rxjs/Observable';
import {
  Quote, Order, QuoteOptions, QuoteState, CheckoutState, OrderType, QuoteType
} from '../../shared/interfaces/commerce.interface';
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

  // Store Accessors

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

  public get purchaseType(): Observable<OrderType> {
    return this.checkoutData.map((state: CheckoutState) => state.selectedPurchaseType);
  }

  // Public Interface

  public getQuote(quoteId: number): Observable<Quote> {
    return this.api.get(Api.Orders, `quote/${quoteId}`, { loading: true })
      .do((quote: Quote) => {
        this.quoteStore.updateQuote(quote);
        this.updateOrderInProgress('selectedPurchaseType', quote.purchaseType);
      });
  }

  public updateOrderInProgress(type: string, data: any): void {
    this.checkoutStore.updateOrderInProgress(type, data);
  }

  public purchase(): Observable<number> {
    switch (this.checkoutState.selectedPurchaseType) {
      case 'CreditCard':
        return this.purchaseWithCreditCard();
      case 'PurchaseOnCredit':
        return this.purchaseOnCredit();
      case 'ProvisionalOrder':
        return this.purchaseQuoteType('ProvisionalOrder');
      case 'OfflineAgreement':
        return this.purchaseQuoteType('OfflineAgreement');
      default:
        return Observable.of(NaN);
    }
  }

  // Private Methods

  private purchaseWithCreditCard(): Observable<number> {
    const stripe: any = {
      stripeToken: this.checkoutState.authorization.id,
      stripeTokenType: this.checkoutState.authorization.type
    };
    return this.api.post(
      Api.Orders,
      `quote/${this.state.data.id}/stripe/process`,
      { body: { options: stripe }, loading: true }
    ).map(_ => _ as Number);
  }

  private purchaseOnCredit(): Observable<number> {
    return this.api.post(
      Api.Orders,
      `quote/${this.state.data.id}/checkout/convertToOrder`,
      { loading: true }
    ).map((order: Order) => order.id);
  }

  private purchaseQuoteType(type: QuoteType): Observable<number> {
    return this.api.post(
      Api.Orders,
      `quote/${this.state.data.id}/checkout/convertToOrder`,
      { loading: true, body: { options: { orderType: type } } }
    ).map((order: Order) => order.id);
  }
}
