import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Observable }  from 'rxjs/Rx';

const collectionOptionsState: any = {
  currentFilter: { 'id': 0, 'label': 'ALL', 'value': 'all', 'active': true, 'access': {'accessLevel': 'all'} },
  currentSort: { 'id': 0, 'label': 'DATE_MOD_NEWEST', 'value': 'modNewest', 'active': true, 'sort': { 's': 'lastUpdated', 'd': true }},
  currentSearchQuery: {'q': ''}
};

export const collectionOptions: ActionReducer<any> = (state = collectionOptionsState, action: Action) => {
  switch (action.type) {
    case 'RESET_OPTIONS':
      return Object.assign({}, action.payload);
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

  public resetCollectionOptions(): void {
    this.store.dispatch({ type: 'RESET_OPTIONS', payload: collectionOptionsState });
  }
}
