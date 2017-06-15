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
  PaymentOptions
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
    /* ------------------------------ mocks ------------------------------- */
    // this.updateOrderInProgress('paymentOptions', this.mockHold);
    // this.updateOrderInProgress('paymentOptions', this.mockCreditCard);
    // this.updateOrderInProgress('paymentOptions', this.mockProvisional);
    // this.updateOrderInProgress('paymentOptions', this.mockOfflineAgreement);
    // this.updateOrderInProgress('paymentOptions', this.mockCreditCardAndPurchaseOnCredit);
    /* -------------------------------------------------------------------- */
  }

  public paymentOptionsEqual(options: Array<OrderType>): Observable<boolean> {
    return this.paymentOptions.map((pmtOpts: PaymentOptions) => {
      if (!pmtOpts) return false;
      pmtOpts.paymentOptions.sort();
      return options.length === pmtOpts.paymentOptions.length &&
        options.sort().every((option: OrderType, index: number) => option === pmtOpts.paymentOptions[index]);
    });
  }

  // Private Methods

  /* BEGIN MOCKS FOR PAYMENT OPTIONS - TO BE REMOVED EVENTUALLY */

  private get mockCreditCardAndPurchaseOnCredit(): PaymentOptions {
    return {
      paymentOptions: ['CreditCard', 'PurchaseOnCredit'],
      explanation: 'Please select either of the payment options below',
      noCheckout: false
    };
  }

  private get mockHold(): PaymentOptions {
    return {
      paymentOptions: ['Hold'],
      explanation: 'You are not authorized to complete a purchase at this time',
      noCheckout: true
    };
  }

  private get mockCreditCard(): PaymentOptions {
    return {
      paymentOptions: ['CreditCard'],
      explanation: 'Please enter your Credit Card information below',
      noCheckout: false
    };
  }

  private get mockProvisional(): PaymentOptions {
    return {
      paymentOptions: ['ProvisionalOrder'],
      explanation: 'This quote has been approved to be purchased as a Provisional Order',
      noCheckout: false
    };
  }

  private get mockOfflineAgreement(): PaymentOptions {
    return {
      paymentOptions: ['OfflineAgreement'],
      explanation: 'You may elect to pay for this quote now, or later',
      noCheckout: false
    };
  }

  /* END MOCKS FOR PAYMENT OPTIONS */

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
