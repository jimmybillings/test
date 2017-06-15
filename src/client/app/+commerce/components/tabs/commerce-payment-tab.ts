import { Output, EventEmitter, NgZone, OnInit, ChangeDetectorRef } from '@angular/core';
import { Tab } from './tab';
import { CartService } from '../../../shared/services/cart.service';
import { QuoteService } from '../../../shared/services/quote.service';
import { UiConfig } from '../../../shared/services/ui.config';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { QuoteState, CartState, CheckoutState, OrderType, PaymentOptions } from '../../../shared/interfaces/commerce.interface';

export class CommercePaymentTab extends Tab implements OnInit {
  @Output() tabNotify: EventEmitter<Object> = this.notify;
  public serverErrors: any = null;
  public config: any;
  public successfullyVerified: Subject<any> = new Subject();
  public selectedPaymentOption: OrderType = null;
  private configSubscription: Subscription;

  constructor(
    private _zone: NgZone,
    private commerceService: CartService | QuoteService,
    private uiConfig: UiConfig,
    private ref: ChangeDetectorRef) {
    super();
    this.successfullyVerified.next(false);
  }

  ngOnInit() {
    this.loadStripe();
  }

  public get data(): Observable<any> {
    return this.commerceService.data.map((state: QuoteState | CartState) => state.data);
  }

  public get formItems(): Observable<any> {
    return this.uiConfig.get('cart').map((config: any) => config.config.payment.items);
  }

  public get paymentOptions(): Observable<PaymentOptions> {
    return this.commerceService.paymentOptions;
  }

  public get showHoldMessage(): Observable<boolean> {
    return this.commerceService.paymentOptionsEqual(['Hold']);
  }

  public get showCreditCardForm(): Observable<boolean> {
    return this.commerceService.paymentOptionsEqual(['CreditCard']);
  }

  public get showCreditCardAndPurchaseOnCredit(): Observable<boolean> {
    return this.commerceService.paymentOptionsEqual(['CreditCard', 'PurchaseOnCredit']);
  }

  public selectPurchaseOnCredit() {
    // if (event.checked) {
    this.commerceService.updateOrderInProgress('selectedPaymentType', 'PurchaseOnCredit');
    this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
    // } else {
    // this.disableTab(3);
    // }
  }

  public preAuthorize(form: any) {
    (<any>window).Stripe.card.createToken(
      form,
      (status: number, response: any) => {
        this._zone.run(() => {
          if (status === 200) {
            this.commerceService.updateOrderInProgress('authorization', response);
            this.commerceService.updateOrderInProgress('selectedPaymentType', 'CreditCard');
            this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
            this.successfullyVerified.next(true);
            this.ref.markForCheck();
          } else {
            this.serverErrors = { fieldErrors: [] };
            this.serverErrors.fieldErrors
              .push({
                code: response.error.code,
                field: response.error.param
              });
            this.successfullyVerified.next(false);
            this.ref.markForCheck();
          }
        });
      });
  }

  public editCreditCard() {
    this.successfullyVerified.next(false);
    this.disableTab(3);
  }

  private loadStripe() {
    const stripeScript = 'https://js.stripe.com/v2/';
    var scripts = document.getElementsByTagName('script');
    var i = scripts.length, stripeLoaded = false;
    while (i--) {
      if (scripts[i].src === stripeScript) {
        stripeLoaded = true;
      }
    }
    if (!stripeLoaded) {
      var script = document.createElement('script');
      Object.assign(script, { src: stripeScript, type: 'text/javascript' });
      document.body.appendChild(script);
      script.onload = () => {
        (<any>window).Stripe.setPublishableKey(this.commerceService.state.data.stripePublicKey);
      };
    }
  }
}
