export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/components/home/home.html',
      controller: 'HomeController',
      controllerAs: 'main'
    })
    .state('users', {
      url: '/users',
      abstract: true,
      template: '<ui-view/>',
      replace: true
    })
    .state('users.create', {
      url: '/create',
      templateUrl: 'app/components/user/create.html',
      controller: 'UserController',
      controllerAs: 'vm'
    });

  $urlRouterProvider.otherwise('/');
}
