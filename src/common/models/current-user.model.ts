import {CurrentUserInterface} from '../interfaces/current-user.interface';

export class CurrentUser {

  private _currentUser: CurrentUserInterface;

  constructor() {
    this._currentUser = this._user();
  }

  public set(user = false): void {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    this._currentUser = this._user();
  }

  public loggedIn(): boolean {
    return (localStorage.getItem('token') !== null);
  }

  public email(): string {
    return this._currentUser.emailAddress;
  }

  public firstName(): string {
    return this._currentUser.firstName;
  }

  public lastName(): string {
    return this._currentUser.lastName;
  }

  public fullName(): string {
    return `${this._currentUser.firstName} ${this._currentUser.lastName}`;
  }

  public createdOn(): Date {
    return this._currentUser.createdOn;
  }

  public lastUpdated(): Date {
    return this._currentUser.lastUpdated;
  }

  public siteName(): string {
    return this._currentUser.siteName;
  }

  public id(): number {
    return this._currentUser.id;
  }

  public accountIds(): Array<any> {
    return this._currentUser.accountIds;
  }

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

