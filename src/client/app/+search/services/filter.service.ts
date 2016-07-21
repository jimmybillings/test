import { Observable } from 'rxjs/Rx';
import { Injectable, OnInit } from '@angular/core';
import { ApiConfig } from '../../shared/services/api.config';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Http, RequestOptions, URLSearchParams, Response } from '@angular/http';
import { Store, Reducer, Action } from '@ngrx/store';

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
export class FilterService implements OnInit {
  public filters: Observable<any>;

  constructor(
    public apiConfig: ApiConfig,
    public http: Http,
    public currentUser: CurrentUser,
    public store: Store<any>) {
      this.filters = this.store.select('filters');
    }

  ngOnInit() {
    this.getFilters();
  }

  public setFilters(filters: any): void {
    this.store.dispatch({type: 'FILTERS.SET_FILTERS', payload: filters});
  }

  public getFilters(): Observable<any> {
    let url = this.getFilterTreeUrl();
    let options = this.getFilterTreeOptions({q: 'cat', counted: true});
    return this.http.get(url, options).map((res: Response) => {
      this.setFilters(this.mapFilters(res.json()));
      return res.json();
    });
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
      return filter.subFilters ? this.mapFilters(filter) : filter.type;
    });
  }
}
