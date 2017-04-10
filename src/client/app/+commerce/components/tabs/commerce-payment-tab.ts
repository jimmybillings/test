import { Output, EventEmitter, NgZone, OnInit, ChangeDetectorRef } from '@angular/core';
import { Tab } from './tab';
import { CartService } from '../../../shared/services/cart.service';
import { QuoteEditService } from '../../../shared/services/quote-edit.service';
import { UiConfig } from '../../../shared/services/ui.config';
import { Observable, Subscription } from 'rxjs/Rx';

export class CommercePaymentTab extends Tab implements OnInit {
  @Output() tabNotify: EventEmitter<Object> = this.notify;
  public serverErrors: any = null;
  public config: any;
  private configSubscription: Subscription;

  constructor(
    private _zone: NgZone,
    private commerceService: CartService | QuoteEditService,
    private uiConfig: UiConfig,
    private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.configSubscription = this.uiConfig.get('cart')
      .subscribe((config: any) => { console.log(config); this.config = config.config.payment; });
    this.loadStripe();
  }

  public selectPurchaseOnCredit() {
    this.commerceService.updateOrderInProgress('selectedPurchaseType', 'credit');
    this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
  }
  public preAuthorize(form: any) {
    (<any>window).Stripe.card.createToken(
      form,
      (status: number, response: any) => {
        this._zone.run(() => {
          if (status === 200) {
            this.commerceService.updateOrderInProgress('authorization', response);
            this.commerceService.updateOrderInProgress('selectedPurchaseType', 'card');
            this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
          } else {
            this.serverErrors = { fieldErrors: [] };
            this.serverErrors.fieldErrors
              .push({
                code: response.error.code,
                field: response.error.param
              });
            this.ref.markForCheck();
          }
        });
      });
  }

  public get userCanPurchaseOnCredit(): Observable<boolean> {
    return this.commerceService.data.map((data: any) => {
      let options: any = data.orderInProgress.purchaseOptions;
      if (data.orderInProgress.selectedAddress.type === 'user') {
        return options.purchaseOnCredit;
      } else {
        if (options.purchaseOnCredit) {
          if (options.creditExemption) {
            return data.cart.total > parseInt(options.creditExemption);
          } else {
            return true;
          }
        } else {
          return options.purchaseOnCredit;
        }
      }
    });
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
      script.src = stripeScript;
      script.type = 'text/javascript';
      document.body.appendChild(script);
      script.onload = () => {
        (<any>window).Stripe.setPublishableKey(this.commerceService.state.cart.stripePublicKey);
      };
    }
  }
}
