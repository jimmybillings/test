import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommerceConfirmTab } from '../../../components/tabs/commerce-confirm-tab';
import { CartService } from '../../../../shared/services/cart.service';
import { Router } from '@angular/router';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';

@Component({
  moduleId: module.id,
  selector: 'cart-confirm-tab-component',
  templateUrl: '../../../components/tabs/commerce-confirm-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CartConfirmTabComponent extends CommerceConfirmTab {

  constructor(
    router: Router,
    cartService: CartService,
    userCan: CommerceCapabilities
  ) {
    super(router, cartService, userCan);
  }

}
