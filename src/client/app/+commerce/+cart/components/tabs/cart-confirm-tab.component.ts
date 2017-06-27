import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommerceConfirmTab } from '../../../components/tabs/commerce-confirm-tab';
import { CartService } from '../../../../shared/services/cart.service';
import { Router } from '@angular/router';
import { CommerceCapabilities } from '../../../services/commerce.capabilities';
import { WzDialogService } from '../../../../shared/modules/wz-dialog/services/wz.dialog.service';

@Component({
  moduleId: module.id,
  selector: 'cart-confirm-tab-component',
  templateUrl: '../../../components/tabs/commerce-confirm-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CartConfirmTabComponent extends CommerceConfirmTab {
  constructor(
    protected router: Router,
    public cartService: CartService,
    public dialogService: WzDialogService,
    public userCan: CommerceCapabilities
  ) {
    super(router, cartService, dialogService, userCan);
  }
}
