import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs/Rx';
import { Store, ActionReducer, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';

export const currentUser: ActionReducer<any> = (state = {}, action: Action) => {

  switch (action.type) {
    case 'SET_USER':
      return Object.assign({}, action.payload);

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
  public permissions: any;
  public data: Observable<any>;

  constructor(
    private store: Store<User>) {
    this.data = this.store.select('currentUser');
  }

  public get(profilePiece: string = ''): Observable<any> {
    return this.data.map((user: any) => {
      return user[profilePiece];
    });
  }

  public set(user: User = null, token?:string): void {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    if (token) localStorage.setItem('token', token);
    this.store.dispatch({ type: 'SET_USER', payload: this._user() });
  }

  public destroy() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.set();
  }

  public loggedInState(): Observable<any> {
    return this.data.map(user => user.id > 0);
  }

  public loggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public fullName(): Observable<any> {
    return this.data.map(user => `${user.firstName} ${user.lastName}`);
  }

  public hasPermission(permission: string): boolean {
    let hasPermission: boolean;
    this.data.map((user:any) => {
      if (user.permissions) {
        return user.permissions;
      } else if (user.roles) {
        return user.roles[0].permissions || [];
      } else {
        return [];
      }
    }).take(1).subscribe((permissions:any) => {
        hasPermission = permissions.indexOf(permission) > -1;
    });
    return hasPermission;
  }

  public hasPurchaseOnCredit(): boolean {
    let answer: boolean;
    this.data.take(1).subscribe(user => answer = (user.hasOwnProperty('purchaseOnCredit') ? user.purchaseOnCredit : false));
    return answer;
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
      'purchaseOnCredit': false,
      'focusedCollection': null,
      'ownedCollections': null,
      'editableCollections': null,
      'accessibleCollections': null
    };
  }
}
