export class AuthController {
  constructor ($state, AuthService) {
    'ngInject';
    this.$state = $state;
    this.AuthService = AuthService
    this.user = {}
  }

  create() {
    this.AuthService.create(this.user)
      .then(function(){
        this.$state.go('users.index');
      }.bind(this));
  }
}
