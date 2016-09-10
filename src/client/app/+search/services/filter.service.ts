import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { ApiConfig } from '../../shared/services/api.config';
import { CurrentUser } from '../../shared/services/current-user.model';
import { Http, RequestOptions, URLSearchParams, Response } from '@angular/http';

const initFilters: any = {};
export const filters: ActionReducer<any> = (state: Array<any> = initFilters, action: Action) => {
  switch (action.type) {
    case 'FILTERS.SET_FILTERS':
      return Object.assign({}, JSON.parse(JSON.stringify(action.payload)));
    default:
      return state;
  }
};

@Injectable()
export class FilterService {
  public data: Observable<any>;
  public filterState: any;
  constructor(
    public http: Http,
    public store: Store<any>,
    public apiConfig: ApiConfig,
    public currentUser: CurrentUser) {
    this.filterState = {};
    this.data = this.store.select('filters');
  }

  public get(params: any, counted: boolean): Observable<any> {
    let options = this.filterOptions(JSON.parse(JSON.stringify(Object.assign({}, params, {counted}))));
    return this.http.get(this.filterUrl, options).map((res: Response) => {
      this.set(this.sanatize(res.json(), null));
      this.checkLocalStorage(res.json());
      return res.json();
    });
  }

  public set(filters: any): void {
    this.store.dispatch({ type: 'FILTERS.SET_FILTERS', payload: filters });
  }

  public sanatize(filter: any, parent: any) {
    if (parent) filter.parentId = parent.filterId;
    if (filter.subFilters) {
      filter.expanded = false;
      for (var l of filter.subFilters) this.sanatize(l, filter);
      return filter;
    }
    return filter;
  }

  public toggle(currentFilter: any, filter=this.filters) {
    if (filter.filterId === currentFilter) {
      filter.active = !filter.active;
      filter = JSON.parse(JSON.stringify(filter));
    }
    if (filter.subFilters) {
      for (var l of filter.subFilters) this.toggle(currentFilter, l);
      return filter;
    }
  }

  public toggleExclusive( subFilter: any, filter=this.filters): void {
    if (filter.subFilters) {
      if (filter.filterId === subFilter.parentId) {
        for (let f of filter.subFilters) f.active = (f.filterId === subFilter.filterId) ? !f.active : false;
      }
      for (var l of filter.subFilters) this.toggleExclusive(subFilter, l);
      return filter;
    }
    return filter;
  }

  public active(activeFilters: any, filter=this.filters) {
    if (filter.subFilters) {
      for (var l of filter.subFilters) this.active(activeFilters, l);
      return filter;
    } else {
      if (filter.active) activeFilters.push(filter);
      return filter;
    }
  }

  public clear(filter=this.filters) {
    if (filter.subFilters) {
      for (var l of filter.subFilters) this.clear(l);
      return filter;
    } else {
      if (filter.active) filter.active = false;
      return filter;
    }
  }

  public addCustomValue(currentFilter: any, value: any, filter=this.filters): void {
    if (filter.subFilters) {
      for (let f of filter.subFilters) this.addCustomValue(currentFilter, value, f);
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
      return new RequestOptions({ headers, search, body: '' });
    } else {
      let headers = this.apiConfig.headers();
      search.set('siteName', this.apiConfig.getPortal());
      return new RequestOptions({ search, body: '', headers });
    }
  }

  public checkLocalStorage(filterTree: any): void {
    if (!localStorage.getItem('filterState')) {
      localStorage.setItem('filterState', JSON.stringify(this.setFilterStateInLocalStorage(filterTree)));
    }
  }

  public setFilterStateInLocalStorage(filterTree: any): any {
    if (filterTree.subFilters) {
      for (let f of filterTree.subFilters) {
        if (f.type === 'None' || f.type === 'List') {
          this.filterState[f.name] = false;
        }
        this.setFilterStateInLocalStorage(f);
      }
    }
    return this.filterState;
  }

  private get filters() {
    let filters: any = {};
    this.data.take(1).subscribe(f => filters = f);
    return filters;
  }
}
