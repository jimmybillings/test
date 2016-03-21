import {CurrentUserInterface} from '../interfaces/current-user.interface';
import { Observable} from 'rxjs/Observable';
import { Store, Reducer, Action} from '@ngrx/store';
import { Injectable } from 'angular2/core';



export const currentUser:Reducer<any> = (state = {}, action:Action) => {

    switch (action.type) {
        case 'SET_USER':
            return Object.assign({}, state, action.payload);

        default:
            return state;
    }
};

@Injectable()
/**
 * Model that describes current user, and provides  
 * methods for retrieving user attributes.
 */  
export class CurrentUser {

  private _currentUser: Observable<any>;
  // we don't need a constructor because currentUser.set() is called from the app.component.
  // having both calls _user() multiple times.
  constructor(private store: Store<any>) {
    this._currentUser = this.store.select('currentUser');
    
    
  }

  /**
   * @param user    Stores current user in localStorage and establishes private _currentUser var.
   *                Example of contents: lastUpdate,createdOn,id,siteName,
   *                emailAddress,password,forstName,lastName,accountIds[].
   *                 
   */
  public set(user: CurrentUserInterface = null): void {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    this.store.dispatch({type: 'SET_USER', payload: this._user()});
  }

  /**
   * @returns      Current user is logged in if a localStorage token exists. If it doesn't exist,
   *               current user is logged out.
   */
  public loggedInState(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.emailAddress;
    });
  }
  
  public loggedIn(): boolean {
    return (localStorage.getItem('token') !== null);
  }

  /**
   * @returns      Current user email address.
   */
  public email(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.emailAddress;
    });
  }

  /**
   * @returns      Current user first name
   */
  public firstName(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.firstName;
    });
  }

  /**
   * @returns      Current user last name
   */
  public lastName(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.lastName;
    });
  }

  /**
   * @returns      Current user full name. Concatenated first and last name
   */
  public fullName(): Observable<any> {
    return this._currentUser.map((user) => {
      return `${user.firstName} ${user.lastName}`;
    });
  }

  /**
   * @returns      Current user createdOn time stamp
   */
  public createdOn(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.createdOn;
    });
  }

  /**
   * @returns      Current user lastUpdated time stamp
   */
  public lastUpdated(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.lastUpdated;
    });
  }

  /**
   * @returns      Current user siteName value
   */
  public siteName(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.siteName;
    });
  }

  /**
   * @returns      Current user id value
   */
  public id(): Observable<any> {
    return this._currentUser.map((user) => {
      return user.id;
    });
  }

  /**
   * @returns      Current user accountIds
   */
  public accountIds(): Observable<Array<number>> {
    return this._currentUser.map((user) => {
      return user.accountIds;
    });
  }

  /**
   * @returns      Current user from localStorage, or if that doesn't exist, return current user with null value attributes.
   */
  private _user(): CurrentUserInterface {
    return JSON.parse(localStorage.getItem('currentUser')) || {
      emailAddress: null,
      firstName: null,
      lastName: null,
      id: null,
      accountIds: null
    };
  }
}

