import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { CartService } from './services/cart.service';
import { UiConfig } from '../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'cart-component',
  templateUrl: 'cart.html'
})

export class CartComponent implements OnInit {
  public cart: Observable<any>;
  public config: any;

  constructor(private cartService: CartService, private uiConfig: UiConfig) {}

  public ngOnInit(): void {
    this.cart = this.cartService.data;
    this.uiConfig.get('cart').subscribe((config: any) => this.config = config.config);
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
      case 'UPDATE_PROJECT': {
        this.cartService.updateProject(message.payload);
        break;
      }
    };
  }
}
