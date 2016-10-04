import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Rx';
import { Store, ActionReducer, Action} from '@ngrx/store';

const InitUiState: any = {
  collectionsListIsOpen: false,
  collectionsSortIsOpen: false,
  collectionsFilterIsOpen: false,
  headerIsExpanded: false,
  showFixed: false,
  loading: false
};

export const uiState: ActionReducer<any> = (state = InitUiState, action: Action) => {

  switch (action.type) {
    case 'UI.STATE.INITIALIZE':
      return Object.assign({}, state);
    case 'UI.STATE.UPDATE':
      return Object.assign({}, state, action.payload);
    case 'UI.STATE.RESET':
      return Object.assign({}, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class UiState {
  public data: Observable<any>;

  constructor(public store: Store<any>) {
    this.data = this.store.select('uiState');
  }

  public reset(): void {
    this.store.dispatch({ type: 'UI.STATE.RESET', payload: InitUiState });
  }

  public update(payload: Object): void {
    this.store.dispatch({ type: 'UI.STATE.UPDATE', payload: payload });
  }

  public showCollectionsList(): void {
    this.update({ collectionsListIsOpen: true });
  }

  public closeCollectionsList(): void {
    this.update({ collectionsListIsOpen: false });
  }

  public loading(state: boolean): void {
    this.data.take(1).subscribe(s => this.update({ loading: state}));
  }

  public headerIsExpanded(): Observable<boolean> {
    return this.data.map(data => data.headerIsExpanded);
  }

  public checkRouteForSearchBar(currentState: string): void {
    if (currentState === '/') {
      this.update({ headerIsExpanded: false });
      return;
    }
    let showSearchBar = ['user', 'admin', 'notification']
      .filter((state) => currentState.indexOf(state) > -1).length === 0;
    this.update({ headerIsExpanded: showSearchBar });
  }

  public showFixedHeader(offset: any): void {
    let isfixed: boolean;
    this.data.take(1).subscribe(state => isfixed = state.showFixed);
    let setFixed: boolean = (offset > 111) ? true : false;
    if (setFixed !== isfixed) this.update({ showFixed: !isfixed });
  }
}
