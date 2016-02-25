import {CurrentUserInterface} from '../interfaces/current-user.interface';
  
/**
 * Model that describes current user, and provides  
 * methods for retrieving user attributes.
 */  
export class CurrentUser {

  private _currentUser: CurrentUserInterface;
  // we don't need a constructor because currentUser.set() is called from the app.component.
  // having both calls _user() multiple times.
  // constructor() {
  //   this._currentUser = this._user();
  // }

  /**
   * @param user    Stores current user in localStorage and establishes private _currentUser var.
   *                Example of contents: lastUpdate,createdOn,id,siteName,
   *                emailAddress,password,forstName,lastName,accountIds[].
   *                 
   */
  public set(user: CurrentUserInterface = null): void {
    // console.log('hit currentUser.set method');
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    this._currentUser = this._user();
    // console.log(this._currentUser);
  }

  /**
   * @returns      Current user is logged in if a localStorage token exists. If it doesn't exist,
   *               current user is logged out.
   */
  public loggedIn(): boolean {
    return (localStorage.getItem('token') !== null);
  }

  /**
   * @returns      Current user email address.
   */
  public email(): string {
    return this._currentUser.emailAddress;
  }

  /**
   * @returns      Current user first name
   */
  public firstName(): string {
    return this._currentUser.firstName;
  }

  /**
   * @returns      Current user last name
   */
  public lastName(): string {
    return this._currentUser.lastName;
  }

  /**
   * @returns      Current user full name. Concatenated first and last name
   */
  public fullName(): string {
    return `${this._currentUser.firstName} ${this._currentUser.lastName}`;
  }

  /**
   * @returns      Current user createdOn time stamp
   */
  public createdOn(): Date {
    return this._currentUser.createdOn;
  }

  /**
   * @returns      Current user lastUpdated time stamp
   */
  public lastUpdated(): Date {
    return this._currentUser.lastUpdated;
  }

  /**
   * @returns      Current user siteName value
   */
  public siteName(): string {
    return this._currentUser.siteName;
  }

  /**
   * @returns      Current user id value
   */
  public id(): number {
    return this._currentUser.id;
  }

  /**
   * @returns      Current user accountIds
   */
  public accountIds(): Array<any> {
    return this._currentUser.accountIds;
  }

  /**
   * @returns      Current user from localStorage, or if that doesn't exist, return current user with null value attributes.
   */
  private _user(): CurrentUserInterface {
    // console.log('hit _user method');
    return JSON.parse(localStorage.getItem('currentUser')) || {
      emailAddress: null,
      firstName: null,
      lastName: null,
      id: null,
      accountIds: null
    };
  }
}

