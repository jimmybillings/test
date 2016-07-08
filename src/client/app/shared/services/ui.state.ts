import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Rx';
import { Store, Reducer, Action} from '@ngrx/store';

const InitUiState: any = {
  collectionsListIsOpen: false,
  newCollectionFormIsOpen: false,
  binTrayIsOpen: false,
  searchIsOpen: true,
  searchBarIsActive: false,
  showFixed: false
};

export const uiState: Reducer<any> = (state = InitUiState, action: Action) => {

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
  public uiState: Observable<any>;

  constructor(public store: Store<any>) {
    this.uiState = this.store.select('uiState');
  }

  public reset() {
    this.store.dispatch({ type: 'UI.STATE.RESET', payload: InitUiState });
  }

  public update(payload: Object) {
    this.store.dispatch({ type: 'UI.STATE.UPDATE', payload: payload });
  }

  public closeBinTray() {
    this.update({ binTrayIsOpen: false });
  }

  public openBinTray() {
    this.update({ binTrayIsOpen: true });
  }

  public openSearch() {
    this.update({ searchIsOpen: true });
  }

  public closeSearch() {
    this.update({ searchIsOpen: false });
  }

  public showCollectionsList() {
    this.update({ collectionsListIsOpen: true });
  }

  public closeCollectionsList() {
    this.update({ collectionsListIsOpen: false });
  }

  public closeNewCollection(): void {
    this.update({ newCollectionFormIsOpen: false });
  }

  public showNewCollection(): void {
    this.update({ newCollectionFormIsOpen: true });
  }

  public checkRouteForSearchBar(currentState: string) {
    if (currentState === '/') {
      this.update({ searchBarIsActive: false });
      return;
    }
    let showSearchBar = ['user', 'admin', 'notification']
      .filter((state) => currentState.indexOf(state) > -1).length === 0;
    this.update({ searchBarIsActive: showSearchBar });
  }

  public showFixedHeader(offset: any) {
    let isfixed: boolean = this.store.getState().uiState.showFixed;
    let setFixed: boolean = (offset > 111) ? true : false;
    if (setFixed !== isfixed) this.update({ showFixed: !isfixed });
  }
}
