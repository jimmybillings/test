import { Output, EventEmitter, NgZone, OnInit, ChangeDetectorRef } from '@angular/core';
import { Tab } from './tab';
import { CartService } from '../../../shared/services/cart.service';
import { QuoteService } from '../../../shared/services/quote.service';
import { UiConfig } from '../../../shared/services/ui.config';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { QuoteState, CartState, CheckoutState, OrderType } from '../../../shared/interfaces/commerce.interface';

export class CommercePaymentTab extends Tab implements OnInit {
  @Output() tabNotify: EventEmitter<Object> = this.notify;
  public serverErrors: any = null;
  public config: any;
  public paymentMethods: string[] = ['Credit Card', 'Purchase on Credit'];
  public paymentMethod: string;
  public successfullyVerified: Subject<any> = new Subject();
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

  public get formItems(): Observable<any> {
    return this.uiConfig.get('cart').map((config: any) => config.config.payment.items);
  }

  public get purchaseType(): Observable<OrderType> {
    return this.commerceService.purchaseType;
  }

  public selectPurchaseOnCredit(event: any) {
    if (event.checked) {
      this.commerceService.updateOrderInProgress('selectedPurchaseType', 'PurchaseOnCredit');
      this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
    } else {
      this.disableTab(3);
    }
  }

  public preAuthorize(form: any) {
    (<any>window).Stripe.card.createToken(
      form,
      (status: number, response: any) => {
        this._zone.run(() => {
          if (status === 200) {
            this.commerceService.updateOrderInProgress('authorization', response);
            this.commerceService.updateOrderInProgress('selectedPurchaseType', 'CreditCard');
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

  public get userCanPurchaseOnCredit(): Observable<boolean> {
    return this.commerceService.checkoutData.map((state: CheckoutState) => {
      let options: any = state.purchaseOptions;
      if (state.selectedAddress.type === 'User') {
        return options.purchaseOnCredit;
      } else {
        if (options.purchaseOnCredit) {
          if (options.creditExemption) {
            return this.commerceService.state.data.total > parseInt(options.creditExemption);
          } else {
            return true;
          }
        } else {
          return options.purchaseOnCredit;
        }
      }
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
