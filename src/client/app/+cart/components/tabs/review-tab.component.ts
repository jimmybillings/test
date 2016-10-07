import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Tab } from './tab';
import { CartService } from '../../services/cart.service';

@Component({
  moduleId: module.id,
  selector: 'review-tab-component',
  templateUrl: 'review-tab.html'
})

export class ReviewTabComponent extends Tab implements OnInit {
  @Output() tabNotify: EventEmitter<Object> = this.notify;

  public cart: Observable<any>;

  constructor(private cartService: CartService) {
    super();
  }

  public ngOnInit(): void {
    this.cart = this.cartService.data;
  }
}
