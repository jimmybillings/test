import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { CurrentUser } from '../../shared/services/current-user.model';
import { ApiService } from '../../shared/services/api.service';
import { Api } from '../../shared/interfaces/api.interface';
import { ActiveFilters } from '../interfaces/filters.interface';

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
  private filterState: any;

  constructor(private api: ApiService, private store: Store<any>, private currentUser: CurrentUser) {
    this.filterState = {};
    this.data = this.store.select('filters');
  }

  public load(params: any, counted: boolean): Observable<any> {
    let options = JSON.parse(JSON.stringify(Object.assign({}, params, { counted })));

    return this.api.get(
      Api.Assets,
      this.currentUser.loggedIn() ? 'filter/filterTree' : 'filter/anonymous/filterTree',
      { parameters: options, loading: false }
    ).do(response => {
      this.set(this.sanitize(response, null));
      this.checkLocalStorage(response);
    });
  }

  public clear() {
    this.set(this.clearValues());
  }

  public toggle(filterId: number) {
    this.set(this.toggleValue(filterId));
  }

  public addCustom(filter: any, value: any) {
    this.set(this.addCustomValue(filter, value));
  }

  public toggleExclusive(subFilter: any) {
    this.set(this.toggleExclusiveValue(subFilter));
  }

  public getActive() {
    let active: ActiveFilters = { filters: [], ids: [], values: [] };
    this.activeFilters(active.filters);
    active.ids = active.filters.map((filter: any) => filter.filterId);
    active.values = active.filters.filter((filter: any) => filter.filterValue)
      .map((filter: any) => `${filter.filterId}:${filter.filterValue}`);
    return active;
  }

  //
  // ----------- END OF PUBLIC INTERFACE ----------- //
  //
  private set(filters: any): void {
    this.store.dispatch({ type: 'FILTERS.SET_FILTERS', payload: filters });
  }

  private sanitize(filter: any, parent: any) {
    if (parent) filter.parentId = parent.filterId;
    if (filter.subFilters) {
      filter.expanded = false;
      for (var l of filter.subFilters) this.sanitize(l, filter);
      return filter;
    }
    return filter;
  }

  private activeFilters(activeFilters: any, filter = this.filters) {
    if (filter.subFilters) {
      for (var l of filter.subFilters) this.activeFilters(activeFilters, l);
      return filter;
    } else {
      if (filter.active) activeFilters.push(filter);
      return filter;
    }
  }

  private checkLocalStorage(filterTree: any): void {
    if (!localStorage.getItem('filterState')) {
      localStorage.setItem('filterState', JSON.stringify(this.setFilterStateInLocalStorage(filterTree)));
    }
  }

  private setFilterStateInLocalStorage(filterTree: any): any {
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

  private clearValues(filter = this.filters) {
    if (filter.subFilters) {
      for (var l of filter.subFilters) this.clearValues(l);
      return filter;
    } else {
      if (filter.active) filter.active = false;
      filter.filterValue = null;
      return filter;
    }
  }

  private toggleExclusiveValue(subFilter: any, filter = this.filters): void {
    if (filter.subFilters) {
      if (filter.filterId === subFilter.parentId) {
        for (let f of filter.subFilters) f.active = (f.filterId === subFilter.filterId) ? !f.active : false;
      }
      for (var l of filter.subFilters) this.toggleExclusiveValue(subFilter, l);
      return filter;
    }
    return filter;
  }

  private addCustomValue(currentFilter: any, value: any, filter = this.filters): void {
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

  private toggleValue(currentFilter: any, filter = this.filters) {
    if (filter.filterId === currentFilter) {
      if (filter.active) filter.filterValue = null;
      filter.active = !filter.active;
      filter = JSON.parse(JSON.stringify(filter));
    }
    if (filter.subFilters) {
      for (var l of filter.subFilters) this.toggleValue(currentFilter, l);
      return filter;
    }
  }

  private get filters() {
    let filters: any = {};
    this.data.take(1).subscribe(f => filters = f);
    return filters;
  }
}
