import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService } from '../../../shared/services/api.service';
import { Api } from '../../../shared/interfaces/api.interface';
import { OrdersStore } from './orders.store';

@Injectable()
export class OrdersService {
  constructor(
    private api: ApiService, 
    private store: OrdersStore) { }

  public get data(): Observable<OrdersStore> {
    return this.store.data;
  }
  
  public getOrders(): Observable<any> {
    return this.api.get(Api.Orders, 'order/myOrders')
      .do(response => this.store.storeOrders(response));
  }
}
