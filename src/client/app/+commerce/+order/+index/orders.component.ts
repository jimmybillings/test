import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../../shared/services/orders.service';
import { OrdersUrlParams } from '../../../shared/interfaces/cart.interface';

@Component({
  moduleId: module.id,
  selector: 'orders-component',
  templateUrl: 'orders.html'
})

export class OrdersComponent implements OnInit {
  public itemSearchIsShowing: boolean = false;
  public ordersPerPage: string = '20';
  private params: any;
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
    this.buildRouteParams({ i });
    this.router.navigate(['/commerce/orders', this.params]);
  }

  public search(query: { q: string }) {
    this.buildRouteParams(Object.assign(query, { i: 1 }));
    this.router.navigate(['/commerce/orders', this.params]);
  }

  private buildRouteParams(params: OrdersUrlParams) {
    this.params = Object.assign({}, this.params, { n: this.ordersPerPage }, params);
  }

}
