import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Store, Reducer, Action } from '@ngrx/store';
import { ApiConfig } from '../../shared/services/api.config';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Http, RequestOptions, URLSearchParams, Response } from '@angular/http';

const initFilters: any = {};
export const filters: Reducer<any> = (state: Array<any> = initFilters, action: Action) => {
  switch (action.type) {
    case 'FILTERS.SET_FILTERS':
      return Object.assign({}, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class FilterService {
  public data: Observable<any>;
  public filters: any;
  constructor(
    public http: Http,
    public store: Store<any>,
    public apiConfig: ApiConfig,
    public currentUser: CurrentUser) {
    this.data = this.store.select('filters');
  }

  public get(params: any): Observable<any> {
    params['counted'] = true;
    let options = this.filterOptions(params);
    return this.http.get(this.filterUrl, options).map((res: Response) => {
      params.filterIds = (params.filterIds) ? params.filterIds.split(',').map(Number) : [];
      this.filters = res.json();
      this.filters.activeFilters = [];
      console.log(this.mapFilters(this.filters, params.filterIds));
      this.set(this.mapFilters(this.filters, params.filterIds));
      this.data.take(1).subscribe(d => console.log(d));
      return this.filters;
    });
  }

  public set(filters: any): void {
    this.store.dispatch({ type: 'FILTERS.SET_FILTERS', payload: filters });
  }

  public get filterUrl(): string {
    if (this.currentUser.loggedIn()) {
      return `${this.apiConfig.baseUrl()}api/assets/v1/filter/filterTree`;
    } else {
      return `${this.apiConfig.baseUrl()}api/assets/v1/filter/anonymous/filterTree`;
    };
  }

  public filterOptions(params: any): RequestOptions {
    let search: URLSearchParams = new URLSearchParams();
    for (let param in params) { search.set(param, params[param]); };
    if (this.currentUser.loggedIn()) {
      let headers = this.apiConfig.authHeaders();
      return new RequestOptions({ headers, search });
    } else {
      search.set('siteName', this.apiConfig.getPortal());
      return new RequestOptions({ search });
    }
  }

  public mapFilters(filter: any, activeFilters: any) {
    if (filter.subFilters) {
      filter.expanded = true;
      for (var l of filter.subFilters) this.mapFilters(l, activeFilters);
      return filter;
    } else {
      // if (filter.active) this.filters.activeFilters.push(filter);
      return filter;
    }
  }
}
