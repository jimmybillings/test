import { Injectable } from '@angular/core';
import { CurrentUser } from './current-user.model';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { ApiService } from './api.service';

const defaultPreferences: any = {
  filterCounts: false,
  sorts: [],
  currentSort: {}
};

export const userPreferences: ActionReducer<any> = (state = defaultPreferences, action: Action) => {
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

  constructor(
    public currentUser: CurrentUser,
    public store: Store<any>,
    public api: ApiService) {
      this.data = this.store.select('userPreferences');
  }

  public get prefs(): Observable<any> {
    return this.data.map(d => {
      return d;
    });
  }

  public get state(): any {
    let s: any;
    this.data.take(1).subscribe(state => s = state);
    return s;
  }

  public update(params: any): void {
    this.store.dispatch({ type: 'UPDATE_PREFERENCES', payload: params });
  }

  public getSortOptions(): Observable<any> {
    return this.api.get('api/identities/v1/sortDefinition/list')
      .map(res => res.json());
  }
}
