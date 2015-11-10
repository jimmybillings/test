export class AuthService {
  constructor ($http, SessionService) {
    'ngInject';
    this.$http = $http;
    this.SessionService = SessionService
    this.loggedIn = (!!localStorage.getItem('token'))
  }

  create(user) {
    return this.$http.post('http://localhost:3000/auth/signin', user)
      .then(function(response){
        this.SessionService.setLoggedIn(response.data.token)
    }.bind(this));
  }
}
