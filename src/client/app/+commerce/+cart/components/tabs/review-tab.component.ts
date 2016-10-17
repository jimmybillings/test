import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { Tab } from './tab';
import { CartService } from '../../services/cart.service';
import { CartCapabilities } from '../../services/cart.capabilities';

@Component({
  moduleId: module.id,
  selector: 'review-tab-component',
  templateUrl: 'review-tab.html'
})

export class ReviewTabComponent extends Tab implements OnInit {
  @Output() tabNotify: EventEmitter<Object> = this.notify;

  public cart: Observable<any>;
  public canPurchaseOnCredit: boolean;

  constructor(private cartService: CartService, private userCan: CartCapabilities, private router: Router) {
    super();
  }

  public ngOnInit(): void {
    this.cart = this.cartService.data;
    this.canPurchaseOnCredit = this.userCan.purchaseOnCredit();
  }

  public purchaseOnCredit(): void {
    this.cartService.purchaseOnCredit().subscribe(data => {
      this.router.navigate(['/order/' + data.id]);
    });
  }
}
