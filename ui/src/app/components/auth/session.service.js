export class SessionService {
  constructor () {
    'ngInject';
    this.loggedIn = (!!localStorage.getItem('token'))
  }

  setLoggedIn(token) {
    localStorage.setItem('token', token);
    this.loggedIn = (!!localStorage.getItem('token'))
    return
  }

  getLoggedIn() {
    return this.loggedIn;
  }

  getToken() {
    return localStorage.getItem('token')
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn = (!!localStorage.getItem('token'))
    return
  }
}
