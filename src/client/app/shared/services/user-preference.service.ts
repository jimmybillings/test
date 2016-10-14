import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { ApiService } from './api.service';
import { Api } from '../interfaces/api.interface';
import { CurrentUser } from './current-user.model';

const defaultPreferences: any = {
  displayFilterCounts: false,
  collectionTrayIsOpen: false,
  searchIsOpen: true,
  searchSortOptionId: 12
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

  constructor(
    public currentUser: CurrentUser,
    public store: Store<any>,
    public api: ApiService) {
      this.data = this.store.select('userPreferences');
  }

  public get state(): any {
    let s: any;
    this.data.take(1).subscribe(state => s = state);
    return s;
  }

  public toggleSearch(): void {
    this.update({ searchIsOpen: !this.state.searchIsOpen });
  }

  public closeSearch(): void {
    this.update({ searchIsOpen: false });
  }

  public toggleCollectionTray(): void {
    this.update({ collectionTrayIsOpen: !this.state.collectionTrayIsOpen });
  }

  public openCollectionTray(): void {
    this.update({ collectionTrayIsOpen: true });
  }

  public updateSortPreference(sortId: number): void {
    this.update({ searchSortOptionId: sortId });
  }

  public toggleFilterCount(): void {
    this.update({ displayFilterCounts: !this.state.displayFilterCounts })
  }

  public set(preferences: any): void {
    this.updateStore(preferences);
  }

  public reset(): void {
    this.updateStore();
  }

  public formatResponse(preferences: any): any {
    for (let prefKey in preferences) {
      let newValue: any = this.stringToBool(preferences[prefKey]);
      preferences[prefKey] = newValue;
    }
    return preferences;
  }

  private update(params: any): void {
    this.updateStore(params);
    if (!this.currentUser.loggedIn()) return;
    this.put(params).take(1).subscribe();
  }

  private updateStore(data: any = defaultPreferences): void {
    this.store.dispatch({ type: 'USER_PREFS.UPDATE_PREFERENCES', payload: data });
  }

  private put(params: any): Observable<any> {
    let body: any = this.formatBody(params);
    return this.api.put2(Api.Identities, 'userPreferences/item', {body: body});
  }

  private formatBody(prefs: any): any {
    for (let pref in prefs) {
      return {
        key: pref,
        value: prefs[pref]
      };
    };
  }

  private stringToBool(value: string): boolean | string {
    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return value;
    };
  }
}
