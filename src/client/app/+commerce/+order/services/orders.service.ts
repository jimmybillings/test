import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../../shared/services/api.service';
import { Api } from '../../../shared/interfaces/api.interface';
import { OrdersStore } from './orders.store';

@Injectable()
export class OrdersService {
  private params: any;

  constructor(
    private api: ApiService,
    private store: OrdersStore) {}

  public get data(): Observable<OrdersStore> {
    return this.store.data;
  }

  public getOrders(params:any): Observable<any> {
    if (params['i']) params['i'] -= 1;
    this.params = Object.assign({}, this.getSearchParams(), params);
    return this.api.get(Api.Orders, 'order/myOrders', { parameters: this.params, loading: true })
      .do(response => this.store.storeOrders(response));
  }

  private getSearchParams() {
    return { q: '', s: '', d: '', i: 0, n: 20 };
  }
}
