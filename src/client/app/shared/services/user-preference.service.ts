import { Injectable } from '@angular/core';
import { CurrentUser } from './current-user.model';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { ApiConfig } from './api.config';

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
    public http: Http,
    public apiConfig: ApiConfig) {
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
    return this.http.get(this.apiConfig.baseUrl() + 'identities-api/v1/sortDefinition/set',
      { headers: this.apiConfig.authHeaders(), body: '' }
    ).map(res => res.json());
  }
}
