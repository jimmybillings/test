import {CurrentUserInterface} from '../interfaces/current-user.interface';

export class CurrentUser {

  private _currentUser: CurrentUserInterface;
  
  constructor() {
    this._currentUser = this._user();
  }
  
  public set(user=false): void {
    if(user) localStorage.setItem('currentUser', JSON.stringify(user));
    this._currentUser = this._user();
  }
  
  public loggedIn() {
    return (localStorage.getItem('token') !== null);
  }

  public email() {
    return this._currentUser.emailAddress;
  }

  public firstName() {
    return this._currentUser.firstName;
  }

  public lastName() {
    return this._currentUser.lastName;
  }

  public fullName() {
    return this._currentUser.firstName+' '+this._currentUser.lastName;
  }

  public account() {
    return this._currentUser.accounts;
  }
  
  private _user() {
    return JSON.parse(localStorage.getItem('currentUser')) || {
      emailAddress: null,
      firstName: null,
      lastName: null,
      accounts: null
    };
  }
}

