import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdersService } from '../services/orders.service';
import { OrdersUrlParams } from '../../+cart/cart.interface';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'orders-component',
  templateUrl: 'orders.html'
})
export class OrdersComponent implements OnInit, OnDestroy {
  public params: OrdersUrlParams;
  private routeSubscription: Subscription;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private orders: OrdersService) { }

  ngOnInit(): void {
    this.routeSubscription = this.routeChanges();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  public buildRouteParams(params: OrdersUrlParams): void {
    let i: string, n: string;
    i = params['i'] || '1';
    n = params['n'] || '20';
    this.params = { i, n };
    console.log(this.params);
  }

  public routeChanges(): Subscription {
    return this.route.params.subscribe(params => {
      this.buildRouteParams(params);

    });
  }

  public changePage(i: string): void {
    console.log(i);
    this.updateRouteParams({ i });
    this.router.navigate(['/orders', this.params ]);
  }

  private updateRouteParams(dynamicParams: OrdersUrlParams) {
    console.log(dynamicParams);
    return Object.assign(this.params, dynamicParams);
  }
}
