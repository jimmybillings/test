import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdersService } from '../services/orders.service';
import { OrdersUrlParams } from '../../+cart/cart.interface';

@Component({
  moduleId: module.id,
  selector: 'orders-component',
  templateUrl: 'orders.html'
})

export class OrdersComponent implements OnInit {
  public itemSearchIsShowing: boolean = false;
  public ordersPerPage: string = '20';

  constructor(
    public orders: OrdersService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ordersPerPage = params['n'] || '20';
    });
  }

  public toggleShowOrderSearch() {
    this.itemSearchIsShowing = !this.itemSearchIsShowing;
  }

  public changePage(i: string): void {
    this.router.navigate(['/orders', this.buildRouteParams({ i })]);
  }

  private buildRouteParams(params: OrdersUrlParams): OrdersUrlParams {
    return Object.assign({}, {n : this.ordersPerPage}, params);
  }
}
