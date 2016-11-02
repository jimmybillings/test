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

  public getOrders(params:any): Observable<any> {
    console.log((parseFloat(params['i']) - 1).toString());
    // if (params['i']) params['i'] = (parseFloat(params['i']) - 1).toString();
    return this.api.get(Api.Orders, 'order/myOrders', { parameters: params, loading: true })
      .do(response => this.store.storeOrders(response));
  }
}
