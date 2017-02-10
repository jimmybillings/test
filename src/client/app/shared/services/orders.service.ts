import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from './api.service';
import { Api } from '../interfaces/api.interface';
import { OrdersStore } from '../stores/orders.store';

@Injectable()
export class OrdersService {

  constructor(
    private api: ApiService,
    private store: OrdersStore) { }

  public get data(): Observable<OrdersStore> {
    return this.store.data;
  }

  public getOrders(params: any): Observable<any> {
    return this.api.get(Api.Orders, 'order/myOrders',
      { parameters: this.buildSearchParams(params), loading: true }
    ).do(response => this.store.storeOrders(response));
  }

  private buildSearchParams(params: any) {
    params['i'] = (params['i'] && params['i'] > 0) ? params['i'] - 1 : 0;
    return Object.assign({}, { q: '', s: '', d: '', i: 0, n: 20 }, params);
  }
}
