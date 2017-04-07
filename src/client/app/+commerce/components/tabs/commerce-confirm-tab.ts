import { Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { Tab } from './tab';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ViewAddress } from '../../../shared/interfaces/user.interface';

export class CommerceConfirmTab extends Tab implements OnInit, OnDestroy {
  @Output() tabNotify: EventEmitter<Object> = this.notify;
  public cartStore: any;
  public cartSubscription: Subscription;
  constructor(private router: Router, public cartService: CartService) {
    super();
  }

  ngOnInit() {
    this.cartSubscription = this.cartService.data.subscribe(data => this.cartStore = data);
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  purchase() {
    this.cartService.purchase().subscribe((orderId: any) =>
      this.router.navigate(['/commerce/order', orderId])
      , (error: any) =>
        console.log(error)
    );
  }

  public purchaseOnCredit(): void {
    this.cartService.purchaseOnCredit().take(1).subscribe((order: any) =>
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
