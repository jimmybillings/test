import { Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { QuoteService } from '../../../shared/services/quote.service';
import { Tab } from './tab';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ViewAddress } from '../../../shared/interfaces/user.interface';
import { QuoteState } from '../../../shared/interfaces/quote.interface';
import { CartState } from '../../../shared/interfaces/cart.interface';
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

  public get orderInProgress() {
    return this.commerceService.data.map((state: QuoteState | CartState) => state.orderInProgress);
  }

  public get data() {
    return this.commerceService.data.map((state: QuoteState | CartState) => state.data);
  }

  purchase() {
    this.commerceService.purchase().subscribe((orderId: any) =>
      this.router.navigate(['/commerce/orders', orderId])
      , (error: any) =>
        console.log(error)
    );
  }

  public purchaseOnCredit(): void {
    this.commerceService.purchaseOnCredit().take(1).subscribe((order: any) =>
      this.router.navigate(['/commerce/orders', order.id])
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
