import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService } from '../services/api.service';
import { Api } from '../interfaces/api.interface';
import { OrderStore } from '../stores/order.store';
import { Order } from '../interfaces/cart.interface';

@Injectable()
export class OrderService {
  constructor(private api: ApiService, private store: OrderStore) { }

  public get data(): Observable<any> {
    return this.store.data;
  }

  public get state(): Order {
    return this.store.state;
  }

  public getOrder(orderId: number): Observable<any> {
    return this.api.get(Api.Orders, `order/${orderId}`)
      .do(response => this.store.update(response));
  }
}
