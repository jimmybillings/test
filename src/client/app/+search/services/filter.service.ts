import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Store, Reducer, Action } from '@ngrx/store';
import { ApiConfig } from '../../shared/services/api.config';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Http, RequestOptions, URLSearchParams, Response } from '@angular/http';

const initFilters: Array<any> = [];
export const filters: Reducer<any> = (state: Array<any> = initFilters, action: Action) => {
  switch (action.type) {
    case 'FILTERS.SET_FILTERS':
      return Object.assign([], action.payload);
    default:
      return state;
  }
};

@Injectable()
export class FilterService {
  public filters: Observable<any>;

  constructor(
    public http: Http,
    public store: Store<any>,
    public apiConfig: ApiConfig,
    public currentUser: CurrentUser) {
      this.filters = this.store.select('filters');
    }

  public getFilters(params: any): Observable<any> {
    let url = this.getFilterTreeUrl();
    let options = this.getFilterTreeOptions(params);
    return this.http.get(url, options).map((res: Response) => {
      this.setFilters(res.json());
      return res.json();
    });
  }

  public setFilters(filters: any): void {
    this.store.dispatch({type: 'FILTERS.SET_FILTERS', payload: filters});
  }

  public getFilterTreeUrl(): string {
    if (this.currentUser.loggedIn()) {
      return `${this.apiConfig.baseUrl()}api/assets/v1/filter/filterTree`;
    } else {
      return `${this.apiConfig.baseUrl()}api/assets/v1/filter/anonymous/filterTree`;
    };
  }

  public getFilterTreeOptions(params: any): RequestOptions {
    let search: URLSearchParams = new URLSearchParams();
    for (let param in params) {search.set(param, params[param]);};
    if (this.currentUser.loggedIn()) {
      let headers = this.apiConfig.authHeaders();
      return new RequestOptions({headers, search});
    } else {
      search.set('siteName', this.apiConfig.getPortal());
      return new RequestOptions({search});
    }
  }

  public mapFilters(filters: any): Array<string> {
    return filters.subFilters.map((filter: any) => {
      return filter.subFilters ? this.mapFilters(filter) : filter;
    });
  }
}
