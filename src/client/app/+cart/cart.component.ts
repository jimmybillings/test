import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { CartService } from '../shared/services/cart.service';

@Component({
  moduleId: module.id,
  selector: 'cart-component',
  templateUrl: 'cart.html'
})

export class CartComponent implements OnInit {
  public cart: Observable<any>;

  constructor(private cartService: CartService) {}

  public ngOnInit(): void {
    this.cart = this.cartService.data;
  }
}
