import { ActionReducer, Action, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Order } from '../interfaces/cart.interface';

const initState: any = { id: 1, projects: [], orderStatus: '', orderType: '' };
export function order(state: any = initState, action: Action) {
  switch (action.type) {
    case 'ORDER.SET_CURRENT_ORDER':
      return Object.assign({}, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class OrderStore {
  constructor(private store: Store<any>) { }

  public get data(): Observable<any> {
    return this.store.select('order');
  }

  public get state(): Order {
    let state: any;
    this.data.take(1).subscribe(order => state = order);
    return state;
  }

  public update(data: any): void {
    this.store.dispatch({ type: 'ORDER.SET_CURRENT_ORDER', payload: data });
  }
}
