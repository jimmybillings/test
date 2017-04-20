import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';
import { Api } from '../interfaces/api.interface';
import { OrdersState, Orders } from '../interfaces/commerce.interface';
import { UrlParams } from '../interfaces/common.interface';
import { OrdersStore } from '../stores/orders.store';

@Injectable()
export class OrdersService {

  constructor(
    private api: ApiService,
    private store: OrdersStore) { }

  public get data(): Observable<OrdersState> {
    return this.store.data;
  }

  public getOrders(params: UrlParams): Observable<Orders> {
    return this.api.get(Api.Orders, 'order/myOrders',
      { parameters: this.buildSearchParams(params), loading: true }
    ).do(response => this.store.storeOrders(response));
  }

  private buildSearchParams(params: UrlParams) {
    params.i = (params.i && params.i > 0) ? params.i - 1 : 0;
    return Object.assign({}, { q: '', s: '', d: '', i: 0, n: 20 }, params);
  }
}
