import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, ActionReducer, Action } from '@ngrx/store';

export const InitUiState: any = {
  headerIsExpanded: false,
  showFixedHeader: false,
  loadingIndicator: false,
  filtersAreAvailable: false
};

export function uiState(state = InitUiState, action: Action) {

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

  public loadingIndicator(state: boolean): void {
    this.data.take(1).subscribe(s => this.update({ loadingIndicator: state }));
  }

  public headerIsExpanded(): Observable<boolean> {
    return this.data.map(data => data.headerIsExpanded);
  }

  public checkRouteForSearchBar(currentState: string): void {
    if (currentState === '/') {
      this.update({ headerIsExpanded: false });
      return;
    }
    let showSearchBar = ['user/forgot-password', 'user/register', 'user/login', 'user/reset-password', 'notification']
      .filter((state) => currentState.indexOf(state) > -1).length === 0;
    this.update({ headerIsExpanded: showSearchBar });
  }

  public checkForFilters(currentState: string) {
    if (this.state.headerIsExpanded === false) {
      this.update({ filtersAreAvailable: false });
      return;
    }
    let showFilters = currentState.indexOf('search') > -1 && currentState.indexOf('gq=') < 0;
    this.update({ filtersAreAvailable: showFilters });
  }

  public showFixedHeader(offset: any): void {
    let isfixed: boolean;
    this.data.take(1).subscribe(state => isfixed = state.showFixedHeader);
    let setFixed: boolean = (offset > 111) ? true : false;
    if (setFixed !== isfixed) this.update({ showFixedHeader: !isfixed });
  }

  private get state(): any {
    let s: any;
    this.data.take(1).subscribe(state => s = state);
    return s;
  }
}
