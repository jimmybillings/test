import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { OrderStore } from '../../../+order/services/order.store';
import { WzNotificationService } from '../../../../shared/components/wz-notification/wz.notification.service';
import { Tab } from './tab';
import { CartService } from '../../services/cart.service';
import { CartCapabilities } from '../../services/cart.capabilities';
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
    private notification: WzNotificationService) {
    super();
  }

  public ngOnInit(): void {
    this.cart = this.cartService.data;
    this.canPurchaseOnCredit = this.userCan.purchaseOnCredit();
    this.addPayByCardForm();
  }

  public purchaseOnCredit(): void {
    this.cartService.purchaseOnCredit().subscribe(data => {
      this.order.update(data);
      this.router.navigate(['/commerce/order/' + data.id]).then(() => {
        this.notification.create('NOTIFICATION.ORDER_PLACED');
      });
    });
  }
  public addPayByCardForm(): void {
      this.cart.subscribe(currentCart => {
            this.createForm(currentCart);
          });
  }
  public createForm(currentCart:any): void {
        let desc = currentCart.itemCount + ' item';
        if (currentCart.itemCount > 1) {
            desc +='s';
        }
       let currentUser = JSON.parse(localStorage.getItem('currentUser'));
       console.log('current user is:');
       console.dir(currentUser);
       let postUrl = baseUrl+'api/orders/v1/cart/stripe/payment?redirect=true&api_key='+localStorage.getItem('token');
       let f = document.createElement('form');
       f.setAttribute('action',postUrl);
       f.setAttribute('method','POST');
       f.setAttribute('id','stripeForm');
       f.setAttribute('style','padding-left: 20px');
       let s = document.createElement('script');
       s.src = 'https://checkout.stripe.com/checkout.js';
       s.setAttribute('class','stripe-button');
       s.setAttribute('data-key',currentCart.stripePublicKey);
       s.setAttribute('data-amount',''+(currentCart.total * 100));
       s.setAttribute('data-name','Pay With Credit Card');
       s.setAttribute('data-description',desc);
       s.setAttribute('data-image','https://core.wazeedigital.com/video/images/wazee/logo-rev.png');
       s.setAttribute('data-allow-remember-me','false');
       s.setAttribute('data-email',currentUser.emailAddress);
       s.setAttribute('data-zip-code','true');
       s.setAttribute('data-locale','auto');
       f.appendChild(s);
       document.getElementById('paymentArea_').appendChild(f);
    }
}
