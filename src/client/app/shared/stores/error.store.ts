import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { LegacyAction } from '../interfaces/common.interface';

export function errorStore(state = {}, action: LegacyAction) {
  switch (action.type) {
    case 'UPDATE_ERROR':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class ErrorStore {
  constructor(private store: Store<any>) { }

  public get data(): Observable<any> {
    return this.store.select('errorStore');
  }

  public dispatch(error: any): void {
    this.store.dispatch({ type: 'UPDATE_ERROR', payload: error });
  }
}
