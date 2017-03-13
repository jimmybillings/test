import { Component, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { Tab } from './tab';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'confirm-tab-component',
  templateUrl: 'confirm-tab.html'
})

export class ConfirmTabComponent extends Tab {
  @Output() tabNotify: EventEmitter<Object> = this.notify;

  constructor(private router: Router, public cartService: CartService) {
    super();
  }

  purchase() {
    this.cartService.purchase().subscribe((orderId: any) =>
      this.router.navigate(['/commerce/order', orderId])
      , (error: any) =>
        console.log(error)
    );
  }
}
