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
  constructor(
    public http: Http,
    public store: Store<any>,
    public apiConfig: ApiConfig,
    public currentUser: CurrentUser) {
    this.data = this.store.select('filters');
  }

  public get filters() {
    let filters: any = {};
    this.data.take(1).subscribe(f => filters = f);
    return filters;
  }

  public get(params: any): Observable<any> {
    params['counted'] = true;
    let options = this.filterOptions(params);
    return this.http.get(this.filterUrl, options).map((res: Response) => {
      this.set(this.mapFilters(res.json(), null));
      return res.json();
    });
  }

  public set(filters: any): void {
    this.store.dispatch({ type: 'FILTERS.SET_FILTERS', payload: filters });
  }

  public mapFilters(filter: any, parent: any) {
    filter.parent = parent;
    if (filter.active && filter.parent) this.makeParentActive(filter.parent);
    if (filter.subFilters) {
      filter.expanded = false;
      for (var l of filter.subFilters) this.mapFilters(l, filter);
      return filter;
    }
    return filter;
  }

  public makeParentActive(filter: any): void {
      filter.active = true;
      if (filter.parent) this.makeParentActive(filter.parent);
      return filter;
  }

  public toggleFilter(filter: any, currentFilter: any) {
    if (filter.filterId === currentFilter) filter.active = !filter.active;
    if (filter.subFilters) {
      for (var l of filter.subFilters) this.toggleFilter(l, currentFilter);
      return filter;
    }
  }

  public toggleExclusiveFilter(filter: any, subFilter: any): void {
    if (filter.subFilters) {
      if (filter.filterId === subFilter.parent.filterId) {
        for (let f of filter.subFilters) f.active = (f.filterId === subFilter.filterId) ? !f.active : false;
      }
      for (var l of filter.subFilters) this.toggleExclusiveFilter(l, subFilter);
      return filter;
    }
    return filter;
  }

  public findActive(filter: any, activeFilters: any) {
    if (filter.subFilters) {
      for (var l of filter.subFilters) this.findActive(l, activeFilters);
      return filter;
    } else {
      if (filter.active) activeFilters.push(filter);
      return filter;
    }
  }

  public clearActive(filter: any) {
    if (filter.subFilters) {
      for (var l of filter.subFilters) this.clearActive(l);
      return filter;
    } else {
      if (filter.active) {
        filter.active = false;
      }
      return filter;
    }
  }

  public updateCustomValue(filter: any, currentFilter: any, value: any): void {
    if (filter.subFilters) {
      for (let f of filter.subFilters) this.updateCustomValue(f, currentFilter, value);
      return filter;
    } else {
      if (filter.filterId === currentFilter.filterId) {
        filter.active = true;
        filter.filterValue = value;
      }
      return filter;
    }
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
}
