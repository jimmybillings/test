import { Component, Output, EventEmitter, NgZone, OnInit } from '@angular/core';
import { Tab } from './tab';
import { CartService } from '../../../../shared/services/cart.service';
import { UiConfig } from '../../../../shared/services/ui.config';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'payment-tab-component',
  templateUrl: 'payment-tab.html'
})

export class PaymentTabComponent extends Tab implements OnInit {
  @Output() tabNotify: EventEmitter<Object> = this.notify;
  public serverErrors: any = null;
  public config: any;
  private configSubscription: Subscription;

  constructor(
    private _zone: NgZone,
    private cartService: CartService,
    private uiConfig: UiConfig, ) {
    super();
  }

  ngOnInit() {
    (<any>window).Stripe.setPublishableKey(this.cartService.state.cart.stripePublicKey);
    this.configSubscription = this.uiConfig.get('cart')
      .subscribe((config: any) => this.config = config.config.payment);
  }

  public preAuthorize(form: any) {

    (<any>window).Stripe.card.createToken(
      form,
      (status: number, response: any) => {
        this._zone.run(() => {
          if (status === 200) {
            // Put payment information into store here
            // before going to next tab.
            // this.cartService.savePaymentInfo(response);
            this.cartService.updateOrderInProgressAuthorization(response);
            console.log(this.cartService.state);
            this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
          } else {
            this.serverErrors = { fieldErrors: [] };
            this.serverErrors.fieldErrors
              .push({
                code: response.error.code,
                field: response.error.param
              });
          }
        });
      });
  }
}
