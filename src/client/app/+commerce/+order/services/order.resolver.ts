import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { OrderService } from '../../../shared/services/order.service';
import { OrderStore } from '../../../shared/stores/order.store';

@Injectable()
export class OrderResolver implements Resolve<any> {
  constructor(private orderService: OrderService, private orderStore: OrderStore) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    if (Number(this.orderStore.state.id) === Number(route.params['orderId'])) {
      return Observable.of(true);
    } else {
      return this.orderService.getOrder(route.params['orderId']);
    }
  }
}
