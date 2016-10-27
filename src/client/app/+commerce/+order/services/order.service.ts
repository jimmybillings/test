import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService } from '../../../shared/services/api.service';
import { Api } from '../../../shared/interfaces/api.interface';
import { OrderStore } from './order.store';

@Injectable()
export class OrderService {
  constructor(private api: ApiService, private store: OrderStore) { }

  public get data(): Observable<any> {
    return this.store.data;
  }

  public getOrder(orderId: number): Observable<any> {
    return this.api.get(Api.Orders, `order/${orderId}`)
      .do(response => this.store.update(response));
  }
}
