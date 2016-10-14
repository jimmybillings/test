import { Injectable } from '@angular/core';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { ApiService } from './api.service';
import { CurrentUser } from './current-user.model';

const defaultPreferences: any = {
  displayFilterCounts: false,
  collectionTrayIsOpen: false,
  searchIsOpen: true,
  stickySort: {}
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

  public getPrefs(): void {
    this.get().take(1).subscribe(data => {
      this.store.dispatch({ type: 'USER_PREFS.UPDATE_PREFERENCES', payload: data });
    });
  }

  public toggleSearch(): void {
    this.data.take(1).subscribe(s => this.update({ searchIsOpen: !s.searchIsOpen }));
  }

  public closeSearch(): void {
    this.update({ searchIsOpen: false });
  }

  public toggleCollectionTray(): void {
    this.data.take(1).subscribe(s => this.update({ collectionTrayIsOpen: !s.collectionTrayIsOpen }));
  }

  public openCollectionTray(): void {
    this.update({ collectionTrayIsOpen: true });
  }

  public update(params: any): void {
    this.updatePrefs(params);
  }

  private updatePrefs(params: any): void {
    this.put(params).take(1).subscribe(data => {
      this.store.dispatch({ type: 'USER_PREFS.UPDATE_PREFERENCES', payload: data });
    });
  }

  private put(params: any): Observable<any> {
    let body: any = this.formatBody(params);
    return this.api.put('api/identities/v1/userPreferences/item', JSON.stringify(body), {}, true).map(res => {
      return this.formatResponse(res.json());
    });
  }

  private get(): Observable<any> {
    return this.api.get('api/identities/v1/userPreferences', {}, true).map(res => {
      return this.formatResponse(res.json());
    }); 
  }

  private formatBody(prefs: any): any {
    for (let pref in prefs) {
      return {
        key: pref,
        value: prefs[pref]
      };
    };
  }

  private formatResponse(response: any): any {
    for (let prefKey in response.prefs) {
      let newValue: any = this.stringToBool(response.prefs[prefKey]);
      response.prefs[prefKey] = newValue;
    }
    return response.prefs;
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
