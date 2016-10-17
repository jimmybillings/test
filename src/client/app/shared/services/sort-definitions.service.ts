import { Store, ActionReducer, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService } from './api.service';
import { Api } from '../interfaces/api.interface';

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

  constructor(private api: ApiService, private store: Store<any>) {
    this.data = this.store.select('sortDefinitions');
  }

  public update(params: any): void {
    this.store.dispatch({ type: 'SORTS.UPDATE_DEFINITIONS', payload: params });
  }

  public getSortOptions(): Observable<any> {
    return this.api.get2(Api.Identities, 'sortDefinition/list', { loading: true });
  }
}