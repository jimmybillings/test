import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { CartService } from './services/cart.service';

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

  public onNotification(message: any): void {
    switch(message.type) {
      case 'ADD_PROJECT': {
        this.cartService.addProject();
        break;
      }
      case 'REMOVE_PROJECT': {
        this.cartService.removeProject(message.payload);
        break;
      }
    };
  }
}
