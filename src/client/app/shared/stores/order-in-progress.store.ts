import { Store, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export function orderInProgress(state: any, action: Action) {
  switch (action.type) {
    case 'ORDER_IN_PROGRESS.UPDATE':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

@Injectable()
export class OrderInProgressStore {
  constructor(private store: Store<any>) { }

  public get data(): Observable<any> {
    return this.store.select('orderInProgress');
  }
}
