import { ActionReducer, Action, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

export const order: ActionReducer<any> = (state: any, action: Action) => {
  switch (action.type) {
    case 'ORDER.SET_CURRENT_ORDER':
      console.log(action.payload);
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

  public update(data: any): void {
    this.store.dispatch({ type: 'ORDER.SET_CURRENT_ORDER', payload: data });
  }
}