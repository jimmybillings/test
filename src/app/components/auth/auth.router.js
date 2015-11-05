export function authRouter ($stateProvider) {
  'ngInject';
  $stateProvider
    .state('auth', {
      url: '/auth',
      abstract: true,
      template: '<ui-view/>',
      replace: true
    })
    .state('auth.create', {
      url: '/create',
      templateUrl: 'app/components/auth/create.html',
      controller: 'AuthController',
      controllerAs: 'vm'
    });
}
