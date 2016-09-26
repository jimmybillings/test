import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

const defaultPreferences: any = {
  filterCounts: false,
  binTrayIsOpen: false,
  searchIsOpen: true
};

export const userPreferences: ActionReducer<any> = (state = defaultPreferences, action: Action) => {
  switch (action.type) {
    case 'USER_PREFS.UPDATE_PREFERENCES':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

@Injectable()
export class UserPreferenceService {
  public data: Observable<any>;

  constructor(public store: Store<any>) {
    this.data = this.store.select('userPreferences');
  }

  public get prefs(): Observable<any> {
    return this.data.map(d => {
      return d;
    });
  }

  public get state(): any {
    let s: any;
    this.data.take(1).subscribe(state => s = state);
    return s;
  }

  public toggleSearch(): void {
    this.data.take(1).subscribe(s => this.update({ searchIsOpen: !s.searchIsOpen }));
  }

  public closeSearch(): void {
    this.update({ searchIsOpen: false });
  }

  public toggleBinTray(): void {
    this.data.take(1).subscribe(s => this.update({ binTrayIsOpen: !s.binTrayIsOpen }));
  }

  public openBinTray(): void {
    this.update({ binTrayIsOpen: true });
  }

  public update(params: any): void {
    this.store.dispatch({ type: 'USER_PREFS.UPDATE_PREFERENCES', payload: params });
  }
}
