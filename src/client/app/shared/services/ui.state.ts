import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Rx';
import { Store, Reducer, Action} from '@ngrx/store';

const InitUiState: any = {
  collectionsListIsOpen: false,
  newCollectionFormIsOpen: false,
  binTrayIsOpen: false,
  searchIsOpen: true
};

export const uiState: Reducer<any> = (state = InitUiState, action: Action) => {

  switch (action.type) {
    case 'UI.STATE.INITIALIZE':
      return Object.assign({}, state);
    case 'UI.STATE.UPDATE':
      return Object.assign({}, state, action.payload);
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
    console.log(this.store.getState());
  }

  public closeCollectionsList() {
    this.update({ collectionsListIsOpen: false });
  }

}
