import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommerceBillingTab } from '../../../components/tabs/commerce-billing-tab';
import { CartService } from '../../../../shared/services/cart.service';
import { UiConfig } from '../../../../shared/services/ui.config';
import { MdDialog } from '@angular/material';
import { UserService } from '../../../../shared/services/user.service';
import { CurrentUserService } from '../../../../shared/services/current-user.service';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';

@Component({
  moduleId: module.id,
  selector: 'cart-billing-tab-component',
  templateUrl: '../../../components/tabs/commerce-billing-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CartBillingTabComponent extends CommerceBillingTab {

  constructor(
    userCan: CommerceCapabilities,
    cartService: CartService,
    uiConfig: UiConfig,
    user: UserService,
    currentUser: CurrentUserService,
    dialog: MdDialog
  ) {
    super(userCan, cartService, uiConfig, user, currentUser, dialog);
  }

}
