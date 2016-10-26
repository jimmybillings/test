import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { Api } from '../../../shared/interfaces/api.interface';
import { Observable } from 'rxjs/Rx';
import { ActionReducer, Action } from '@ngrx/store';
import { OrderStore } from './order.store';

@Injectable()
export class OrderService {
  public data: Observable<any>;

  constructor(private api: ApiService, private store: OrderStore) {
    this.data = this.store.data;
  }

  public getOrder(orderId: number): Observable<any> {
    return this.api.get(Api.Orders, `order/${orderId}`)
      .do(response => this.store.update(response));
  };
}
