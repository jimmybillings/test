import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { Tab } from './tab';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'confirm-tab-component',
  templateUrl: 'confirm-tab.html'
})

export class ConfirmTabComponent extends Tab implements OnInit, OnDestroy {
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
}
