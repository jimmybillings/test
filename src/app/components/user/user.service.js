export class UserService {
  constructor ($http, SessionService) {
    'ngInject';
    this.$http = $http;
    this.SessionService = SessionService
    this.users = []
  }

  index() {
    this.$http.get('http://localhost:3000/api/users')
      .then(function(response){
        this.users = response.data;
      }.bind(this))
      .catch(function(){
      })
  }

  create(user) {
    return this.$http.post('http://localhost:3000/api/users', user)
      .then(function(response){
        this.SessionService.setLoggedIn(response.data.token);
    }.bind(this));
  }
}
