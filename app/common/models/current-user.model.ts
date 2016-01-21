export class CurrentUser {

  public _currentUser: {
    emailAddress: string
    firstName: string
    lastName: string
    accounts: Object
  };

  constructor() {
    this._currentUser = {
      emailAddress: undefined,
      firstName: null,
      lastName: null,
      accounts: []
    };
    this.set();
  }

  public set(user=false) {
    if(user) localStorage.setItem('currentUser', JSON.stringify(user));
    this._currentUser = JSON.parse(localStorage.getItem('currentUser')) || this._currentUser;
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
    return this._currentUser.accounts[0].name;
  }
}

