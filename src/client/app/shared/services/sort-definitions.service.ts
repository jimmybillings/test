import { Store, ActionReducer, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Rx';
import { ApiConfig } from './api.config';

const initSortState: any = {
  sorts: [],
  currentSort: {}
};

export const sortDefinitions: ActionReducer<any> = (state = initSortState, action: Action) => {
  switch (action.type) {
    case 'SORTS.UPDATE_DEFINITIONS':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class SortDefinitionsService {
  public data: Observable<any>;
  constructor(public api: ApiService,
              public apiConfig: ApiConfig,
              public store: Store<any>) {
                this.data = this.store.select('sortDefinitions');
              }

  public update(params: any): void {
    this.store.dispatch({ type: 'SORTS.UPDATE_DEFINITIONS', payload: params });
  }

  public getSortOptions(): Observable<any> {
    return this.api.get(
      this.apiConfig.baseUrl() + 'api/identities/v1/sortDefinition/list'
    ).map(res => res.json());
  }
}