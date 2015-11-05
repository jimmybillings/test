export function userRouter ($stateProvider) {
  'ngInject';
  $stateProvider
    .state('users', {
      url: '/users',
      abstract: true,
      template: '<ui-view/>',
      replace: true
    })
    .state('users.index', {
      url: '/index',
      templateUrl: 'app/components/user/index.html',
      controller: 'UserController',
      controllerAs: 'vm',
      onEnter: function(UserService) {
        UserService.index()
      }
    })
    .state('users.create', {
      url: '/create',
      templateUrl: 'app/components/user/create.html',
      controller: 'UserController',
      controllerAs: 'vm'
    });
}
