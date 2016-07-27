import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs/Rx';
import { Store, Reducer, Action } from '@ngrx/store';
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

  private data: Observable<any>;

  constructor(
    private store: Store<User>) {
    this.data = this.store.select('currentUser');
  }

  get profile() {
    return this.data;
  }

  public get(profilePiece: string = ''): Observable<any> {
    return this.data.map((user: any) => {
      return user[profilePiece];
    });
  }

  public set(user: User = null): void {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    this.store.dispatch({ type: 'SET_USER', payload: this._user() });
  }

  public destroy() {
    localStorage.removeItem('currentUser');
    localStorage.setItem('currentUser', JSON.stringify(this.mayflyUser()));
    this.set();
  }

  public loggedInState(): Observable<any> {
    return this.data.map(user => (user.id > 0));
  }

  public loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public fullName(): Observable<any> {
    return this.data.map(user => `${user.firstName} ${user.lastName}`);
  }

  public is(permission: string): Observable<any> {
    let permissionToCheck = permissionMap[permission];
    return this.data.map((user) => {
      return user.permissions ? user.permissions.indexOf(permissionToCheck) > -1 : false;
    });
  }

  private _user(): User {
    return JSON.parse(localStorage.getItem('currentUser')) || this.mayflyUser();
  }

  private mayflyUser(): User {
    return {
      'lastUpdated': '',
      'createdOn': '',
      'id': 0,
      'emailAddress': '',
      'password': '',
      'firstName': '',
      'lastName': '',
      'siteName': '',
      'accountIds': [0],
      'permissions': [''],
      'focusedCollection': null,
      'ownedCollections': null,
      'editableCollections': null,
      'accessibleCollections': null
    };
  }
}
