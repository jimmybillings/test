import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../../shared/services/orders.service';
import { OrdersUrlParams } from '../../../shared/interfaces/cart.interface';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'orders-component',
  templateUrl: 'orders.html'
})

export class OrdersComponent implements OnInit {
  public ordersPerPage: string = '20';
  private params: any;
  constructor(
    public ordersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ordersPerPage = params['n'] || '20';
    });
  }

  public get orders(): Observable<any> {
    return this.ordersService.data;
  }

  public changePage(i: string): void {
    this.buildRouteParams({ i });
    this.router.navigate(['/commerce/orders', this.params]);
  }

  public onSearch(query: { q: string }) {
    this.ordersService.getOrders(query).subscribe();
  }

  private buildRouteParams(params: OrdersUrlParams) {
    this.params = Object.assign({}, this.params, { n: this.ordersPerPage }, params);
  }

}
