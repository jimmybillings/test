import { Component, Inject, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommercePaymentTab } from '../../../components/tabs/commerce-payment-tab';
import { CartService } from '../../../../shared/services/cart.service';
import { AppStore } from '../../../../app.store';
import { FormFields } from '../../../../shared/interfaces/forms.interface';
import { Pojo } from '../../../../shared/interfaces/common.interface';

@Component({
  moduleId: module.id,
  selector: 'cart-payment-tab-component',
  templateUrl: 'cart-payment-tab.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CartPaymentTabComponent extends CommercePaymentTab {
  public PurchaseOrderFormConfig: Array<FormFields>;
  constructor(
    protected _zone: NgZone,
    protected cartService: CartService,
    protected store: AppStore,
    protected ref: ChangeDetectorRef
  ) {
    super(_zone, cartService, store, ref);
    this.PurchaseOrderFormConfig = this.store.snapshotCloned(state => state.uiConfig.components.cart.config.addPurchaseOrderId.items);
  }

  public onBlur(form: Pojo): void {
    // console.log(form.purchaseOrderId);
    this.store.dispatch(factory => factory.checkout.setPurchaseOrderId(form.purchaseOrderId));
  }
}
