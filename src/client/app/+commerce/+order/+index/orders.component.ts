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
  public options: any;
  public itemSearchIsShowing: boolean = false;
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

  // public search(query: any) {
  //   this.collectionContext.updateCollectionOptions({ currentSearchQuery: query });
  //   this.orders.load(query, true).take(1).subscribe();
  // }

  public toggleShowOrderSearch() {
    this.itemSearchIsShowing = !this.itemSearchIsShowing;
  }






  public buildRouteParams(params: OrdersUrlParams): void {
    let i: string, n: string;
    i = params['i'] || '1';
    n = params['n'] || '20';
    this.params = { i, n };
    // console.log(this.params);
  }

  public routeChanges(): Subscription {
    return this.route.params.subscribe(params => {
      this.buildRouteParams(params);
    });
  }

  public changePage(i: string): void {
    // console.log(i);
    this.updateRouteParams({ i });
    // console.log(this.params);
    this.router.navigate(['/orders', this.params ]);
  }

  private updateRouteParams(dynamicParams: OrdersUrlParams) {
    // console.log(dynamicParams);
    // console.log(this.params);
    return Object.assign(this.params, dynamicParams);
  }
}
