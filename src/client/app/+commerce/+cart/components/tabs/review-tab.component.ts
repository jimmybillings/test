import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { OrderStore } from '../../../+order/services/order.store';
import { Tab } from './tab';
import { CartService } from '../../../../shared/services/cart.service';
import { CartCapabilities } from '../../services/cart.capabilities';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from 'ng2-translate';
declare var baseUrl: any;

@Component({
  moduleId: module.id,
  selector: 'review-tab-component',
  templateUrl: 'review-tab.html'
})
export class ReviewTabComponent extends Tab implements OnInit {
  @Output() tabNotify: EventEmitter<Object> = this.notify;

  public cart: Observable<any>;
  public canPurchaseOnCredit: boolean;
  constructor(private cartService: CartService,
    private userCan: CartCapabilities,
    private router: Router,
    private order: OrderStore,
    private snackbar: MdSnackBar,
    private translate: TranslateService) {
    super();
  }

  public ngOnInit(): void {
    this.cart = this.cartService.data;
    this.canPurchaseOnCredit = this.userCan.purchaseOnCredit();

    // TODO: Due to recent Angular changes, the last line of createForm() fails.
    // So we are commenting this out so that it can be refactored into more Angular-like code.
    // See Jira issue CRUX-1322.
    //
    // this.addPayByCardForm();
  }

  public purchaseOnCredit(): void {
    this.cartService.purchaseOnCredit().subscribe(data => {
      this.order.update(data);
      this.router.navigate(['/commerce/order/' + data.id]).then(() => {
        this.showSnackbar('NOTIFICATION.ORDER_PLACED');
      });
    });
  }

  public addPayByCardForm(): void {
    this.cart.subscribe(currentCart => {
      this.createForm(currentCart);
    });
  }

  public createForm(currentCart: any): void {
    let desc = currentCart.itemCount + ' item';
    if (currentCart.itemCount > 1) {
      desc += 's';
    }
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      let postUrl = baseUrl + 'api/orders/v1/cart/stripe/payment?redirect=true&api_key=' + localStorage.getItem('token');
      let f = document.createElement('form');
      f.setAttribute('action', postUrl);
      f.setAttribute('method', 'POST');
      f.setAttribute('id', 'stripeForm');
      f.setAttribute('style', 'padding-left: 20px');
      let s = document.createElement('script');
      s.src = 'https://checkout.stripe.com/checkout.js';
      s.setAttribute('class', 'stripe-button');
      s.setAttribute('data-key', currentCart.stripePublicKey);
      s.setAttribute('data-amount', '' + (currentCart.total * 100));
      s.setAttribute('data-name', 'Pay With Credit Card');
      s.setAttribute('data-description', desc);
      s.setAttribute('data-image', 'assets/img/logo/logo-c-alt.png');
      s.setAttribute('data-allow-remember-me', 'false');
      s.setAttribute('data-email', currentUser.emailAddress);
      s.setAttribute('data-zip-code', 'true');
      s.setAttribute('data-locale', 'auto');
      f.appendChild(s);

      // This is the line that fails, with this error: "Cannot read property 'appendChild' of null"
      document.getElementById('paymentArea_').appendChild(f);
    }
  }

  private showSnackbar(message: any): void {
    this.translate.get(message)
      .subscribe((res: string) => {
        this.snackbar.open(res, '', { duration: 2000 });
      });
  }
}
