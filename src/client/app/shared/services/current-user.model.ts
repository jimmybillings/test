import { CurrentUserInterface} from '../interfaces/current-user.interface';
import { Observable} from 'rxjs/Rx';
import { Store, Reducer, Action} from '@ngrx/store';
import { Injectable } from '@angular/core';

const permissionMap: any = {
  'root': 'Root'
};

export const currentUser: Reducer<any> = (state = {}, action: Action) => {

  switch (action.type) {
    case 'SET_USER':
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
};

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

/**
 * Model that describes current user, and provides  
 * methods for retrieving user attributes.
 */
@Injectable()
export class CurrentUser {

  public _currentUser: Observable<any>;

  constructor(private store: Store<any>) {
    this._currentUser = this.store.select('currentUser');


  }

  public set(user: CurrentUserInterface = null): void {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    this.store.dispatch({ type: 'SET_USER', payload: this._user() });
  }

  public destroy() {
    localStorage.clear();
    this.set();
  }

  public loggedInState(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.emailAddress;
    });
  }

  public loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public email(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.emailAddress;
    });
  }

  public firstName(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.firstName;
    });
  }

  public lastName(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.lastName;
    });
  }

  public fullName(): Observable<any> {
    return this._currentUser.map((user) => {
      return `${user.firstName} ${user.lastName}`;
    });
  }

  public createdOn(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.createdOn;
    });
  }

  public lastUpdated(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.lastUpdated;
    });
  }

  public siteName(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.siteName;
    });
  }

  public id(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.id;
    });
  }

  public accountIds(): Observable<Array<number>> {
    return this._currentUser.map((user) => {
      return user.accountIds;
    });
  }

  public is(permission: string): Observable<any> {
    let permissionToCheck = permissionMap[permission];
    return this._currentUser.map((user) => {
      return user.permissions ? user.permissions.indexOf(permissionToCheck) > -1 : false;
    });
  }

  private _user(): CurrentUserInterface {
    return JSON.parse(localStorage.getItem('currentUser')) || {
      'lastUpdated': '',
      'createdOn': '',
      'id': 0,
      'emailAddress': '',
      'password': '',
      'firstName': '',
      'lastName': '',
      'siteName': '',
      'accountIds': [0],
      'permissions': [
        ''
      ]
    };
  }
}
