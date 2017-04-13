import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { OrdersService } from '../../../shared/services/orders.service';
import { Orders } from '../../../shared/interfaces/commerce.interface';

@Injectable()
export class OrdersResolver implements Resolve<Orders> {
  constructor(
    private ordersService: OrdersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Orders> {
    return this.ordersService.getOrders(JSON.parse(JSON.stringify(route.params)));
  }
}
