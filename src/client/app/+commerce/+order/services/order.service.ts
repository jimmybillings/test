import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { Api } from '../../../shared/interfaces/api.interface';
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

  public getOrder(orderId: number): Observable<any> {
    return this.api.get2(Api.Orders, `order/${orderId}`)
      .do(response => this.update(response));
  }

  private update(data: any): void {
    this.store.dispatch({ type: 'ORDER.SET_CURRENT_ORDER', payload: data });
  }
}
