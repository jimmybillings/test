import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from '../services/orders.service';
import { OrdersUrlParams } from '../../+cart/cart.interface';

@Component({
  moduleId: module.id,
  selector: 'orders-component',
  templateUrl: 'orders.html'
})

export class OrdersComponent {
  public itemSearchIsShowing: boolean = false;

  constructor(
    public orders: OrdersService,
    private router: Router) { }

  public toggleShowOrderSearch() {
    this.itemSearchIsShowing = !this.itemSearchIsShowing;
  }

  public changePage(i: string): void {
    this.router.navigate(['/orders', this.buildRouteParams({ i, n: '20'}) ]);
  }

  private buildRouteParams(params: OrdersUrlParams): OrdersUrlParams {
    return Object.assign({}, params);
  }
}
