import { Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { QuoteService } from '../../../shared/services/quote.service';
import { Tab } from './tab';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ViewAddress } from '../../../shared/interfaces/user.interface';
import { CartState, QuoteState, CheckoutState, OrderType } from '../../../shared/interfaces/commerce.interface';
import { CommerceCapabilities } from '../../services/commerce.capabilities';

export class CommerceConfirmTab extends Tab {
  @Output() tabNotify: EventEmitter<Object> = this.notify;
  public store: any;
  public storeSubscription: Subscription;
  constructor(
    protected router: Router,
    public commerceService: CartService | QuoteService,
    public userCan: CommerceCapabilities
  ) {
    super();
  }

  public get orderInProgress(): Observable<CheckoutState> {
    return this.commerceService.checkoutData;
  }

  public get data(): Observable<any> {
    return this.commerceService.data.map((state: QuoteState | CartState) => state.data);
  }

  public get paymentType(): Observable<OrderType> {
    return this.commerceService.paymentType;
  }

  public get showPurchaseBtn(): Observable<boolean> {
    return this.paymentType.map((type: OrderType) => {
      return type === 'CreditCard';
    });
  }

  public get showPurchaseOnCreditBtn(): Observable<boolean> {
    return this.paymentType.map((type: OrderType) => {
      return type === 'PurchaseOnCredit' || type === 'ProvisionalOrder';
    });
  }

  public purchase(): void {
    this.commerceService.purchase().subscribe((orderId: Number) =>
      this.router.navigate(['/commerce/orders', orderId])
      , (error: any) =>
        console.log(error)
    );
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
}
