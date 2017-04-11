import { Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { QuoteEditService } from '../../../shared/services/quote-edit.service';
import { Tab } from './tab';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ViewAddress } from '../../../shared/interfaces/user.interface';

export class CommerceConfirmTab extends Tab {
  @Output() tabNotify: EventEmitter<Object> = this.notify;
  public store: any;
  public storeSubscription: Subscription;
  constructor(
    protected router: Router,
    public commerceService: CartService | QuoteEditService
  ) {
    super();
  }

  public get orderInProgress() {
    return this.commerceService.data.map((data: any) => data.orderInProgress);
  }

  public get cart() {
    return this.commerceService.data.map((data: any) => data.cart);
  }

  purchase() {
    this.commerceService.purchase().subscribe((orderId: any) =>
      this.router.navigate(['/commerce/order', orderId])
      , (error: any) =>
        console.log(error)
    );
  }

  public purchaseOnCredit(): void {
    this.commerceService.purchaseOnCredit().take(1).subscribe((order: any) =>
      this.router.navigate(['/commerce/order', order.id])
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
