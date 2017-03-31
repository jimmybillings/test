import { Component, Inject, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommercePaymentTab } from '../../../components/tabs/commerce-payment-tab';
import { CartService } from '../../../../shared/services/cart.service';
import { UiConfig } from '../../../../shared/services/ui.config';


@Component({
  moduleId: module.id,
  selector: 'cart-payment-tab-component',
  templateUrl: 'cart-payment-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CartPaymentTabComponent extends CommercePaymentTab {

  constructor(
    _zone: NgZone,
    cartService: CartService,
    uiConfig: UiConfig,
    ref: ChangeDetectorRef
  ) {
    super(_zone, cartService, uiConfig, ref);
  }

}
