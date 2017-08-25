import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { OrderService } from '../../../shared/services/order.service';
import { OrderStore } from '../../../shared/stores/order.store';
import { Order } from '../../../shared/interfaces/commerce.interface';

@Injectable()
export class OrderResolver implements Resolve<Order> {
  constructor(private orderService: OrderService, private orderStore: OrderStore) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> | Observable<any> {
    if (Number(this.orderStore.state.id) === Number(route.params['orderId'])) {
      return Observable.of({});
    } else {
      return this.orderService.getOrder(route.params['orderId']);
    }
  }
}
