import {CurrentUserInterface} from '../interfaces/current-user.interface';

export class CurrentUser {

  private _currentUser: CurrentUserInterface;

  constructor() {
    this._currentUser = this._user();
  }

  /**
   * @param user   If empty default to false. Example of contents: lastUpdate,createdOn,id,siteName,
   *                emailAddress,password,forstName,lastName,accountIds[].
   *                Method stores current user to localStorage and establishes private currentUser var. 
   */
  public set(user = null): void {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    this._currentUser = this._user();
    console.log(this._currentUser);
  }

  /**
   * @returns      Current user is logged in or not. Based on the existence of a localStorage token.
   */
  public loggedIn(): boolean {
    return (localStorage.getItem('token') !== null);
  }

  /**
   * @returns      Current users email address.
   */
  public email(): string {
    return this._currentUser.emailAddress;
  }

  /**
   * @returns      Current users first name
   */
  public firstName(): string {
    return this._currentUser.firstName;
  }

  /**
   * @returns      Current users last name
   */
  public lastName(): string {
    return this._currentUser.lastName;
  }

  /**
   * @returns      Current users full name. Concatenated first and last name
   */
  public fullName(): string {
    return `${this._currentUser.firstName} ${this._currentUser.lastName}`;
  }

  /**
   * @returns      Current users createdOn time stamp
   */
  public createdOn(): Date {
    return this._currentUser.createdOn;
  }

  /**
   * @returns      Current users lastUpdated time stamp
   */
  public lastUpdated(): Date {
    return this._currentUser.lastUpdated;
  }

  /**
   * @returns      Current users siteName value
   */
  public siteName(): string {
    return this._currentUser.siteName;
  }

  /**
   * @returns      Current users id value
   */
  public id(): number {
    return this._currentUser.id;
  }

  /**
   * @returns      Current users accountIds
   */
  public accountIds(): Array<any> {
    return this._currentUser.accountIds;
  }

  /**
   * @returns      Current user from localStorage, or if that doesn't exist, creates email, first, last name with null values.
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

