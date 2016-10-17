import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { OrderService } from './order.service';

@Injectable()
export class OrderResolver implements Resolve<any> {
  constructor(private orderService: OrderService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    // need to figure out how we are actually retrieving thr order
    // it seems wrong to be using the id. maybe a unique identifier?
    return this.orderService.getOrder(route.params['orderId']);
  }
}
