import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersResolver implements Resolve<any> {

  constructor(
    private ordersService: OrdersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.ordersService.getOrders(route.params);
  }
}
