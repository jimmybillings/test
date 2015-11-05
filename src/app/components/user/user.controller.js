export class UserController {
  constructor ($http, UserService, $state) {
    'ngInject';
    this.$http = $http;
    this.user = {}
    this.UserService = UserService;
    this.$state = $state;
  }

  index() {
    this.UserService.index()
  }

  create() {
    this.UserService.create(this.user)
      .then(function(){
        this.$state.go('home')
      }.bind(this));
  }
}
