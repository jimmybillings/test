import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { CartService } from '../../services/cart.service';
import { UiConfig } from '../../../shared/services/ui.config';

@Component({
  moduleId: module.id,
  selector: 'cart-tab-component',
  templateUrl: 'cart-tab.html'
})

export class CartTabComponent implements OnInit {
  @Output() tabNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public cart: Observable<any>;
  public config: any;

  constructor(private cartService: CartService, private uiConfig: UiConfig) {}

  public ngOnInit(): void {
    this.cart = this.cartService.data;
    this.uiConfig.get('cart').subscribe((config: any) => this.config = config.config);
  }

  public goToNextTab(): void {
    this.tabNotify.emit({ type: 'GO_TO_NEXT_TAB' });
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
      case 'MOVE_LINE_ITEM': {
        this.cartService.moveLineItemTo(message.payload.otherProject, message.payload.lineItem);
        break;
      }
      case 'CLONE_LINE_ITEM': {
        this.cartService.cloneLineItem(message.payload);
        break;
      }
      case 'REMOVE_LINE_ITEM': {
        this.cartService.removeLineItem(message.payload);
        break;
      }
    };
  }
}
