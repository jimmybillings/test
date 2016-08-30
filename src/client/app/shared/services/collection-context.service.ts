import { Injectable } from '@angular/core';
import { Store, Reducer, Action } from '@ngrx/store';
import { Observable }  from 'rxjs/observable';

const collectionOptionsState: any = {
  currentFilter: { 'id': 0, 'label': 'ALL', 'value': 'all', 'active': true, 'access': {'access-level': 'all'} },
  currentSort: { 'id': 0, 'label': 'DATE_MOD_NEWEST', 'value': 'modNewest', 'active': true, 'sort': { 's': 'lastUpdated', 'd': true }},
  currentSearchQuery: {'q': ''}
};

export const collectionOptions: Reducer<any> = (state = collectionOptionsState, action: Action) => {
  switch (action.type) {
    case 'UPDATE_OPTIONS':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class CollectionContextService {
  public data: Observable<any>;

  constructor(public store: Store<any>) {
    this.data = store.select('collectionOptions');
  }

  public updateCollectionOptions(options: any): void {
    this.store.dispatch({ type: 'UPDATE_OPTIONS', payload: options });
  }
}
