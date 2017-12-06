import { Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { QuoteService } from '../../../shared/services/quote.service';
import { Tab } from './tab';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ViewAddress } from '../../../shared/interfaces/user.interface';
import { CartState, QuoteState, PaymentOption } from '../../../shared/interfaces/commerce.interface';
import { CommerceCapabilities } from '../../services/commerce.capabilities';
import { WzDialogService } from '../../../shared/modules/wz-dialog/services/wz.dialog.service';
import { Common } from '../../../shared/utilities/common.functions';
import { AppStore, CheckoutState } from '../../../app.store';

export class CommerceConfirmTab extends Tab {
  @Output() tabNotify: EventEmitter<Object> = this.notify;
  public storeSubscription: Subscription;
  public licensesAreAgreedTo: boolean = false;

  constructor(
    protected router: Router,
    public commerceService: CartService | QuoteService,
    protected dialogService: WzDialogService,
    public userCan: CommerceCapabilities,
    protected store: AppStore
  ) {
    super();
  }

  public get hasDiscount(): boolean {
    return !!this.commerceService.state.data.discount;
  }

  public get orderInProgress(): Observable<CheckoutState> {
    return this.store.select(state => state.checkout);
  }

  public get data(): Observable<any> {
    return this.commerceService.data.map((state: QuoteState | CartState) => state.data);
  }

  public get paymentType(): Observable<PaymentOption> {
    return this.store.select(state => state.checkout.selectedPaymentType);
  }

  public get showPurchaseBtn(): Observable<boolean> {
    return this.store.select(state => state.checkout.selectedPaymentType).map((type: PaymentOption) => {
      return type === 'CreditCard';
    });
  }

  public get showPurchaseOnCreditBtn(): Observable<boolean> {
    return this.store.select(state => state.checkout.selectedPaymentType).map((type: PaymentOption) => {
      return type === 'PurchaseOnCredit';
    });
  }

  public purchase(): void {
    this.commerceService.purchase().subscribe((orderId: Number) =>
      this.router.navigate(['/orders', orderId])
      , (error: any) => { });
  }

  public format(address: ViewAddress): string {
    if (address.address) {
      return Object.keys(address.address).reduce((previous: string, current: string) => {
        if (current === 'address' || current === 'zipcode' || current === 'phone') {
          previous += `${address.address[current]}<br>`;
        } else {
          previous += `${address.address[current]}, `;
        }
        return previous;
      }, '');
    } else {
      return `There is no address on record for this ${address.type}`;
    }
  }

  public shouldShowLicenseDetailsBtn(): boolean {
    return this.userCan.viewLicenseAgreementsButton(this.commerceService.hasAssetLineItems);
  }

  public get isOfflineQuote(): Observable<boolean> {
    return this.store.select(state => state.checkout.selectedPaymentType).map(type => type && type.includes('Offline'));
  }

  public get canPurchase(): boolean {
    return this.licensesAreAgreedTo && this.shouldShowLicenseDetailsBtn();
  }
}
