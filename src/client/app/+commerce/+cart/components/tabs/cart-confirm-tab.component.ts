import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommerceConfirmTab } from '../../../components/tabs/commerce-confirm-tab';
import { CartService } from '../../../../shared/services/cart.service';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'cart-confirm-tab-component',
  templateUrl: 'cart-confirm-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CartConfirmTabComponent extends CommerceConfirmTab {

  constructor(
    router: Router,
    cartService: CartService
  ) {
    super(router, cartService);
  }

}
