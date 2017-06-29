import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { CartService } from '../../shared/services/cart.service';
import { Api, ApiResponse } from '../../shared/interfaces/api.interface';
import { Observable } from 'rxjs/Observable';
import {
  Quote,
  Order,
  QuoteOptions,
  QuoteState,
  CheckoutState,
  OrderType,
  QuoteType,
  AddressPurchaseOptions,
  CreditCardPurchaseOptions,
  PurchaseOptions,
  PaymentOptions,
  Project,
  LicenseAgreements
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

  public get paymentType(): Observable<OrderType> {
    return this.checkoutData.map((state: CheckoutState) => state.selectedPaymentType);
  }

  public get paymentOptions(): Observable<PaymentOptions> {
    return this.checkoutData.map((data: CheckoutState) => data.paymentOptions);
  }

  public get hasAssets(): Observable<boolean> {
    return this.data.map((state: QuoteState) => (state.data.itemCount || 0) > 0);
  }

  public get hasAssetLineItems(): Observable<boolean> {
    return this.data.map((state: QuoteState) => {
      return state.data.projects.reduce((previous: number, current: Project) => {
        return current.lineItems ? previous += current.lineItems.length : 0;
      }, 0) > 0;
    });
  }

  // Public Interface

  public getQuote(quoteId: number): Observable<Quote> {
    return this.api.get(Api.Orders, `quote/${quoteId}`, { loading: true })
      .do((quote: Quote) => this.quoteStore.updateQuote(quote));
  }

  public updateOrderInProgress(type: string, data: any): void {
    this.checkoutStore.updateOrderInProgress(type, data);
  }

  public purchase(): Observable<number> {
    switch (this.checkoutState.selectedPaymentType) {
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

  public getPaymentOptions() {
    this.api.get(Api.Orders, `quote/paymentOptions/${this.state.data.id}`).subscribe((options: PaymentOptions) => {
      this.updateOrderInProgress('paymentOptions', options);
      if (options.paymentOptions.length === 1) this.updateOrderInProgress('selectedPaymentType', options.paymentOptions[0]);
    });
  }

  public paymentOptionsEqual(options: Array<OrderType>): Observable<boolean> {
    return this.paymentOptions.map((pmtOpts: PaymentOptions) => {
      if (!pmtOpts) return false;
      pmtOpts.paymentOptions.sort();
      return options.length === pmtOpts.paymentOptions.length &&
        options.sort().every((option: OrderType, index: number) => option === pmtOpts.paymentOptions[index]);
    });
  }

  public retrieveLicenseAgreements(): Observable<LicenseAgreements> {
    return this.api.get(Api.Orders, `quote/licensing/${this.state.data.id}`);
  }

  // Private Methods

  private purchaseWithCreditCard(): Observable<number> {
    const options: PurchaseOptions = this.purchaseOptions;
    return this.api.post(
      Api.Orders,
      `quote/${this.state.data.id}/stripe/process`,
      { body: { options }, loading: true }
    ).map(_ => _ as Number);
  }

  private purchaseOnCredit(): Observable<number> {
    const options: AddressPurchaseOptions = this.addressPurchaseOptions;
    return this.api.post(
      Api.Orders,
      `quote/${this.state.data.id}/checkout/convertToOrder`,
      { body: { options }, loading: true }
    ).map((order: Order) => order.id);
  }

  private purchaseQuoteType(type: QuoteType): Observable<number> {
    const options: AddressPurchaseOptions = Object.assign({}, { orderType: type }, this.addressPurchaseOptions);
    return this.api.post(
      Api.Orders,
      `quote/${this.state.data.id}/checkout/convertToOrder`,
      { body: { options }, loading: true }
    ).map((order: Order) => order.id);
  }

  private get purchaseOptions(): PurchaseOptions {
    return Object.assign({}, this.addressPurchaseOptions, this.creditCardPurchaseOptions) as PurchaseOptions;
  }

  private get addressPurchaseOptions(): AddressPurchaseOptions {
    return {
      orderAddressId: this.checkoutState.selectedAddress.addressEntityId,
      orderAddressType: this.checkoutState.selectedAddress.type
    };
  }

  private get creditCardPurchaseOptions(): CreditCardPurchaseOptions {
    return {
      stripeToken: this.checkoutState.authorization.id,
      stripeTokenType: this.checkoutState.authorization.type
    };
  }
}
