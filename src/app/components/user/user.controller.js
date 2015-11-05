export class UserController {
  constructor ($http) {
    'ngInject';
    this.$http = $http;
    this.user = {}
  }

  create() {
    this.$http.post('http://localhost:3000/api/users', {'username': this.user.username, 'password': this.user.password})
      .then(function(response){
        localStorage.setItem('token', response.data.token);
      });
  }
}
