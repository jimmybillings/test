import { Injectable } from '@angular/core';
import { CurrentUser } from './current-user.model';
import { Store, Reducer, Action } from '@ngrx/store';
import { Observable } from 'Rxjs/rx';

const defaultPreferences: any = {
  filterCounts: false
};

export const userPreferences: Reducer<any> = (state = defaultPreferences, action: Action) => {
  switch (action.type) {
    case 'UPDATE_PREFERENCES':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class UserPreferenceService {
  public data: Observable<any>;

  constructor(public currentUser: CurrentUser, public store: Store<any>) {
    this.data = this.store.select('userPreferences');
  }

  public get filterCounts(): Observable<any> {
    return this.data.map(d => {
      return d.filterCounts;
    });
  }

  public update(params: any): void {
    this.store.dispatch({ type: 'UPDATE_PREFERENCES', payload: params });
  }
}
