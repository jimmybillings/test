import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Observable } from 'rxjs/Rx';
import { ActionReducer, Action, Store } from '@ngrx/store';

export const order: ActionReducer<any> = (state: any, action: Action) => {
  switch (action.type) {
    case 'ORDER.SET_CURRENT_ORDER':
      return Object.assign({}, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class OrderService {
  public data: Observable<any>;

  constructor(private api: ApiService, private store: Store<any>) {
    this.data = this.store.select('order');
  }

  public getOrder(orderId: number): void {
    this.api.get(`/api/orders/v1/order/${orderId}`).map(res => {
      return res.json();
    }).take(1).subscribe((data) => {
      this.store.dispatch({ type: 'ORDER.SET_CURRENT_ORDER', payload: data });
    });
  }
}
