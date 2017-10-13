import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommerceBillingTab } from '../../../components/tabs/commerce-billing-tab';
import { CartService } from '../../../../shared/services/cart.service';
import { UserService } from '../../../../shared/services/user.service';
import { CurrentUserService } from '../../../../shared/services/current-user.service';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { WzDialogService } from '../../../../shared/modules/wz-dialog/services/wz.dialog.service';

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
    user: UserService,
    currentUser: CurrentUserService,
    dialog: WzDialogService
  ) {
    super(userCan, cartService, user, currentUser, dialog);
  }
}
