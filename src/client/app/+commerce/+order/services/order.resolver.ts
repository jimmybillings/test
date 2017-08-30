import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { OrderService } from '../../../shared/services/order.service';
import { AppStore } from '../../../app.store';

@Injectable()
export class OrderResolver implements Resolve<boolean> {
  constructor(private orderService: OrderService, private store: AppStore) { }

  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requestedOrderId: number = Number(route.params['orderId']);

    if (this.store.match(requestedOrderId, state => state.order.activeOrder.id)) return Observable.of(true);

    // this.store.dispatch(factory => factory.order.load(requestedOrderId));
    return this.orderService.getOrder(requestedOrderId).map(response => true);

    // return this.store.blockUntil(state => !state.order.loading);
  }
}
