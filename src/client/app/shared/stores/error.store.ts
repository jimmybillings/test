import { Injectable } from '@angular/core';
import { ActionReducer, Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export function errorStore(state = {}, action: Action) {
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
